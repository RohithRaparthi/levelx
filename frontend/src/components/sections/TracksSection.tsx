import React from 'react';
import { Cpu, Coins, HeartPulse, Leaf, Sparkles, ArrowRight } from 'lucide-react';
import { Surface } from '../common/Surface';
import { Badge } from '../common/Badge';
import type { TrackItem } from '../../types';

const TRACKS: TrackItem[] = [
  {
    id: 'track-ai',
    title: 'Autonomous Systems & Edge AI',
    tagline: 'On-device intelligence, robotics, high-throughput model inference, and real-time vision.',
    category: 'Engineering & AI',
    accent: 'brand',
    iconName: 'Cpu',
    prizePool: '$45,000',
    tags: ['Edge AI', 'Robotics', 'Vision', 'Real-Time'],
  },
  {
    id: 'track-fintech',
    title: 'Decentralized Finance & Next-Gen Commerce',
    tagline: 'Cryptographic settlement, micro-transactions, automated market engines, and fintech infrastructure.',
    category: 'Fintech & Systems',
    accent: 'sapphire',
    iconName: 'Coins',
    prizePool: '$35,000',
    tags: ['Smart Contracts', 'DeFi', 'Payments', 'Security'],
  },
  {
    id: 'track-health',
    title: 'BioTech & Precision Healthcare',
    tagline: 'Computational biology, diagnostic telemetry, wearable health sensors, and clinical tooling.',
    category: 'Bio & Medicine',
    accent: 'violet',
    iconName: 'HeartPulse',
    prizePool: '$40,000',
    tags: ['BioTech', 'Diagnostics', 'Sensors', 'Genomics'],
  },
  {
    id: 'track-climate',
    title: 'ClimateTech & Smart Infrastructure',
    tagline: 'Grid optimization, renewable telemetry, carbon auditing, and sustainable hardware systems.',
    category: 'Sustainability',
    accent: 'emerald',
    iconName: 'Leaf',
    prizePool: '$30,000',
    tags: ['CleanTech', 'Grid', 'IoT', 'Hardware'],
  },
  {
    id: 'track-open',
    title: 'Open Frontier & Moonshots',
    tagline: 'Unconventional architectures, creative tooling, AR/VR spatial computing, and wild experiments.',
    category: 'Moonshots',
    accent: 'brand',
    iconName: 'Sparkles',
    prizePool: '$25,000',
    tags: ['Spatial', 'Tooling', 'Novel UI', 'Research'],
  },
];

export const TracksSection: React.FC = () => {
  const renderIcon = (name: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-brand-400" />;
      case 'Coins': return <Coins className="w-5 h-5 text-indigo-400" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-teal-400" />;
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <section id="tracks" className="py-20 border-t border-canvas-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              <span className="text-xs font-mono uppercase tracking-wider text-brand-400 font-semibold">
                DOMAINS OF EXCELLENCE
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Collegiate Innovation Tracks
            </h2>
          </div>
          <p className="text-sm text-text-secondary max-w-md">
            Choose a specialized domain or tackle multi-disciplinary challenges with mentorship from industry architects.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRACKS.map((track) => (
            <Surface
              key={track.id}
              variant="interactive"
              className="flex flex-col justify-between group p-7"
            >
              <div>
                {/* Top Row: Icon + Prize */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-canvas-base border border-canvas-border group-hover:border-white/20 transition-colors">
                    {renderIcon(track.iconName)}
                  </div>
                  <Badge variant={track.accent} size="sm">
                    {track.prizePool} Grant
                  </Badge>
                </div>

                {/* Category & Title */}
                <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted mb-1">
                  {track.category}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-brand-300 transition-colors">
                  {track.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {track.tagline}
                </p>
              </div>

              {/* Tags & Action */}
              <div>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-canvas-border/70">
                  {track.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-canvas-base/80 text-text-muted border border-canvas-border/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Surface>
          ))}

          {/* Custom CTA Card */}
          <Surface
            variant="accent"
            className="flex flex-col justify-between p-7"
          >
            <div>
              <div className="p-3 w-fit rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-400 mb-6">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-brand-300 font-semibold mb-1">
                CUSTOM PROPOSALS
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3">
                Have an Uncategorized Moonshot?
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                LEVELX supports cross-disciplinary research and student-originated problem statements directly with XFACTOR venture fellows.
              </p>
            </div>

            <div className="pt-6 border-t border-brand-500/20 flex items-center justify-between text-xs font-mono text-brand-300">
              <span>Propose Open Track</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Surface>
        </div>

      </div>
    </section>
  );
};
