import React, { useState } from 'react';
import type { HouseholdMember, RationCard } from '../types';
import seedData from '../data/dataset.json';
import {
  Users,
  ShieldCheck,
  CreditCard,
  MapPin,
  Calendar,
  AlertTriangle,
  RefreshCw,
  GitMerge,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RosterStructuredViewProps {
  card: RationCard;
  onSelectCard: (cardNumber: string) => void;
  onLaunchCorrection: (memberId: string) => void;
  is409ConflictActive: boolean;
  onResolve409: () => void;
}

export const RosterStructuredView: React.FC<RosterStructuredViewProps> = ({
  card,
  onSelectCard,
  onLaunchCorrection,
  is409ConflictActive,
  onResolve409,
}) => {
  const allCards = seedData.rationCards as RationCard[];
  const [conflictResolved, setConflictResolved] = useState<boolean>(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 409 Stale Cache Collision Warning Modal (EC-07) */}
      {(is409ConflictActive && !conflictResolved) && (
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
          }}
          role="alert"
          id="conflict-409-banner"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <GitMerge size={22} color="#ef4444" />
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#fca5a5' }}>
                  HTTP 409 Version Conflict Detected: Stale Local Cache (EC-07)
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Client record was cached 14 days ago (Version {card.version}). Government registry has since moved to Version {card.version + 2} via Taluk verification.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                onClick={() => {
                  setConflictResolved(true);
                  onResolve409();
                }}
                id="btn-resolve-409-merge"
              >
                <span>Accept Latest Server Snapshot (Safe Rebase)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Selector & Overview Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <CreditCard size={18} />
              <span>National Food Security Roster & Quota Ledger</span>
              <span className="badge badge-safe">{card.scheme} Scheme</span>
            </div>
            <p className="card-subtitle">
              Official digital ration mandate authenticated against UIDAI & Department of Food & Civil Supplies.
            </p>
          </div>

          {/* Switch Demo Cards */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {allCards.map((c) => (
              <button
                key={c.cardNumber}
                type="button"
                className={`btn btn-secondary ${c.cardNumber === card.cardNumber ? 'active' : ''}`}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.65rem',
                  border: c.cardNumber === card.cardNumber ? '1px solid var(--text-accent)' : undefined,
                }}
                onClick={() => onSelectCard(c.cardNumber)}
              >
                <span>{c.homeState} ({c.scheme})</span>
              </button>
            ))}
          </div>
        </div>

        {/* High Density Metric Tiles */}
        <div className="grid-4">
          <div className="stat-box">
            <span className="stat-label">Card Number</span>
            <span className="stat-value" style={{ fontSize: '1.05rem', color: 'var(--text-accent)' }}>
              {card.cardNumber}
            </span>
          </div>

          <div className="stat-box">
            <span className="stat-label">Monthly Grain Allocation</span>
            <span className="stat-value">
              {card.monthlyQuota.riceKg + card.monthlyQuota.wheatKg} <span className="stat-unit">kg / mo</span>
            </span>
          </div>

          <div className="stat-box">
            <span className="stat-label">Registered Home Jurisdiction</span>
            <span className="stat-value" style={{ fontSize: '0.95rem' }}>
              {card.homeDistrict}, {card.homeState}
            </span>
          </div>

          <div className="stat-box">
            <span className="stat-label">Assigned FPS Counter</span>
            <span className="stat-value" style={{ fontSize: '0.95rem', color: '#f59e0b' }}>
              {card.fpsAssignedId}
            </span>
          </div>
        </div>
      </div>

      {/* Household Members Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Users size={18} />
            <span>Family Member Composition ({card.members.length} Registered Individuals)</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Click "Simulate Blast-Radius" to test pre-flight mutations
          </span>
        </div>

        <div className="table-container">
          <table className="custom-table" role="table" aria-label="Household Members Table">
            <thead>
              <tr>
                <th scope="col">Member Name</th>
                <th scope="col">Relation</th>
                <th scope="col">Age / Gender</th>
                <th scope="col">Aadhaar Token</th>
                <th scope="col">Declared Income</th>
                <th scope="col">Location Status</th>
                <th scope="col">Pre-Flight Simulation</th>
              </tr>
            </thead>
            <tbody>
              {card.members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {m.name}
                      {m.isHoH && <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>HOH</span>}
                    </div>
                  </td>
                  <td>{m.relation}</td>
                  <td>{m.age} yrs / {m.gender}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{m.aadhaarMasked}</td>
                  <td>₹{m.incomeMonthly} / mo</td>
                  <td>
                    <span
                      className={`badge ${
                        m.locationStatus === 'MIGRANT_DESTINATION' ? 'badge-caution' : 'badge-safe'
                      }`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {m.locationStatus === 'MIGRANT_DESTINATION' ? `Migrant (${m.currentDestinationState})` : 'Home Village'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => onLaunchCorrection(m.id)}
                      title={`Simulate correction for ${m.name}`}
                      id={`btn-sim-member-${m.id}`}
                    >
                      <Sparkles size={12} color="#38bdf8" />
                      <span>Simulate Blast Radius</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
