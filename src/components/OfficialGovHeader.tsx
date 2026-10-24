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
  Menu,
  Home,
} from 'lucide-react';

import type { PortalNavigationTab } from '../types';

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
  onNavigateTab: (tab: PortalNavigationTab) => void;
  activeTab: PortalNavigationTab;
  onSearchCard: (query: string) => void;
  onOpenSidebar: () => void;
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
  onOpenSidebar,
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
        <div
          className="nav-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('landing')}
          title="Return to National Portal Landing Page"
        >
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
          {/* 2nd Menu: Off-Canvas Sidebar Trigger */}
          <button
            type="button"
            className="nav-toggle-btn"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', fontWeight: 700 }}
            onClick={onOpenSidebar}
            title="Open 2nd Menu: Capability Modules Sidebar (Alt+M)"
            aria-label="Open sidebar modules menu"
            id="btn-open-sidebar"
          >
            <Menu size={16} />
            <span>Modules Menu</span>
          </button>

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
      <div className="gov-ribbon" role="navigation" aria-label="Official NFSA Services Ribbon">
        <div className="gov-ribbon-group">
          {[
            { key: 'landing' as const, label: 'Home', icon: <Home size={14} />, tooltip: 'National Portal Landing Page', testId: 'ribbon-home' },
            { key: 'bulletin' as const, label: 'Foodgrains Bulletin', icon: <FileText size={14} />, tooltip: 'Monthly Central Pool Foodgrains Bulletin & Offtake', testId: 'ribbon-bulletin' },
            { key: 'fps_locator' as const, label: 'Fair Price Shop', icon: <Store size={14} />, tooltip: 'Fair Price Shop (FPS) Locator & Live Stock Radar', testId: 'ribbon-fps' },
            { key: 'ration_cards' as const, label: 'Ration Cards', icon: <CreditCard size={14} />, tooltip: 'Ration Card Details & Safe-Correction Simulator', testId: 'ribbon-ration-cards' },
            { key: 'allocation' as const, label: 'Allocation', icon: <Truck size={14} />, tooltip: 'National Allocation Policy & Quota Calculator', testId: 'ribbon-allocation' },
            { key: 'citizen_corner' as const, label: 'Citizen Corner', icon: <Users size={14} />, tooltip: 'Citizen Grievance Redressal & Rights', testId: 'ribbon-citizen-corner' },
            { key: 'annavitran' as const, label: 'Annavitran', icon: <Activity size={14} />, tooltip: 'Nationwide ePoS Distribution Telemetry', testId: 'ribbon-annavitran' },
            { key: 'onorc' as const, label: 'IMPDS (ONORC)', icon: <Repeat size={14} />, tooltip: 'One Nation One Ration Card Inter-State Portability', testId: 'ribbon-onorc' },
            { key: 'state_portals' as const, label: 'State Portals', icon: <DollarSign size={14} />, tooltip: 'State PDS Transparency Portals Directory', testId: 'ribbon-state-portals' },
          ].map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`gov-ribbon-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onNavigateTab(item.key);
                  const el = document.getElementById('main-content');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                title={item.tooltip}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                id={item.testId}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && <span className="gov-ribbon-indicator" title="Active View" />}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--civic-emerald-text)' }} />
          <span>Nationwide ePoS Network Active (99.4%)</span>
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
