import React from 'react';
import { Target, Users, Award } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3 pb-8 border-b border-[#E8E1D5]">
        <Badge variant="brand" size="md">
          ABOUT LEVELX × XFACTOR
        </Badge>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#14161B] tracking-tight">
          Empowering The Next Wave of Student Builders
        </h1>
        <p className="text-base text-[#5D616F] leading-relaxed">
          LEVELX is the flagship student innovation ecosystem powered by XFACTOR, established to bridge the gap between collegiate academic learning and high-velocity engineering.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] space-y-3">
          <div className="p-3 rounded-2xl bg-[#FDF2EC] text-[#DF421A] w-fit border border-[#F8CCBB]">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#14161B]">
            Practical Engineering
          </h3>
          <p className="text-xs sm:text-sm text-[#5D616F] leading-relaxed">
            We focus on tangible engineering challenges with practical themes (RAG, Multi-Agent Systems, Deep Tech) instead of abstract slides.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] space-y-3">
          <div className="p-3 rounded-2xl bg-[#EEF7F1] text-[#156B3F] w-fit border border-[#BEE2CD]">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#14161B]">
            Veteran Industry Critique
          </h3>
          <p className="text-xs sm:text-sm text-[#5D616F] leading-relaxed">
            Student projects are evaluated by working technology architects and industry leads who provide direct, actionable code reviews.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] space-y-3">
          <div className="p-3 rounded-2xl bg-[#F0F3FA] text-[#29487D] w-fit border border-[#CCD8ED]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#14161B]">
            Zero Equity Model
          </h3>
          <p className="text-xs sm:text-sm text-[#5D616F] leading-relaxed">
            LEVELX takes zero equity. All awards, computing credits, and grants go directly to empowering student builders.
          </p>
        </div>
      </div>

      {/* Evaluator Spotlight */}
      <div className="bg-[#14161B] text-white p-8 sm:p-10 rounded-3xl border border-[#14161B] shadow-[0_16px_40px_-8px_rgba(20,22,27,0.2)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <Badge variant="brand" size="sm">
              Phase 1 Lead Evaluator
            </Badge>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Nallanesh
            </h2>
            <div className="text-xs font-mono text-[#F8CCBB]">
              AI Professional & Cyber Security Lead • 10+ Years Industry Experience
            </div>
            <p className="text-sm text-[#B7BAC6] leading-relaxed pt-2">
              Served as the lead technical evaluator for Phase 1 (RAG), assessing teams on pipeline design, vector search accuracy, grounding robustness, hallucination prevention, and overall innovation quality.
            </p>
          </div>

          <div className="md:col-span-4 p-5 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-[#8C90A0] space-y-2">
            <div className="text-white font-semibold">Evaluation Criteria:</div>
            <div>• Technical Architecture (30%)</div>
            <div>• RAG Pipeline & Retrieval (30%)</div>
            <div>• Problem Solving & UX (20%)</div>
            <div>• Presentation & Teamwork (20%)</div>
          </div>
        </div>
      </div>

      {/* Institutional Context */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] font-mono text-xs text-[#7E8290] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          Presented by <span className="text-[#14161B] font-semibold">XFACTOR</span> • Hosted at <span className="text-[#14161B] font-semibold">KIET Collegiate Campus</span>
        </div>
        <div className="text-[#5D616F]">
          Phase 1 Complete • Series Maximum 300 Credits
        </div>
      </div>

    </div>
  );
};
