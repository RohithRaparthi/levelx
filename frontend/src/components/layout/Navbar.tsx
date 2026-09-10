import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import type { PageView } from '../../types';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems: { id: PageView; label: string }[] = [
    { id: 'home', label: 'Overview' },
    { id: 'hackathons', label: 'Hackathons' },
    { id: 'results', label: 'Results' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'journey', label: 'Journey' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (view: PageView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className="sticky top-0 z-40 w-full transition-all duration-300"
      style={{
        /* glass that reveals the warm canvas beneath */
        background: scrolled ? 'rgba(248,246,242,0.82)' : 'rgba(253,252,250,0.72)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        borderBottom: `1px solid ${scrolled ? 'rgba(60,54,42,0.10)' : 'rgba(60,54,42,0.06)'}`,
        boxShadow: scrolled
          ? '0 4px 24px rgba(26,24,20,0.07), 0 1px 0 rgba(255,255,255,0.8) inset'
          : '0 1px 0 rgba(255,255,255,0.6) inset',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[58px] flex items-center justify-between gap-4">

        {/* ── Brand ── */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group shrink-0 focus:outline-none cursor-pointer"
        >
          <span
            className="font-display font-black text-[22px] tracking-tight transition-colors duration-200"
            style={{ color: currentView === 'home' ? 'var(--brand)' : 'var(--ink-primary)' }}
          >
            LEVELX
          </span>
          <span
            className="w-[5px] h-[5px] rounded-full shrink-0 transition-colors duration-200"
            style={{ background: 'var(--brand)' }}
          />
          <span
            className="text-[10px] font-mono uppercase tracking-[0.2em] pl-3 border-l"
            style={{ color: 'var(--ink-faint)', borderColor: 'var(--border-medium)' }}
          >
            by XFACTOR
          </span>
        </button>

        {/* ── Desktop pill nav ── */}
        <nav
          className="hidden lg:flex items-center gap-[2px] p-[3px] rounded-[14px]"
          style={{
            background: 'rgba(255,255,255,0.75)',
            border: '1px solid rgba(60,54,42,0.09)',
            boxShadow: '0 1px 4px rgba(26,24,20,0.05), inset 0 1px 0 rgba(255,255,255,0.95)',
          }}
        >
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="relative px-3.5 py-[7px] rounded-[11px] text-[12px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap"
                style={isActive ? {
                  background: 'var(--surface-base)',
                  color: 'var(--ink-primary)',
                  fontWeight: 600,
                  boxShadow: '0 1px 6px rgba(26,24,20,0.08), 0 1px 1px rgba(26,24,20,0.05), inset 0 1px 0 #fff',
                  border: '1px solid rgba(60,54,42,0.09)',
                } : {
                  color: 'var(--ink-muted)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-primary)';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-muted)';
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute left-1/2 -bottom-[3px] -translate-x-1/2 w-4 h-[2px] rounded-full"
                    style={{ background: 'var(--brand)', opacity: 0.7 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── CTA + Mobile toggle ── */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleNavClick('results')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 cursor-pointer"
            style={{
              background: 'var(--ink-primary)',
              color: '#fff',
              border: '1px solid transparent',
              boxShadow: '0 2px 8px rgba(26,24,20,0.18)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = 'var(--brand)';
              el.style.boxShadow = '0 2px 10px rgba(217,79,30,0.3)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = 'var(--ink-primary)';
              el.style.boxShadow = '0 2px 8px rgba(26,24,20,0.18)';
            }}
          >
            <span>Phase 1 Results</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl transition-all cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(60,54,42,0.10)',
              boxShadow: '0 1px 3px rgba(26,24,20,0.07)',
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen
              ? <X className="w-5 h-5" style={{ color: 'var(--ink-primary)' }} />
              : <Menu className="w-5 h-5" style={{ color: 'var(--ink-primary)' }} />
            }
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150"
          style={{
            background: 'rgba(253,252,250,0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(60,54,42,0.07)',
          }}
        >
          <div className="grid grid-cols-2 gap-1.5 pb-3 border-b" style={{ borderColor: 'var(--border-faint)' }}>
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="px-4 py-2.5 text-[12px] font-medium rounded-xl text-left transition-all cursor-pointer"
                  style={isActive ? {
                    background: 'var(--surface-base)',
                    color: 'var(--ink-primary)',
                    fontWeight: 600,
                    border: '1px solid rgba(60,54,42,0.10)',
                    boxShadow: '0 1px 4px rgba(26,24,20,0.07)',
                  } : {
                    background: 'rgba(255,255,255,0.5)',
                    color: 'var(--ink-muted)',
                    border: '1px solid rgba(60,54,42,0.07)',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div
            className="pt-1 flex items-center justify-between text-[11px] font-mono"
            style={{ color: 'var(--ink-faint)' }}
          >
            <span>KIET Collegiate Arena</span>
            <button
              onClick={() => handleNavClick('results')}
              className="font-semibold transition-colors"
              style={{ color: 'var(--brand)' }}
            >
              View Results →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
