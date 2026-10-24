import React, { useState } from 'react';
import type { DraftLifecycleRecord, LifecycleStatus } from '../types';
import { transitionDraftStatus, isDraftUnsynced } from '../services/lifecycleFsm';
import {
  FileCheck,
  Send,
  CloudOff,
  CheckCircle,
  Clock,
  Hash,
  ShieldCheck,
  Building2,
  AlertCircle,
  Copy,
} from 'lucide-react';

interface LifecycleDraftsProps {
  drafts: DraftLifecycleRecord[];
  onDraftUpdated: (draft: DraftLifecycleRecord) => void;
}

const LIFECYCLE_STEPS: { key: LifecycleStatus; label: string; desc: string }[] = [
  { key: 'LOCAL_DRAFT', label: 'Local Draft', desc: 'Saved in offline browser/kiosk memory. Zero official authority.' },
  { key: 'FACILITATOR_STAGED_BATCH', label: 'Facilitator Batch', desc: 'Queued at CSC Kiosk; signed offline shortcode receipt issued.' },
  { key: 'GATEWAY_SUBMITTED', label: 'Gateway Submitted', desc: 'Acknowledged by Food & Civil Supplies backend gateway.' },
  { key: 'UNDER_VERIFICATION', label: 'Under Verification', desc: 'Assigned to Taluk Supply Officer (TSO); statutory 14-day SLA clock starts.' },
  { key: 'APPROVED', label: 'Approved & Sealed', desc: 'Official digital roster mutation committed.' },
];

export const LifecycleDrafts: React.FC<LifecycleDraftsProps> = ({ drafts, onDraftUpdated }) => {
  const [selectedDraftId, setSelectedDraftId] = useState<string>(drafts[0]?.id || '');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeDraft = drafts.find((d) => d.id === selectedDraftId) || drafts[0];

  const handleStepTransition = async (targetStatus: LifecycleStatus, simulateNetworkCut = false) => {
    if (!activeDraft) return;
    setSyncError(null);

    const res = await transitionDraftStatus(activeDraft, targetStatus, simulateNetworkCut);
    if (!res.success) {
      setSyncError(res.error || 'Transition failed');
    }
    onDraftUpdated(res.draft);
  };

  const handleCopyReceipt = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!activeDraft) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <FileCheck size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
        <h3>No Offline Drafts Yet</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
          Use the Pre-Flight Safe-Correction Simulator to generate an offline draft receipt.
        </p>
      </div>
    );
  }

  const isUnsynced = isDraftUnsynced(activeDraft.status);

  return (
    <div className="card" id="lifecycle-section">
      <div className="card-header">
        <div>
          <div className="card-title">
            <Building2 size={18} />
            <span>Multi-State Draft vs Official Submission Lifecycle</span>
            <span className={`badge ${isUnsynced ? 'badge-caution' : 'badge-safe'}`}>
              {activeDraft.status}
            </span>
          </div>
          <p className="card-subtitle">
            Formal state machine preventing citizens from confusing offline village facilitator drafts with government-acknowledged submissions.
          </p>
        </div>

        {/* Short Code Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.65rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>Receipt: {activeDraft.shortCodeReceipt}</span>
            <button
              type="button"
              onClick={() => handleCopyReceipt(activeDraft.shortCodeReceipt)}
              title="Copy receipt short-code"
              style={{ color: 'inherit' }}
            >
              <Copy size={13} />
            </button>
          </div>
          {copiedCode && <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Copied!</span>}
        </div>
      </div>

      {/* Prominent Diagonal Watermark for Unsynced Drafts */}
      {isUnsynced && (
        <div
          style={{
            margin: '0.5rem 0 1.25rem',
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '2px dashed rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            color: '#fca5a5',
            fontWeight: 800,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
          id="lifecycle-watermark-banner"
        >
          <AlertCircle size={18} />
          <span>
            WATERMARK MANDATE ACTIVE: "DRAFT ONLY — NOT SUBMITTED TO FOOD & CIVIL SUPPLIES DEPARTMENT".
            Citizen holds an offline facilitator voucher, not a statutory filing acknowledgment.
          </span>
        </div>
      )}

      {/* Lifecycle Stage Progression Bar */}
      <div style={{ margin: '1.5rem 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isCurrent = activeDraft.status === step.key;
            const stepOrder = LIFECYCLE_STEPS.findIndex((s) => s.key === activeDraft.status);
            const isPast = idx < stepOrder;

            return (
              <div
                key={step.key}
                style={{
                  background: isCurrent
                    ? 'rgba(56, 189, 248, 0.15)'
                    : isPast
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'rgba(15, 23, 42, 0.5)',
                  border: `1px solid ${
                    isCurrent
                      ? 'var(--text-accent)'
                      : isPast
                      ? 'rgba(16, 185, 129, 0.3)'
                      : 'var(--border-subtle)'
                  }`,
                  borderRadius: '10px',
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    STAGE {idx + 1}
                  </span>
                  {isPast ? (
                    <CheckCircle size={14} color="#10b981" />
                  ) : isCurrent ? (
                    <Clock size={14} color="var(--text-accent)" />
                  ) : null}
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{step.label}</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error alert if sync dropped */}
      {syncError && (
        <div
          style={{
            margin: '0.75rem 0',
            padding: '0.75rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            fontSize: '0.825rem',
          }}
        >
          {syncError}
        </div>
      )}

      {/* Lifecycle Transition Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Kiosk Origin: <strong>{activeDraft.kioskId}</strong> • Timestamp: {new Date(activeDraft.createdAt).toLocaleTimeString()}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* EC-04 Ghost Sync Test Button */}
          {activeDraft.status === 'LOCAL_DRAFT' && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem' }}
              onClick={() => handleStepTransition('GATEWAY_SUBMITTED', true)}
              title="Test EC-04: Simulate mid-sync network loss (draft stays LOCAL_DRAFT)"
              id="btn-test-ghost-sync"
            >
              <CloudOff size={15} color="#ef4444" />
              <span>⚡ Test EC-04: Ghost Sync Network Drop</span>
            </button>
          )}

          {/* Normal Gateway Submit */}
          {activeDraft.status === 'LOCAL_DRAFT' && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '0.8rem' }}
              onClick={() => handleStepTransition('GATEWAY_SUBMITTED', false)}
              id="btn-sync-gateway"
            >
              <Send size={15} />
              <span>Sync with Government Gateway</span>
            </button>
          )}

          {activeDraft.status === 'GATEWAY_SUBMITTED' && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '0.8rem' }}
              onClick={() => handleStepTransition('UNDER_VERIFICATION', false)}
              id="btn-tso-assign"
            >
              <span>Assign to Taluk Supply Officer (Start 14d SLA)</span>
            </button>
          )}

          {activeDraft.status === 'UNDER_VERIFICATION' && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', background: '#10b981' }}
              onClick={() => handleStepTransition('APPROVED', false)}
              id="btn-approve-mutation"
            >
              <span>Verify & Approve Roster Mutation</span>
            </button>
          )}
        </div>
      </div>

      {/* Tamper-Evident SHA-256 Audit Trail */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.85rem',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-accent)' }}>
          <Hash size={14} />
          <span>Tamper-Evident Chained Hash Audit Ledger:</span>
        </div>
        <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {activeDraft.auditHashChain.map((hash, i) => (
            <div
              key={i}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.725rem',
                color: 'var(--text-secondary)',
                wordBreak: 'break-all',
              }}
            >
              Block #{i}: {hash}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
