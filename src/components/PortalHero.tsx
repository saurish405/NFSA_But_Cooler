import React from 'react';
import {
  MessageSquare,
  Sparkles,
  Compass,
  FileCheck,
  FileWarning,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import type { PortalNavigationTab } from '../types';
import seedData from '../data/dataset.json';

interface PortalHeroProps {
  onOpenAskNicci: () => void;
  onNavigateTab: (tab: PortalNavigationTab) => void;
}

export const PortalHero: React.FC<PortalHeroProps> = ({ onOpenAskNicci, onNavigateTab }) => {
  const stats = (seedData as any).nationalStats || {
    beneficiariesCoveredCr: '80.72',
    activeRationCardsCr: '19.85',
    fairPriceShopsTotal: '5,38,241',
    eposOperationalPercent: '99.4%',
    monthlyAllocationLakhMT: '55.4',
    onorcMonthlyPortabilityLakh: '125.8',
  };

  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* 1. Sleek National Civic Banner */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-safe">GOVERNMENT OF INDIA • NFSA 2013</span>
              <span className="badge badge-info">ONE NATION ONE RATION CARD (ONORC)</span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
              National Food Security & Zero-Runaround Portal
            </h2>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Guaranteed food and nutritional security for <strong>80.7 Crore citizens</strong> across 36 States and Union Territories. Powered by pre-flight demographic mutation safeguards, dynamic interstate portability splitting, and zero-trace village kiosk hygiene.
            </p>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onNavigateTab('ration_cards')}
                id="hero-btn-check-quota"
              >
                <Sparkles size={14} />
                <span>Simulate Safe demographic edit</span>
                <ArrowRight size={13} />
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onNavigateTab('onorc')}
                id="hero-btn-onorc"
              >
                <Compass size={14} />
                <span>Interstate Portability (ONORC)</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onNavigateTab('state_portals')}
                id="hero-btn-state-portals"
              >
                <MapPin size={14} />
                <span>State Transparency Portals</span>
              </button>
            </div>
          </div>

          {/* "NEED HELP? ASK NICCI" - Official Virtual Assistant Widget (As seen on real nfsa.gov.in) */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              minWidth: '220px',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--civic-emerald-text)',
              }}
            >
              <MessageSquare size={24} />
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>NEED HELP? ASK NICCI</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                NIC Citizen Virtual Assistant
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.775rem', padding: '0.35rem 0.65rem', marginTop: '0.25rem' }}
              onClick={onOpenAskNicci}
              id="btn-trigger-ask-nicci"
            >
              <span>Instant Citizen Q&A</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Real-Time National PDS Operational Statistics Strip */}
      <div className="grid-4" style={{ gap: '0.75rem' }}>
        <div className="stat-box">
          <span className="stat-label">Total Beneficiaries</span>
          <span className="stat-value">
            {stats.beneficiariesCoveredCr} <span className="stat-unit">Crore Citizens</span>
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Active Ration Cards</span>
          <span className="stat-value">
            {stats.activeRationCardsCr} <span className="stat-unit">Crore Households</span>
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Automated Fair Price Shops</span>
          <span className="stat-value">
            {stats.fairPriceShopsTotal} <span className="stat-unit">({stats.eposOperationalPercent} ePoS)</span>
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Monthly Foodgrain Lifting</span>
          <span className="stat-value">
            {stats.monthlyAllocationLakhMT} <span className="stat-unit">Lakh MT Grain</span>
          </span>
        </div>
      </div>
    </div>
  );
};
