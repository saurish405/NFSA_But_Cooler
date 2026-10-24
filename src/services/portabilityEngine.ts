import type {
  CommodityAllocation,
  FairPriceShop,
  HouseholdMember,
  PortabilityCalculation,
  RationCard,
} from '../types';
import seedData from '../data/dataset.json';

// Calculate Stock Uncertainty Confidence: Cstock = f(LastSyncTime, ReportedBalance, ActiveTransactionsInWindow)
export function computeStockConfidence(fps: FairPriceShop): {
  confidencePercent: number;
  confidenceGrade: 'HIGH' | 'MODERATE' | 'LOW' | 'CRITICAL_DEPLETED';
  arrivalWindowAdvice: string;
  velocityCategory: 'LOW' | 'MODERATE' | 'HIGH';
  alternateFpsSuggestion?: FairPriceShop;
} {
  const totalStockQuintals = fps.reportedRiceQuintals + fps.reportedWheatQuintals;

  // 1. Total depletion check (EC-05)
  if (totalStockQuintals <= 0.1) {
    // Find nearest alternate FPS with stock
    const alternate = (seedData.fairPriceShops as FairPriceShop[])
      .filter((s) => s.id !== fps.id && s.state === fps.state && (s.reportedRiceQuintals + s.reportedWheatQuintals > 5))
      .sort((a, b) => a.distanceKm - b.distanceKm)[0];

    return {
      confidencePercent: 5,
      confidenceGrade: 'CRITICAL_DEPLETED',
      arrivalWindowAdvice: 'Counter depleted. Grain consignment exhausted.',
      velocityCategory: 'LOW',
      alternateFpsSuggestion: alternate,
    };
  }

  // 2. Compute confidence decay based on last sync & transaction velocity
  // Hours since last sync
  const hoursSinceSync = fps.lastSyncMinutesAgo / 60;
  // Transactions per hour estimate
  const hourlyTxVelocity = fps.activeTransactionsInWindow;

  let baseConfidence = 95;
  // Deplete based on hours
  baseConfidence -= Math.min(40, hoursSinceSync * 7);
  // Deplete based on high transaction velocity
  if (hourlyTxVelocity > 30) {
    baseConfidence -= 20;
  } else if (hourlyTxVelocity > 15) {
    baseConfidence -= 10;
  }

  const confidencePercent = Math.max(10, Math.min(99, Math.round(baseConfidence)));

  let confidenceGrade: 'HIGH' | 'MODERATE' | 'LOW' | 'CRITICAL_DEPLETED' = 'HIGH';
  if (confidencePercent >= 80) confidenceGrade = 'HIGH';
  else if (confidencePercent >= 55) confidenceGrade = 'MODERATE';
  else confidenceGrade = 'LOW';

  const velocityCategory: 'LOW' | 'MODERATE' | 'HIGH' =
    hourlyTxVelocity > 30 ? 'HIGH' : hourlyTxVelocity > 12 ? 'MODERATE' : 'LOW';

  let arrivalWindowAdvice = 'Optimal arrival anytime during operating hours.';
  if (velocityCategory === 'HIGH') {
    arrivalWindowAdvice = 'High transaction velocity detected. Recommended arrival window: Before 1:00 PM to avoid queue timeouts.';
  } else if (hoursSinceSync > 4) {
    arrivalWindowAdvice = 'PoS last reported 4+ hours ago. Arrive during morning verification cycle.';
  }

  return {
    confidencePercent,
    confidenceGrade,
    arrivalWindowAdvice,
    velocityCategory,
  };
}

// Calculate ONORC Portability Allocation & Head of Household Rights (EC-02, EC-03, EC-11)
export function calculatePortability(
  card: RationCard,
  actingMemberId: string,
  destinationState: string,
  targetFpsId?: string
): PortabilityCalculation {
  const totalMembers = card.members.length;
  const actingMember = card.members.find((m) => m.id === actingMemberId) || card.members[0];
  const hohMember = card.members.find((m) => m.isHoH) || card.members[0];

  const migrantMembers = card.members.filter(
    (m) => m.locationStatus === 'MIGRANT_DESTINATION' || m.currentDestinationState === destinationState
  );
  const migrantCount = migrantMembers.length > 0 ? migrantMembers.length : 2; // default 2 migrant members for Bihar->AP scenario
  const homeCount = Math.max(1, totalMembers - migrantCount);

  // Pro-rata grain calculation (5kg per person per month under PHH)
  const kgPerPerson = card.scheme === 'PHH' ? 5 : card.monthlyQuota.riceKg / totalMembers;

  const destinationDrawAllowedKg: CommodityAllocation = {
    riceKg: Math.round(migrantCount * (card.monthlyQuota.riceKg / totalMembers)),
    wheatKg: Math.round(migrantCount * (card.monthlyQuota.wheatKg / totalMembers)),
    coarseGrainKg: 0,
    keroseneLitres: 0, // Kerosene is non-portable interstate to prevent subsidized fuel leakage
    sugarKg: 0,
  };

  const homeRemainingKg: CommodityAllocation = {
    riceKg: Math.max(0, card.monthlyQuota.riceKg - destinationDrawAllowedKg.riceKg - card.currentCycleDrawn.riceKg),
    wheatKg: Math.max(0, card.monthlyQuota.wheatKg - destinationDrawAllowedKg.wheatKg - card.currentCycleDrawn.wheatKg),
    coarseGrainKg: 0,
    keroseneLitres: card.monthlyQuota.keroseneLitres,
    sugarKg: card.monthlyQuota.sugarKg,
  };

  // HoH Absence Rights logic (EC-03)
  const hohPresentAtCounter = actingMember.isHoH;
  const allowedActions: ('COMMODITY_DRAW' | 'STRUCTURE_MODIFY' | 'SURRENDER_CARD')[] = ['COMMODITY_DRAW'];
  const lockedActions: ('STRUCTURE_MODIFY' | 'SURRENDER_CARD')[] = ['STRUCTURE_MODIFY', 'SURRENDER_CARD'];
  let lockReason = '';

  if (hohPresentAtCounter) {
    allowedActions.push('STRUCTURE_MODIFY', 'SURRENDER_CARD');
    lockedActions.length = 0;
  } else {
    lockReason = `Head of Household (${hohMember.name}) is absent from counter. Standard commodity grain draw is fully permitted for ${actingMember.name}. However, structural mutations (adding/deleting members, surrender of card, updating bank mandate) are locked and require an explicit HoH biometric/OTP dual-consent token.`;
  }

  // Stock confidence for target FPS
  const allFps = seedData.fairPriceShops as FairPriceShop[];
  const activeFps = allFps.find((f) => f.id === targetFpsId) || allFps[0];
  const stockConfidence = computeStockConfidence(activeFps);

  return {
    homeState: card.homeState,
    destinationState,
    totalFamilyMembers: totalMembers,
    migrantMembersCount: migrantCount,
    homeMembersCount: homeCount,
    destinationDrawAllowedKg,
    homeRemainingKg,
    hohPresentAtCounter,
    actingMemberId: actingMember.id,
    actingMemberName: actingMember.name,
    allowedActions,
    lockedActions,
    lockReason: lockedActions.length > 0 ? lockReason : undefined,
    stockConfidence: {
      fpsId: activeFps.id,
      fpsNumber: activeFps.fpsNumber,
      confidencePercent: stockConfidence.confidencePercent,
      confidenceGrade: stockConfidence.confidenceGrade,
      arrivalWindowAdvice: stockConfidence.arrivalWindowAdvice,
      velocityCategory: stockConfidence.velocityCategory,
      alternateFpsSuggestion: stockConfidence.alternateFpsSuggestion,
    },
  };
}
