import React, { useState } from 'react';
import { MessageSquare, X, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import seedData from '../data/dataset.json';

import type { PortalNavigationTab } from '../types';

interface AskNicciModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: PortalNavigationTab) => void;
}

export const AskNicciModal: React.FC<AskNicciModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const faqs = (seedData as any).nicciFaq || [];
  const [selectedFaqIdx, setSelectedFaqIdx] = useState<number>(0);

  if (!isOpen) return null;

  return (
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
      onClick={onClose}
      role="dialog"
      aria-label="Ask NICCI Virtual Assistant"
    >
      <div
        className="card"
        style={{
          maxWidth: '680px',
          width: '100%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-strong)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div className="card-title">
            <MessageSquare size={18} />
            <span>NICCI: National Informatics Centre Citizen Assistant</span>
            <span className="badge badge-safe">Verified AI / Rules Engine</span>
          </div>
          <button type="button" onClick={onClose} style={{ color: 'var(--text-muted)' }} aria-label="Close Assistant">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Select a common citizen scenario below to see how <strong>NFSA_But_Cooler</strong> calculates safeguards and eliminates bureaucratic runarounds:
        </p>

        {/* Q&A List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowY: 'auto', flex: 1, paddingRight: '0.25rem' }}>
          {faqs.map((faq: { q: string; a: string }, idx: number) => {
            const isSelected = selectedFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-primary)',
                  border: `1px solid ${isSelected ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  transition: 'background var(--trans-fast)',
                }}
                onClick={() => setSelectedFaqIdx(idx)}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={15} color={isSelected ? 'var(--civic-emerald-text)' : 'var(--text-muted)'} />
                  <span>{faq.q}</span>
                </div>

                {isSelected && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Shortcuts */}
        <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Direct Action Shortcuts:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              onClick={() => {
                onClose();
                onNavigateTab('ration_cards');
              }}
            >
              <span>Test Pre-Flight Simulator</span>
              <ArrowRight size={12} />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              onClick={() => {
                onClose();
                onNavigateTab('onorc');
              }}
            >
              <span>Test ONORC Portability</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
