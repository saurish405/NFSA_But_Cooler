import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface StateBulletinRecord {
  state: string;
  code: string;
  allocationLakhMT: number;
  offtakeLakhMT: number;
  liftingPercent: number;
  primaryGrain: string;
  pmgkayLiftingStatus: '100% COMPLETE' | 'IN_PROGRESS' | 'STOCKED';
}

const BULLETIN_DATA: StateBulletinRecord[] = [
  { state: 'Bihar', code: 'BR', allocationLakhMT: 4.82, offtakeLakhMT: 4.79, liftingPercent: 99.4, primaryGrain: 'Rice 60% : Wheat 40%', pmgkayLiftingStatus: '100% COMPLETE' },
  { state: 'Uttar Pradesh', code: 'UP', allocationLakhMT: 7.95, offtakeLakhMT: 7.91, liftingPercent: 99.5, primaryGrain: 'Wheat 60% : Rice 40%', pmgkayLiftingStatus: '100% COMPLETE' },
  { state: 'Andhra Pradesh', code: 'AP', allocationLakhMT: 2.65, offtakeLakhMT: 2.65, liftingPercent: 100.0, primaryGrain: 'Rice 100%', pmgkayLiftingStatus: '100% COMPLETE' },
  { state: 'Maharashtra', code: 'MH', allocationLakhMT: 4.25, offtakeLakhMT: 4.18, liftingPercent: 98.4, primaryGrain: 'Wheat 55% : Rice 45%', pmgkayLiftingStatus: 'IN_PROGRESS' },
  { state: 'West Bengal', code: 'WB', allocationLakhMT: 3.88, offtakeLakhMT: 3.84, liftingPercent: 99.0, primaryGrain: 'Rice 70% : Wheat 30%', pmgkayLiftingStatus: '100% COMPLETE' },
  { state: 'Rajasthan', code: 'RJ', allocationLakhMT: 2.75, offtakeLakhMT: 2.72, liftingPercent: 98.9, primaryGrain: 'Wheat 90% : Coarse 10%', pmgkayLiftingStatus: 'IN_PROGRESS' },
  { state: 'Tamil Nadu', code: 'TN', allocationLakhMT: 3.12, offtakeLakhMT: 3.12, liftingPercent: 100.0, primaryGrain: 'Rice 100% (Universal PDS)', pmgkayLiftingStatus: '100% COMPLETE' },
  { state: 'Karnataka', code: 'KA', allocationLakhMT: 2.45, offtakeLakhMT: 2.43, liftingPercent: 99.2, primaryGrain: 'Rice 65% : Ragi/Millets 35%', pmgkayLiftingStatus: '100% COMPLETE' },
];

export const FoodgrainsBulletinView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('October 2026');
  const [searchState, setSearchState] = useState<string>('');
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);

  const filteredStates = BULLETIN_DATA.filter((s) =>
    s.state.toLowerCase().includes(searchState.toLowerCase()) ||
    s.code.toLowerCase().includes(searchState.toLowerCase())
  );

  return (
    <div className="card" id="foodgrains-bulletin-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Header & Official Reference */}
      <div className="card-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="card-title">
            <FileText size={18} />
            <span>Monthly Foodgrains Bulletin & Central Pool Offtake Report</span>
            <span className="badge badge-safe">Official DFPD Record</span>
          </div>
          <p className="card-subtitle">
            Department of Food & Public Distribution • Food Corporation of India (FCI) Central Pool Allocation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.775rem' }}
            onClick={() => setShowOrderModal(true)}
            id="btn-view-allocation-order"
          >
            <Download size={13} />
            <span>Official Allocation Order</span>
          </button>
        </div>
      </div>

      {/* 2. Statutory Pricing & PMGKAY 100% Free Grain Banner */}
      <div
        style={{
          background: 'var(--status-safe-bg)',
          border: '1px solid var(--status-safe-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={24} color="var(--civic-emerald-text)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              PMGKAY Zero-Cost Foodgrain Guarantee Active
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
              Under central government notification, the Central Issue Price (CIP) for all 80+ Crore NFSA beneficiaries is <strong>₹0.00 / kg</strong> (100% subsidized by Govt of India).
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div>Statutory NFSA Max Price: Rice ₹3 | Wheat ₹2 | Coarse Grains ₹1</div>
        </div>
      </div>

      {/* 3. Central Pool Stock Reserves Grid */}
      <div className="grid-4" style={{ gap: '0.75rem' }}>
        <div className="stat-box">
          <span className="stat-label">Central Pool Wheat Stock</span>
          <span className="stat-value">
            23.4 <span className="stat-unit">Million MT</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', marginTop: '0.25rem' }}>
            ● Above Buffer Norm (20.5M MT)
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Central Pool Rice Stock</span>
          <span className="stat-value">
            32.1 <span className="stat-unit">Million MT</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', marginTop: '0.25rem' }}>
            ● Robust Reserve (Buffer 10.2M MT)
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Nutri-Cereals / Millets Stock</span>
          <span className="stat-value">
            1.8 <span className="stat-unit">Million MT</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            ● Jowar, Bajra & Ragi
          </span>
        </div>

        <div className="stat-box">
          <span className="stat-label">National Offtake Efficiency</span>
          <span className="stat-value">
            99.4% <span className="stat-unit">ePoS Validated</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--civic-emerald-text)', marginTop: '0.25rem' }}>
            ● 55.4L MT Monthly Lifting
          </span>
        </div>
      </div>

      {/* 4. Filter & Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Bulletin Period:</span>
          <select
            className="form-input"
            style={{ width: 'auto', padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="October 2026">October 2026 (Current Cycle)</option>
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
          </select>
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '1.85rem', height: '32px', fontSize: '0.8rem' }}
            placeholder="Filter by State or UT..."
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
          />
          <Search size={13} style={{ position: 'absolute', left: '0.55rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* 5. State-Wise Offtake Table */}
      <div className="table-responsive">
        <table className="roster-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>State / UT</th>
              <th>State Code</th>
              <th>Monthly Allocation (Lakh MT)</th>
              <th>Actual Offtake (Lakh MT)</th>
              <th>Lifting %</th>
              <th>Grain Ratio Breakdown</th>
              <th>Lifting Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStates.map((st) => (
              <tr key={st.code}>
                <td style={{ fontWeight: 700 }}>{st.state}</td>
                <td>
                  <span className="badge badge-info">{st.code}</span>
                </td>
                <td>{st.allocationLakhMT.toFixed(2)}</td>
                <td>{st.offtakeLakhMT.toFixed(2)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '50px', height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${st.liftingPercent}%`, height: '100%', background: 'var(--civic-emerald-text)' }} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.775rem' }}>{st.liftingPercent}%</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{st.primaryGrain}</td>
                <td>
                  <span className={`badge ${st.pmgkayLiftingStatus === '100% COMPLETE' ? 'badge-safe' : 'badge-caution'}`}>
                    {st.pmgkayLiftingStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Official Order Modal */}
      {showOrderModal && (
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
          onClick={() => setShowOrderModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: '640px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header">
              <div className="card-title">
                <FileText size={18} />
                <span>Govt of India Central Allocation Circular #{selectedMonth}</span>
              </div>
              <button type="button" onClick={() => setShowOrderModal(false)} style={{ color: 'var(--text-muted)' }}>
                ✕
              </button>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.775rem', background: 'var(--bg-inset)', padding: '1rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.6, border: '1px solid var(--border-subtle)' }}>
              <div>GOVERNMENT OF INDIA</div>
              <div>MINISTRY OF CONSUMER AFFAIRS, FOOD AND PUBLIC DISTRIBUTION</div>
              <div>DEPARTMENT OF FOOD AND PUBLIC DISTRIBUTION</div>
              <div>KRISHI BHAWAN, NEW DELHI - 110001</div>
              <br />
              <div>File No: 4-2/2026-BP.II</div>
              <div>Dated: 01 October 2026</div>
              <br />
              <div>SUBJECT: Monthly Allocation of Foodgrains to States/UTs under NFSA, 2013 and PMGKAY for the month of {selectedMonth}.</div>
              <br />
              <div>The President is pleased to convey the sanction of the Government of India for the allocation of 55,42,800 Metric Tonnes of foodgrains (comprising 32,10,000 MT Rice and 23,32,800 MT Wheat) to all 36 States/UTs for distribution under the National Food Security Act, 2013.</div>
              <br />
              <div>Issue Price: ₹0.00 / quintal (Under PMGKAY free grain directive).</div>
              <div>Valid Lifting Period: Up to the last calendar day of the cycle.</div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer size={14} />
                <span>Print Official Circular</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowOrderModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
