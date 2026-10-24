import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  LayoutGrid,
  Volume2,
  VolumeX,
  Flame,
  Sun,
  Moon,
  Compass,
  FileText,
  Store,
  CreditCard,
  Truck,
  Users,
  Activity,
  Repeat,
  DollarSign,
  LogIn,
  Search,
} from 'lucide-react';

interface OfficialGovHeaderProps {
  viewMode: 'structured' | 'pictorial';
  onToggleViewMode: () => void;
  isKioskMode: boolean;
  onToggleKioskMode: () => void;
  onBurnKioskSession: () => void;
  isSpeaking: boolean;
  onVoiceReadback: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigateTab: (tab: 'roster_sim' | 'portability' | 'lifecycle' | 'grievance' | 'inspector' | 'state_portals') => void;
  activeTab: string;
  onSearchCard: (query: string) => void;
}

export const OfficialGovHeader: React.FC<OfficialGovHeaderProps> = ({
  viewMode,
  onToggleViewMode,
  isKioskMode,
  onToggleKioskMode,
  onBurnKioskSession,
  isSpeaking,
  onVoiceReadback,
  theme,
  onToggleTheme,
  onNavigateTab,
  activeTab,
  onSearchCard,
}) => {
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const handleAdjustFontSize = (delta: number) => {
    let next = fontSizeMultiplier + delta;
    if (next < 0.9) next = 0.9;
    if (next > 1.2) next = 1.2;
    setFontSizeMultiplier(next);
    document.documentElement.style.fontSize = `${next * 16}px`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchCard(searchQuery.trim());
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 1. Official Top Utility Bar */}
      <div
        style={{
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.35rem 1.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span>भारत सरकार • Government of India</span>
          <span style={{ color: 'var(--border-strong)' }}>|</span>
          <span>उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Accessibility Font Resizer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              type="button"
              style={{ padding: '0.1rem 0.35rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px', color: 'var(--text-primary)', fontWeight: 600 }}
              onClick={() => handleAdjustFontSize(-0.05)}
              title="Decrease Font Size"
            >
              -A
            </button>
            <button
              type="button"
              style={{ padding: '0.1rem 0.35rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px', color: 'var(--text-primary)', fontWeight: 600 }}
              onClick={() => handleAdjustFontSize(0)}
              title="Reset Font Size"
            >
              A
            </button>
            <button
              type="button"
              style={{ padding: '0.1rem 0.35rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px', color: 'var(--text-primary)', fontWeight: 600 }}
              onClick={() => handleAdjustFontSize(0.05)}
              title="Increase Font Size"
            >
              +A
            </button>
          </div>

          <span style={{ color: 'var(--border-strong)' }}>|</span>

          {/* Language Selector */}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              type="button"
              style={{
                color: lang === 'en' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: lang === 'en' ? 700 : 400,
              }}
              onClick={() => setLang('en')}
            >
              English
            </button>
            <span>/</span>
            <button
              type="button"
              style={{
                color: lang === 'hi' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: lang === 'hi' ? 700 : 400,
              }}
              onClick={() => setLang('hi')}
            >
              हिन्दी
            </button>
          </div>

          <span style={{ color: 'var(--border-strong)' }}>|</span>

          {/* Official Login / CSC SSO Button */}
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
            }}
            onClick={() => setShowLoginModal(true)}
          >
            <LogIn size={12} />
            <span>Official Log In / VLE</span>
          </button>
        </div>
      </div>

      {/* 2. Main Government Emblem & Department Header */}
      <header className="top-nav" role="banner">
        <div className="nav-brand">
          {/* Emblem representation */}
          <div className="brand-emblem" aria-hidden="true">
            <ShieldCheck size={22} strokeWidth={2.2} />
          </div>
          <div className="brand-text">
            <h1>
              NFSA_But_Cooler
              <span className="brand-badge">SCAN Modernization • Elite</span>
            </h1>
            <p>Department of Food & Public Distribution • खाद्य और सार्वजनिक वितरण विभाग</p>
          </div>
        </div>

        {/* Global Search Bar (like real NFSA) */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, maxWidth: '440px', margin: '0 1.5rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '2rem', height: '34px', fontSize: '0.8rem' }}
              placeholder="Search by Ration Card # (e.g. BR-PAT-2024-884920), Name, or UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="global-portal-search-input"
            />
            <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', height: '34px', fontSize: '0.775rem' }}>
            Search
          </button>
        </form>

        <nav className="nav-actions" aria-label="Portal Navigation Controls">
          {/* Dual Interface Toggle: Structured vs Pictorial View */}
          <button
            type="button"
            className={`nav-toggle-btn ${viewMode === 'pictorial' ? 'active' : ''}`}
            onClick={onToggleViewMode}
            title="Toggle between Data-Dense and Pictorial Low-Literacy View (Alt+D)"
            aria-label="Toggle pictorial mode"
            id="btn-toggle-view"
          >
            {viewMode === 'pictorial' ? <LayoutGrid size={15} /> : <Eye size={15} />}
            <span>{viewMode === 'pictorial' ? 'Pictorial View' : 'Structured Data'}</span>
          </button>

          {/* Local Voice Readback (Web Speech API) */}
          <button
            type="button"
            className={`nav-toggle-btn ${isSpeaking ? 'active speaking-pulse' : ''}`}
            onClick={onVoiceReadback}
            title="Narrate current screen in Indian English/Hindi (Alt+A)"
            aria-label="Narrate current screen"
            id="btn-voice-readback"
          >
            {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isSpeaking ? 'Stop Audio' : 'Audio Read-back'}</span>
          </button>

          {/* Kiosk Mode Toggle */}
          <button
            type="button"
            className={`nav-toggle-btn ${isKioskMode ? 'active' : ''}`}
            onClick={onToggleKioskMode}
            title="Toggle CSC Shared Kiosk Sandboxing Mode"
            aria-label="Toggle Kiosk mode"
            id="btn-toggle-kiosk"
          >
            <Compass size={15} />
            <span>{isKioskMode ? 'Kiosk: Active' : 'Kiosk Mode'}</span>
          </button>

          {/* Burn On Exit Button (if in Kiosk mode) */}
          {isKioskMode && (
            <button
              type="button"
              className="btn btn-danger"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.775rem' }}
              onClick={onBurnKioskSession}
              title="Immediately erase all session memory and temporary storage"
              id="btn-burn-exit"
            >
              <Flame size={14} />
              <span>Burn On Exit</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            className="nav-toggle-btn"
            onClick={onToggleTheme}
            title="Toggle High-Contrast / Light Theme"
            aria-label="Toggle theme"
            id="btn-toggle-theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>
      </header>

      {/* 3. Official NFSA Quick Services Ribbon (As seen on real nfsa.gov.in) */}
      <div
        style={{
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.45rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'nowrap' }}>
          {/* Quick Item 1: Foodgrains Bulletin */}
          <button
            type="button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-secondary)' }}
            onClick={() => onNavigateTab('roster_sim')}
            title="Foodgrains Bulletin & Entitlement Ledger"
          >
            <FileText size={14} />
            <span>Foodgrains Bulletin</span>
          </button>

          {/* Quick Item 2: Fair Price Shop */}
          <button
            type="button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-secondary)' }}
            onClick={() => onNavigateTab('portability')}
            title="Fair Price Shop & Stock Locator"
          >
            <Store size={14} />
            <span>Fair Price Shop</span>
          </button>

          {/* Quick Item 3: Ration Cards */}
          <button
            type="button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-secondary)' }}
            onClick={() => onNavigateTab('roster_sim')}
            title="Ration Card Details & Safe-Correction"
          >
            <CreditCard size={14} />
            <span>Ration Cards</span>
          </button>

          {/* Quick Item 4: Allocation */}
          <button
            type="button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-secondary)' }}
            onClick={() => onNavigateTab('portability')}
            title="Allocation Policy & Portability"
          >
            <Truck size={14} />
            <span>Allocation</span>
          </button>

          {/* Quick Item 5: Citizen Corner */}
          <button
            type="button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-secondary)' }}
            onClick={() => onNavigateTab('grievance')}
            title="Citizen Corner & Grievance Redressal"
          >
            <Users size={14} />
            <span>Citizen Corner</span>
          </button>

          {/* Quick Item 6: Annavitran */}
          <button
            type="button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-secondary)' }}
            onClick={() => onNavigateTab('inspector')}
            title="Annavitran POS Distribution Dashboard"
          >
            <Activity size={14} />
            <span>Annavitran</span>
          </button>

          {/* Quick Item 7: IMPDS (ONORC) */}
          <button
            type="button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-secondary)' }}
            onClick={() => onNavigateTab('portability')}
            title="Integrated Management PDS / One Nation One Ration Card"
          >
            <Repeat size={14} />
            <span>IMPDS (ONORC)</span>
          </button>

          {/* Quick Item 8: Transparency State Portals */}
          <button
            type="button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-secondary)' }}
            onClick={() => onNavigateTab('state_portals')}
            title="State Food Portals & Transparency Directory"
          >
            <DollarSign size={14} />
            <span>State Portals</span>
          </button>
        </div>

        <div style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          ● Nationwide ePoS Network Active (99.4%)
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: '440px', width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-strong)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header">
              <div className="card-title">
                <LogIn size={18} />
                <span>Departmental & CSC VLE Single Sign-On (SSO)</span>
              </div>
              <button type="button" onClick={() => setShowLoginModal(false)} style={{ color: 'var(--text-muted)' }}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Authorized government access for Taluk Supply Officers, Food Inspectors, and Common Service Centre Village Level Entrepreneurs (VLEs).
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Official SSO ID / CSC Kendra ID</label>
                <input className="form-input" defaultValue="VLE-BIHAR-PAT-091" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Authentication Token</label>
                <input className="form-input" type="password" defaultValue="••••••••••••" readOnly />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  alert('Authenticated as CSC Kendra Operator #091 (Patna). Operational session logged to SHA-256 ledger.');
                  setShowLoginModal(false);
                }}
              >
                Enter Smart Administrative Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
