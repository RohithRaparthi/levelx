import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ALL_PHASE1_PHOTOS } from '../components/common/CinematicPhotoReel';
import { api } from '../api/client';
import type { PhaseSummary, TeamSummary, ProjectItem, PageView } from '../types';

interface HomePageProps {
  onNavigate: (view: PageView) => void;
  onSelectTeam: (teamId: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectTeam }) => {
  const [phases, setPhases] = useState<PhaseSummary[]>([]);
  const [topTeams, setTopTeams] = useState<TeamSummary[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Hero Live Reel state
  const [heroPhotoIndex, setHeroPhotoIndex] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.getPhases().catch(() => []),
      api.getTeams({ limit: 4, sort: 'rank' }).then(res => res.items).catch(() => []),
      api.getProjects({ limit: 4 }).then(res => res.items).catch(() => []),
    ]).then(([phasesData, teamsData, projectsData]) => {
      setPhases(phasesData);
      setTopTeams(teamsData);
      setFeaturedProjects(projectsData);
    }).finally(() => setIsLoading(false));
  }, []);

  // Auto-advance hero photo slideshow smoothly every 2.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroPhotoIndex((prev) => (prev + 1) % ALL_PHASE1_PHOTOS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const phase1 = phases.find(p => p.name.toLowerCase().includes('phase 1')) || phases[0];
  const totalTeamsCount = phases.reduce((acc, curr) => acc + curr.teams_count, 0);
  const currentHeroPhoto = ALL_PHASE1_PHOTOS[heroPhotoIndex];

  return (
    <div className="space-y-24 py-6 sm:py-10">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E1D5] mb-10">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded bg-[#14161B] text-white text-[11px] font-mono font-bold tracking-wider uppercase">
              COHORT 2026
            </span>
            <span className="text-xs font-mono text-[#5D616F]">
              KIET Collegiate Innovation Arena • By XFACTOR
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#156B3F] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#156B3F]" />
            <span>Phase 1 Completed & Evaluated</span>
          </div>
        </div>

        {/* Split Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Narrative Block */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Mission Movement Tag */}
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#DF421A] flex items-center gap-2.5">
              <span>BUILD</span>
              <span className="text-[#C8C0B2]">→</span>
              <span>COMPETE</span>
              <span className="text-[#C8C0B2]">→</span>
              <span>GROW</span>
            </div>

            {/* Oversized Headline */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#14161B] tracking-tight leading-[1.05]">
              A Student Innovation Journey.
            </h1>

            <p className="text-base sm:text-lg text-[#484B56] leading-relaxed max-w-xl font-normal">
              Where collegiate engineers, researchers, and creators build breakthrough technologies through progressive engineering challenges under veteran industry evaluation.
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('results')}
                className="px-6 py-3.5 rounded-2xl bg-[#DF421A] text-white font-semibold text-sm hover:bg-[#C83812] shadow-[0_2px_8px_rgba(223,66,26,0.25)] flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Explore Phase 1 Leaderboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('highlights')}
                className="px-5 py-3.5 rounded-2xl bg-white text-[#14161B] font-semibold text-sm hover:bg-[#FAF7F2] border border-[#D6CDBF] shadow-[0_1px_3px_rgba(20,22,27,0.06)] flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>View Event Highlights</span>
                <ArrowUpRight className="w-4 h-4 text-[#7E8290]" />
              </button>
            </div>

            {/* Inset Metric Strip */}
            <div className="pt-6 grid grid-cols-3 gap-3.5 border-t border-[#E8E1D5] font-mono">
              <div className="p-3.5 rounded-2xl bg-[#F4EDE2] border border-[#E5DECة]">
                <div className="text-[10px] text-[#7E8290] uppercase tracking-wider">SERIES PHASES</div>
                <div className="text-base font-bold text-[#14161B] mt-0.5">3 Phases</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4EDE2] border border-[#E5DECة]">
                <div className="text-[10px] text-[#7E8290] uppercase tracking-wider">PHASE 1 ENROLLED</div>
                <div className="text-base font-bold text-[#DF421A] mt-0.5">
                  {phase1 ? `${phase1.teams_count} Teams` : `${totalTeamsCount} Teams`}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4EDE2] border border-[#E5DECة]">
                <div className="text-[10px] text-[#7E8290] uppercase tracking-wider">MAX CREDITS</div>
                <div className="text-base font-bold text-[#156B3F] mt-0.5">300 Credits</div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual / Interactive 3D Slow-Moving Slideshow Card */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="relative rounded-3xl overflow-hidden border border-[#D6CDBF] shadow-[0_16px_40px_-8px_rgba(20,22,27,0.18)] aspect-[4/3] bg-[#14161B] group">
              
              {/* Animated 3D Slow Ken-Burns Image Slide */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHeroPhoto.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0 w-full h-full overflow-hidden"
                >
                  <motion.img
                    src={currentHeroPhoto.imageSrc}
                    alt={currentHeroPhoto.title}
                    initial={{ scale: 1.18, x: -10, y: 5 }}
                    animate={{ scale: 1.03, x: 0, y: 0 }}
                    transition={{ duration: 3.2, ease: 'linear' }}
                    className="w-full h-full object-cover object-center transform-gpu"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14161B]/95 via-[#14161B]/25 to-transparent pointer-events-none" />
              
              {/* Top Navigation Strip in Hero */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#DF421A] text-white text-[10px] font-mono font-bold uppercase shadow-sm">
                    {currentHeroPhoto.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#14161B]/70 text-white text-[10px] font-mono backdrop-blur-sm border border-white/20">
                    {heroPhotoIndex + 1} / {ALL_PHASE1_PHOTOS.length}
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('highlights')}
                  className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black backdrop-blur-sm transition-colors cursor-pointer"
                  title="Explore All Highlights"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 inset-x-5 text-white space-y-1 z-10 pointer-events-none">
                <h3 className="font-display font-bold text-base sm:text-lg text-white drop-shadow-md line-clamp-1">
                  {currentHeroPhoto.title}
                </h3>
                <p className="text-xs text-[#E2E5F0] drop-shadow-sm font-mono line-clamp-1">
                  {currentHeroPhoto.location}
                </p>
              </div>

              {/* Prev / Next Quick Nav Controls */}
              <button
                onClick={() => setHeroPhotoIndex((prev) => (prev - 1 + ALL_PHASE1_PHOTOS.length) % ALL_PHASE1_PHOTOS.length)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setHeroPhotoIndex((prev) => (prev + 1) % ALL_PHASE1_PHOTOS.length)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

            </div>

            {/* Quick Status Slab */}
            <div className="bg-[#14161B] text-white rounded-2xl p-5 border border-[#14161B] flex items-center justify-between font-mono text-xs">
              <div className="space-y-0.5">
                <div className="text-[10px] text-[#8C90A0] uppercase">Lead Evaluator</div>
                <div className="font-bold text-white text-sm">Nallanesh (10+ Yrs AI/Cyber)</div>
              </div>
              <button
                onClick={() => onNavigate('results')}
                className="text-xs text-[#DF421A] font-bold hover:underline cursor-pointer"
              >
                View Scores →
              </button>
            </div>

          </div>

        </div>

      </section>


      {/* 2. THE 3-PHASE JOURNEY PROGRESSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#14161B] text-white rounded-3xl p-8 sm:p-12 border border-[#14161B] shadow-[0_16px_40px_-8px_rgba(20,22,27,0.2)] space-y-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 border-b border-white/10 gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#DF421A] font-bold">
                03 PHASES • 300 CREDITS • ONE JOURNEY
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white">
                The Cumulative Series Architecture
              </h2>
            </div>

            <p className="text-sm text-[#B7BAC6] max-w-md leading-relaxed font-normal">
              Every phase carries up to 100 credits awarded based on technical architecture, system design, innovation, and presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            
            {/* Phase 1 */}
            <div
              onClick={() => onNavigate('results')}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#DF421A] transition-colors cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#DF421A]">01 • PHASE 1</span>
                <Badge variant="emerald" size="sm">Completed</Badge>
              </div>
              <h3 className="font-display font-bold text-xl text-white group-hover:text-[#F8CCBB] transition-colors">
                Retrieval-Augmented Generation
              </h3>
              <p className="text-xs text-[#8C90A0] font-sans leading-relaxed">
                Vector databases, contextual prompt augmentation, and grounded AI systems evaluated by Nallanesh.
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#DF421A] font-bold">
                <span>100 Credits Max</span>
                <span>View Results →</span>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C90A0]">02 • PHASE 2</span>
                <Badge variant="neutral" size="sm">Coming Soon</Badge>
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Autonomous Systems & Deep Tech
              </h3>
              <p className="text-xs text-[#8C90A0] font-sans leading-relaxed">
                Multi-agent orchestration, tool-calling pipelines, and live domain integrations.
              </p>
              <div className="pt-3 border-t border-white/10 text-xs text-[#8C90A0]">
                100 Credits Max
              </div>
            </div>

            {/* Phase 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C90A0]">03 • PHASE 3</span>
                <Badge variant="neutral" size="sm">Coming Soon</Badge>
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Venture Summit & Grand Pitch
              </h3>
              <p className="text-xs text-[#8C90A0] font-sans leading-relaxed">
                Comprehensive 3-phase cumulative evaluation, national demo day, and investor pitching.
              </p>
              <div className="pt-3 border-t border-white/10 text-xs text-[#8C90A0]">
                Series Total: 300 Credits
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 3. RESULTS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E8E1D5] gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#DF421A] font-bold">
              OFFICIAL RANKINGS & SCORES
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#14161B] tracking-tight">
              The Work Was Done. The Results Remain.
            </h2>
          </div>

          <button
            onClick={() => onNavigate('results')}
            className="text-xs font-mono text-[#DF421A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Full Phase 1 Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner label="Loading Phase 1 rankings..." />
        ) : topTeams.length === 0 ? (
          <EmptyState
            title="Phase 1 Records Live Soon"
            description="Leaderboard scores will appear here as soon as official scores are synchronized."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topTeams.map((team) => (
              <div
                key={team.id}
                onClick={() => onSelectTeam(team.id)}
                className="bg-white p-6 rounded-3xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(20,22,27,0.08)] hover:border-[#D6CDBF] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded bg-[#FAF7F2] text-[#14161B] text-xs font-mono font-bold border border-[#E5DECة]">
                      #{team.rank ?? '-'}
                    </span>

                    {team.score !== null && team.score !== undefined && (
                      <span className="text-xs font-mono font-bold text-[#DF421A]">
                        {team.score} <span className="text-[10px] text-[#7E8290]">pts</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#14161B] group-hover:text-[#DF421A] transition-colors line-clamp-1">
                    {team.team_name}
                  </h3>

                  {team.project_name && (
                    <p className="text-xs text-[#5D616F] mt-1 font-mono line-clamp-1">
                      {team.project_name}
                    </p>
                  )}

                  {team.award && (
                    <div className="mt-3">
                      <Badge variant="emerald" size="sm">
                        {team.award}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8E1D5] flex items-center justify-between text-[11px] font-mono text-[#7E8290]">
                  <span>{team.members_count} {team.members_count === 1 ? 'builder' : 'builders'}</span>
                  <span className="text-[#14161B] font-semibold group-hover:translate-x-0.5 transition-transform">Inspect →</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>


      {/* 4. STUDENT PROJECT EXHIBITION SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E8E1D5] gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#7E8290] font-bold">
                WORKING PROTOTYPES
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#14161B] mt-1">
                Student Project Exhibition
              </h2>
            </div>

            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-mono text-[#DF421A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isLoading ? (
            <LoadingSpinner label="Fetching project exhibition..." />
          ) : featuredProjects.length === 0 ? (
            <EmptyState
              title="Exhibition Catalog Syncing"
              description="Student code repositories and prototypes will appear here once verified."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredProjects.map((project) => (
                <div
                  key={project.team_id}
                  onClick={() => onSelectTeam(project.team_id)}
                  className="bg-white p-6 rounded-2xl border border-[#E8E1D5] hover:border-[#D6CDBF] shadow-[0_1px_3px_rgba(20,22,27,0.04)] hover:shadow-[0_6px_20px_-2px_rgba(20,22,27,0.06)] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#7E8290] mb-2">
                      <span className="uppercase tracking-wider font-semibold">{project.team_name}</span>
                      {project.score !== null && (
                        <span className="font-bold text-[#14161B]">{project.score} Credits</span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#14161B] group-hover:text-[#DF421A] transition-colors mb-2">
                      {project.project_name}
                    </h3>

                    {project.project_description && (
                      <p className="text-xs sm:text-sm text-[#5D616F] leading-relaxed line-clamp-2 mb-4">
                        {project.project_description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#7E8290]">Phase 1 Prototype</span>
                    <span className="text-[#DF421A] font-semibold group-hover:translate-x-0.5 transition-transform">
                      View Project Dossier →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* 5. FINAL DECLARATION & CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-white border border-[#D6CDBF] shadow-[0_4px_24px_-2px_rgba(20,22,27,0.06)] text-center space-y-6">
          <Badge variant="brand" size="md">
            JOIN THE MOVEMENT
          </Badge>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#14161B] tracking-tight max-w-3xl mx-auto leading-tight">
            The Next Level is Yours.
          </h2>

          <p className="text-base sm:text-lg text-[#5D616F] max-w-xl mx-auto leading-relaxed">
            Explore the collegiate projects, review the official Phase 1 standings, and prepare for the next technical challenges.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('results')}
              className="px-6 py-3.5 rounded-2xl bg-[#14161B] text-white font-semibold text-sm hover:bg-[#DF421A] transition-colors shadow-[0_2px_8px_rgba(20,22,27,0.15)] cursor-pointer"
            >
              View Phase 1 Leaderboard
            </button>

            <button
              onClick={() => onNavigate('projects')}
              className="px-6 py-3.5 rounded-2xl bg-[#FAF7F2] text-[#14161B] font-semibold text-sm hover:bg-white border border-[#D6CDBF] transition-colors cursor-pointer"
            >
              Browse Student Projects
            </button>

            <button
              onClick={() => onNavigate('journey')}
              className="px-6 py-3.5 rounded-2xl bg-transparent text-[#5D616F] hover:text-[#14161B] font-semibold text-sm transition-colors cursor-pointer"
            >
              Explore 3-Phase Journey →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
