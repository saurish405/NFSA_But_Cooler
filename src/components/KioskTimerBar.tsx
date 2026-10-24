import React, { useEffect, useState, useCallback } from 'react';
import { Timer, Flame, ShieldAlert } from 'lucide-react';

interface KioskTimerBarProps {
  onAutoBurn: () => void;
  isActive: boolean;
}

export const KioskTimerBar: React.FC<KioskTimerBarProps> = ({ onAutoBurn, isActive }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(90);

  const resetTimer = useCallback(() => {
    setSecondsRemaining(90);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Reset timer on user interaction
    const handleActivity = () => {
      setSecondsRemaining(90);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onAutoBurn();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearInterval(interval);
    };
  }, [isActive, onAutoBurn]);

  if (!isActive) return null;

  const isLow = secondsRemaining <= 15;

  return (
    <div className="kiosk-banner" role="region" aria-label="Shared Kiosk Inactivity Safeguard">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <ShieldAlert size={18} />
        <span>
          <strong>CSC Shared Kiosk Sandbox Active</strong> • Ephemeral memory auto-flushes on idle
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          className="kiosk-timer-pill"
          style={{
            background: isLow ? '#7f1d1d' : 'rgba(0,0,0,0.4)',
            color: isLow ? '#fca5a5' : '#ffffff',
            border: isLow ? '1px solid #ef4444' : 'none',
          }}
          aria-live="polite"
        >
          <Timer size={14} className={isLow ? 'speaking-pulse' : ''} />
          <span>Auto-Wipe in: {secondsRemaining}s</span>
        </div>

        <button
          type="button"
          className="kiosk-exit-btn"
          onClick={onAutoBurn}
          title="Immediately wipe all session data and return to clean kiosk screen"
          id="btn-kiosk-exit-timer"
        >
          <Flame size={13} style={{ display: 'inline', marginRight: '4px' }} />
          Exit & Burn Now
        </button>
      </div>
    </div>
  );
};
