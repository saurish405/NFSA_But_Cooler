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
  Keyboard,
  Compass,
} from 'lucide-react';
import { speechEngine } from '../services/speechEngine';

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
          <ShieldCheck size={26} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <h1>
            AntiGravity
            <span className="brand-badge">NFSA 2.0 • Elite</span>
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
          {viewMode === 'pictorial' ? <LayoutGrid size={16} /> : <Eye size={16} />}
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
          {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
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
          <Compass size={16} />
          <span>{isKioskMode ? 'Kiosk: Active' : 'Kiosk Mode'}</span>
        </button>

        {/* Burn On Exit Button (if in Kiosk mode) */}
        {isKioskMode && (
          <button
            type="button"
            className="btn btn-danger"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            onClick={onBurnKioskSession}
            title="Immediately erase all session memory and temporary storage"
            id="btn-burn-exit"
          >
            <Flame size={15} />
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
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>
    </header>
  );
};
