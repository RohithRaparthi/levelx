import React from 'react';
import { ArrowRight, Trophy, Users, Code, Zap } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Surface } from '../common/Surface';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Callout */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Badge variant="brand" pulse size="md">
            COHORT 2026 NOW OPEN
          </Badge>
          <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
            <span>Annual Collegiate Hackathon Championship</span>
            <span className="text-text-muted">•</span>
            <span className="text-brand-400 font-semibold">$250K Total Grants</span>
          </div>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
              Where Student Builders Turn Ideas Into <span className="text-brand-500 underline decoration-brand-500/40 decoration-4 underline-offset-8">Venture Scale</span>.
            </h1>

            <p className="text-base sm:text-lg text-text-secondary font-normal leading-relaxed max-w-xl">
              LEVELX by XFACTOR provides the ultimate collegiate platform for rapid hackathon execution, peer team formation, expert industry mentorship, and direct access to venture backing.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  const el = document.getElementById('tracks');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse Innovation Tracks
              </Button>

              <Button
                size="lg"
                variant="secondary"
                icon={<Code className="w-4 h-4 text-text-secondary" />}
                iconPosition="left"
                onClick={() => {
                  const el = document.getElementById('live-status');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Platform Diagnostics
              </Button>
            </div>

            {/* Micro Trust Proof */}
            <div className="pt-6 flex items-center gap-6 text-xs text-text-muted font-mono border-t border-canvas-border">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Inter-University Validated</span>
              </div>
              <div>•</div>
              <div>50+ Partner Campuses</div>
              <div>•</div>
              <div>Zero Equity Taken</div>
            </div>
          </div>

          {/* Right Column: Morphism Live Arena Card */}
          <div className="lg:col-span-5">
            <Surface variant="accent" className="relative p-6 sm:p-8">
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-brand-400 font-semibold">
                    ACTIVE SPRINT
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mt-0.5">
                    National Hackathon 2026
                  </h3>
                </div>
                <Badge variant="emerald" size="sm">
                  Registration Active
                </Badge>
              </div>

              {/* Card Body: Sprint Highlights */}
              <div className="space-y-4 py-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-canvas-base/60 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-brand-500/10 text-brand-400">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted font-mono">GRAND PRIZE POOL</div>
                      <div className="text-sm font-bold text-white font-mono">$100,000 Cash + Grants</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-canvas-base/60 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-teal-surface text-teal-text">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted font-mono">TEAM SIZE</div>
                      <div className="text-sm font-bold text-white font-mono">2 - 4 Collegiate Members</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-canvas-base/60 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-indigo-surface text-indigo-text">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted font-mono">DURATION</div>
                      <div className="text-sm font-bold text-white font-mono">48 Hours Sprint + Pitch</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-text-muted">
                <span className="font-mono">Presented by XFACTOR Labs</span>
                <span className="text-brand-400 font-medium">Phase 1 Foundation →</span>
              </div>
            </Surface>
          </div>

        </div>

      </div>
    </section>
  );
};
