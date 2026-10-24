import React, { useState } from 'react';
import {
  Activity,
  Fingerprint,
  Eye,
  Smartphone,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Search,
  Radio,
} from 'lucide-react';

interface StateAnnavitranMetric {
  state: string;
  code: string;
  todayTransactions: number;
  todayTonnes: number;
  activeEpos: number;
  biometricSuccessPercent: number;
  velocityRating: 'NORMAL' | 'HIGH' | 'SURGE';
}

const SEED_ANNAVITRAN_DATA: StateAnnavitranMetric[] = [
  { state: 'Uttar Pradesh', code: 'UP', todayTransactions: 3120400, todayTonnes: 14250, activeEpos: 78920, biometricSuccessPercent: 99.2, velocityRating: 'HIGH' },
  { state: 'Bihar', code: 'BR', todayTransactions: 2450800, todayTonnes: 11840, activeEpos: 54980, biometricSuccessPercent: 98.9, velocityRating: 'SURGE' },
  { state: 'Maharashtra', code: 'MH', todayTransactions: 1980200, todayTonnes: 9420, activeEpos: 52190, biometricSuccessPercent: 99.4, velocityRating: 'NORMAL' },
  { state: 'West Bengal', code: 'WB', todayTransactions: 1820500, todayTonnes: 8650, activeEpos: 20850, biometricSuccessPercent: 98.7, velocityRating: 'HIGH' },
  { state: 'Andhra Pradesh', code: 'AP', todayTransactions: 1420100, todayTonnes: 7100, activeEpos: 29810, biometricSuccessPercent: 99.8, velocityRating: 'NORMAL' },
  { state: 'Tamil Nadu', code: 'TN', todayTransactions: 1540300, todayTonnes: 7420, activeEpos: 35200, biometricSuccessPercent: 99.5, velocityRating: 'NORMAL' },
  { state: 'Rajasthan', code: 'RJ', todayTransactions: 1180400, todayTonnes: 5890, activeEpos: 26850, biometricSuccessPercent: 99.1, velocityRating: 'NORMAL' },
  { state: 'Karnataka', code: 'KA', todayTransactions: 1040800, todayTonnes: 5210, activeEpos: 20450, biometricSuccessPercent: 99.3, velocityRating: 'NORMAL' },
];

export const AnnavitranView: React.FC = () => {
  const [searchState, setSearchState] = useState<string>('');

  const filtered = SEED_ANNAVITRAN_DATA.filter(
    (s) =>
      s.state.toLowerCase().includes(searchState.toLowerCase()) ||
      s.code.toLowerCase().includes(searchState.toLowerCase())
  );

  return (
    <div className="card" id="annavitran-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Header */}
      <div className="card-header">
        <div>
          <div className="card-title">
            <Activity size={18} />
            <span>Annavitran: Real-Time Nationwide ePoS Distribution Analytics</span>
            <span className="badge badge-safe">Live Feed Active</span>
          </div>
          <p className="card-subtitle">
            National Informatics Centre (NIC) Public Distribution System ePoS Telemetry Dashboard
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--civic-emerald-text)', fontWeight: 600 }}>
          <Radio size={14} className="speaking-pulse" />
          <span>498,320 ePoS Terminals Transacting</span>
        </div>
      </div>

      {/* 2. Real-Time Distribution Ticker */}
      <div className="grid-4" style={{ gap: '0.75rem' }}>
        <div className="stat-box">
          <span className="stat-label">Transactions Today</span>
          <span className="stat-value">
            1.84 <span className="stat-unit">Crore</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            18,429,150 Verified Slips
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Foodgrain Lifted Today</span>
          <span className="stat-value">
            82,410 <span className="stat-unit">Metric Tonnes</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', marginTop: '0.25rem' }}>
            ● Normal Velocity Pace
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Active ePoS Terminals</span>
          <span className="stat-value">
            4,98,320 <span className="stat-unit">Devices</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', marginTop: '0.25rem' }}>
            ● 99.4% Nationwide Online
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Interstate ONORC Today</span>
          <span className="stat-value">
            4.12 <span className="stat-unit">Lakh Draws</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            ● Zero Portability Lockouts
          </span>
        </div>
      </div>

      {/* 3. Authentication Mode Breakdown (Crucial for Low-Literacy & Elder Access) */}
      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Authentication Modality Breakdown (Aadhaar Statutory Exceptions)</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero Exclusion Guideline Enforced</span>
        </div>

        <div className="grid-4" style={{ gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--civic-emerald-text)', fontSize: '0.8rem', fontWeight: 700 }}>
              <Fingerprint size={16} />
              <span>Fingerprint ePoS</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem' }}>88.4%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1.63 Cr Transactions</div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--civic-slate)', fontSize: '0.8rem', fontWeight: 700 }}>
              <Eye size={16} />
              <span>Iris Scan Exemption</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem' }}>3.1%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Elderly / Manual Labor</div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--civic-amber-text)', fontSize: '0.8rem', fontWeight: 700 }}>
              <Smartphone size={16} />
              <span>Mobile OTP Bypass</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem' }}>7.9%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Biometric Sensor Failure</div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700 }}>
              <FileSpreadsheet size={16} />
              <span>Physical Register</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem' }}>0.6%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Deep Rural Offline Exception</div>
          </div>
        </div>
      </div>

      {/* 4. State Activity Leaderboard */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Live State Distribution Velocity Leaderboard</div>
          <div style={{ position: 'relative', width: '220px' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '1.85rem', height: '30px', fontSize: '0.75rem' }}
              placeholder="Search State or UT..."
              value={searchState}
              onChange={(e) => setSearchState(e.target.value)}
            />
            <Search size={12} style={{ position: 'absolute', left: '0.55rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="roster-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>State / UT</th>
                <th>State Code</th>
                <th>Transactions Today</th>
                <th>Grain Distributed Today (MT)</th>
                <th>Active ePoS Terminals</th>
                <th>Auth Success %</th>
                <th>Velocity Indicator</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st) => (
                <tr key={st.code}>
                  <td style={{ fontWeight: 700 }}>{st.state}</td>
                  <td>
                    <span className="badge badge-info">{st.code}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{st.todayTransactions.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{st.todayTonnes.toLocaleString()} MT</td>
                  <td>{st.activeEpos.toLocaleString()}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--civic-emerald-text)' }}>
                      {st.biometricSuccessPercent}%
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        st.velocityRating === 'SURGE'
                          ? 'badge-caution'
                          : st.velocityRating === 'HIGH'
                          ? 'badge-info'
                          : 'badge-safe'
                      }`}
                    >
                      {st.velocityRating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
