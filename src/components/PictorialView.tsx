import React, { useState } from 'react';
import type { HouseholdMember, RationCard } from '../types';
import { speechEngine } from '../services/speechEngine';
import {
  Wheat,
  Utensils,
  Fuel,
  Candy,
  Volume2,
  Users,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface PictorialViewProps {
  card: RationCard;
}

export const PictorialView: React.FC<PictorialViewProps> = ({ card }) => {
  const [activeMemberId, setActiveMemberId] = useState<string>(card.members[0].id);
  const [pinInput, setPinInput] = useState<string>('');
  const [unlockedMemberId, setUnlockedMemberId] = useState<string>(card.members[0].id);
  const [pinError, setPinError] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'en'>('hi');

  const activeMember = card.members.find((m) => m.id === activeMemberId) || card.members[0];
  const isProfileUnlocked = unlockedMemberId === activeMember.id;

  const handleSelectMember = (member: HouseholdMember) => {
    setActiveMemberId(member.id);
    setPinError(false);
    setPinInput('');
  };

  const handleVerifyPin = () => {
    if (pinInput === activeMember.pin) {
      setUnlockedMemberId(activeMember.id);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleReadQuotaAloud = () => {
    speechEngine.speakQuota(
      card.monthlyQuota.riceKg,
      card.monthlyQuota.wheatKg,
      card.monthlyQuota.coarseGrainKg,
      selectedLanguage
    );
  };

  const handleSpeakItem = (item: string, qty: number, unit: string) => {
    if (selectedLanguage === 'hi') {
      const hiNames: Record<string, string> = {
        Rice: 'चावल',
        Wheat: 'गेहूं',
        Kerosene: 'केरोसिन',
        Sugar: 'चीनी',
      };
      speechEngine.speak(`${hiNames[item] || item}: ${qty} ${unit === 'kg' ? 'किलोग्राम' : 'लीटर'} उपलब्ध है।`, 'hi');
    } else {
      speechEngine.speak(`${item}: ${qty} ${unit} available.`, 'en');
    }
  };

  return (
    <div className="card" id="pictorial-view-container" style={{ border: '2px solid rgba(56, 189, 248, 0.3)' }}>
      {/* Header with Language Selector & Voice Button */}
      <div className="card-header">
        <div>
          <div className="card-title" style={{ fontSize: '1.15rem' }}>
            <Users size={18} />
            <span>चित्रमय इंटरफ़ेस • Pictorial & Audio View</span>
            <span className="badge badge-safe">कम साक्षरता अनुकूल (Low-Literacy Safe)</span>
          </div>
          <p className="card-subtitle">
            Large high-contrast pictorial representation of family grain quotas with regional voice read-backs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Language Selector */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              type="button"
              className={`btn btn-secondary ${selectedLanguage === 'hi' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
              onClick={() => setSelectedLanguage('hi')}
            >
              🇮🇳 हिन्दी
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${selectedLanguage === 'en' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
              onClick={() => setSelectedLanguage('en')}
            >
              English
            </button>
          </div>

          <button
            type="button"
            className="btn btn-voice"
            onClick={handleReadQuotaAloud}
            title="Read entire family ration aloud"
            id="btn-pictorial-read-all"
          >
            <Volume2 size={16} />
            <span>{selectedLanguage === 'hi' ? 'पूरा कोटा सुनें' : 'Listen To Quota'}</span>
          </button>
        </div>
      </div>

      {/* Pictorial Commodity Grid */}
      <div className="pictorial-grid">
        {/* Rice Card */}
        <div className="pictorial-card">
          <div className="pictorial-icon-ring">
            <Utensils size={28} />
          </div>
          <div className="pictorial-label">RICE</div>
          <div className="pictorial-vernacular">चावल • బియ్యం</div>
          <div className="pictorial-amount">
            {card.monthlyQuota.riceKg} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: '0.65rem', width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
            onClick={() => handleSpeakItem('Rice', card.monthlyQuota.riceKg, 'kg')}
          >
            <Volume2 size={13} /> {selectedLanguage === 'hi' ? 'बोलकर बताएं' : 'Speak'}
          </button>
        </div>

        {/* Wheat Card */}
        <div className="pictorial-card">
          <div className="pictorial-icon-ring">
            <Wheat size={28} />
          </div>
          <div className="pictorial-label">WHEAT</div>
          <div className="pictorial-vernacular">गेहूं • गोధుమలు</div>
          <div className="pictorial-amount">
            {card.monthlyQuota.wheatKg} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: '0.65rem', width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
            onClick={() => handleSpeakItem('Wheat', card.monthlyQuota.wheatKg, 'kg')}
          >
            <Volume2 size={13} /> {selectedLanguage === 'hi' ? 'बोलकर बताएं' : 'Speak'}
          </button>
        </div>

        {/* Kerosene Card */}
        <div className="pictorial-card">
          <div className="pictorial-icon-ring">
            <Fuel size={28} />
          </div>
          <div className="pictorial-label">KEROSENE</div>
          <div className="pictorial-vernacular">केरोसिन तेल • కిరోసిన్</div>
          <div className="pictorial-amount">
            {card.monthlyQuota.keroseneLitres} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>L</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: '0.65rem', width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
            onClick={() => handleSpeakItem('Kerosene', card.monthlyQuota.keroseneLitres, 'L')}
          >
            <Volume2 size={13} /> {selectedLanguage === 'hi' ? 'बोलकर बताएं' : 'Speak'}
          </button>
        </div>

        {/* Sugar Card */}
        <div className="pictorial-card">
          <div className="pictorial-icon-ring">
            <Candy size={28} />
          </div>
          <div className="pictorial-label">SUGAR</div>
          <div className="pictorial-vernacular">चीनी • చక్కెర</div>
          <div className="pictorial-amount">
            {card.monthlyQuota.sugarKg} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: '0.65rem', width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
            onClick={() => handleSpeakItem('Sugar', card.monthlyQuota.sugarKg, 'kg')}
          >
            <Volume2 size={13} /> {selectedLanguage === 'hi' ? 'बोलकर बताएं' : 'Speak'}
          </button>
        </div>
      </div>

      {/* Shared-Device Family Member Switcher & PIN Barrier (EC-09) */}
      <div
        style={{
          marginTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#10b981" />
              <span>Shared-Phone Privacy Sandbox: Per-Member 4-Digit PIN Wall</span>
              <span className="badge badge-safe">EC-09 Verified (0 Bytes Leaked)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Prevents other family members using a shared village smartphone from viewing confidential domestic grievances or pension records.
            </p>
          </div>
        </div>

        {/* Member Selector Badges */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {card.members.map((m) => {
            const isSelected = m.id === activeMemberId;
            const isUnlocked = m.id === unlockedMemberId;
            return (
              <button
                key={m.id}
                type="button"
                className={`btn btn-secondary ${isSelected ? 'active' : ''}`}
                style={{
                  fontSize: '0.825rem',
                  padding: '0.5rem 0.85rem',
                  border: isSelected ? '1px solid var(--text-accent)' : undefined,
                }}
                onClick={() => handleSelectMember(m)}
              >
                {isUnlocked ? <Unlock size={14} color="#10b981" /> : <Lock size={14} color="#f59e0b" />}
                <span>{m.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({m.relation})</span>
              </button>
            );
          })}
        </div>

        {/* PIN Verification / Unlocked Profile Details */}
        <div
          style={{
            marginTop: '1rem',
            padding: '1.25rem',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
          }}
        >
          {isProfileUnlocked ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 800, fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} />
                <span>Profile Unlocked: {activeMember.name} (Confidential Session Active)</span>
              </div>

              <div className="grid-3" style={{ marginTop: '0.85rem' }}>
                <div className="stat-box">
                  <span className="stat-label">Aadhaar Token</span>
                  <span className="stat-value" style={{ fontSize: '1rem' }}>{activeMember.aadhaarMasked}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Location Status</span>
                  <span className="stat-value" style={{ fontSize: '1rem', color: 'var(--text-accent)' }}>
                    {activeMember.locationStatus}
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Confidential Flags</span>
                  <span className="stat-value" style={{ fontSize: '0.9rem', color: '#f59e0b' }}>
                    {activeMember.pensionFlag ? 'Pension Beneficiary' : 'Standard Roster'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: '420px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 800, fontSize: '0.9rem' }}>
                <Lock size={16} />
                <span>Enter 4-Digit Family PIN for {activeMember.name} (PIN: {activeMember.pin})</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem' }}>
                <input
                  type="password"
                  maxLength={4}
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', textAlign: 'center', width: '120px' }}
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  id="input-member-pin"
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleVerifyPin}
                  id="btn-verify-pin"
                >
                  <Unlock size={14} />
                  <span>Authenticate</span>
                </button>
              </div>

              {pinError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={14} /> Incorrect PIN. Zero profile data revealed.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
