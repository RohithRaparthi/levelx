import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { api } from '../api/client';
import type { PageView } from '../types';

interface HackathonsPageProps {
  onNavigate: (view: PageView) => void;
}

export const HackathonsPage: React.FC<HackathonsPageProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    api.getPhases()
      .catch(() => [])
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3 pb-8 border-b border-[#E8E1D5]">
        <Badge variant="brand" size="md">
          HACKATHON SCHEDULE & CALENDAR
        </Badge>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#14161B] tracking-tight">
          The 3-Phase Hackathon Series
        </h1>
        <p className="text-base text-[#5D616F] leading-relaxed">
          Hosted at KIET campus by XFACTOR. Each phase introduces a distinct technical theme with up to 100 credits awarded based on technical architecture, system design, and live execution.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading hackathon phases..." />
      ) : (
        <div className="space-y-8">
          
          {/* Phase 1 - Completed Paper Slab */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#DFD6C7] shadow-[0_4px_20px_-2px_rgba(20,22,27,0.06)] relative space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8E1D5]">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="emerald" pulse icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                    Phase 1 Completed
                  </Badge>
                  <span className="text-xs font-mono text-[#7E8290]">August 2026</span>
                </div>

                <h2 className="font-display font-black text-2xl sm:text-3xl text-[#14161B] tracking-tight">
                  Phase 1 — Retrieval-Augmented Generation (RAG)
                </h2>

                <p className="text-sm text-[#5D616F] max-w-2xl leading-relaxed">
                  Teams built enterprise RAG pipelines, vector embedding indexes, and grounded chatbots evaluated on technical architecture, latency, and hallucination guardrails.
                </p>
              </div>

              <div className="shrink-0">
                <Button
                  size="md"
                  variant="brand"
                  icon={<Trophy className="w-4 h-4" />}
                  onClick={() => onNavigate('results')}
                >
                  Explore Phase 1 Leaderboard
                </Button>
              </div>
            </div>

            {/* Key Facts Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] space-y-1">
                <div className="text-[#7E8290] uppercase tracking-wider text-[10px]">EVALUATION WEIGHT</div>
                <div className="text-sm font-bold text-[#DF421A]">0 - 100 Credits Max</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] space-y-1">
                <div className="text-[#7E8290] uppercase tracking-wider text-[10px]">LEAD EVALUATOR</div>
                <div className="text-sm font-bold text-[#14161B]">Nallanesh (10+ Yrs AI/Cyber)</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] space-y-1">
                <div className="text-[#7E8290] uppercase tracking-wider text-[10px]">CAMPUS VENUE</div>
                <div className="text-sm font-bold text-[#156B3F]">KIET Collegiate Campus</div>
              </div>
            </div>
          </div>

          {/* Phase 2 - Upcoming */}
          <div className="bg-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#E8E1D5] space-y-6 opacity-90">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8E1D5]">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="neutral" icon={<Clock className="w-3.5 h-3.5" />}>
                    Phase 2 Upcoming
                  </Badge>
                  <span className="text-xs font-mono text-[#7E8290]">Theme Release Soon</span>
                </div>

                <h2 className="font-display font-bold text-2xl text-[#14161B]">
                  Phase 2 — Autonomous Systems & Agentic Workflows
                </h2>

                <p className="text-sm text-[#5D616F] max-w-2xl leading-relaxed">
                  The second technical milestone of LEVELX. Student teams will engineer distributed multi-agent systems and live tool-calling integrations.
                </p>
              </div>

              <div className="text-xs font-mono text-[#7E8290] shrink-0 font-medium">
                Prerequisites announced shortly
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[#7E8290]">
              <div>• Weight: 0 to 100 Credits</div>
              <div>• Hands-on masterclasses before build phase</div>
            </div>
          </div>

          {/* Phase 3 - Grand Finale */}
          <div className="bg-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#E8E1D5] space-y-6 opacity-85">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8E1D5]">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="neutral" icon={<Clock className="w-3.5 h-3.5" />}>
                    Phase 3 Grand Finale
                  </Badge>
                  <span className="text-xs font-mono text-[#7E8290]">Championship Summit</span>
                </div>

                <h2 className="font-display font-bold text-2xl text-[#14161B]">
                  Phase 3 — Venture Summit & Grand Pitch
                </h2>

                <p className="text-sm text-[#5D616F] max-w-2xl leading-relaxed">
                  The grand culmination of LEVELX where cumulative scores across all 3 phases (out of 300 maximum credits) determine the ultimate collegiate winners.
                </p>
              </div>

              <div className="text-xs font-mono text-[#7E8290] shrink-0 font-medium">
                Series Maximum: 300 Credits
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[#7E8290]">
              <div>• Cumulative 3-Phase Scoring Architecture</div>
              <div>• Direct venture investor presentations</div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
