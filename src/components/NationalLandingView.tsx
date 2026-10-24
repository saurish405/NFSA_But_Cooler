import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Compass,
  Store,
  Users,
  FileText,
  Activity,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  ImageIcon,
  RefreshCw,
  Send,
} from 'lucide-react';
import seedData from '../data/dataset.json';
import type { PortalNavigationTab } from '../types';

interface NationalLandingViewProps {
  onNavigateTab: (tab: PortalNavigationTab) => void;
  onOpenAskNicci: () => void;
}

export const NationalLandingView: React.FC<NationalLandingViewProps> = ({
  onNavigateTab,
  onOpenAskNicci,
}) => {
  const stats = (seedData as any).nationalStats || {
    beneficiariesCoveredCr: '80.72',
    activeRationCardsCr: '19.85',
    fairPriceShopsTotal: '5,38,241',
    eposOperationalPercent: '99.4%',
    monthlyAllocationLakhMT: '55.4',
    onorcMonthlyPortabilityLakh: '125.8',
  };

  // Official 3-tab active state
  const [activeInfoTab, setActiveInfoTab] = useState<'activity' | 'complaint' | 'social'>('activity');

  // Image placeholder customizer state
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('/assets/nfsa_hero_banner.jpg');
  const [isCustomizingImage, setIsCustomizingImage] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [useWireframePlaceholder, setUseWireframePlaceholder] = useState<boolean>(false);

  // Quick complaint state on landing
  const [complaintText, setComplaintText] = useState<string>('');
  const [complaintCardNumber, setComplaintCardNumber] = useState<string>('BR-PAT-2024-884920');

  const handleApplyCustomImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setBannerImageUrl(customUrlInput.trim());
      setUseWireframePlaceholder(false);
      setIsCustomizingImage(false);
    }
  };

  const handleResetToDefaultBanner = () => {
    setBannerImageUrl('/assets/nfsa_hero_banner.jpg');
    setUseWireframePlaceholder(false);
    setIsCustomizingImage(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Official Hero Banner with Image Placeholder & Floating Ask NICCI Widget */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'var(--shadow-md)',
        }}
        id="landing-hero-banner"
      >
        {/* Banner Top Bar / Campaign Badge */}
        <div
          style={{
            background: 'var(--bg-primary)',
            padding: '0.45rem 1rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-safe">NATIONAL FOOD SECURITY ACT • 2013</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              भारत सरकार • Ministry of Consumer Affairs, Food & Public Distribution
            </span>
          </div>

          {/* Image Placeholder Config Trigger */}
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.725rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
            onClick={() => setIsCustomizingImage(!isCustomizingImage)}
            title="Configure or Replace Hero Banner Image Placeholder"
          >
            <ImageIcon size={12} />
            <span>Hero Image Placeholder Settings</span>
          </button>
        </div>

        {/* Custom Image Setting Panel (if opened) */}
        {isCustomizingImage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-elevated)',
              borderBottom: '1px solid var(--border-strong)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              <span>Banner Image Placeholder Controls</span>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Aspect Ratio: 16:9 • Recommended: 1920×1080</span>
            </div>
            <form onSubmit={handleApplyCustomImage} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1, minWidth: '240px', height: '32px', fontSize: '0.775rem' }}
                placeholder="Paste Custom Banner Image URL (e.g. https://.../banner.png)"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>
                Apply Image
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => setUseWireframePlaceholder(!useWireframePlaceholder)}
              >
                {useWireframePlaceholder ? 'Show Graphic Banner' : 'Show Wireframe Box'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                onClick={handleResetToDefaultBanner}
              >
                <RefreshCw size={12} />
                <span>Reset to Default</span>
              </button>
            </form>
          </div>
        )}

        {/* Hero Image Container */}
        <div style={{ position: 'relative', width: '100%', minHeight: '340px', background: 'var(--bg-inset)' }}>
          {useWireframePlaceholder ? (
            /* Wireframe Placeholder for Image */
            <div
              style={{
                width: '100%',
                minHeight: '360px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--bg-inset) 0%, var(--bg-elevated) 100%)',
                border: '2px dashed var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '2rem',
                textAlign: 'center',
                gap: '0.75rem',
              }}
            >
              <ImageIcon size={48} strokeWidth={1.5} color="var(--text-muted)" />
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                [ HERO BANNER IMAGE PLACEHOLDER ]
              </div>
              <div style={{ fontSize: '0.825rem', maxWidth: '540px', lineHeight: 1.5 }}>
                Dimensions: <strong>1920 × 1080 (16:9 Aspect Ratio)</strong>. Designed to host official national campaign banners, commemorative announcements, or ministry mission posters.
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ fontSize: '0.775rem' }}
                onClick={handleResetToDefaultBanner}
              >
                Load Official Civic Commemorative Graphic
              </button>
            </div>
          ) : (
            /* Real High-Resolution Generated Civic Graphic */
            <img
              src={bannerImageUrl}
              alt="National Food Security Act 2013 - Commemorating Grain Self-Sufficiency and Nutritional Security"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '440px',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={() => {
                setUseWireframePlaceholder(true);
              }}
            />
          )}

          {/* "NEED HELP? ASK NICCI" Floating Widget (Exact replica from official site) */}
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1.25rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'transform var(--trans-fast)',
            }}
            onClick={onOpenAskNicci}
            id="btn-hero-ask-nicci"
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--civic-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 10px rgba(46, 160, 67, 0.4)',
              }}
              className="speaking-pulse"
            >
              <MessageSquare size={18} />
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                NEED HELP? ASK NICCI
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', fontWeight: 600 }}>
                ● Instant Citizen Q&A
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Real-Time National Operational Metrics Strip */}
      <div className="grid-4" style={{ gap: '0.75rem' }}>
        <div className="stat-box">
          <span className="stat-label">Total Beneficiaries</span>
          <span className="stat-value">
            {stats.beneficiariesCoveredCr} <span className="stat-unit">Crore Citizens</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', marginTop: '0.2rem' }}>
            ● Universal Right to Food
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Active Ration Cards</span>
          <span className="stat-value">
            {stats.activeRationCardsCr} <span className="stat-unit">Crore Households</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            ● AAY & PHH Categories
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Automated Fair Price Shops</span>
          <span className="stat-value">
            {stats.fairPriceShopsTotal} <span className="stat-unit">({stats.eposOperationalPercent} ePoS)</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', marginTop: '0.2rem' }}>
            ● Real-Time Biometric Link
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Monthly Grain Lifting</span>
          <span className="stat-value">
            {stats.monthlyAllocationLakhMT} <span className="stat-unit">Lakh MT Grain</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', marginTop: '0.2rem' }}>
            ● 100% Free under PMGKAY
          </span>
        </div>
      </div>

      {/* 3. Official 3-Tab Information Desk (Matching real nfsa.gov.in screenshot) */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Tab Headers */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: activeInfoTab === 'activity' ? 'var(--bg-secondary)' : 'transparent',
              color: activeInfoTab === 'activity' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: activeInfoTab === 'activity' ? '2px solid var(--civic-slate)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
            }}
            onClick={() => setActiveInfoTab('activity')}
          >
            <Activity size={16} />
            <span>Activity & Latest Notifications</span>
          </button>

          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: activeInfoTab === 'complaint' ? 'var(--bg-secondary)' : 'transparent',
              color: activeInfoTab === 'complaint' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: activeInfoTab === 'complaint' ? '2px solid var(--civic-slate)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
            }}
            onClick={() => setActiveInfoTab('complaint')}
          >
            <Users size={16} />
            <span>Online Complaint & Grievances</span>
          </button>

          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: activeInfoTab === 'social' ? 'var(--bg-secondary)' : 'transparent',
              color: activeInfoTab === 'social' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: activeInfoTab === 'social' ? '2px solid var(--civic-slate)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
            }}
            onClick={() => setActiveInfoTab('social')}
          >
            <ExternalLink size={16} />
            <span>X by @FoodDeptGOI</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Tab 1: Activity */}
          {activeInfoTab === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <Calendar size={18} color="var(--civic-emerald-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Central Allocation Sanction for October 2026 Issued
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Government of India releases 55.4 Lakh Metric Tonnes of wheat and rice to all 36 States/UTs. Free distribution continues under PMGKAY.
                  </div>
                </div>
                <button type="button" className="btn btn-secondary" style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem' }} onClick={() => onNavigateTab('bulletin')}>
                  View Bulletin
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <CheckCircle2 size={18} color="var(--civic-slate)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Inter-State ONORC Portability Crosses 125 Lakh Monthly Transactions
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Migrant workers in Andhra Pradesh, Maharashtra, and Gujarat successfully drew their entitlement without home state quota lockouts.
                  </div>
                </div>
                <button type="button" className="btn btn-secondary" style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem' }} onClick={() => onNavigateTab('onorc')}>
                  Test Portability
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <AlertCircle size={18} color="var(--civic-amber-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Biometric Sensor Exemption: 100% Zero-Exclusion Advisory Active
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    All Fair Price Shop dealers mandated to provide Iris or Mobile OTP fallback if elderly or manual workers experience fingerprint wear.
                  </div>
                </div>
                <button type="button" className="btn btn-secondary" style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem' }} onClick={() => onNavigateTab('annavitran')}>
                  View Annavitran
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Online Complaint */}
          {activeInfoTab === 'complaint' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--status-safe-bg)', border: '1px solid var(--status-safe-border)', borderRadius: 'var(--radius-md)', padding: '0.85rem', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                <strong>Statutory Grievance Redressal under Section 15 of NFSA 2013:</strong> All complaints regarding non-supply, weighing irregularities, or dealer misbehavior must be redressed within <strong>14 business days</strong>. Beyond 14 days, the portal auto-escalates an appeal memo to the District Collector.
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div className="form-group">
                    <label className="form-label">Ration Card Number</label>
                    <input
                      className="form-input"
                      value={complaintCardNumber}
                      onChange={(e) => setComplaintCardNumber(e.target.value)}
                      placeholder="e.g. BR-PAT-2024-884920"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Grievance Description</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      placeholder="Describe the Fair Price Shop issue (e.g. FPS-0412 dealer refused wheat allocation)..."
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => {
                      onNavigateTab('citizen_corner');
                    }}
                  >
                    <Send size={13} />
                    <span>Open Grievance Redressal Center & Track SLA</span>
                  </button>
                </div>

                <div style={{ flex: 1, minWidth: '260px', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Active Helpline Numbers</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    National Toll-Free PDS Helpline: <strong style={{ color: 'var(--text-primary)' }}>1967</strong>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    Bihar State Food Helpline: <strong style={{ color: 'var(--text-primary)' }}>1800-3456-194</strong>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    Andhra Pradesh Helpline: <strong style={{ color: 'var(--text-primary)' }}>1967</strong>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Direct dispatch available via SMS, WhatsApp, and physical District Collector memo printing.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Social Feed */}
          {activeInfoTab === 'social' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Department of Food & Public Distribution</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>@FoodDeptGOI • 2h ago</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  "Union Food Secretary reviews countrywide buffer stock of wheat and rice. Over 57 Million Metric Tonnes of foodgrains available in the Central Pool, ensuring comprehensive national food security."
                </p>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Department of Food & Public Distribution</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>@FoodDeptGOI • 1d ago</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  "No biometric exclusion! In case of fingerprint failure on ePoS machines, FPS dealers are legally instructed to use Iris scanners or authorized mobile OTP verification."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Core Featured Civic Modules Grid */}
      <div>
        <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>NFSA_But_Cooler Smart Capability Modules</span>
          <span className="badge badge-info">Zero-Runaround Engines</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Tile 1: Safe Demographic Simulator */}
          <div
            className="card"
            style={{ cursor: 'pointer', transition: 'border-color var(--trans-fast)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onClick={() => onNavigateTab('ration_cards')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--civic-emerald-text)', marginBottom: '0.4rem' }}>
                <Sparkles size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pre-Flight Roster Simulator</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Simulate demographic mutations (age, name, UID) before saving to catch harmful entitlement loss (e.g. -5kg Rule 4B adult reduction).
              </p>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <span>Launch Simulator</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* Tile 2: ONORC Portability */}
          <div
            className="card"
            style={{ cursor: 'pointer', transition: 'border-color var(--trans-fast)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onClick={() => onNavigateTab('onorc')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--civic-slate)', marginBottom: '0.4rem' }}>
                <Compass size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>"What Can I Do Today?"</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Calculate dynamic interstate quota splitting for migrant family members without freezing home village grain allocations.
              </p>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <span>Test Portability Split</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* Tile 3: Fair Price Shop Radar */}
          <div
            className="card"
            style={{ cursor: 'pointer', transition: 'border-color var(--trans-fast)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onClick={() => onNavigateTab('fps_locator')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--civic-amber-text)', marginBottom: '0.4rem' }}>
                <Store size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Fair Price Shop Radar</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Live stock inspection (Rice/Wheat Quintals), ePoS online status, and automated Stock Mirage rerouting to nearest active counters.
              </p>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <span>Locate Fair Price Shops</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* Tile 4: Foodgrains Bulletin */}
          <div
            className="card"
            style={{ cursor: 'pointer', transition: 'border-color var(--trans-fast)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onClick={() => onNavigateTab('bulletin')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                <FileText size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Monthly Foodgrains Bulletin</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Central Pool grain buffer reserves (57.3M MT), state offtake tracking, statutory pricing schedule, and official circulars.
              </p>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <span>View Central Bulletin</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
