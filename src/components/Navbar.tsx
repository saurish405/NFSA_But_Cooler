import React from 'react';
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
} from 'lucide-react';

interface NavbarProps {
  viewMode: 'structured' | 'pictorial';
  onToggleViewMode: () => void;
  isKioskMode: boolean;
  onToggleKioskMode: () => void;
  onBurnKioskSession: () => void;
  isSpeaking: boolean;
  onVoiceReadback: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onToggleViewMode,
  isKioskMode,
  onToggleKioskMode,
  onBurnKioskSession,
  isSpeaking,
  onVoiceReadback,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="top-nav" role="banner">
      <div className="nav-brand">
        <div className="brand-emblem" aria-hidden="true">
          <ShieldCheck size={22} strokeWidth={2.2} />
        </div>
        <div className="brand-text">
          <h1>
            NFSA_But_Cooler
            <span className="brand-badge">PDS Modernization • Elite</span>
          </h1>
          <p>Zero-Runaround Public Distribution System Navigator</p>
        </div>
      </div>

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
  );
};
