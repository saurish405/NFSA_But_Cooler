import React, { useState } from 'react';
import {
  Truck,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import type { SchemeType } from '../types';

interface AllocationPolicyViewProps {
  onNavigateToSimulator?: () => void;
}

export const AllocationPolicyView: React.FC<AllocationPolicyViewProps> = ({ onNavigateToSimulator }) => {
  const [scheme, setScheme] = useState<SchemeType>('PHH');
  const [memberCount, setMemberCount] = useState<number>(5);
  const [commodityRatio, setCommodityRatio] = useState<'STANDARD' | 'RICE_DOMINANT' | 'WHEAT_DOMINANT'>('STANDARD');

  // Calculate allocation
  let totalKg = 0;
  let riceKg = 0;
  let wheatKg = 0;

  if (scheme === 'AAY') {
    totalKg = 35; // AAY is fixed 35kg per household
    if (commodityRatio === 'STANDARD') {
      riceKg = 20;
      wheatKg = 15;
    } else if (commodityRatio === 'RICE_DOMINANT') {
      riceKg = 35;
      wheatKg = 0;
    } else {
      riceKg = 15;
      wheatKg = 20;
    }
  } else {
    // PHH: 5kg per member
    totalKg = memberCount * 5;
    if (commodityRatio === 'STANDARD') {
      riceKg = memberCount * 3;
      wheatKg = memberCount * 2;
    } else if (commodityRatio === 'RICE_DOMINANT') {
      riceKg = memberCount * 5;
      wheatKg = 0;
    } else {
      riceKg = memberCount * 2;
      wheatKg = memberCount * 3;
    }
  }

  return (
    <div className="card" id="allocation-policy-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Card Header */}
      <div className="card-header">
        <div>
          <div className="card-title">
            <Truck size={18} />
            <span>National Allocation Policy & Statutory Entitlement Calculator</span>
            <span className="badge badge-safe">NFSA 2013 Statutory Mandate</span>
          </div>
          <p className="card-subtitle">
            Calculate statutory household grain entitlements, state commodity ratios, and Food Security Allowance safeguards under Section 8.
          </p>
        </div>
      </div>

      {/* 2. Interactive Calculator Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Left Column: Parameter Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calculator size={16} />
            <span>Household Parameters</span>
          </div>

          {/* Scheme Selector */}
          <div className="form-group">
            <label className="form-label">Ration Card Category / Scheme</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn ${scheme === 'PHH' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '0.8rem' }}
                onClick={() => setScheme('PHH')}
              >
                Priority Household (PHH)
              </button>
              <button
                type="button"
                className={`btn ${scheme === 'AAY' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '0.8rem' }}
                onClick={() => setScheme('AAY')}
              >
                Antyodaya Anna Yojana (AAY)
              </button>
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {scheme === 'PHH'
                ? 'Statutory entitlement: 5 kg per member per month.'
                : 'Statutory entitlement: Fixed 35 kg per family per month, regardless of family size.'}
            </div>
          </div>

          {/* Member Count Slider (Relevant for PHH) */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Active Family Members in Roster</label>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {memberCount} Members
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={memberCount}
              onChange={(e) => setMemberCount(parseInt(e.target.value, 10))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>1 Member</span>
              <span>5 Members</span>
              <span>10 Members</span>
            </div>
          </div>

          {/* State Commodity Ratio */}
          <div className="form-group">
            <label className="form-label">State Commodity Allocation Profile</label>
            <select
              className="form-input"
              value={commodityRatio}
              onChange={(e) => setCommodityRatio(e.target.value as any)}
            >
              <option value="STANDARD">Standard National (60% Rice : 40% Wheat — Bihar, UP, MP)</option>
              <option value="RICE_DOMINANT">Southern / Coastal (100% Rice — Andhra Pradesh, TN, WB)</option>
              <option value="WHEAT_DOMINANT">Northern Wheat Belt (40% Rice : 60% Wheat — Punjab, Haryana, Rajasthan)</option>
            </select>
          </div>
        </div>

        {/* Right Column: Calculated Entitlement Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Statutory Monthly Entitlement Result
            </div>

            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center', marginBottom: '1rem', border: '1px solid var(--border-strong)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TOTAL GUARANTEED MONTHLY FOODGRAIN</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--civic-emerald-text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {totalKg} <span style={{ fontSize: '1.1rem' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                ₹0.00 Total Cost • 100% Subsidized under PMGKAY
              </div>
            </div>

            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div className="stat-box" style={{ padding: '0.75rem' }}>
                <span className="stat-label">Fortified Rice</span>
                <span className="stat-value" style={{ fontSize: '1.25rem' }}>
                  {riceKg} <span className="stat-unit">kg</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Statutory max ₹3/kg (Waived)
                </span>
              </div>

              <div className="stat-box" style={{ padding: '0.75rem' }}>
                <span className="stat-label">Wheat</span>
                <span className="stat-value" style={{ fontSize: '1.25rem' }}>
                  {wheatKg} <span className="stat-unit">kg</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Statutory max ₹2/kg (Waived)
                </span>
              </div>
            </div>
          </div>

          {onNavigateToSimulator && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={onNavigateToSimulator}
            >
              <span>Test Pre-Flight Demographic Blast Radius</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Statutory Safeguards & EC-11 Outage Protection */}
      <div className="grid-2" style={{ gap: '1rem', marginTop: '0.5rem' }}>
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
            <ShieldCheck size={16} color="var(--civic-emerald-text)" />
            <span>Section 8: Food Security Allowance</span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
            Under Section 8 of the National Food Security Act, 2013, if the State Government fails to supply entitled foodgrains to an eligible household within the calendar month, the citizen has a statutory entitlement to a cash <strong>Food Security Allowance</strong> paid directly to their bank account.
          </p>
        </div>

        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
            <CheckCircle2 size={16} color="var(--civic-emerald-text)" />
            <span>EC-11: Commodity Outage Safe Partial Draw</span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
            If a Fair Price Shop suffers a temporary stock outage of wheat but has rice in stock, citizens are legally permitted to draw their rice quota today without forfeiting their wheat quota. The ePoS system preserves the remaining wheat balance for later collection.
          </p>
        </div>
      </div>
    </div>
  );
};
