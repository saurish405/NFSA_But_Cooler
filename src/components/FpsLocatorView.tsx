import React, { useState } from 'react';
import {
  Store,
  Search,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Battery,
  Clock,
  ArrowRight,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import type { FairPriceShop } from '../types';

interface FpsLocatorViewProps {
  onSelectFpsForPortability?: (fpsId: string) => void;
}

const SEED_FPS_LIST: FairPriceShop[] = [
  {
    id: 'FPS-BR-1042',
    fpsNumber: 'FPS-BR-1042',
    dealerName: 'M/s Rajesh Kumar Sah',
    state: 'Bihar',
    district: 'Patna',
    pincode: '801108',
    reportedRiceQuintals: 48.5,
    reportedWheatQuintals: 36.2,
    reportedKeroseneLitres: 120,
    lastSyncMinutesAgo: 6,
    activeTransactionsInWindow: 14,
    distanceKm: 0.8,
    operatingHours: '08:00 AM - 01:00 PM, 03:00 PM - 07:00 PM',
    lat: 25.632,
    lng: 85.045,
  },
  {
    id: 'FPS-0412',
    fpsNumber: 'FPS-0412',
    dealerName: 'M/s Sunil Paswan (Depleted Counter)',
    state: 'Bihar',
    district: 'Patna',
    pincode: '801108',
    reportedRiceQuintals: 0.0,
    reportedWheatQuintals: 0.0,
    reportedKeroseneLitres: 0,
    lastSyncMinutesAgo: 2,
    activeTransactionsInWindow: 45,
    distanceKm: 1.2,
    operatingHours: '09:00 AM - 01:00 PM (Stock Outage)',
    lat: 25.635,
    lng: 85.051,
  },
  {
    id: 'FPS-0419',
    fpsNumber: 'FPS-0419',
    dealerName: 'Annapurna Mahila Swayam Sahayata Samuh',
    state: 'Bihar',
    district: 'Patna',
    pincode: '801108',
    reportedRiceQuintals: 32.2,
    reportedWheatQuintals: 28.5,
    reportedKeroseneLitres: 190,
    lastSyncMinutesAgo: 4,
    activeTransactionsInWindow: 8,
    distanceKm: 2.8,
    operatingHours: '08:00 AM - 01:00 PM, 03:00 PM - 06:30 PM',
    lat: 25.645,
    lng: 85.068,
  },
  {
    id: 'FPS-1082',
    fpsNumber: 'FPS-1082',
    dealerName: 'Patna Central Food Corporation Cooperative',
    state: 'Bihar',
    district: 'Patna',
    pincode: '800001',
    reportedRiceQuintals: 75.0,
    reportedWheatQuintals: 62.4,
    reportedKeroseneLitres: 340,
    lastSyncMinutesAgo: 1,
    activeTransactionsInWindow: 22,
    distanceKm: 5.4,
    operatingHours: '07:30 AM - 08:00 PM',
    lat: 25.612,
    lng: 85.124,
  },
  {
    id: 'FPS-AP-9901',
    fpsNumber: 'FPS-AP-9901',
    dealerName: 'M/s Venkat Rao PDS Shop (Destination State)',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    pincode: '522002',
    reportedRiceQuintals: 58.0,
    reportedWheatQuintals: 0.0,
    reportedKeroseneLitres: 0,
    lastSyncMinutesAgo: 8,
    activeTransactionsInWindow: 12,
    distanceKm: 1.5,
    operatingHours: '08:00 AM - 12:30 PM, 04:00 PM - 08:00 PM',
    lat: 16.306,
    lng: 80.436,
  },
];

export const FpsLocatorView: React.FC<FpsLocatorViewProps> = ({ onSelectFpsForPortability }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'IN_STOCK' | 'BIHAR' | 'ANDHRA'>('ALL');

  const filteredFps = SEED_FPS_LIST.filter((fps) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      fps.fpsNumber.toLowerCase().includes(q) ||
      fps.dealerName.toLowerCase().includes(q) ||
      fps.district.toLowerCase().includes(q) ||
      fps.pincode.includes(q);

    if (!matchesSearch) return false;

    if (selectedFilter === 'IN_STOCK') {
      return fps.reportedRiceQuintals > 0 || fps.reportedWheatQuintals > 0;
    }
    if (selectedFilter === 'BIHAR') {
      return fps.state === 'Bihar';
    }
    if (selectedFilter === 'ANDHRA') {
      return fps.state === 'Andhra Pradesh';
    }
    return true;
  });

  return (
    <div className="card" id="fps-locator-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Card Header */}
      <div className="card-header">
        <div>
          <div className="card-title">
            <Store size={18} />
            <span>Fair Price Shop (FPS) Locator & Live Stock Radar</span>
            <span className="badge badge-safe">Real-Time ePoS Linked</span>
          </div>
          <p className="card-subtitle">
            Search licensed Fair Price Shops, view live grain reserves, ePoS connectivity, and automated stock mirage rerouting.
          </p>
        </div>
      </div>

      {/* 2. Stock Mirage Defense Highlight (EC-05) */}
      <div
        style={{
          background: 'var(--status-caution-bg)',
          border: '1px solid var(--status-caution-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
        }}
      >
        <AlertTriangle size={20} color="var(--civic-amber-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.825rem', lineHeight: 1.5 }}>
          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
            EC-05 Stock Mirage Auto-Protection Armed
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            If a citizen arrives at a depleted shop (e.g. <strong>FPS-0412</strong> with 0 stock), the portal prevents a bureaucratic runaround by instantly pointing to <strong>FPS-0419</strong> (2.8 km away) with 32.2 Quintals of verified stock and an optimal morning arrival window.
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.825rem' }}
            placeholder="Search by FPS Code (e.g. FPS-BR-1042), Dealer Name, or Pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="input-fps-search"
          />
          <Search size={15} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${selectedFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            onClick={() => setSelectedFilter('ALL')}
          >
            All Counters ({SEED_FPS_LIST.length})
          </button>
          <button
            type="button"
            className={`btn ${selectedFilter === 'IN_STOCK' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            onClick={() => setSelectedFilter('IN_STOCK')}
          >
            Verified In-Stock
          </button>
          <button
            type="button"
            className={`btn ${selectedFilter === 'BIHAR' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            onClick={() => setSelectedFilter('BIHAR')}
          >
            Bihar (Home)
          </button>
          <button
            type="button"
            className={`btn ${selectedFilter === 'ANDHRA' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            onClick={() => setSelectedFilter('ANDHRA')}
          >
            Andhra Pradesh (Destination)
          </button>
        </div>
      </div>

      {/* 4. FPS Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {filteredFps.map((fps) => {
          const isDepleted = fps.reportedRiceQuintals === 0 && fps.reportedWheatQuintals === 0;

          return (
            <div
              key={fps.id}
              style={{
                background: isDepleted ? 'rgba(207, 34, 46, 0.04)' : 'var(--bg-primary)',
                border: `1px solid ${isDepleted ? 'var(--status-danger-border)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{fps.fpsNumber}</span>
                    <span className={`badge ${isDepleted ? 'badge-danger' : 'badge-safe'}`}>
                      {isDepleted ? 'STOCK DEPLETED' : 'IN STOCK'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {fps.dealerName}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Navigation size={12} style={{ display: 'inline', marginRight: '3px' }} />
                  <span>{fps.distanceKm} km away</span>
                </div>
              </div>

              {/* Location Line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                <MapPin size={13} />
                <span>{fps.district}, {fps.state} — PIN {fps.pincode}</span>
              </div>

              {/* Commodity Stock Ticker */}
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '0.65rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rice Stock</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: fps.reportedRiceQuintals > 0 ? 'var(--text-primary)' : 'var(--civic-crimson-text)' }}>
                    {fps.reportedRiceQuintals} Qtl
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Wheat Stock</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: fps.reportedWheatQuintals > 0 ? 'var(--text-primary)' : 'var(--civic-crimson-text)' }}>
                    {fps.reportedWheatQuintals} Qtl
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sugar / Kero</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {fps.reportedKeroseneLitres} Ltr
                  </div>
                </div>
              </div>

              {/* Operational Metadata */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Wifi size={12} color="var(--civic-emerald-text)" />
                  <span>ePoS Online ({fps.lastSyncMinutesAgo}m ago)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={12} />
                  <span>{fps.operatingHours.split(',')[0]}</span>
                </div>
              </div>

              {/* Stock Mirage Action / Portability Jump */}
              <div style={{ marginTop: '0.25rem' }}>
                {isDepleted ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--civic-amber-text)', background: 'var(--status-caution-bg)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--status-caution-border)' }}>
                    <strong>Recommended Alternate:</strong> Annapurna Mahila Samuh (FPS-0419) • 2.8 km away • 32.2 Qtl stock available.
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem' }}
                    onClick={() => {
                      if (onSelectFpsForPortability) {
                        onSelectFpsForPortability(fps.fpsNumber);
                      } else {
                        alert(`Selected ${fps.fpsNumber} (${fps.dealerName}) as active counter. Verified ${fps.reportedRiceQuintals} Qtl stock.`);
                      }
                    }}
                  >
                    <span>Check Quota Lifting at this Counter</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
