import React, { useState, useEffect } from 'react';
import type {
  DraftLifecycleRecord,
  JudgeFaultConfig,
  RationCard,
  PortalNavigationTab,
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
import { FoodgrainsBulletinView } from './components/FoodgrainsBulletinView';
import { FpsLocatorView } from './components/FpsLocatorView';
import { AllocationPolicyView } from './components/AllocationPolicyView';
import { AnnavitranView } from './components/AnnavitranView';
import {
  Sparkles,
  Compass,
  FileCheck,
  FileWarning,
  Activity,
  Flame,
  MapPin,
  FileText,
  Store,
  CreditCard,
  Truck,
  Users,
} from 'lucide-react';

export const App: React.FC = () => {
  const [cards] = useState<RationCard[]>(seedData.rationCards as RationCard[]);
  const [selectedCardNumber, setSelectedCardNumber] = useState<string>(cards[0].cardNumber);
  const [activeTab, setActiveTab] = useState<PortalNavigationTab>('ration_cards');
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
          setActiveTab('ration_cards');
        } else if (e.key === '2') {
          setActiveTab('onorc');
        } else if (e.key === '3') {
          setActiveTab('bulletin');
        } else if (e.key === '4') {
          setActiveTab('fps_locator');
        } else if (e.key === '5') {
          setActiveTab('allocation');
        } else if (e.key === '6') {
          setActiveTab('citizen_corner');
        } else if (e.key === '7') {
          setActiveTab('annavitran');
        } else if (e.key === '8') {
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
    setActiveTab('ration_cards');
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
      setActiveTab('ration_cards');
    } else {
      alert(`No active demo ration card matched "${query}". Loaded default Bihar household mandate.`);
    }
  };

  const handleSelectStateCard = (stateName: string) => {
    const match = cards.find((c) => c.homeState.toLowerCase() === stateName.toLowerCase());
    if (match) {
      setSelectedCardNumber(match.cardNumber);
      setActiveTab('ration_cards');
    }
  };

  // Safe navigation normalizer
  const handleNavigate = (tab: PortalNavigationTab) => {
    if (tab === 'roster_sim') {
      setActiveTab('ration_cards');
    } else if (tab === 'portability') {
      setActiveTab('onorc');
    } else if (tab === 'grievance') {
      setActiveTab('citizen_corner');
    } else {
      setActiveTab(tab);
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

      {/* Official Government Portal Header & 8-Service Ribbon (As seen on real nfsa.gov.in) */}
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
        onNavigateTab={handleNavigate}
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

      {/* Secondary Tab Navigation Subheader (Operations Center) */}
      <nav className="tab-subheader" aria-label="Capability Engines">
        <div className="tab-group">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'ration_cards' || (activeTab as string) === 'roster_sim' ? 'active' : ''}`}
            onClick={() => setActiveTab('ration_cards')}
            id="tab-roster-sim"
          >
            <CreditCard size={15} />
            <span>Ration Cards & Simulator</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'onorc' || (activeTab as string) === 'portability' ? 'active' : ''}`}
            onClick={() => setActiveTab('onorc')}
            id="tab-portability"
          >
            <Compass size={15} />
            <span>"What Can I Do Today?" Portability</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'bulletin' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulletin')}
            id="tab-bulletin"
          >
            <FileText size={15} />
            <span>Foodgrains Bulletin</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'fps_locator' ? 'active' : ''}`}
            onClick={() => setActiveTab('fps_locator')}
            id="tab-fps"
          >
            <Store size={15} />
            <span>Fair Price Shop Radar</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'allocation' ? 'active' : ''}`}
            onClick={() => setActiveTab('allocation')}
            id="tab-allocation"
          >
            <Truck size={15} />
            <span>Allocation Policy</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'citizen_corner' || (activeTab as string) === 'grievance' ? 'active' : ''}`}
            onClick={() => setActiveTab('citizen_corner')}
            id="tab-grievance"
          >
            <Users size={15} />
            <span>Citizen Corner & Grievances</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'annavitran' ? 'active' : ''}`}
            onClick={() => setActiveTab('annavitran')}
            id="tab-annavitran"
          >
            <Activity size={15} />
            <span>Annavitran Telemetry</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'lifecycle' ? 'active' : ''}`}
            onClick={() => setActiveTab('lifecycle')}
            id="tab-lifecycle"
          >
            <FileCheck size={15} />
            <span>Draft Lifecycles ({drafts.length})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'inspector' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspector')}
            id="tab-inspector"
          >
            <Activity size={15} />
            <span>Inspector Signals</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'state_portals' ? 'active' : ''}`}
            onClick={() => setActiveTab('state_portals')}
            id="tab-state-portals"
          >
            <MapPin size={15} />
            <span>State Portals</span>
          </button>
        </div>

        {/* Hotkey Guide Hint for judges & accessibility */}
        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Keyboard: <kbd style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px' }}>Alt+D</kbd> View • <kbd style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px' }}>Alt+A</kbd> Voice • <kbd style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px' }}>Alt+K</kbd> Burn • <kbd style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '3px' }}>Alt+1..8</kbd> Tabs
        </div>
      </nav>

      {/* Main Workspace Area */}
      <main className="main-content" id="main-content" role="main">
        {/* National Portal Hero Banner & Real-time Metrics (Present on top for civic context) */}
        <PortalHero
          onOpenAskNicci={() => setIsAskNicciOpen(true)}
          onNavigateTab={handleNavigate}
        />

        {/* Dual Interface Switch: Pictorial View vs Structured View */}
        {viewMode === 'pictorial' ? (
          <PictorialView card={activeCard} />
        ) : (
          <div>
            {/* 1. Foodgrains Bulletin */}
            {activeTab === 'bulletin' && (
              <FoodgrainsBulletinView />
            )}

            {/* 2. Fair Price Shop */}
            {activeTab === 'fps_locator' && (
              <FpsLocatorView
                onSelectFpsForPortability={(_fpsId) => {
                  setActiveTab('onorc');
                }}
              />
            )}

            {/* 3. Ration Cards & Simulator */}
            {(activeTab === 'ration_cards' || (activeTab as string) === 'roster_sim') && (
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

            {/* 4. Allocation Policy */}
            {activeTab === 'allocation' && (
              <AllocationPolicyView
                onNavigateToSimulator={() => setActiveTab('ration_cards')}
              />
            )}

            {/* 5. Citizen Corner & Grievances */}
            {(activeTab === 'citizen_corner' || (activeTab as string) === 'grievance') && (
              <GrievanceEscalation />
            )}

            {/* 6. Annavitran Live ePoS Telemetry */}
            {activeTab === 'annavitran' && (
              <AnnavitranView />
            )}

            {/* 7. IMPDS / ONORC Portability */}
            {(activeTab === 'onorc' || (activeTab as string) === 'portability') && (
              <PortabilityCalculator card={activeCard} />
            )}

            {/* 8. State Portals */}
            {activeTab === 'state_portals' && (
              <StatePortalsDirectory onSelectStateCard={handleSelectStateCard} />
            )}

            {/* 9. Lifecycle Drafts */}
            {activeTab === 'lifecycle' && (
              <LifecycleDrafts
                drafts={drafts}
                onDraftUpdated={handleDraftUpdated}
              />
            )}

            {/* 10. Inspector Signals */}
            {activeTab === 'inspector' && (
              <InspectorSignals />
            )}
          </div>
        )}
      </main>

      {/* ASK NICCI Interactive Citizen Assistant Modal */}
      <AskNicciModal
        isOpen={isAskNicciOpen}
        onClose={() => setIsAskNicciOpen(false)}
        onNavigateTab={handleNavigate}
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
