import React, { useState, useEffect } from 'react';
import type {
  DraftLifecycleRecord,
  JudgeFaultConfig,
  RationCard,
} from './types';
import seedData from './data/dataset.json';
import { initializeDatabaseWithSeed, executeKioskBurnSanitation } from './services/db';
import { speechEngine } from './services/speechEngine';
import { OfficialGovHeader } from './components/OfficialGovHeader';
import { PortalHero } from './components/PortalHero';
import { AskNicciModal } from './components/AskNicciModal';
import { KioskTimerBar } from './components/KioskTimerBar';
import { RosterStructuredView } from './components/RosterStructuredView';
import { SafeCorrectionSimulator } from './components/SafeCorrectionSimulator';
import { PortabilityCalculator } from './components/PortabilityCalculator';
import { LifecycleDrafts } from './components/LifecycleDrafts';
import { GrievanceEscalation } from './components/GrievanceEscalation';
import { InspectorSignals } from './components/InspectorSignals';
import { StatePortalsDirectory } from './components/StatePortalsDirectory';
import { PictorialView } from './components/PictorialView';
import { JudgeDebugHUD } from './components/JudgeDebugHUD';
import {
  Sparkles,
  Compass,
  FileCheck,
  FileWarning,
  Activity,
  Flame,
  MapPin,
} from 'lucide-react';

export const App: React.FC = () => {
  const [cards] = useState<RationCard[]>(seedData.rationCards as RationCard[]);
  const [selectedCardNumber, setSelectedCardNumber] = useState<string>(cards[0].cardNumber);
  const [activeTab, setActiveTab] = useState<'roster_sim' | 'portability' | 'lifecycle' | 'grievance' | 'inspector' | 'state_portals'>('roster_sim');
  const [viewMode, setViewMode] = useState<'structured' | 'pictorial'>('structured');
  const [isKioskMode, setIsKioskMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [drafts, setDrafts] = useState<DraftLifecycleRecord[]>([]);
  const [burnNotice, setBurnNotice] = useState<string | null>(null);
  const [isAskNicciOpen, setIsAskNicciOpen] = useState<boolean>(false);

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
        } else if (e.key === '6') {
          setActiveTab('state_portals');
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
      const summary = `NFSA_But_Cooler Zero-Runaround PDS Navigator. Viewing ration card ${activeCard.cardNumber} from ${activeCard.homeState}. Total monthly grain quota is ${activeCard.monthlyQuota.riceKg + activeCard.monthlyQuota.wheatKg} kilograms. All demographic mutations are simulation-guarded.`;
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

  const handleSearchCard = (query: string) => {
    const q = query.toLowerCase();
    const match = cards.find(
      (c) =>
        c.cardNumber.toLowerCase().includes(q) ||
        c.homeState.toLowerCase().includes(q) ||
        c.members.some((m) => m.name.toLowerCase().includes(q) || m.aadhaarMasked.includes(q))
    );
    if (match) {
      setSelectedCardNumber(match.cardNumber);
      setActiveTab('roster_sim');
    } else {
      alert(`No active demo ration card matched "${query}". Loaded default Bihar household mandate.`);
    }
  };

  const handleSelectStateCard = (stateName: string) => {
    const match = cards.find((c) => c.homeState.toLowerCase() === stateName.toLowerCase());
    if (match) {
      setSelectedCardNumber(match.cardNumber);
      setActiveTab('roster_sim');
    }
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

      {/* Official Government Portal Header & Services Ribbon */}
      <OfficialGovHeader
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((v) => (v === 'structured' ? 'pictorial' : 'structured'))}
        isKioskMode={isKioskMode}
        onToggleKioskMode={() => setIsKioskMode(!isKioskMode)}
        onBurnKioskSession={handleBurnKioskSession}
        isSpeaking={isSpeaking}
        onVoiceReadback={handleVoiceReadback}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigateTab={(tab) => setActiveTab(tab)}
        activeTab={activeTab}
        onSearchCard={handleSearchCard}
      />

      {/* Burn Notice Alert Banner */}
      {burnNotice && (
        <div
          style={{
            background: 'var(--status-safe-bg)',
            borderBottom: '1px solid var(--status-safe-border)',
            padding: '0.65rem 1.5rem',
            color: 'var(--status-safe-text)',
            fontSize: '0.825rem',
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

      {/* Secondary Tab Navigation Subheader (Smart Citizen Operations Center) */}
      <nav className="tab-subheader" aria-label="Capability Engines">
        <div className="tab-group">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'roster_sim' ? 'active' : ''}`}
            onClick={() => setActiveTab('roster_sim')}
            id="tab-roster-sim"
          >
            <Sparkles size={15} />
            <span>Roster & Safe-Correction Simulator</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'portability' ? 'active' : ''}`}
            onClick={() => setActiveTab('portability')}
            id="tab-portability"
          >
            <Compass size={15} />
            <span>"What Can I Do Today?" Portability Engine</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'lifecycle' ? 'active' : ''}`}
            onClick={() => setActiveTab('lifecycle')}
            id="tab-lifecycle"
          >
            <FileCheck size={15} />
            <span>Draft Lifecycles & Shortcode Receipts ({drafts.length})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'grievance' ? 'active' : ''}`}
            onClick={() => setActiveTab('grievance')}
            id="tab-grievance"
          >
            <FileWarning size={15} />
            <span>Grievance SLA & Tier-2 Escalation</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'inspector' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspector')}
            id="tab-inspector"
          >
            <Activity size={15} />
            <span>Inspector Anomaly Signals</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'state_portals' ? 'active' : ''}`}
            onClick={() => setActiveTab('state_portals')}
            id="tab-state-portals"
          >
            <MapPin size={15} />
            <span>State Transparency Portals</span>
          </button>
        </div>

        {/* Hotkey Guide Hint for judges & accessibility */}
        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Keyboard: <kbd style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px' }}>Alt+D</kbd> View • <kbd style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px' }}>Alt+A</kbd> Voice • <kbd style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px' }}>Alt+K</kbd> Burn • <kbd style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px' }}>Alt+1..6</kbd> Tabs
        </div>
      </nav>

      {/* Main Workspace Area */}
      <main className="main-content" id="main-content" role="main">
        {/* National Portal Hero Banner & Real-time Metrics (Present on top for civic context) */}
        <PortalHero
          onOpenAskNicci={() => setIsAskNicciOpen(true)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

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
                  onLaunchCorrection={() => {
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

            {activeTab === 'state_portals' && (
              <StatePortalsDirectory onSelectStateCard={handleSelectStateCard} />
            )}
          </div>
        )}
      </main>

      {/* ASK NICCI Interactive Citizen Assistant Modal */}
      <AskNicciModal
        isOpen={isAskNicciOpen}
        onClose={() => setIsAskNicciOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Live Judge Fault Injection & Automated Test Suite Controller */}
      <JudgeDebugHUD
        faultConfig={faultConfig}
        onUpdateFaultConfig={(cfg) => setFaultConfig((prev) => ({ ...prev, ...cfg }))}
      />
    </div>
  );
};

export default App;
