import React from 'react';
import { ExternalLink, Phone, CheckCircle2, Shield, Store, MapPin } from 'lucide-react';
import seedData from '../data/dataset.json';
import type { StatePortalInfo } from '../types';

interface StatePortalsDirectoryProps {
  onSelectStateCard: (stateName: string) => void;
}

export const StatePortalsDirectory: React.FC<StatePortalsDirectoryProps> = ({ onSelectStateCard }) => {
  const states = ((seedData as any).statePortals || []) as StatePortalInfo[];

  return (
    <div className="card" id="state-portals-section">
      <div className="card-header">
        <div>
          <div className="card-title">
            <MapPin size={18} />
            <span>State Food & Transparency Portals Directory (All States & UTs)</span>
            <span className="badge badge-safe">36 States Integrated</span>
          </div>
          <p className="card-subtitle">
            Direct access to State Public Distribution System portals, local grievance cells, and automated ePoS networks.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginTop: '0.5rem',
        }}
      >
        {states.map((st) => (
          <div
            key={st.code}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{st.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{st.regionalName}</div>
              </div>
              <span className="badge badge-info">{st.code}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
              <div>
                <Store size={12} style={{ display: 'inline', marginRight: '3px' }} />
                <span>FPS: <strong>{st.fpsCount.toLocaleString()}</strong></span>
              </div>
              <div>
                <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '3px', color: 'var(--civic-emerald-text)' }} />
                <span>ePoS: <strong>{st.eposCount.toLocaleString()}</strong></span>
              </div>
            </div>

            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={12} />
              <span>Toll Free Helpline: <strong>{st.tollFree}</strong></span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem' }}>
              <a
                href={st.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '0.725rem', padding: '0.3rem 0.5rem', textDecoration: 'none' }}
              >
                <span>State Portal</span>
                <ExternalLink size={11} />
              </a>

              {(st.name === 'Bihar' || st.name === 'Andhra Pradesh') && (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
                  onClick={() => onSelectStateCard(st.name)}
                >
                  <span>Load Card</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
