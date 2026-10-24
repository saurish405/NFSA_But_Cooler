import React, { useState, useEffect } from 'react';
import type {
  DraftLifecycleRecord,
  JudgeFaultConfig,
  RationCard,
} from './types';
import seedData from './data/dataset.json';
import { initializeDatabaseWithSeed, executeKioskBurnSanitation } from './services/db';
import { speechEngine } from './services/speechEngine';
import { Navbar } from './components/Navbar';
import { KioskTimerBar } from './components/KioskTimerBar';
import { RosterStructuredView } from './components/RosterStructuredView';
import { SafeCorrectionSimulator } from './components/SafeCorrectionSimulator';
import { PortabilityCalculator } from './components/PortabilityCalculator';
import { LifecycleDrafts } from './components/LifecycleDrafts';
import { GrievanceEscalation } from './components/GrievanceEscalation';
import { InspectorSignals } from './components/InspectorSignals';
import { PictorialView } from './components/PictorialView';
import { JudgeDebugHUD } from './components/JudgeDebugHUD';
import {
  Sparkles,
  Compass,
  FileCheck,
  FileWarning,
  Activity,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export const App: React.FC = () => {
  const [cards, setCards] = useState<RationCard[]>(seedData.rationCards as RationCard[]);
  const [selectedCardNumber, setSelectedCardNumber] = useState<string>(cards[0].cardNumber);
  const [activeTab, setActiveTab] = useState<'roster_sim' | 'portability' | 'lifecycle' | 'grievance' | 'inspector'>('roster_sim');
  const [viewMode, setViewMode] = useState<'structured' | 'pictorial'>('structured');
  const [isKioskMode, setIsKioskMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [drafts, setDrafts] = useState<DraftLifecycleRecord[]>([]);
  const [burnNotice, setBurnNotice] = useState<string | null>(null);

  // Judge Fault Bus
  const [faultConfig, setFaultConfig] = useState<JudgeFaultConfig>({
    forceOffline: false,
    gatewayTimeout504: false,
    corruptStorage: false,
    backendConflict409: false,
    promptInjectionActive: false,
    throttle2G: false,
  });

  const activeCard = cards.find((c) => c.cardNumber === selectedCardNumber) || cards[0];

  // Initialize DB & URL parameter check (?mode=csc_kiosk)
  useEffect(() => {
    initializeDatabaseWithSeed();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'csc_kiosk') {
        setIsKioskMode(true);
      }
    }

    const unsub = speechEngine.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });

    return () => unsub();
  }, []);

  // Keyboard accessibility hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === 'd' || e.key === 'D') {
          setViewMode((v) => (v === 'structured' ? 'pictorial' : 'structured'));
        } else if (e.key === 'a' || e.key === 'A') {
          handleVoiceReadback();
        } else if (e.key === 'k' || e.key === 'K') {
          handleBurnKioskSession();
        } else if (e.key === '1') {
          setActiveTab('roster_sim');
        } else if (e.key === '2') {
          setActiveTab('portability');
        } else if (e.key === '3') {
          setActiveTab('lifecycle');
        } else if (e.key === '4') {
          setActiveTab('grievance');
        } else if (e.key === '5') {
          setActiveTab('inspector');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, activeTab]);

  const handleVoiceReadback = () => {
    if (isSpeaking) {
      speechEngine.stop();
    } else {
      const summary = `AntiGravity Zero-Runaround PDS Navigator. Viewing ration card ${activeCard.cardNumber} from ${activeCard.homeState}. Total monthly grain quota is ${activeCard.monthlyQuota.riceKg + activeCard.monthlyQuota.wheatKg} kilograms. All demographic mutations are simulation-guarded.`;
      speechEngine.speak(summary, 'en');
    }
  };

  const handleBurnKioskSession = async () => {
    const result = await executeKioskBurnSanitation();
    setBurnNotice(`Zero-Trace Kiosk Wipe Executed: ${result.wipedKeys} session keys flushed. Storage residue: 0 Bytes.`);
    setViewMode('structured');
    setActiveTab('roster_sim');
    setTimeout(() => setBurnNotice(null), 5000);
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'light') {
        document.body.classList.add('theme-light');
      } else {
        document.body.classList.remove('theme-light');
      }
    }
  };

  const handleDraftCreated = (draft: DraftLifecycleRecord) => {
    setDrafts((prev) => [draft, ...prev]);
    setActiveTab('lifecycle');
  };

  const handleDraftUpdated = (updated: DraftLifecycleRecord) => {
    setDrafts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  // Determine if active draft has unverified watermark
  const hasActiveUnverifiedDraft = drafts.some(
    (d) => d.status === 'LOCAL_DRAFT' || d.status === 'FACILITATOR_STAGED_BATCH'
  );

  return (
    <div className="app-wrapper">
      {/* Visual Watermark for unverified offline drafts (Section 3.3) */}
      {hasActiveUnverifiedDraft && activeTab === 'lifecycle' && (
        <div className="watermark-overlay" aria-hidden="true">
          <div className="watermark-text">
            DRAFT ONLY — NOT SUBMITTED TO FOOD & CIVIL SUPPLIES DEPARTMENT
          </div>
        </div>
      )}

      {/* Kiosk Mode Top Inactivity Safeguard Bar (Section 3.4) */}
      <KioskTimerBar
        isActive={isKioskMode}
        onAutoBurn={handleBurnKioskSession}
      />

      {/* Primary Navigation Bar */}
      <Navbar
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((v) => (v === 'structured' ? 'pictorial' : 'structured'))}
        isKioskMode={isKioskMode}
        onToggleKioskMode={() => setIsKioskMode(!isKioskMode)}
        onBurnKioskSession={handleBurnKioskSession}
        isSpeaking={isSpeaking}
        onVoiceReadback={handleVoiceReadback}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Burn Notice Alert Banner */}
      {burnNotice && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            borderBottom: '1px solid #10b981',
            padding: '0.65rem 1.5rem',
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
          role="status"
          id="burn-notice-banner"
        >
          <Flame size={16} />
          <span>{burnNotice}</span>
        </div>
      )}

      {/* Secondary Tab Navigation Subheader */}
      <nav className="tab-subheader" aria-label="Capability Engines">
        <div className="tab-group">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'roster_sim' ? 'active' : ''}`}
            onClick={() => setActiveTab('roster_sim')}
            id="tab-roster-sim"
          >
            <Sparkles size={16} />
            <span>Roster & Safe-Correction Simulator</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'portability' ? 'active' : ''}`}
            onClick={() => setActiveTab('portability')}
            id="tab-portability"
          >
            <Compass size={16} />
            <span>"What Can I Do Today?" Portability Engine</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'lifecycle' ? 'active' : ''}`}
            onClick={() => setActiveTab('lifecycle')}
            id="tab-lifecycle"
          >
            <FileCheck size={16} />
            <span>Draft Lifecycles & Shortcode Receipts ({drafts.length})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'grievance' ? 'active' : ''}`}
            onClick={() => setActiveTab('grievance')}
            id="tab-grievance"
          >
            <FileWarning size={16} />
            <span>Grievance SLA & Tier-2 Escalation</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'inspector' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspector')}
            id="tab-inspector"
          >
            <Activity size={16} />
            <span>Inspector Anomaly Signals</span>
          </button>
        </div>

        {/* Hotkey Guide Hint for judges & power accessibility */}
        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Keyboard: <kbd style={{ padding: '0.1rem 0.3rem', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>Alt+D</kbd> View • <kbd style={{ padding: '0.1rem 0.3rem', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>Alt+A</kbd> Voice • <kbd style={{ padding: '0.1rem 0.3rem', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>Alt+1..5</kbd> Tabs
        </div>
      </nav>

      {/* Main Workspace Area */}
      <main className="main-content" id="main-content" role="main">
        {/* Dual Interface Switch: Pictorial View vs Structured View */}
        {viewMode === 'pictorial' ? (
          <PictorialView card={activeCard} />
        ) : (
          <div>
            {activeTab === 'roster_sim' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <RosterStructuredView
                  card={activeCard}
                  onSelectCard={(num) => setSelectedCardNumber(num)}
                  onLaunchCorrection={(memberId) => {
                    const el = document.getElementById('safe-correction-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  is409ConflictActive={faultConfig.backendConflict409}
                  onResolve409={() => setFaultConfig((prev) => ({ ...prev, backendConflict409: false }))}
                />

                <SafeCorrectionSimulator
                  card={activeCard}
                  onDraftCreated={handleDraftCreated}
                />
              </div>
            )}

            {activeTab === 'portability' && (
              <PortabilityCalculator card={activeCard} />
            )}

            {activeTab === 'lifecycle' && (
              <LifecycleDrafts
                drafts={drafts}
                onDraftUpdated={handleDraftUpdated}
              />
            )}

            {activeTab === 'grievance' && (
              <GrievanceEscalation />
            )}

            {activeTab === 'inspector' && (
              <InspectorSignals />
            )}
          </div>
        )}
      </main>

      {/* Live Judge Fault Injection & Automated Test Suite Controller */}
      <JudgeDebugHUD
        faultConfig={faultConfig}
        onUpdateFaultConfig={(cfg) => setFaultConfig((prev) => ({ ...prev, ...cfg }))}
      />
    </div>
  );
};

export default App;
