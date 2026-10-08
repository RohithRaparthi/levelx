import React, { useEffect, useState, useCallback } from 'react';
import { Search, ExternalLink, Code, ArrowRight, ArrowUpRight, Building2, Layers } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { api } from '../api/client';
import type { ProjectItem } from '../types';

interface ProjectsPageProps {
  onSelectTeam: (teamId: number) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectTeam }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedPhase, setSelectedPhase] = useState<number | 'All'>('All');
  const [selectedCollege, setSelectedCollege] = useState<string>('All');

  const fetchProjects = useCallback(() => {
    setIsLoading(true);
    api.getProjects({
      phase_id: selectedPhase === 'All' ? undefined : selectedPhase,
      college: selectedCollege === 'All' ? undefined : selectedCollege,
      search: search.trim() || undefined,
      limit: 100,
    })
      .then((res) => {
        setProjects(res.items);
        setTotal(res.total);
      })
      .catch(() => {
        setProjects([]);
        setTotal(0);
      })
      .finally(() => setIsLoading(false));
  }, [selectedPhase, selectedCollege, search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const featuredProject = projects.length > 0 ? projects[0] : null;
  const standardProjects = projects.length > 0 ? projects.slice(1) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8E1D5]">
        <div className="space-y-3">
          <Badge variant="brand" size="md">
            STUDENT EXHIBITION DIRECTORY
          </Badge>
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#14161B] tracking-tight">
            Collegiate Innovation Projects
          </h1>
          <p className="text-base text-[#5D616F] max-w-2xl leading-relaxed">
            Exhibition of technical prototypes, RAG engines, vector search pipelines, and real business chatbot systems built by collegiate teams across LEVELX phases.
          </p>
        </div>

        <div className="shrink-0 font-mono text-xs text-[#5D616F] p-4 rounded-2xl bg-white border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)]">
          <span className="text-[#7E8290]">Total Submissions:</span>{' '}
          <span className="font-bold text-[#14161B] text-sm">{total} Projects</span>
        </div>
      </div>

      {/* 2. Phase & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] space-y-4">
        
        {/* Phase Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#7E8290]">
            <Layers className="w-4 h-4 text-[#DF421A]" />
            <span className="uppercase font-bold tracking-wider text-[11px]">HACKATHON PHASE:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'All', label: 'All Phases' },
              { id: 1, label: 'Phase 1 (RAG)' },
              { id: 2, label: 'Phase 2 (Real Business & Chatbots)' },
            ].map((ph) => {
              const active = selectedPhase === ph.id;
              return (
                <button
                  key={String(ph.id)}
                  type="button"
                  onClick={() => {
                    setSelectedPhase(ph.id as number | 'All');
                    if (ph.id === 2) setSelectedCollege('All');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#14161B] text-white shadow-sm'
                      : 'bg-[#FAF7F2] text-[#5D616F] hover:text-[#14161B] border border-[#E8E1D5]'
                  }`}
                >
                  <span>{ph.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Campus Filter Strip for Phase 1 */}
        {selectedPhase === 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E1D5]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7E8290]">
              <Building2 className="w-4 h-4 text-[#DF421A]" />
              <span className="uppercase font-bold tracking-wider text-[11px]">CAMPUS:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'All', label: 'All Campuses' },
                { id: 'KIET', label: 'KIET Main Campus' },
                { id: 'KIET Women', label: 'KIET Women Campus' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCollege(c.id)}
                  className={`px-3 py-1 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                    selectedCollege === c.id
                      ? 'bg-[#14161B] text-white font-bold'
                      : 'bg-[#FAF7F2] text-[#5D616F] hover:text-[#14161B] border border-[#E8E1D5]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-lg">
            <Search className="w-4 h-4 text-[#7E8290] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project title, abstract, leader or team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#D6CDBF] rounded-xl text-xs sm:text-sm text-[#14161B] placeholder-[#7E8290] focus:outline-none focus:border-[#14161B] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button size="sm" variant="primary" type="submit">
              Search Exhibition
            </Button>
            {search && (
              <Button size="sm" variant="ghost" type="button" onClick={() => { setSearch(''); fetchProjects(); }}>
                Reset
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* 3. Featured Showcase Project */}
      {!isLoading && featuredProject && !search && (
        <div
          onClick={() => onSelectTeam(featuredProject.team_id)}
          className="bg-[#14161B] text-white p-8 sm:p-10 rounded-3xl border border-[#14161B] shadow-[0_16px_40px_-8px_rgba(20,22,27,0.2)] hover:shadow-[0_24px_50px_-8px_rgba(20,22,27,0.28)] transition-all cursor-pointer group space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-[#DF421A] text-white text-xs font-mono font-bold">
                FEATURED SPOTLIGHT
              </span>
              <span className="text-xs font-mono text-[#B7BAC6]">
                By {featuredProject.team_name}
              </span>
            </div>

            {featuredProject.score !== null && (
              <span className="text-sm font-mono font-bold text-[#F8CCBB]">
                {featuredProject.score} Credits
              </span>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white group-hover:text-[#F8CCBB] transition-colors">
              {featuredProject.project_name}
            </h2>

            {featuredProject.project_description && (
              <p className="text-sm sm:text-base text-[#B7BAC6] leading-relaxed max-w-3xl">
                {featuredProject.project_description}
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {featuredProject.room && (
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded border font-semibold bg-white/15 text-white border-white/25">
                  {featuredProject.room}
                </span>
              )}
              {featuredProject.college && (
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded border font-semibold bg-white/15 text-white border-white/25">
                  {featuredProject.college}
                </span>
              )}
              {featuredProject.phase_name && (
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white/10 text-white/80">
                  {featuredProject.phase_name}
                </span>
              )}
              {(featuredProject.grade || featuredProject.award) && (
                <Badge variant="brand" size="sm">
                  {featuredProject.grade || featuredProject.award}
                </Badge>
              )}
              {featuredProject.rank && (
                <span className="text-xs font-mono text-[#8C90A0]">
                  Rank #{featuredProject.rank}
                </span>
              )}
            </div>

            <span className="text-xs font-mono font-bold text-white group-hover:text-[#DF421A] flex items-center gap-1.5 transition-colors">
              <span>Inspect Full Project Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* 4. Exhibition Project Directory */}
      <section className="space-y-4">
        {isLoading ? (
          <LoadingSpinner label="Loading student project catalog..." />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No Projects Found"
            description={search ? `No projects match "${search}". Try searching with another keyword.` : 'Student project submissions will appear here once verified.'}
            icon="search"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(search ? projects : standardProjects).map((project, idx) => (
              <div
                key={project.team_id}
                onClick={() => onSelectTeam(project.team_id)}
                className="bg-white p-7 rounded-3xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(20,22,27,0.08)] hover:border-[#D6CDBF] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-[#7E8290]">
                      PROJECT #{search ? idx + 1 : idx + 2}
                    </span>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {project.room && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] text-[#DF421A] border border-[#E8E1D5] font-semibold">
                          {project.room}
                        </span>
                      )}
                      {project.college && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                            project.college === 'KIET'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {project.college}
                        </span>
                      )}
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#5D616F] font-semibold truncate max-w-[160px]">
                        {project.team_name}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-[#14161B] group-hover:text-[#DF421A] transition-colors mb-2.5">
                    {project.project_name}
                  </h3>

                  {project.project_description && (
                    <p className="text-xs sm:text-sm text-[#5D616F] leading-relaxed line-clamp-3 mb-6">
                      {project.project_description}
                    </p>
                  )}
                </div>

                <div className="space-y-4 pt-5 border-t border-[#E8E1D5]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    {project.score !== null && project.score !== undefined ? (
                      <span className="text-[#14161B] font-bold">{project.score} Credits</span>
                    ) : (
                      <span className="text-[#7E8290]">Evaluated</span>
                    )}

                    {(project.grade || project.award) && (
                      <Badge variant={(project.grade || project.award) === 'Top Performer' ? 'brand' : 'emerald'} size="sm">
                        {project.grade || project.award}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#5D616F]">
                      {project.leader_name && (
                        <span className="text-[11px] font-mono text-[#7E8290]">
                          Lead: {project.leader_name}
                        </span>
                      )}
                      {project.github_url && (
                        <span className="flex items-center gap-1 hover:text-[#14161B]">
                          <Code className="w-3.5 h-3.5" /> Source
                        </span>
                      )}
                      {project.demo_url && (
                        <span className="flex items-center gap-1 text-[#DF421A] hover:underline">
                          <ExternalLink className="w-3.5 h-3.5" /> Demo
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-mono text-[#14161B] font-semibold group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                      <span>Dossier</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
