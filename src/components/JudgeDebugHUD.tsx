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
} from 'lucide-react';

interface JudgeDebugHUDProps {
  faultConfig: JudgeFaultConfig;
  onUpdateFaultConfig: (config: Partial<JudgeFaultConfig>) => void;
  onSelfHealTriggered?: () => void;
}

export const JudgeDebugHUD: React.FC<JudgeDebugHUDProps> = ({
  faultConfig,
  onUpdateFaultConfig,
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

    const run = await runAllAutomatedTests((_currentIdx, _total, result) => {
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
          <Sliders size={16} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
            [!] NFSA_BUT_COOLER FAULT CONTROLLER (JUDGES)
          </span>
          <span
            className={`badge ${faultConfig.forceOffline ? 'badge-danger' : 'badge-safe'}`}
            style={{ fontSize: '0.65rem' }}
          >
            {faultConfig.forceOffline ? 'OFFLINE' : 'ONLINE'}
          </span>
        </div>

        <button
          type="button"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={collapsed ? 'Expand Controller' : 'Collapse Controller'}
        >
          {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                fontSize: '0.75rem',
                padding: '0.4rem',
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
                fontSize: '0.75rem',
                padding: '0.4rem',
              }}
              onClick={() => setActiveTab('test_runner')}
            >
              <Play size={13} />
              <span>Automated Suite (15/15)</span>
            </button>
          </div>

          {activeTab === 'faults' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {/* Force Complete Offline Mode */}
              <div className="fault-toggle-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  {faultConfig.forceOffline ? <WifiOff size={15} color="var(--civic-crimson-text)" /> : <Wifi size={15} color="var(--civic-emerald-text)" />}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <ServerCrash size={15} color={faultConfig.gatewayTimeout504 ? 'var(--civic-crimson-text)' : 'var(--text-muted)'} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <Database size={15} color={faultConfig.corruptStorage ? 'var(--civic-crimson-text)' : 'var(--text-muted)'} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <FileCode size={15} color={faultConfig.backendConflict409 ? 'var(--civic-crimson-text)' : 'var(--text-muted)'} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <Shield size={15} color={faultConfig.promptInjectionActive ? 'var(--civic-crimson-text)' : 'var(--text-muted)'} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <WifiOff size={15} color={faultConfig.throttle2G ? 'var(--civic-amber-text)' : 'var(--text-muted)'} />
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
                  style={{ width: '100%', fontSize: '0.825rem' }}
                  onClick={handleRunAllTests}
                  id="btn-run-tests-from-faults"
                >
                  <Play size={13} />
                  <span>RUN AUTOMATED TEST SUITE (15 / 15 Cases) [▶ RUN ALL]</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'test_runner' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                  Test Cases Evaluated: {testResults.length} / 15
                </span>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
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
                    background: 'var(--status-safe-bg)',
                    border: '1px solid var(--status-safe-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                  }}
                  id="metrics-scoreboard"
                >
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--status-safe-text)', textTransform: 'uppercase' }}>
                    Section 8: Quantitative Success Metrics Verified
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.45rem',
                      marginTop: '0.45rem',
                      fontSize: '0.725rem',
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Harmful Correction Catch:</div>
                      <div style={{ fontWeight: 700, color: 'var(--status-safe-text)' }}>{testMetrics.harmfulCorrectionCatchRate}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Shared Device Leakage:</div>
                      <div style={{ fontWeight: 700, color: 'var(--status-safe-text)' }}>{testMetrics.sharedDeviceDataLeakage}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Screen-Reader/Keyboard:</div>
                      <div style={{ fontWeight: 700, color: 'var(--status-safe-text)' }}>{testMetrics.screenReaderKeyboardFlow}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Offline Sync Recovery:</div>
                      <div style={{ fontWeight: 700, color: 'var(--status-safe-text)' }}>{testMetrics.offlineSyncRecoveryLatency}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* List of Test Results */}
              <div className="test-suite-list">
                {testResults.map((t) => (
                  <div key={t.id} className={`test-item ${t.passed ? 'passed' : 'failed'}`}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        [{t.id}] {t.title}
                      </span>
                      {t.passed ? (
                        <span className="badge badge-safe">
                          <CheckCircle2 size={11} /> PASSED
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <XCircle size={11} /> FAILED
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.725rem' }}>
                      {t.description}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-primary)' }}>
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
