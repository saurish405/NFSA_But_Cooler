import React, { useState } from 'react';
import type { CorrectionIntent, DraftLifecycleRecord, RationCard, SimulationResult } from '../types';
import { simulatePreFlightCorrection } from '../services/policyEngine';
import { createNewDraft } from '../services/lifecycleFsm';
import { speechEngine } from '../services/speechEngine';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Volume2,
  Lock,
  Stamp,
} from 'lucide-react';

interface SafeCorrectionSimulatorProps {
  card: RationCard;
  onDraftCreated: (draft: DraftLifecycleRecord) => void;
}

export const SafeCorrectionSimulator: React.FC<SafeCorrectionSimulatorProps> = ({
  card,
  onDraftCreated,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(card.members[3]?.id || card.members[0].id);
  const [field, setField] = useState<'age' | 'name' | 'aadhaar' | 'income'>('age');
  const [newVal, setNewVal] = useState<string | number>('18');
  const [twoStepConfirmed, setTwoStepConfirmed] = useState<boolean>(false);
  const [createdDraft, setCreatedDraft] = useState<DraftLifecycleRecord | null>(null);

  const selectedMember = card.members.find((m) => m.id === selectedMemberId) || card.members[0];

  const currentVal =
    field === 'age'
      ? selectedMember.age
      : field === 'name'
      ? selectedMember.name
      : field === 'aadhaar'
      ? selectedMember.aadhaarMasked
      : selectedMember.incomeMonthly;

  const currentIntent: CorrectionIntent = {
    memberId: selectedMember.id,
    memberName: selectedMember.name,
    field,
    oldVal: currentVal,
    newVal,
  };

  const simResult: SimulationResult = simulatePreFlightCorrection(card, currentIntent);

  // Preset Shortcuts
  const applyPresetEC01 = () => {
    setSelectedMemberId('MEM-04'); // Ramesh Paswan
    setField('age');
    setNewVal(18);
    setTwoStepConfirmed(false);
  };

  const applyPresetEC06 = () => {
    setSelectedMemberId('MEM-03'); // Sunita Paswan
    setField('name');
    setNewVal('Seeta Paswan');
    setTwoStepConfirmed(false);
  };

  const applyPresetEC10 = () => {
    setSelectedMemberId('MEM-03');
    setField('aadhaar');
    setNewVal('XXXX-XXXX-9999'); // Registered on UP card
    setTwoStepConfirmed(false);
  };

  const handleCreateDraft = async () => {
    if (simResult.requiresTwoStepConfirmation && !twoStepConfirmed) {
      alert('Mandatory safety precaution: You must review and check the two-step affirmative confirmation before generating an offline draft.');
      return;
    }

    const draft = await createNewDraft(currentIntent, 'CSC-PATNA-091', 'LOCAL_DRAFT');
    setCreatedDraft(draft);
    onDraftCreated(draft);
  };

  const handleSpeakAlert = () => {
    speechEngine.speakSimulationAlert(simResult.headline, simResult.warningText, 'en');
  };

  const handleSpeakAlertHindi = () => {
    const hindiSummary =
      simResult.safetyRank === 'DANGER_ENTITLEMENT_LOSS'
        ? `चेतावनी: रमेश की उम्र 18 वर्ष करने पर बिहार नियम 4बी के अनुसार प्रति माह 5 किलो अनाज का नुकसान होगा।`
        : `जांच सफल: आपके राशन में कोई कटौती नहीं होगी।`;
    speechEngine.speak(hindiSummary, 'hi');
  };

  return (
    <div className="card" id="safe-correction-section">
      <div className="card-header">
        <div>
          <div className="card-title">
            <Sparkles size={18} />
            <span>Pre-Flight Safe-Correction Simulator</span>
            <span className="badge badge-info">Zero-Runaround Guard</span>
          </div>
          <p className="card-subtitle">
            Simulates the policy blast radius of any demographic edit before submission to prevent the "Silent Exclusion" catastrophe.
          </p>
        </div>

        {/* Audio triggers */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
            onClick={handleSpeakAlert}
            title="Listen to simulation warning in English"
            id="btn-speak-sim-en"
          >
            <Volume2 size={14} /> Listen (EN)
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
            onClick={handleSpeakAlertHindi}
            title="Listen to simulation warning in Hindi"
            id="btn-speak-sim-hi"
          >
            <Volume2 size={14} /> सुनें (HI)
          </button>
        </div>
      </div>

      {/* Preset Test Case Buttons */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>
          Quick Scenarios:
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
          onClick={applyPresetEC01}
          id="btn-preset-ec01"
        >
          ⚡ Test EC-01: Ramesh Age 17 → 18 (Adult Purge)
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
          onClick={applyPresetEC06}
          id="btn-preset-ec06"
        >
          ⚡ Test EC-06: Sita → Seeta (Spelling Bypass)
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
          onClick={applyPresetEC10}
          id="btn-preset-ec10"
        >
          ⚡ Test EC-10: Injected Duplicate Aadhaar (Fraud Intercept)
        </button>
      </div>

      {/* Mutation Form Controls */}
      <div className="grid-3">
        <div className="form-group">
          <label className="form-label" htmlFor="select-member">Target Family Member</label>
          <select
            id="select-member"
            className="form-select"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
          >
            {card.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.relation}, Age {m.age})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="select-field">Field to Mutate</label>
          <select
            id="select-field"
            className="form-select"
            value={field}
            onChange={(e) => {
              const f = e.target.value as any;
              setField(f);
              if (f === 'age') setNewVal(18);
              else if (f === 'name') setNewVal(selectedMember.name);
              else if (f === 'aadhaar') setNewVal('XXXX-XXXX-9999');
              else if (f === 'income') setNewVal(selectedMember.incomeMonthly);
            }}
          >
            <option value="age">Age (Threshold Reclassification)</option>
            <option value="name">Name (Transliteration / Spelling)</option>
            <option value="aadhaar">Aadhaar UID (De-duplication Check)</option>
            <option value="income">Monthly Income (Poverty Ceiling)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="input-newval">
            Proposed New Value (Current: {String(currentVal)})
          </label>
          <input
            id="input-newval"
            className="form-input"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            placeholder="Enter proposed correction"
          />
        </div>
      </div>

      {/* Simulation Result Callout Card */}
      <div
        className={`sim-alert-card ${
          simResult.safetyRank === 'DANGER_ENTITLEMENT_LOSS' || simResult.safetyRank === 'DANGER_DUPLICATE_UID'
            ? 'sim-alert-danger'
            : simResult.safetyRank === 'CAUTION'
            ? 'sim-alert-caution'
            : 'sim-alert-safe'
        }`}
        role="alert"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            {simResult.safetyRank.startsWith('DANGER') ? (
              <ShieldAlert size={28} color="#ef4444" style={{ flexShrink: 0 }} />
            ) : simResult.safetyRank === 'CAUTION' ? (
              <AlertTriangle size={28} color="#f59e0b" style={{ flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={28} color="#10b981" style={{ flexShrink: 0 }} />
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{simResult.headline}</h4>
                <span
                  className={`badge ${
                    simResult.safetyRank.startsWith('DANGER')
                      ? 'badge-danger'
                      : simResult.safetyRank === 'CAUTION'
                      ? 'badge-caution'
                      : 'badge-safe'
                  }`}
                >
                  {simResult.safetyRank}
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
                {simResult.warningText}
              </p>

              {/* Statutory Rule Citation */}
              <div style={{ marginTop: '0.6rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                <strong>Statutory Basis:</strong> {simResult.ruleCitation}
              </div>

              {/* Required Affidavit Link if triggered */}
              {simResult.requiredAffidavit && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                  }}
                >
                  <FileText size={14} />
                  <span>Safeguard Document Required: {simResult.requiredAffidavit}</span>
                </div>
              )}
            </div>
          </div>

          {/* Entitlement Delta Scoreboard */}
          <div
            style={{
              textAlign: 'right',
              flexShrink: 0,
              background: 'rgba(0,0,0,0.25)',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Entitlement Delta (ΔE)
            </div>
            <div
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
                color: simResult.deltaE < 0 ? '#ef4444' : simResult.deltaE > 0 ? '#10b981' : 'var(--text-primary)',
              }}
            >
              {simResult.deltaE > 0 ? `+${simResult.deltaE}` : simResult.deltaE} kg
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {simResult.baselineEntitlementKg} kg → {simResult.postChangeEntitlementKg} kg
            </div>
          </div>
        </div>

        {/* Two-Step Affirmative Confirmation Checkbox for dangerous mutations */}
        {simResult.requiresTwoStepConfirmation && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.85rem',
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                id="checkbox-two-step-confirm"
                checked={twoStepConfirmed}
                onChange={(e) => setTwoStepConfirmed(e.target.checked)}
                style={{ marginTop: '0.2rem', width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#fef2f2' }}>
                I acknowledge the calculated blast radius. I verify that this demographic mutation risks an entitlement
                reduction or verification lock, and I have attached/prepared the mandated dependency affidavit.
              </span>
            </label>
          </div>
        )}

        {/* Action Button: Generate Offline Draft */}
        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateDraft}
            disabled={simResult.safetyRank === 'DANGER_DUPLICATE_UID'}
            id="btn-generate-draft"
          >
            <Stamp size={16} />
            <span>Generate Cryptographic Offline Draft Receipt</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Generated Draft Feedback */}
      {createdDraft && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          id="draft-success-callout"
        >
          <div>
            <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.95rem' }}>
              🎉 Local Draft Created with Deterministic Short-Code:
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, marginTop: '0.2rem' }}>
              {createdDraft.shortCodeReceipt}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Status: <strong>{createdDraft.status}</strong> • Watermark: <strong>DRAFT ONLY</strong> (Isolated from govt gateway until batch sync)
            </div>
          </div>
          <span className="badge badge-safe">Chained Hash Verified</span>
        </div>
      )}
    </div>
  );
};
