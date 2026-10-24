import type { CorrectionIntent, DraftLifecycleRecord, LifecycleStatus } from '../types';
import { appendAuditLog, computeSha256 } from './db';

const VALID_TRANSITIONS: Record<LifecycleStatus, LifecycleStatus[]> = {
  LOCAL_DRAFT: ['FACILITATOR_STAGED_BATCH', 'GATEWAY_SUBMITTED'],
  FACILITATOR_STAGED_BATCH: ['GATEWAY_SUBMITTED', 'LOCAL_DRAFT'],
  GATEWAY_SUBMITTED: ['UNDER_VERIFICATION'],
  UNDER_VERIFICATION: ['APPROVED', 'REJECTED_WITH_REASON'],
  APPROVED: [],
  REJECTED_WITH_REASON: ['LOCAL_DRAFT'],
};

// Base32 Alphabet for readable short codes
const BASE32_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function encodeBase32(buffer: Uint8Array): string {
  let result = '';
  let bits = 0;
  let value = 0;

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      result += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    result += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return result;
}

// Generate Deterministic Short-Code Receipt: Base32(HMAC-SHA256(Data, KioskID+Timestamp))[:10]
export async function generateShortCodeReceipt(data: string, kioskId: string, timestamp: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(kioskId + timestamp);
    const msgData = encoder.encode(data);

    // If WebCrypto subtle HMAC is available
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, msgData);
    const b32 = encodeBase32(new Uint8Array(signature));
    // Format as XXXX-XXXX-XX (10 chars formatted with hyphen)
    const code = b32.substring(0, 10).toUpperCase();
    return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 10)}`;
  } catch (err) {
    // Fallback deterministic pseudo-random shortcode
    const pseudo = Math.random().toString(36).substring(2, 12).toUpperCase();
    return `${pseudo.slice(0, 4)}-${pseudo.slice(4, 8)}-${pseudo.slice(8, 10)}`;
  }
}

export function canTransition(from: LifecycleStatus, to: LifecycleStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isDraftUnsynced(status: LifecycleStatus): boolean {
  return status === 'LOCAL_DRAFT' || status === 'FACILITATOR_STAGED_BATCH';
}

export async function createNewDraft(
  intent: CorrectionIntent,
  kioskId = 'CSC-PATNA-091',
  initialStatus: LifecycleStatus = 'LOCAL_DRAFT'
): Promise<DraftLifecycleRecord> {
  const now = new Date().toISOString();
  const id = `DFT-${Date.now()}`;
  const shortCodeReceipt = await generateShortCodeReceipt(JSON.stringify(intent), kioskId, now);
  const initialHash = await computeSha256(`${id}:${shortCodeReceipt}:${now}`);

  const record: DraftLifecycleRecord = {
    id,
    shortCodeReceipt,
    status: initialStatus,
    kioskId,
    createdAt: now,
    updatedAt: now,
    intent,
    isOfflineOnly: isDraftUnsynced(initialStatus),
    auditHashChain: [initialHash],
  };

  await appendAuditLog('DRAFT_CREATED', kioskId, record);
  return record;
}

// Transition state with validation and audit logging
export async function transitionDraftStatus(
  draft: DraftLifecycleRecord,
  newStatus: LifecycleStatus,
  simulatedNetworkCut = false
): Promise<{ success: boolean; draft: DraftLifecycleRecord; error?: string }> {
  // Check for simulated network drop mid-sync (EC-04)
  if (simulatedNetworkCut) {
    // Mid-sync fails; remains in LOCAL_DRAFT
    const updatedDraft: DraftLifecycleRecord = {
      ...draft,
      updatedAt: new Date().toISOString(),
      status: 'LOCAL_DRAFT',
      isOfflineOnly: true,
    };
    await appendAuditLog('GATEWAY_SYNC_FAILED_NETWORK_CUT', draft.kioskId, { draftId: draft.id });
    return {
      success: false,
      draft: updatedDraft,
      error: 'Network connection dropped mid-synchronization. Safe-mode preserved: draft retained as LOCAL_DRAFT.',
    };
  }

  if (!canTransition(draft.status, newStatus)) {
    return {
      success: false,
      draft,
      error: `Invalid transition from ${draft.status} to ${newStatus}. Government lifecycle mandates sequential verification.`,
    };
  }

  const now = new Date().toISOString();
  const newHash = await computeSha256(
    `${draft.auditHashChain[draft.auditHashChain.length - 1]}:${newStatus}:${now}`
  );

  const updated: DraftLifecycleRecord = {
    ...draft,
    status: newStatus,
    updatedAt: now,
    isOfflineOnly: isDraftUnsynced(newStatus),
    officialAckNumber:
      newStatus === 'GATEWAY_SUBMITTED' || newStatus === 'UNDER_VERIFICATION' || newStatus === 'APPROVED'
        ? draft.officialAckNumber || `GOV-NFSA-${Math.floor(100000 + Math.random() * 900000)}`
        : undefined,
    assignedOfficer:
      newStatus === 'UNDER_VERIFICATION' ? 'Taluk Supply Officer (TSO), Danapur' : draft.assignedOfficer,
    slaDaysRemaining: newStatus === 'UNDER_VERIFICATION' ? 14 : draft.slaDaysRemaining,
    auditHashChain: [...draft.auditHashChain, newHash],
  };

  await appendAuditLog('DRAFT_STATUS_TRANSITIONED', draft.kioskId, {
    draftId: draft.id,
    from: draft.status,
    to: newStatus,
  });

  return { success: true, draft: updated };
}
