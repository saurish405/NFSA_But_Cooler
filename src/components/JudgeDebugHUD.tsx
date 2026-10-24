import React, { useState } from 'react';
import type { JudgeFaultConfig, QuantitativeMetrics, TestCaseResult } from '../types';
import { runAllAutomatedTests } from '../services/testRunner';
import {
  Sliders,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle2,
  XCircle,
  Activity,
  Shield,
  Wifi,
  WifiOff,
  ServerCrash,
  Database,
  FileCode,
  Flame,
} from 'lucide-react';

interface JudgeDebugHUDProps {
  faultConfig: JudgeFaultConfig;
  onUpdateFaultConfig: (config: Partial<JudgeFaultConfig>) => void;
  onSelfHealTriggered?: () => void;
}

export const JudgeDebugHUD: React.FC<JudgeDebugHUDProps> = ({
  faultConfig,
  onUpdateFaultConfig,
  onSelfHealTriggered,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [testMetrics, setTestMetrics] = useState<QuantitativeMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'faults' | 'test_runner'>('faults');

  const handleRunAllTests = async () => {
    setIsRunningTests(true);
    setActiveTab('test_runner');
    setTestResults([]);

    const run = await runAllAutomatedTests((currentIdx, total, result) => {
      setTestResults((prev) => [...prev, result]);
    });

    setTestMetrics(run.metrics);
    setIsRunningTests(false);
  };

  return (
    <aside
      className={`judge-hud ${collapsed ? 'collapsed' : ''}`}
      aria-label="Judge Fault Injection and Automated Test Harness"
      id="judge-debug-hud"
    >
      {/* HUD Header Bar */}
      <div className="judge-hud-header" onClick={() => setCollapsed(!collapsed)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Sliders size={18} color="#38bdf8" />
          <span style={{ fontWeight: 800, fontSize: '0.875rem', letterSpacing: '-0.01em', color: '#f8fafc' }}>
            [!] ANTIGRAVITY FAULT INJECTION CONTROLLER (JUDGES)
          </span>
          <span
            className="badge"
            style={{
              background: faultConfig.forceOffline ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.2)',
              color: faultConfig.forceOffline ? '#f87171' : '#34d399',
              fontSize: '0.675rem',
            }}
          >
            {faultConfig.forceOffline ? 'OFFLINE SIM' : 'ONLINE'}
          </span>
        </div>

        <button
          type="button"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={collapsed ? 'Expand Controller' : 'Collapse Controller'}
        >
          {collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expanded HUD Body */}
      {!collapsed && (
        <div className="judge-hud-body">
          {/* Internal Tabs: Fault Injector vs Test Suite Runner */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem' }}>
            <button
              type="button"
              className={`btn btn-secondary ${activeTab === 'faults' ? 'active' : ''}`}
              style={{
                flex: 1,
                fontSize: '0.775rem',
                padding: '0.4rem',
                border: activeTab === 'faults' ? '1px solid var(--text-accent)' : undefined,
              }}
              onClick={() => setActiveTab('faults')}
            >
              <Activity size={13} />
              <span>Fault Bus Toggles</span>
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${activeTab === 'test_runner' ? 'active' : ''}`}
              style={{
                flex: 1,
                fontSize: '0.775rem',
                padding: '0.4rem',
                border: activeTab === 'test_runner' ? '1px solid var(--text-accent)' : undefined,
              }}
              onClick={() => setActiveTab('test_runner')}
            >
              <Play size={13} />
              <span>Automated Suite (15/15)</span>
            </button>
          </div>

          {activeTab === 'faults' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {/* Force Complete Offline Mode */}
              <div className="fault-toggle-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
                  {faultConfig.forceOffline ? <WifiOff size={16} color="#ef4444" /> : <Wifi size={16} color="#10b981" />}
                  <span>Force Complete Offline Mode</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={faultConfig.forceOffline}
                    onChange={(e) => onUpdateFaultConfig({ forceOffline: e.target.checked })}
                    id="toggle-force-offline"
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Inject Gateway 504 Timeout */}
              <div className="fault-toggle-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
                  <ServerCrash size={16} color={faultConfig.gatewayTimeout504 ? '#ef4444' : 'var(--text-muted)'} />
                  <span>Inject Gateway 504 Gateway Timeout</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={faultConfig.gatewayTimeout504}
                    onChange={(e) => onUpdateFaultConfig({ gatewayTimeout504: e.target.checked })}
                    id="toggle-504-timeout"
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Corrupt IndexedDB Storage State */}
              <div className="fault-toggle-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
                  <Database size={16} color={faultConfig.corruptStorage ? '#ef4444' : 'var(--text-muted)'} />
                  <span>Corrupt IndexedDB Storage State (EC-13)</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={faultConfig.corruptStorage}
                    onChange={(e) => onUpdateFaultConfig({ corruptStorage: e.target.checked })}
                    id="toggle-corrupt-storage"
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Simulate Backend Data Conflict (409 Version Mismatch) */}
              <div className="fault-toggle-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
                  <FileCode size={16} color={faultConfig.backendConflict409 ? '#ef4444' : 'var(--text-muted)'} />
                  <span>Simulate Backend Data Conflict (409)</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={faultConfig.backendConflict409}
                    onChange={(e) => onUpdateFaultConfig({ backendConflict409: e.target.checked })}
                    id="toggle-409-conflict"
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Inject Adversarial Prompt Payload into Forms */}
              <div className="fault-toggle-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
                  <Shield size={16} color={faultConfig.promptInjectionActive ? '#ef4444' : 'var(--text-muted)'} />
                  <span>Inject Adversarial Prompt Payload (EC-14)</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={faultConfig.promptInjectionActive}
                    onChange={(e) => onUpdateFaultConfig({ promptInjectionActive: e.target.checked })}
                    id="toggle-prompt-injection"
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Throttle Network to 2G Speeds */}
              <div className="fault-toggle-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
                  <WifiOff size={16} color={faultConfig.throttle2G ? '#f59e0b' : 'var(--text-muted)'} />
                  <span>Throttle Network to 2G (30 kbps) (EC-15)</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={faultConfig.throttle2G}
                    onChange={(e) => onUpdateFaultConfig({ throttle2G: e.target.checked })}
                    id="toggle-throttle-2g"
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div style={{ marginTop: '0.85rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                  onClick={handleRunAllTests}
                  id="btn-run-tests-from-faults"
                >
                  <Play size={14} />
                  <span>RUN AUTOMATED TEST SUITE (15 / 15 Cases) [▶ RUN ALL]</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'test_runner' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                  Test Cases Evaluated: {testResults.length} / 15
                </span>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
                  onClick={handleRunAllTests}
                  disabled={isRunningTests}
                  id="btn-trigger-all-tests"
                >
                  <Play size={12} />
                  <span>{isRunningTests ? 'Running...' : 'Run All 15'}</span>
                </button>
              </div>

              {/* Quantitative Success Metrics Verified Scoreboard (Section 8) */}
              {testMetrics && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    marginBottom: '0.85rem',
                  }}
                  id="metrics-scoreboard"
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--emerald-400)', textTransform: 'uppercase' }}>
                    Section 8: Quantitative Success Metrics Verified
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.5rem',
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Harmful Correction Catch:</div>
                      <div style={{ fontWeight: 800, color: '#34d399' }}>{testMetrics.harmfulCorrectionCatchRate}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Shared Device Leakage:</div>
                      <div style={{ fontWeight: 800, color: '#34d399' }}>{testMetrics.sharedDeviceDataLeakage}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Screen-Reader/Keyboard:</div>
                      <div style={{ fontWeight: 800, color: '#34d399' }}>{testMetrics.screenReaderKeyboardFlow}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Offline Sync Recovery:</div>
                      <div style={{ fontWeight: 800, color: '#34d399' }}>{testMetrics.offlineSyncRecoveryLatency}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* List of Test Results */}
              <div className="test-suite-list">
                {testResults.map((t) => (
                  <div key={t.id} className={`test-item ${t.passed ? 'passed' : 'failed'}`}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                        [{t.id}] {t.title}
                      </span>
                      {t.passed ? (
                        <span className="badge badge-safe">
                          <CheckCircle2 size={12} /> PASSED
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <XCircle size={12} /> FAILED
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.725rem' }}>
                      {t.description}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-accent)' }}>
                      Observed: {t.metricObserved}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
