import React from 'react';
import type { InspectorAnomalySignal } from '../types';
import seedData from '../data/dataset.json';
import { Shield, Activity, Search, AlertCircle, FileSearch, CheckCircle2 } from 'lucide-react';

export const InspectorSignals: React.FC = () => {
  const signals = seedData.inspectorSignals as InspectorAnomalySignal[];

  return (
    <div className="card" id="inspector-section">
      <div className="card-header">
        <div>
          <div className="card-title">
            <Activity size={20} color="#38bdf8" />
            <span>Inspector Anomaly Signal & Hypothesis Generator</span>
            <span className="badge badge-info">Elite Neutral Framing</span>
          </div>
          <p className="card-subtitle">
            Detects counter irregularities using purely objective, non-accusatory language. Formulates actionable inspection hypotheses for field audit officers.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {signals.map((sig) => (
          <div
            key={sig.id}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{sig.fpsName}</h3>
                  <span className="badge badge-caution">Velocity Score: {sig.distributionVelocityScore}/10</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Jurisdiction: {sig.location} • Monitored Metric: {sig.offHoursPercentage}% Off-Hours Distribution
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="badge badge-info">
                  <Search size={12} /> Audit Recommended
                </span>
              </div>
            </div>

            {/* Observed Pattern */}
            <div style={{ marginTop: '0.85rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Empirical Pattern Observed:
              </div>
              <div style={{ fontSize: '0.875rem', color: '#f8fafc', marginTop: '0.2rem', lineHeight: 1.4 }}>
                {sig.patternObserved}
              </div>
            </div>

            {/* Objective Hypothesis (Zero-Accusation Standard) */}
            <div
              style={{
                marginTop: '0.85rem',
                padding: '0.85rem',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-accent)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileSearch size={14} />
                <span>Non-Accusatory System Hypothesis:</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.3rem', lineHeight: 1.5 }}>
                "{sig.systemHypothesis}"
              </p>
            </div>

            {/* Recommended Standard Field Action */}
            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong>Field Protocol:</strong> {sig.recommendedAction}
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                onClick={() => alert(`Inspection docket dispatched to Taluk Civil Supplies Officer for ${sig.fpsName}.`)}
              >
                <CheckCircle2 size={13} />
                <span>Dispatch Standard Field Docket</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
