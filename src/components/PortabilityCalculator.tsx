import React, { useState } from 'react';
import type { FairPriceShop, RationCard } from '../types';
import { calculatePortability } from '../services/portabilityEngine';
import seedData from '../data/dataset.json';
import { speechEngine } from '../services/speechEngine';
import {
  Compass,
  MapPin,
  Lock,
  Unlock,
  AlertOctagon,
  Clock,
  TrendingUp,
  PackageCheck,
  Wheat,
  Share2,
  Volume2,
  CheckCircle2,
} from 'lucide-react';

interface PortabilityCalculatorProps {
  card: RationCard;
}

export const PortabilityCalculator: React.FC<PortabilityCalculatorProps> = ({ card }) => {
  const [destinationState, setDestinationState] = useState<string>('Andhra Pradesh');
  const [actingMemberId, setActingMemberId] = useState<string>('MEM-03'); // Sunita Paswan (daughter)
  const [selectedFpsId, setSelectedFpsId] = useState<string>('FPS-AP-2041');
  const [partialDrawExecuted, setPartialDrawExecuted] = useState<boolean>(false);

  const fpsList = seedData.fairPriceShops as FairPriceShop[];
  const calculation = calculatePortability(card, actingMemberId, destinationState, selectedFpsId);

  // Quick Preset Handlers
  const testEC02InterstateSplit = () => {
    setDestinationState('Andhra Pradesh');
    setActingMemberId('MEM-01'); // HoH Ramvilas
    setSelectedFpsId('FPS-AP-2041');
  };

  const testEC03AbsentHoH = () => {
    setDestinationState('Bihar');
    setActingMemberId('MEM-03'); // Daughter Sunita
    setSelectedFpsId('FPS-BR-1043');
  };

  const testEC05StockMirage = () => {
    setDestinationState('Bihar');
    setActingMemberId('MEM-02');
    setSelectedFpsId('FPS-BR-1042'); // 0 stock FPS
  };

  const handleSpeakPortability = () => {
    const text = `Portability Summary: Destination drawing allowance is ${calculation.destinationDrawAllowedKg.riceKg + calculation.destinationDrawAllowedKg.wheatKg} kilograms. Home village retaining balance is ${calculation.homeRemainingKg.riceKg + calculation.homeRemainingKg.wheatKg} kilograms. Stock confidence at Fair Price Shop is ${calculation.stockConfidence.confidencePercent} percent.`;
    speechEngine.speak(text, 'en');
  };

  return (
    <div className="card" id="portability-section">
      <div className="card-header">
        <div>
          <div className="card-title">
            <Compass size={18} />
            <span>"What Can I Do Today?" Portability & Stock Engine</span>
            <span className="badge badge-info">ONORC Real-Time Split</span>
          </div>
          <p className="card-subtitle">
            Dynamically partitions household entitlements across state borders and computes probabilistic inventory confidence intervals.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
          onClick={handleSpeakPortability}
          id="btn-speak-portability"
        >
          <Volume2 size={14} /> Narrate Status
        </button>
      </div>

      {/* Preset Action Buttons */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>
          Test Scenarios:
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
          onClick={testEC02InterstateSplit}
          id="btn-preset-ec02"
        >
          ⚡ Test EC-02: Interstate Split (AP Draws 10kg, Bihar Keeps 15kg)
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
          onClick={testEC03AbsentHoH}
          id="btn-preset-ec03"
        >
          ⚡ Test EC-03: Absent HoH Rights (Daughter Grain Draw vs Structural Lock)
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
          onClick={testEC05StockMirage}
          id="btn-preset-ec05"
        >
          ⚡ Test EC-05: Stock Mirage (Zero Stock Auto-Suggests Nearby FPS)
        </button>
      </div>

      {/* Configuration Controls */}
      <div className="grid-3">
        <div className="form-group">
          <label className="form-label" htmlFor="select-acting-member">Member Present at Counter</label>
          <select
            id="select-acting-member"
            className="form-select"
            value={actingMemberId}
            onChange={(e) => setActingMemberId(e.target.value)}
          >
            {card.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.isHoH ? 'Head of Household' : m.relation})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="select-dest-state">Current Drawing State</label>
          <select
            id="select-dest-state"
            className="form-select"
            value={destinationState}
            onChange={(e) => setDestinationState(e.target.value)}
          >
            <option value="Andhra Pradesh">Andhra Pradesh (Migrant Destination)</option>
            <option value="Bihar">Bihar (Home State)</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Karnataka">Karnataka</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="select-fps">Fair Price Shop Counter</label>
          <select
            id="select-fps"
            className="form-select"
            value={selectedFpsId}
            onChange={(e) => setSelectedFpsId(e.target.value)}
          >
            {fpsList.map((fps) => (
              <option key={fps.id} value={fps.id}>
                {fps.fpsNumber} — {fps.state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ONORC Entitlement Partition Display (EC-02) */}
      <div className="grid-2" style={{ marginTop: '1rem' }}>
        {/* Host State Draw Box */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              MIGRANT DESTINATION: {destinationState.toUpperCase()}
            </span>
            <span className="badge badge-info">{calculation.migrantMembersCount} Members Lift</span>
          </div>

          <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {calculation.destinationDrawAllowedKg.riceKg + calculation.destinationDrawAllowedKg.wheatKg}
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>kg grain allowed today</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Allocation Breakdown: {calculation.destinationDrawAllowedKg.riceKg} kg Rice • {calculation.destinationDrawAllowedKg.wheatKg} kg Wheat
          </div>

          {/* Commodity Outage Simulation (EC-11) */}
          <div style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.85rem' }}
              onClick={() => setPartialDrawExecuted(true)}
              disabled={partialDrawExecuted}
              id="btn-execute-partial-draw"
            >
              <PackageCheck size={16} />
              <span>
                {partialDrawExecuted ? '✅ 10 kg Grain Drawn (Balance Protected)' : 'Lift Destination Quota (10 kg)'}
              </span>
            </button>
          </div>
        </div>

        {/* Home State Preserved Quota Box (EC-02) */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald-400)' }}>
              HOME VILLAGE: {card.homeState.toUpperCase()} ({card.homeVillage})
            </span>
            <span className="badge badge-safe">{calculation.homeMembersCount} Members Staying</span>
          </div>

          <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
              {calculation.homeRemainingKg.riceKg + calculation.homeRemainingKg.wheatKg}
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>kg protected at home</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Protected Balance: {calculation.homeRemainingKg.riceKg} kg Rice • {calculation.homeRemainingKg.wheatKg} kg Wheat • {calculation.homeRemainingKg.keroseneLitres}L Kerosene
          </div>

          <div
            style={{
              marginTop: '0.85rem',
              fontSize: '0.775rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
            }}
          >
            🔒 <strong>Interstate Isolation Guard:</strong> Drawing 10 kg in {destinationState} is guaranteed NOT to lock or forfeit the 15 kg quota for family members in {card.homeState}.
          </div>
        </div>
      </div>

      {/* Head of Household Absence Rights Block (EC-03) */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '1rem',
          borderRadius: '10px',
          background: calculation.hohPresentAtCounter ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
          border: `1px solid ${calculation.hohPresentAtCounter ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {calculation.hohPresentAtCounter ? (
              <Unlock size={20} color="#10b981" />
            ) : (
              <Lock size={20} color="#f59e0b" />
            )}
            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              Counter Authority Status: {calculation.actingMemberName} ({calculation.hohPresentAtCounter ? 'Head of Household Present' : 'Secondary Member Authenticated'})
            </span>
          </div>

          <span className={`badge ${calculation.hohPresentAtCounter ? 'badge-safe' : 'badge-caution'}`}>
            {calculation.hohPresentAtCounter ? 'Full Rights' : 'Grain Draw Only'}
          </span>
        </div>

        {calculation.lockReason && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {calculation.lockReason}
          </div>
        )}

        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontSize: '0.775rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <CheckCircle2 size={13} />
            Commodity Draw: PERMITTED
          </div>
          <div
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              background: calculation.hohPresentAtCounter ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: calculation.hohPresentAtCounter ? '#34d399' : '#f87171',
              fontSize: '0.775rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Lock size={13} />
            Structural Card Surrender: {calculation.hohPresentAtCounter ? 'PERMITTED' : 'BLOCKED (HoH Consent Needed)'}
          </div>
        </div>
      </div>

      {/* Probabilistic Stock Uncertainty Engine Display (EC-05) */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '1.25rem',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={18} color="#38bdf8" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              Probabilistic Stock Confidence: {calculation.stockConfidence.fpsNumber}
            </span>
          </div>

          <span
            className={`badge ${
              calculation.stockConfidence.confidenceGrade === 'HIGH'
                ? 'badge-safe'
                : calculation.stockConfidence.confidenceGrade === 'MODERATE'
                ? 'badge-caution'
                : 'badge-danger'
            }`}
          >
            Confidence: {calculation.stockConfidence.confidencePercent}% ({calculation.stockConfidence.confidenceGrade})
          </span>
        </div>

        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <TrendingUp size={15} color="var(--text-accent)" />
            <span>Transaction Velocity: <strong>{calculation.stockConfidence.velocityCategory}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Clock size={15} />
            <span>{calculation.stockConfidence.arrivalWindowAdvice}</span>
          </div>
        </div>

        {/* Depleted Inventory & Nearest Alternate Suggestion (EC-05 Stock Mirage) */}
        {calculation.stockConfidence.alternateFpsSuggestion && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.85rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', fontWeight: 700, fontSize: '0.85rem' }}>
              <AlertOctagon size={16} />
              <span>Current Counter Depleted. Auto-Routing to Nearest Alternate Counter within 3 km:</span>
            </div>
            <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>{calculation.stockConfidence.alternateFpsSuggestion.fpsNumber}</strong> • {calculation.stockConfidence.alternateFpsSuggestion.dealerName}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Distance: {calculation.stockConfidence.alternateFpsSuggestion.distanceKm} km • Available: {calculation.stockConfidence.alternateFpsSuggestion.reportedRiceQuintals} Qtl Rice, {calculation.stockConfidence.alternateFpsSuggestion.reportedWheatQuintals} Qtl Wheat
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.775rem' }}
                onClick={() => setSelectedFpsId(calculation.stockConfidence.alternateFpsSuggestion!.id)}
                id="btn-switch-alternate-fps"
              >
                <MapPin size={13} />
                Switch to this Counter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
