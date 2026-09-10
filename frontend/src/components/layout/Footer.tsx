import React from 'react';
import type { PageView } from '../../types';

interface FooterProps {
  onNavigate: (view: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      className="mt-24"
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--canvas-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">

          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-2xl tracking-tight" style={{ color: 'var(--ink-primary)' }}>
                LEVELX
              </span>
              <span
                className="text-[10px] font-mono px-2.5 py-[3px] rounded-full border uppercase tracking-[0.14em]"
                style={{ background: 'var(--surface-base)', color: 'var(--ink-muted)', borderColor: 'var(--border-medium)' }}
              >
                by XFACTOR
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--ink-muted)' }}>
              A 3-phase student innovation platform designed to empower undergraduate engineers, researchers, and early venture creators through real-world technical challenges and industry critique.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono" style={{ color: 'var(--ink-faint)' }}>
              <span>Hosted at KIET</span>
              <span>·</span>
              <span>Evaluator: Nallanesh</span>
              <span>·</span>
              <span>Max 300 Credits</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.18em] font-bold" style={{ color: 'var(--ink-faint)' }}>
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: 'var(--ink-secondary)' }}>
              {([
                { view: 'home', label: 'Overview' },
                { view: 'hackathons', label: 'Hackathon Series' },
                { view: 'projects', label: 'Project Exhibition' },
                { view: 'achievements', label: 'Vault & Awards' },
              ] as { view: PageView; label: string }[]).map(item => (
                <li key={item.view}>
                  <button
                    onClick={() => onNavigate(item.view)}
                    className="transition-colors cursor-pointer hover:underline underline-offset-2"
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = '')}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('results')}
                  className="font-semibold cursor-pointer"
                  style={{ color: 'var(--brand)' }}
                >
                  Phase 1 Leaderboard →
                </button>
              </li>
            </ul>
          </div>

          {/* Initiative Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.18em] font-bold" style={{ color: 'var(--ink-faint)' }}>
              Initiative
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: 'var(--ink-secondary)' }}>
              {([
                { view: 'journey', label: '3-Phase Roadmap' },
                { view: 'highlights', label: 'Event Highlights' },
                { view: 'about', label: 'About XFACTOR' },
              ] as { view: PageView; label: string }[]).map(item => (
                <li key={item.view}>
                  <button
                    onClick={() => onNavigate(item.view)}
                    className="transition-colors cursor-pointer hover:underline underline-offset-2"
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = '')}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono"
          style={{ borderTop: '1px solid var(--border-faint)', color: 'var(--ink-faint)' }}
        >
          <p>© {new Date().getFullYear()} LEVELX by XFACTOR. All student projects belong to their respective creators.</p>
          <div className="flex items-center gap-3">
            <span>Zero Equity Model</span>
            <span>·</span>
            <span>KIET Innovation Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
