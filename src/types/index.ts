export type SchemeType = 'AAY' | 'PHH'; // Antyodaya Anna Yojana (35kg flat) vs Priority Household (5kg/member)

export interface HouseholdMember {
  id: string;
  name: string;
  relation: 'HEAD' | 'SPOUSE' | 'SON' | 'DAUGHTER' | 'MOTHER' | 'FATHER' | 'DEPENDENT';
  age: number;
  gender: 'M' | 'F' | 'O';
  aadhaarMasked: string;
  aadhaarHash: string;
  incomeMonthly: number;
  isHoH: boolean;
  pin: string; // 4-digit PIN for shared phone isolation
  pensionFlag?: boolean;
  medicalFlag?: string;
  locationStatus: 'HOME' | 'MIGRANT_DESTINATION';
  currentDestinationState?: string;
}

export interface CommodityAllocation {
  riceKg: number;
  wheatKg: number;
  coarseGrainKg: number;
  keroseneLitres: number;
  sugarKg: number;
}

export interface RationCard {
  cardNumber: string;
  scheme: SchemeType;
  homeState: string;
  homeDistrict: string;
  homeVillage: string;
  fpsAssignedId: string;
  headOfHouseholdId: string;
  members: HouseholdMember[];
  monthlyQuota: CommodityAllocation;
  currentCycleDrawn: CommodityAllocation;
  cardStatus: 'ACTIVE' | 'FLAGGED_REVIEW' | 'SUSPENDED';
  version: number; // for 409 conflict detection
  lastVerifiedAt: string;
}

export interface FairPriceShop {
  id: string;
  fpsNumber: string;
  dealerName: string;
  state: string;
  district: string;
  pincode: string;
  reportedRiceQuintals: number;
  reportedWheatQuintals: number;
  reportedKeroseneLitres: number;
  lastSyncMinutesAgo: number;
  activeTransactionsInWindow: number;
  distanceKm: number;
  operatingHours: string;
  lat: number;
  lng: number;
}

export type MutationSafetyRank =
  | 'SAFE'
  | 'CAUTION'
  | 'DANGER_ENTITLEMENT_LOSS'
  | 'DANGER_CARD_SPLIT'
  | 'DANGER_DUPLICATE_UID';

export interface CorrectionIntent {
  memberId: string;
  memberName: string;
  field: 'age' | 'name' | 'aadhaar' | 'income' | 'relation';
  oldVal: string | number;
  newVal: string | number;
  reason?: string;
}

export interface SimulationResult {
  intent: CorrectionIntent;
  baselineEntitlementKg: number;
  postChangeEntitlementKg: number;
  deltaE: number; // simulated - current
  safetyRank: MutationSafetyRank;
  headline: string;
  warningText: string;
  ruleCitation: string;
  requiredAffidavit?: string;
  requiresTwoStepConfirmation: boolean;
  rosterIntegrityPassed: boolean;
  transliterationCheck?: {
    matchType: 'EXACT' | 'LOW_RISK_SPELLING' | 'SUSPICIOUS_DEVIATION';
    similarityScore: number;
    recommendedAction: string;
  };
}

export interface PortabilityCalculation {
  homeState: string;
  destinationState: string;
  totalFamilyMembers: number;
  migrantMembersCount: number;
  homeMembersCount: number;
  destinationDrawAllowedKg: CommodityAllocation;
  homeRemainingKg: CommodityAllocation;
  hohPresentAtCounter: boolean;
  actingMemberId: string;
  actingMemberName: string;
  allowedActions: ('COMMODITY_DRAW' | 'STRUCTURE_MODIFY' | 'SURRENDER_CARD')[];
  lockedActions: ('STRUCTURE_MODIFY' | 'SURRENDER_CARD')[];
  lockReason?: string;
  stockConfidence: {
    fpsId: string;
    fpsNumber: string;
    confidencePercent: number;
    confidenceGrade: 'HIGH' | 'MODERATE' | 'LOW' | 'CRITICAL_DEPLETED';
    arrivalWindowAdvice: string;
    velocityCategory: 'LOW' | 'MODERATE' | 'HIGH';
    alternateFpsSuggestion?: FairPriceShop;
  };
}

export type LifecycleStatus =
  | 'LOCAL_DRAFT'
  | 'FACILITATOR_STAGED_BATCH'
  | 'GATEWAY_SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'APPROVED'
  | 'REJECTED_WITH_REASON';

export interface DraftLifecycleRecord {
  id: string;
  shortCodeReceipt: string; // Base32(HMAC-SHA256(Data, KioskID+Timestamp))[:10]
  status: LifecycleStatus;
  kioskId: string;
  createdAt: string;
  updatedAt: string;
  officialAckNumber?: string;
  assignedOfficer?: string;
  slaDaysRemaining?: number;
  rejectionReason?: string;
  intent: CorrectionIntent;
  isOfflineOnly: boolean;
  auditHashChain: string[]; // SHA-256 chained hashes
}

export interface GrievanceRecord {
  id: string;
  tokenNumber: string;
  filingDate: string;
  daysElapsed: number;
  slaDays: number; // usually 14
  status: 'OPEN' | 'SLA_BREACHED' | 'ESCALATED_TIER_2' | 'RESOLVED';
  citizenName: string;
  citizenPhone: string;
  rationCardNumber: string;
  district: string;
  state: string;
  subject: string;
  description: string;
  sanitizedDescription: string;
  hadAdversarialPayload: boolean;
  tier2MemoDraft?: {
    addressedTo: string;
    authorityJurisdiction: string;
    legalSectionCited: string;
    bodyText: string;
    whatsappPayload: string;
    smsPayload: string;
  };
}

export interface InspectorAnomalySignal {
  id: string;
  fpsId: string;
  fpsName: string;
  location: string;
  patternObserved: string;
  systemHypothesis: string;
  distributionVelocityScore: number;
  offHoursPercentage: number;
  recommendedAction: string;
  auditRecommended: boolean;
}

export interface JudgeFaultConfig {
  forceOffline: boolean;
  gatewayTimeout504: boolean;
  corruptStorage: boolean;
  backendConflict409: boolean;
  promptInjectionActive: boolean;
  throttle2G: boolean;
}

export interface TestCaseResult {
  id: string; // e.g. EC-01
  title: string;
  category: 'PRE_FLIGHT_SIM' | 'PORTABILITY' | 'SECURITY' | 'LIFECYCLE' | 'RESILIENCE';
  description: string;
  passed: boolean;
  metricObserved: string;
  logDetail: string;
}

export interface QuantitativeMetrics {
  harmfulCorrectionCatchRate: string;
  sharedDeviceDataLeakage: string;
  screenReaderKeyboardFlow: string;
  offlineSyncRecoveryLatency: string;
}

export interface StatePortalInfo {
  code: string;
  name: string;
  regionalName: string;
  portalUrl: string;
  fpsCount: number;
  eposCount: number;
  tollFree: string;
  dbtActive: boolean;
  onorcActive: boolean;
}

export interface NationalStats {
  beneficiariesCoveredCr: string;
  activeRationCardsCr: string;
  fairPriceShopsTotal: string;
  eposOperationalPercent: string;
  monthlyAllocationLakhMT: string;
  onorcMonthlyPortabilityLakh: string;
}

