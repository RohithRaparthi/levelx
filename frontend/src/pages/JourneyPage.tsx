import React from 'react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import type { PageView } from '../types';

interface JourneyPageProps {
  onNavigate: (view: PageView) => void;
}

export const JourneyPage: React.FC<JourneyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3 pb-8 border-b border-[#E8E1D5]">
        <Badge variant="brand" size="md">
          CHAMPIONSHIP ROADMAP
        </Badge>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#14161B] tracking-tight">
          The LEVELX Scoring Framework
        </h1>
        <p className="text-base text-[#5D616F] leading-relaxed">
          LevelX is structured across 3 progressive phases designed to turn classroom theory into venture-scale prototypes.
        </p>
      </div>

      {/* 300 Credits Overview Paper Slab */}
      <div className="bg-[#14161B] text-white p-8 sm:p-10 rounded-3xl border border-[#14161B] shadow-[0_16px_40px_-8px_rgba(20,22,27,0.2)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <Badge variant="emerald" size="sm">
              Cumulative Series Architecture
            </Badge>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              3 Phases • 3 Themes • Up to 300 Total Credits
            </h2>
            <p className="text-sm sm:text-base text-[#B7BAC6] leading-relaxed">
              Every phase carries 0 to 100 credits awarded based on technical architecture, system design, prompt grounding, UX innovation, teamwork, and live presentation. Overall champions are decided from cumulative performance across all three phases.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 font-mono text-center">
            <span className="text-xs text-[#8C90A0] uppercase tracking-wider">MAXIMUM SERIES SCORE</span>
            <span className="text-6xl font-black text-[#DF421A] my-1 font-display">300</span>
            <span className="text-xs text-[#156B3F] font-bold">100 Credits / Phase</span>
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-6">
        <div className="text-xs font-mono uppercase tracking-widest text-[#DF421A] font-bold">
          PHASE BREAKDOWN
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#DF421A]">PHASE 01</span>
              <Badge variant="emerald" size="sm">Completed</Badge>
            </div>
            <h3 className="font-display font-bold text-xl text-[#14161B]">
              Retrieval-Augmented Generation
            </h3>
            <p className="text-xs sm:text-sm text-[#5D616F] leading-relaxed">
              Masterclass in vector databases and embeddings, followed by a 48h build sprint evaluated by Nallanesh.
            </p>
            <div className="pt-4 border-t border-[#E8E1D5] text-xs font-mono text-[#7E8290]">
              Weight: 100 Credits Max
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#7E8290]">PHASE 02</span>
              <Badge variant="neutral" size="sm">Upcoming</Badge>
            </div>
            <h3 className="font-display font-bold text-xl text-[#14161B]">
              Autonomous Systems & Agents
            </h3>
            <p className="text-xs sm:text-sm text-[#5D616F] leading-relaxed">
              Multi-agent coordination, tool-calling pipelines, structured workflows, and real-world domain integrations.
            </p>
            <div className="pt-4 border-t border-[#E8E1D5] text-xs font-mono text-[#7E8290]">
              Weight: 100 Credits Max
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#7E8290]">PHASE 03</span>
              <Badge variant="neutral" size="sm">Grand Finale</Badge>
            </div>
            <h3 className="font-display font-bold text-xl text-[#14161B]">
              Venture Summit & Pitch
            </h3>
            <p className="text-xs sm:text-sm text-[#5D616F] leading-relaxed">
              Comprehensive venture readiness, investor pitching, ecosystem showcase, and the crowning of LEVELX Champions.
            </p>
            <div className="pt-4 border-t border-[#E8E1D5] text-xs font-mono text-[#7E8290]">
              Series Maximum: 300 Credits
            </div>
          </div>

        </div>
      </div>

      {/* Action Banner */}
      <div className="p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-[0_2px_8px_rgba(20,22,27,0.04)] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-display font-bold text-xl text-[#14161B]">Explore Official Results</h4>
          <p className="text-xs sm:text-sm text-[#5D616F]">View the complete Phase 1 rankings, teams, and score breakdown.</p>
        </div>
        <Button
          size="md"
          variant="brand"
          onClick={() => onNavigate('results')}
        >
          View Phase 1 Leaderboard
        </Button>
      </div>

    </div>
  );
};
