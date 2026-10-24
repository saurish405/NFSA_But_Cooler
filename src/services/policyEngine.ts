import type {
  CorrectionIntent,
  HouseholdMember,
  RationCard,
  SimulationResult,
} from '../types';
import seedData from '../data/dataset.json';

// Levenshtein distance for transliteration mismatch analysis (EC-06)
export function computeLevenshteinDistance(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

export function analyzeNameTransliteration(nameA: string, nameB: string): {
  matchType: 'EXACT' | 'LOW_RISK_SPELLING' | 'SUSPICIOUS_DEVIATION';
  similarityScore: number;
  recommendedAction: string;
} {
  const cleanA = nameA.trim().toLowerCase();
  const cleanB = nameB.trim().toLowerCase();
  if (cleanA === cleanB) {
    return { matchType: 'EXACT', similarityScore: 1.0, recommendedAction: 'No deviation. Auto-approve.' };
  }

  const dist = computeLevenshteinDistance(cleanA, cleanB);
  const maxLen = Math.max(cleanA.length, cleanB.length);
  const similarity = 1 - dist / maxLen;

  // Known phonetic aliases in Indian PDS (e.g. Sita/Seeta, Geeta/Gita, Ramvilas/Ram Bilas)
  const isPhoneticPair =
    (cleanA.includes('sita') && cleanB.includes('seeta')) ||
    (cleanA.includes('seeta') && cleanB.includes('sita')) ||
    (cleanA.includes('gita') && cleanB.includes('geeta')) ||
    (cleanA.includes('geeta') && cleanB.includes('gita')) ||
    (cleanA.replace(/v/g, 'b') === cleanB.replace(/v/g, 'b'));

  if (isPhoneticPair || similarity >= 0.75) {
    return {
      matchType: 'LOW_RISK_SPELLING',
      similarityScore: Math.max(similarity, 0.8),
      recommendedAction: 'Low-risk phonetic/transliteration variation detected. Permit one-click bypass without documentation penalty.',
    };
  }

  return {
    matchType: 'SUSPICIOUS_DEVIATION',
    similarityScore: similarity,
    recommendedAction: 'Significant name discrepancy detected. Requires gazette notification or Aadhaar update receipt.',
  };
}

// Check for duplicate UID (EC-10)
export function checkDuplicateUid(newUidMasked: string, currentCardNumber: string): {
  isDuplicate: boolean;
  registeredCard?: string;
  ownerName?: string;
} {
  const match = seedData.registeredAadhaarRegistry.find(
    (entry) => entry.uid.toLowerCase() === newUidMasked.toLowerCase() && entry.card !== currentCardNumber
  );
  if (match) {
    return {
      isDuplicate: true,
      registeredCard: match.card,
      ownerName: match.ownerName,
    };
  }
  return { isDuplicate: false };
}

// Pre-Flight Safe-Correction Simulator (EC-01, EC-06, EC-10)
export function simulatePreFlightCorrection(
  card: RationCard,
  intent: CorrectionIntent
): SimulationResult {
  const member = card.members.find((m) => m.id === intent.memberId);
  const baselineTotalKg = card.monthlyQuota.riceKg + card.monthlyQuota.wheatKg + card.monthlyQuota.coarseGrainKg;

  // 1. Check for Duplicate UID (EC-10)
  if (intent.field === 'aadhaar') {
    const dupCheck = checkDuplicateUid(String(intent.newVal), card.cardNumber);
    if (dupCheck.isDuplicate) {
      return {
        intent,
        baselineEntitlementKg: baselineTotalKg,
        postChangeEntitlementKg: baselineTotalKg,
        deltaE: 0,
        safetyRank: 'DANGER_DUPLICATE_UID',
        headline: '🚨 FRAUD INTERCEPT: Duplicate Aadhaar UID Detected',
        warningText: `Aadhaar UID ${intent.newVal} is already actively registered under card [${dupCheck.registeredCard}] assigned to ${dupCheck.ownerName}. Attempting to bind this UID here will trigger automated vigilance flagging and freeze both ration cards.`,
        ruleCitation: 'NFSA 2013 De-duplication Directive Section 10(1) & Aadhaar Act Reg 14',
        requiresTwoStepConfirmation: true,
        rosterIntegrityPassed: false,
      };
    }
  }

  // 2. Check for Name Transliteration Variation (EC-06)
  if (intent.field === 'name') {
    const transliteration = analyzeNameTransliteration(String(intent.oldVal), String(intent.newVal));
    if (transliteration.matchType === 'LOW_RISK_SPELLING') {
      return {
        intent,
        baselineEntitlementKg: baselineTotalKg,
        postChangeEntitlementKg: baselineTotalKg,
        deltaE: 0,
        safetyRank: 'SAFE',
        headline: '✅ Safe Spelling Correction (Low-Risk Transliteration)',
        warningText: `Name update from "${intent.oldVal}" to "${intent.newVal}" classified as benign vernacular transliteration (${Math.round(transliteration.similarityScore * 100)}% phonetic match). Zero entitlement reduction.`,
        ruleCitation: 'UIDAI-NFSA Name Variance Tolerance Protocol (Circular 2024/09)',
        requiresTwoStepConfirmation: false,
        rosterIntegrityPassed: true,
        transliterationCheck: transliteration,
      };
    }
  }

  // 3. Check Age Threshold Shift: Adult Classification & The Silent Purge (EC-01)
  if (intent.field === 'age' && member) {
    const oldAge = Number(intent.oldVal);
    const newAge = Number(intent.newVal);

    // Threshold from minor (<18) to adult (>=18) in Bihar / PHH scheme
    if (oldAge < 18 && newAge >= 18) {
      const deductionKg = card.scheme === 'PHH' ? 5 : 0;
      const postTotalKg = Math.max(0, baselineTotalKg - deductionKg);
      const deltaE = postTotalKg - baselineTotalKg;

      return {
        intent,
        baselineEntitlementKg: baselineTotalKg,
        postChangeEntitlementKg: postTotalKg,
        deltaE,
        safetyRank: 'DANGER_ENTITLEMENT_LOSS',
        headline: '⚠️ BLAST RADIUS ALERT: Adult Threshold Reclassification (-5 kg Grain)',
        warningText: `Changing age of ${member.name} from ${oldAge} to ${newAge} classifies them as an independent adult earning member under State Rule 4B. This will automatically reduce your monthly household grain quota by 5 kg (from ${baselineTotalKg} kg down to ${postTotalKg} kg) unless an individual dependency affidavit is filed.`,
        ruleCitation: 'Bihar Food & Civil Supplies State Rule 4B (Adult Household Member Quota Cap)',
        requiredAffidavit: 'Form 3B (Individual Unemployed Dependency Affidavit)',
        requiresTwoStepConfirmation: true,
        rosterIntegrityPassed: true,
      };
    }
  }

  // 4. Default Safe or Neutral mutation
  return {
    intent,
    baselineEntitlementKg: baselineTotalKg,
    postChangeEntitlementKg: baselineTotalKg,
    deltaE: 0,
    safetyRank: 'SAFE',
    headline: '✅ Pre-Flight Verification Passed: No Entitlement Loss',
    warningText: `Updating ${intent.field} from "${intent.oldVal}" to "${intent.newVal}" is safe. Household grain allocation remains unaffected at ${baselineTotalKg} kg.`,
    ruleCitation: 'NFSA Demographic Mutation Guidelines',
    requiresTwoStepConfirmation: false,
    rosterIntegrityPassed: true,
  };
}
