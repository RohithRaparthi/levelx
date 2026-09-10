import React, { useEffect, useState, useCallback } from 'react';
import { Trophy, Search, ArrowUpDown, Medal, Code, CheckCircle2, ChevronRight, AlertCircle, Building2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { api } from '../api/client';
import type { TeamSummary } from '../types';

interface ResultsPageProps {
  onSelectTeam: (teamId: number) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ onSelectTeam }) => {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('rank');
  const [selectedCollege, setSelectedCollege] = useState<string>('All');

  const fetchResults = useCallback(() => {
    setIsLoading(true);
    api.getTeams({
      college: selectedCollege === 'All' ? undefined : selectedCollege,
      search: search.trim() || undefined,
      sort: sort,
      limit: 100,
    })
      .then((res) => {
        setTeams(res.items);
        setTotal(res.total);
      })
      .catch(() => {
        setTeams([]);
        setTotal(0);
      })
      .finally(() => setIsLoading(false));
  }, [selectedCollege, search, sort]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  // Only evaluated teams with valid rank <= 3 for podium
  const evaluatedTeams = teams.filter(t => t.status !== 'disqualified' && t.score !== null);
  const podiumTeams = evaluatedTeams.filter(t => t.rank && t.rank <= 3).sort((a, b) => (a.rank || 99) - (b.rank || 99));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* 1. EDITORIAL HEADER */}
      <div className="space-y-4 pb-8 border-b border-[#E8E1D5]">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="emerald" pulse icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Official Phase 1 Results
          </Badge>
          <span className="text-xs font-mono text-[#7E8290]">
            {selectedCollege === 'KIET'
              ? 'Conducted at KIET Main Campus'
              : selectedCollege === 'KIET Women'
              ? 'Conducted at KIET Women Campus'
              : 'Conducted across KIET & KIET Women Campuses'}
          </span>
          <span className="text-[#C8C0B2]">•</span>
          <span className="text-xs font-mono text-[#DF421A] font-semibold">0 - 100 Credits Max</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#14161B] tracking-tight">
              Phase 1 Championship Leaderboard
            </h1>
            <p className="text-base text-[#5D616F] mt-2 max-w-2xl leading-relaxed">
              Theme: <span className="text-[#14161B] font-semibold">Retrieval-Augmented Generation (RAG)</span>. Evaluated by Nallanesh (10+ Years AI & Cyber Security Industry Architect).
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-white border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] font-mono text-xs text-[#5D616F]">
            <div className="text-[10px] text-[#7E8290] uppercase tracking-wider">TEAMS RECORDED</div>
            <div className="text-2xl font-bold text-[#14161B] mt-0.5">{total} Teams</div>
          </div>
        </div>
      </div>


      {/* 2. ARCHITECTURAL PODIUM COMPOSITION */}
      {!isLoading && podiumTeams.length >= 3 && !search && (
        <section className="space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-[#DF421A] font-bold flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>PHASE 1 PODIUM FINISHERS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            
            {/* Rank 2 (Silver) */}
            {podiumTeams[1] && (
              <div
                onClick={() => onSelectTeam(podiumTeams[1].id)}
                className="bg-white p-6 rounded-3xl border border-[#D6CDBF] shadow-[0_2px_8px_rgba(20,22,27,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(20,22,27,0.08)] transition-all cursor-pointer group order-2 md:order-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-md bg-[#F2ECE1] text-[#3D404C] text-xs font-mono font-bold flex items-center gap-1.5 border border-[#DFD6C7]">
                    <Medal className="w-3.5 h-3.5 text-[#5D616F]" /> 2nd • Silver
                  </span>
                  {podiumTeams[1].score !== null && (
                    <span className="text-sm font-mono font-bold text-[#14161B]">
                      {podiumTeams[1].score} pts
                    </span>
                  )}
                </div>

                <div className="text-4xl font-black font-display text-[#7E8290] mb-1">02</div>
                
                <h3 className="font-display font-bold text-xl text-[#14161B] group-hover:text-[#DF421A] transition-colors mb-1">
                  {podiumTeams[1].team_name}
                </h3>
                
                {podiumTeams[1].project_name && (
                  <p className="text-xs font-mono text-[#5D616F] line-clamp-1 mb-3">
                    {podiumTeams[1].project_name}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  {podiumTeams[1].college && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold bg-[#FAF7F2] text-[#14161B] border-[#D6CDBF]">
                      {podiumTeams[1].college}
                    </span>
                  )}
                  {podiumTeams[1].award && (
                    <Badge variant="emerald" size="sm">
                      {podiumTeams[1].award}
                    </Badge>
                  )}
                  {podiumTeams[1].department && (
                    <span className="text-[10px] font-mono text-[#7E8290] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E8E1D5]">
                      {podiumTeams[1].department}
                    </span>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8E1D5] text-[11px] font-mono text-[#7E8290] flex items-center justify-between">
                  <span>{podiumTeams[1].members_count} Builders</span>
                  <span className="text-[#14161B] font-semibold group-hover:translate-x-0.5 transition-transform">Inspect Dossier →</span>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold Champion) */}
            {podiumTeams[0] && (
              <div
                onClick={() => onSelectTeam(podiumTeams[0].id)}
                className="bg-[#14161B] text-white p-7 sm:p-8 rounded-3xl border border-[#14161B] shadow-[0_16px_40px_-8px_rgba(20,22,27,0.2)] hover:shadow-[0_24px_50px_-8px_rgba(20,22,27,0.3)] transition-all cursor-pointer group order-1 md:order-2 md:-translate-y-2 relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-md bg-[#DF421A] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(223,66,26,0.3)]">
                    <Trophy className="w-3.5 h-3.5 text-white" /> 1st • Champion
                  </span>
                  {podiumTeams[0].score !== null && (
                    <span className="text-base font-mono font-bold text-[#F8CCBB]">
                      {podiumTeams[0].score} pts
                    </span>
                  )}
                </div>

                <div className="text-5xl font-black font-display text-[#DF421A] mb-1">01</div>

                <h3 className="font-display font-black text-2xl text-white mb-1">
                  {podiumTeams[0].team_name}
                </h3>

                {podiumTeams[0].project_name && (
                  <p className="text-xs font-mono text-[#DF421A] font-medium line-clamp-1 mb-4">
                    {podiumTeams[0].project_name}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  {podiumTeams[0].college && (
                    <span className="text-[10px] font-mono text-white/90 px-2 py-0.5 rounded bg-white/15 border border-white/25 font-bold">
                      {podiumTeams[0].college}
                    </span>
                  )}
                  {podiumTeams[0].award && (
                    <Badge variant="brand" size="sm">
                      {podiumTeams[0].award}
                    </Badge>
                  )}
                  {podiumTeams[0].department && (
                    <span className="text-[10px] font-mono text-white/70 px-2 py-0.5 rounded bg-white/10 border border-white/15">
                      {podiumTeams[0].department}
                    </span>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/15 text-[11px] font-mono text-[#B7BAC6] flex items-center justify-between">
                  <span>{podiumTeams[0].members_count} Builders</span>
                  <span className="text-white font-bold group-hover:translate-x-0.5 transition-transform">Inspect Champion Profile →</span>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {podiumTeams[2] && (
              <div
                onClick={() => onSelectTeam(podiumTeams[2].id)}
                className="bg-white p-6 rounded-3xl border border-[#D6CDBF] shadow-[0_2px_8px_rgba(20,22,27,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(20,22,27,0.08)] transition-all cursor-pointer group order-3"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-md bg-[#FBF5E7] text-[#9A6712] text-xs font-mono font-bold flex items-center gap-1.5 border border-[#EED4A2]">
                    <Medal className="w-3.5 h-3.5 text-[#9A6712]" /> 3rd • Bronze
                  </span>
                  {podiumTeams[2].score !== null && (
                    <span className="text-sm font-mono font-bold text-[#14161B]">
                      {podiumTeams[2].score} pts
                    </span>
                  )}
                </div>

                <div className="text-4xl font-black font-display text-[#7E8290] mb-1">03</div>

                <h3 className="font-display font-bold text-xl text-[#14161B] group-hover:text-[#DF421A] transition-colors mb-1">
                  {podiumTeams[2].team_name}
                </h3>

                {podiumTeams[2].project_name && (
                  <p className="text-xs font-mono text-[#5D616F] line-clamp-1 mb-3">
                    {podiumTeams[2].project_name}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  {podiumTeams[2].college && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold bg-[#FAF7F2] text-[#14161B] border-[#D6CDBF]">
                      {podiumTeams[2].college}
                    </span>
                  )}
                  {podiumTeams[2].award && (
                    <Badge variant="amber" size="sm">
                      {podiumTeams[2].award}
                    </Badge>
                  )}
                  {podiumTeams[2].department && (
                    <span className="text-[10px] font-mono text-[#7E8290] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E8E1D5]">
                      {podiumTeams[2].department}
                    </span>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8E1D5] text-[11px] font-mono text-[#7E8290] flex items-center justify-between">
                  <span>{podiumTeams[2].members_count} Builders</span>
                  <span className="text-[#14161B] font-semibold group-hover:translate-x-0.5 transition-transform">Inspect Dossier →</span>
                </div>
              </div>
            )}

          </div>
        </section>
      )}


      {/* 3. TOOLBAR CONTROLS WITH COLLEGE FILTER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] space-y-4">
        
        {/* College Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#7E8290]">
            <Building2 className="w-4 h-4 text-[#DF421A]" />
            <span className="uppercase font-bold tracking-wider text-[11px]">COLLEGE COHORT:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'All', label: 'All Cohorts', badge: '60' },
                { id: 'KIET', label: 'KIET', badge: '29' },
                { id: 'KIET Women', label: 'KIET Women', badge: '31' },
              ].map((col) => {
                const active = selectedCollege === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedCollege(col.id)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#14161B] text-white shadow-sm'
                        : 'bg-[#FAF7F2] text-[#5D616F] hover:text-[#14161B] border border-[#E8E1D5]'
                    }`}
                  >
                    <span>{col.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                        active ? 'bg-white/20 text-white' : 'bg-[#E8E1D5] text-[#5D616F]'
                      }`}
                    >
                      {col.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dropdown Selector */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#E8E1D5]">
              <label htmlFor="college-select" className="text-xs font-mono text-[#7E8290] hidden sm:inline">
                Dropdown:
              </label>
              <select
                id="college-select"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                aria-label="Filter teams by college"
                className="px-3 py-1.5 bg-[#FAF7F2] border border-[#D6CDBF] rounded-xl text-xs font-mono text-[#14161B] font-semibold focus:outline-none focus:border-[#14161B] cursor-pointer"
              >
                <option value="All">All Cohorts (Combined 60)</option>
                <option value="KIET">🏛️ KIET (Main Campus — 29)</option>
                <option value="KIET Women">🏛️ KIET Women (Campus — 31)</option>
              </select>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#7E8290] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by team name, department or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#D6CDBF] rounded-xl text-xs sm:text-sm text-[#14161B] placeholder-[#7E8290] focus:outline-none focus:border-[#14161B] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7E8290]">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 bg-[#FAF7F2] border border-[#D6CDBF] rounded-xl text-xs font-mono text-[#14161B] focus:outline-none focus:border-[#14161B] cursor-pointer"
            >
              <option value="rank">Rank (Ascending)</option>
              <option value="-score">Score (Highest First)</option>
              <option value="score">Score (Lowest First)</option>
              <option value="team_name">Team Name (A-Z)</option>
            </select>

            <Button size="sm" variant="primary" type="submit">
              Apply
            </Button>
          </div>

        </form>
      </div>


      {/* 4. EDITORIAL LEADERBOARD RESULTS BOARD */}
      <section className="space-y-3">
        {isLoading ? (
          <LoadingSpinner label="Loading competition results board..." />
        ) : teams.length === 0 ? (
          <EmptyState
            title="No Teams Found"
            description={search ? `No teams match "${search}". Try resetting your filter.` : 'Official Phase 1 scoring records will appear here.'}
            icon="search"
            action={search ? <Button size="sm" variant="secondary" onClick={() => { setSearch(''); fetchResults(); }}>Reset Search</Button> : undefined}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8E1D5] divide-y divide-[#E8E1D5] overflow-hidden shadow-[0_2px_8px_rgba(20,22,27,0.04)]">
            
            {/* Header Row */}
            <div className="hidden sm:grid grid-cols-12 px-6 py-3.5 bg-[#F4EDE2] font-mono text-[11px] text-[#7E8290] uppercase tracking-wider font-semibold">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Team & Project Title</div>
              <div className="col-span-3">Department / Status</div>
              <div className="col-span-2 text-right">Score / 100</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Team Rows */}
            {teams.map((team) => {
              const isDisqualified = team.status === 'disqualified';
              return (
                <div
                  key={team.id}
                  onClick={() => onSelectTeam(team.id)}
                  className={`grid grid-cols-1 sm:grid-cols-12 px-6 py-4.5 items-center gap-3 hover:bg-[#FAF7F2] transition-colors cursor-pointer group ${
                    isDisqualified ? 'bg-red-50/20' : ''
                  }`}
                >
                  {/* Rank Index */}
                  <div className="col-span-1 flex items-center gap-3">
                    <span className="font-mono text-base font-black text-[#14161B]">
                      {isDisqualified ? '--' : team.rank ? (team.rank < 10 ? `0${team.rank}` : team.rank) : '--'}
                    </span>
                  </div>

                  {/* Team & Project Title */}
                  <div className="col-span-5 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-base text-[#14161B] group-hover:text-[#DF421A] transition-colors">
                        {team.team_name}
                      </h4>
                      {team.college && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                            team.college === 'KIET'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {team.college}
                        </span>
                      )}
                    </div>

                    {team.project_name && (
                      <div className="text-xs font-mono text-[#5D616F] flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-[#7E8290]" />
                        <span>{team.project_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Department / Award / Disqualified status */}
                  <div className="col-span-3 space-y-1">
                    {isDisqualified ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-mono font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Disqualified</span>
                      </div>
                    ) : team.award ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="emerald" size="sm">
                          {team.award}
                        </Badge>
                        {team.department && (
                          <span className="text-[10px] font-mono text-[#7E8290]">
                            {team.department}
                          </span>
                        )}
                      </div>
                    ) : team.department ? (
                      <span className="text-xs font-mono text-[#7E8290]">{team.department}</span>
                    ) : (
                      <span className="text-xs font-mono text-[#7E8290]">Participant</span>
                    )}

                    {isDisqualified && team.evaluator_notes && (
                      <div className="text-[11px] font-mono text-red-600">
                        {team.evaluator_notes}
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-left sm:text-right font-mono">
                    {isDisqualified ? (
                      <span className="text-xs font-mono text-red-600 font-medium">N/A</span>
                    ) : team.score !== null && team.score !== undefined ? (
                      <div>
                        <span className="text-base font-bold text-[#14161B]">{team.score}</span>
                        <span className="text-xs text-[#7E8290]"> / 100</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#7E8290]">Pending</span>
                    )}
                  </div>

                  {/* Inspect Link */}
                  <div className="col-span-1 text-left sm:text-right">
                    <span className="text-xs font-mono text-[#DF421A] font-semibold group-hover:translate-x-1 inline-flex items-center gap-0.5 transition-transform">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </div>
              );
            })}

          </div>
        )}
      </section>

    </div>
  );
};
