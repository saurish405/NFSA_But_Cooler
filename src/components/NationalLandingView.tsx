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
  ShieldCheck,
  Star,
  PhoneCall,
  Search,
  Lock,
  Layers,
  ChevronRight,
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

  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '2rem' }}>
      {/* 1. Sleek Modern Emerald Hero Showcase (Matching reference UI design) */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0e3820 0%, #14532d 45%, #166534 100%)',
          borderRadius: '24px',
          padding: '2.5rem 2.5rem 2rem 2.5rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -15px rgba(20, 83, 45, 0.45)',
        }}
        aria-label="National Portal Hero"
      >
        {/* Subtle Decorative Background Circles */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, rgba(20, 83, 45, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          {/* Left Column: Heading, Subtitle, Pill Buttons & Glassmorphic Stat Pill */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '0.3rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#bbf7d0',
                }}
              >
                Government of India • NFSA 2013
              </span>
              <span
                style={{
                  background: 'rgba(34, 197, 94, 0.25)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#86efac',
                }}
              >
                ONORC Active
              </span>
            </div>

            <h1
              style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                margin: 0,
              }}
            >
              National Food Security System
              <span
                style={{
                  display: 'block',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: '#dcfce7',
                  marginTop: '0.5rem',
                  letterSpacing: 'normal',
                }}
              >
                राष्ट्रीय खाद्य सुरक्षा एवं सार्वजनिक वितरण प्रणाली में आपका स्वागत है
              </span>
            </h1>

            <p style={{ fontSize: '0.925rem', color: '#e2e8f0', lineHeight: 1.6, maxWidth: '520px', margin: 0 }}>
              Guaranteed food and nutritional security for <strong>80.7 Crore citizens</strong> across 36 States & Union Territories. Powered by pre-flight demographic mutation safeguards, dynamic interstate portability splitting, and zero-trace village kiosk hygiene.
            </p>

            {/* Action Pill Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <button
                type="button"
                style={{
                  background: '#22c55e',
                  color: '#052e16',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.7rem 1.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                  transition: 'transform 0.15s ease, background 0.15s ease',
                }}
                onClick={() => onNavigateTab('ration_cards')}
                id="landing-hero-btn-simulate"
              >
                <Sparkles size={16} />
                <span>Simulate Safe Demographic Edit</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '9999px',
                  padding: '0.7rem 1.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backdropFilter: 'blur(8px)',
                  transition: 'background 0.15s ease',
                }}
                onClick={() => onNavigateTab('onorc')}
                id="landing-hero-btn-onorc"
              >
                <Compass size={16} />
                <span>Interstate Portability (ONORC)</span>
              </button>
            </div>

            {/* Floating Glassmorphic Statistics Strip (As seen in reference screenshot) */}
            <div
              style={{
                marginTop: '1.25rem',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '0.85rem 1.25rem',
                backdropFilter: 'blur(12px)',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {stats.beneficiariesCoveredCr} Cr
                </div>
                <div style={{ fontSize: '0.7rem', color: '#bbf7d0', marginTop: '2px' }}>
                  Beneficiaries
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {stats.activeRationCardsCr} Cr
                </div>
                <div style={{ fontSize: '0.7rem', color: '#bbf7d0', marginTop: '2px' }}>
                  Active Cards
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {stats.eposOperationalPercent}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#bbf7d0', marginTop: '2px' }}>
                  ePoS Online
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {stats.monthlyAllocationLakhMT}L MT
                </div>
                <div style={{ fontSize: '0.7rem', color: '#bbf7d0', marginTop: '2px' }}>
                  Monthly Grain
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Framed Showcase Card containing banner.jpeg */}
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#092716',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
            }}
          >
            <img
              src="/banner.jpeg"
              alt="National Food Security Act - India has Won"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '18px',
                objectFit: 'cover',
              }}
              onError={(e) => {
                // Fallback to /assets/banner.jpeg if needed
                (e.target as HTMLImageElement).src = '/assets/banner.jpeg';
              }}
            />

            {/* Pinned "NEED HELP? ASK NICCI" Floating Widget */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '0.65rem 0.9rem',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
              }}
              onClick={onOpenAskNicci}
              id="landing-btn-ask-nicci"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#052e16',
                }}
                className="speaking-pulse"
              >
                <MessageSquare size={16} />
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff' }}>
                  NEED HELP? ASK NICCI
                </div>
                <div style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 600 }}>
                  ● Instant Citizen Assistant
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Capabilities Grid (প্রধান বৈশিষ্ট্যসমূহ / Core Features) */}
      <section aria-label="Core Capabilities">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2rem auto' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Core Safeguard Engines • मुख्य विशेषताएं
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
            Client-Runtime Safety & Zero-Runaround Architecture
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Empowering citizens with pre-flight simulation before submission, dynamic quota splitting for seasonal migrants, and automated grievance escalation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Card 1: Pre-Flight Simulator */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            onClick={() => onNavigateTab('ration_cards')}
          >
            <div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(168, 85, 247, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a855f7',
                  marginBottom: '1rem',
                }}
              >
                <Sparkles size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                Pre-Flight Safe Demographic Simulator
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Calculates entitlement blast radius before updating age, name, or UID, catching harmful adult reclassification (-5kg Rule 4B) and Form 3B affidavit needs.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>
              <span>Launch Simulator</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 2: ONORC Portability */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            onClick={() => onNavigateTab('onorc')}
          >
            <div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(236, 72, 153, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ec4899',
                  marginBottom: '1rem',
                }}
              >
                <Compass size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                "What Can I Do Today?" Portability
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Interstate quota partitioning allows migrant workers in destination states to draw their exact quota without locking or reducing grain for family members back home.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>
              <span>Test Portability</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 3: Fair Price Shop Radar */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            onClick={() => onNavigateTab('fps_locator')}
          >
            <div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a',
                  marginBottom: '1rem',
                }}
              >
                <Store size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                Fair Price Shop Radar & Stock Mirage
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Live commodity stocks (Rice/Wheat Quintals), ePoS online status, and automated Stock Mirage rerouting to nearest active counters within 3km.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>
              <span>Inspect Counters</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 4: Grievance Redressal */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            onClick={() => onNavigateTab('citizen_corner')}
          >
            <div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6',
                  marginBottom: '1rem',
                }}
              >
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                Section 15 Grievance Redressal SLA
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                14-day statutory resolution tracker. Automatically generates formal District Collector Appeal Memos if local supply officers breach statutory deadlines.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>
              <span>File Grievance</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Step-by-Step Citizen Process Journey (আবেদন প্রক্রিয়ার ধাপসমূহ) */}
      <section aria-label="Process Steps">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 1.75rem auto' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Citizen Process Journey • प्रक्रिया के चरण
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
            How NFSA_But_Cooler Protects Your Household
          </h2>
        </div>

        {/* Horizontal Step Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '1.75rem',
          }}
        >
          {[
            { id: 1, label: '1. Roster Lookup' },
            { id: 2, label: '2. Check Entitlements' },
            { id: 3, label: '3. Safe Simulation' },
            { id: 4, label: '4. Collect at FPS' },
            { id: 5, label: '5. HMAC Receipt' },
          ].map((step) => (
            <button
              key={step.id}
              type="button"
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: activeStepTab === step.id ? '1px solid #16a34a' : '1px solid var(--border-subtle)',
                background: activeStepTab === step.id ? 'rgba(34, 197, 94, 0.12)' : 'var(--bg-elevated)',
                color: activeStepTab === step.id ? '#16a34a' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onClick={() => setActiveStepTab(step.id)}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* 3 Visual Process Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.25rem', background: 'var(--bg-card)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.4rem' }}>
              STEP 01 • VERIFICATION
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              Card & Roster Discovery
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Enter Ration Card number or masked Aadhaar. System instantly renders verified family members, monthly grain balance, and current FPS assignment.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem', background: 'var(--bg-card)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.4rem' }}>
              STEP 02 • PRE-FLIGHT GUARD
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              Entitlement Blast-Radius Check
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Before saving changes, our simulator calculates the exact delta (ΔE). If an age or income edit reduces grain quota, you receive an advance warning and required affidavit checklist.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem', background: 'var(--bg-card)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.4rem' }}>
              STEP 03 • SAFE RECEIPT
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              Cryptographic HMAC Receipt
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Generates an offline-verifiable 10-character Base32 shortcode receipt (e.g. <code>K7NP-9M2Q-X4</code>) with watermark proof preventing ghost facilitator fraud.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Verified Citizen & Officer Impact (গ্রাহক মতামত ও রিভিউ / Testimonials) */}
      <section aria-label="Verified Impact">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2rem auto' }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Verified Impact & Citizen Feedback • जन प्रभाव
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
            Trusted by Migrants, Rural CSCs, and Food Inspectors
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Review 1 */}
          <div className="card" style={{ padding: '1.25rem', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.2rem', color: '#eab308', marginBottom: '0.65rem' }}>
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic', margin: '0 0 1rem 0' }}>
                "When updating my son Ramesh's age from 17 to 18, the simulator alerted us that Bihar Rule 4B would reduce our allocation by 5kg without Form 3B affidavit. That saved our monthly ration!"
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                RP
              </div>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700 }}>Ramvilas Paswan</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Maner, Patna (Bihar) • Household Head</div>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="card" style={{ padding: '1.25rem', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.2rem', color: '#eab308', marginBottom: '0.65rem' }}>
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic', margin: '0 0 1rem 0' }}>
                "I migrated to Andhra Pradesh for seasonal farm work. Using the ONORC engine, I drew my 10kg rice quota in Guntur, while my wife and children drew their 15kg in Bihar without any blockages."
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                DK
              </div>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700 }}>Devi Kumari & Family</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Interstate Migrant Family • Andhra Pradesh / Bihar</div>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="card" style={{ padding: '1.25rem', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.2rem', color: '#eab308', marginBottom: '0.65rem' }}>
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
                <Star size={14} fill="#eab308" />
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic', margin: '0 0 1rem 0' }}>
                "The objective anomaly signals distinguish genuine internet batch syncs from suspicious off-hours diversions. It eliminated administrative harassment and brought data-backed integrity."
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                SO
              </div>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700 }}>Taluk Supply Officer</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dept of Food & Civil Supplies • Regional Inspectorate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Curved Emerald FAQ & Help CTA Banner (পদ্ধতি সম্পর্কিত জিজ্ঞাসা / Have Questions?) */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0e3820 0%, #15803d 100%)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 12px 32px rgba(21, 128, 61, 0.35)',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-label="FAQ & Helpline Call to Action"
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Have Questions About Your Food Entitlements?
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#dcfce7', lineHeight: 1.6, margin: 0 }}>
            NICCI Citizen Assistant is available 24/7 to resolve questions on quota calculations, Aadhaar biometric exceptions, and statutory Section 15 grievance escalations.
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              style={{
                background: '#ffffff',
                color: '#14532d',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.7rem 1.4rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              onClick={onOpenAskNicci}
            >
              <MessageSquare size={16} />
              <span>Ask NICCI Virtual Assistant</span>
            </button>

            <a
              href="tel:1967"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '9999px',
                padding: '0.7rem 1.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              <PhoneCall size={16} />
              <span>Call Toll-Free 1967</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Institutional Government Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
        }}
        role="contentinfo"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-emblem" style={{ width: '36px', height: '36px' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                NFSA_But_Cooler
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Department of Food & Public Distribution • Ministry of Consumer Affairs, Food & Public Distribution
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <button type="button" onClick={() => onNavigateTab('bulletin')} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Foodgrains Bulletin
            </button>
            <button type="button" onClick={() => onNavigateTab('fps_locator')} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Fair Price Shop Radar
            </button>
            <button type="button" onClick={() => onNavigateTab('allocation')} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Statutory Allocation
            </button>
            <button type="button" onClick={() => onNavigateTab('state_portals')} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              State Portals (36 States)
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          <div>
            © 2026 Government of India • National Food Security Act, 2013 (NFSA). Designed for Zero-Runaround Citizen Empowerment.
          </div>
          <div>
            Toll-Free Helpline: <strong>1967</strong> / <strong>1800-3456-194</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};
