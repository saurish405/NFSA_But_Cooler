import React, { useEffect } from 'react';
import {
  X,
  CreditCard,
  Compass,
  FileText,
  Store,
  Truck,
  Users,
  Activity,
  FileCheck,
  MapPin,
  Flame,
  ShieldCheck,
  Home,
  CheckCircle2,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import type { PortalNavigationTab } from '../types';

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: PortalNavigationTab;
  onSelectTab: (tab: PortalNavigationTab) => void;
  draftsCount: number;
  isKioskMode: boolean;
  onBurnKioskSession: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  draftsCount,
  isKioskMode,
  onBurnKioskSession,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleItemClick = (tab: PortalNavigationTab) => {
    onSelectTab(tab);
    onClose();
    const el = document.getElementById('main-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
      aria-label="Navigation Sidebar Modal"
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: '360px',
          maxWidth: '85vw',
          height: '100%',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-strong)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          overflowY: 'auto',
          animation: 'slideInLeft 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="brand-emblem" style={{ width: '32px', height: '32px' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>NFSA_But_Cooler</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Citizen Operations & Engine Console
              </div>
            </div>
          </div>

          <button
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
            }}
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Menu Sections */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
          {/* Section 1: Main Landing */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              Portal Home
            </div>
            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'landing' ? 'active' : ''}`}
              onClick={() => handleItemClick('landing')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Home size={16} />
                <span>National Portal Landing Page</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.6 }} />
            </button>
          </div>

          {/* Section 2: Citizen Core Services */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              Citizen Welfare & Portability
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'ration_cards' || (activeTab as string) === 'roster_sim' ? 'active' : ''}`}
                onClick={() => handleItemClick('ration_cards')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <CreditCard size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Ration Cards & Simulator</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Pre-Flight safe correction DAG</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'onorc' || (activeTab as string) === 'portability' ? 'active' : ''}`}
                onClick={() => handleItemClick('onorc')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Compass size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>"What Can I Do Today?"</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Interstate ONORC portability</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'fps_locator' ? 'active' : ''}`}
                onClick={() => handleItemClick('fps_locator')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Store size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Fair Price Shop Radar</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Live stock & EC-05 mirage reroute</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'citizen_corner' || (activeTab as string) === 'grievance' ? 'active' : ''}`}
                onClick={() => handleItemClick('citizen_corner')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Users size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Citizen Corner & Grievances</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>14-day SLA Tier-2 DC escalation</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>
            </div>
          </div>

          {/* Section 3: National Telemetry & Allocation */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              National Telemetry & Allocation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'bulletin' ? 'active' : ''}`}
                onClick={() => handleItemClick('bulletin')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <FileText size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Foodgrains Bulletin</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Central Pool reserves & offtake</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'allocation' ? 'active' : ''}`}
                onClick={() => handleItemClick('allocation')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Truck size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Statutory Allocation Policy</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>AAY / PHH quota calculator</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'annavitran' ? 'active' : ''}`}
                onClick={() => handleItemClick('annavitran')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Activity size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Annavitran Telemetry</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Live ePoS transactions & auth modes</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'state_portals' ? 'active' : ''}`}
                onClick={() => handleItemClick('state_portals')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <MapPin size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>State Portals Directory</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>36 States/UTs & 1967 helplines</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>
            </div>
          </div>

          {/* Section 4: Facilitator & Integrity Engines */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              Facilitator & Integrity Engines
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'lifecycle' ? 'active' : ''}`}
                onClick={() => handleItemClick('lifecycle')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <FileCheck size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Draft Lifecycles ({draftsCount})</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>HMAC Base32 shortcode receipts</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'inspector' ? 'active' : ''}`}
                onClick={() => handleItemClick('inspector')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Sliders size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Inspector Anomaly Signals</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Objective anomaly hypothesis generator</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer with Kiosk Status and Hotkeys */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-primary)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          {isKioskMode && (
            <button
              type="button"
              className="btn btn-danger"
              style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem' }}
              onClick={() => {
                onBurnKioskSession();
                onClose();
              }}
            >
              <Flame size={14} />
              <span>Burn Kiosk Session (0 Bytes Residue)</span>
            </button>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Keyboard shortcuts:</span>
            <span><kbd>Alt+1..8</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
};
