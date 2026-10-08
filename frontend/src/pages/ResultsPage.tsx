import React, { useEffect, useState, useCallback } from 'react';
import {
  Trophy, Search, ArrowUpDown, Medal, Code, CheckCircle2,
  ChevronRight, AlertCircle, Building2, Layers, Sparkles
} from 'lucide-react';
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
  const [selectedPhase, setSelectedPhase] = useState<number>(2); // Default to Phase 2, toggleable
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('rank');
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedRoom, setSelectedRoom] = useState<string>('All');

  const fetchResults = useCallback(() => {
    setIsLoading(true);
    api.getTeams({
      phase_id: selectedPhase,
      college: selectedPhase === 1 && selectedCollege !== 'All' ? selectedCollege : undefined,
      search: search.trim() || undefined,
      sort: sort,
      limit: 100,
    })
      .then((res) => {
        let items = res.items;
        if (selectedPhase === 2 && selectedRoom !== 'All') {
          items = items.filter(t => t.room === selectedRoom);
        }
        setTeams(items);
        setTotal(selectedPhase === 2 && selectedRoom !== 'All' ? items.length : res.total);
      })
      .catch(() => {
        setTeams([]);
        setTotal(0);
      })
      .finally(() => setIsLoading(false));
  }, [selectedPhase, selectedCollege, selectedRoom, search, sort]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  // Evaluated teams with valid score for podium
  const evaluatedTeams = teams.filter(t => t.status !== 'disqualified' && t.score !== null);
  const podiumTeams = evaluatedTeams.filter(t => t.rank && t.rank <= 3).sort((a, b) => (a.rank || 99) - (b.rank || 99));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* 0. PHASE SELECTOR STRIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white rounded-3xl border border-[#E8E1D5] shadow-[0_2px_8px_rgba(20,22,27,0.04)]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#DF421A] ml-2" />
          <span className="text-xs font-mono font-bold text-[#14161B] uppercase tracking-wider">
            Select Hackathon Phase:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setSelectedPhase(1); setSelectedRoom('All'); }}
            className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedPhase === 1
                ? 'bg-[#14161B] text-white shadow-sm'
                : 'bg-[#FAF7F2] text-[#5D616F] hover:text-[#14161B] border border-[#E8E1D5]'
            }`}
          >
            <span>Phase 1 — RAG Architecture</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedPhase === 1 ? 'bg-white/20 text-white' : 'bg-[#E8E1D5] text-[#5D616F]'}`}>
              60 Teams
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedPhase(2); setSelectedCollege('All'); }}
            className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedPhase === 2
                ? 'bg-[#DF421A] text-white shadow-sm'
                : 'bg-[#FAF7F2] text-[#5D616F] hover:text-[#14161B] border border-[#E8E1D5]'
            }`}
          >
            <span>Phase 2 — Real Business & Chatbots</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedPhase === 2 ? 'bg-white/20 text-white' : 'bg-[#E8E1D5] text-[#5D616F]'}`}>
              47 Teams
            </span>
          </button>
        </div>
      </div>

      {/* 1. EDITORIAL HEADER */}
      <div className="space-y-4 pb-8 border-b border-[#E8E1D5]">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={selectedPhase === 2 ? 'brand' : 'emerald'} pulse icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Official Phase {selectedPhase} Results
          </Badge>
          <span className="text-xs font-mono text-[#7E8290]">
            {selectedPhase === 1
              ? (selectedCollege === 'KIET'
                  ? 'Conducted at KIET Main Campus'
                  : selectedCollege === 'KIET Women'
                  ? 'Conducted at KIET Women Campus'
                  : 'Conducted across KIET & KIET Women Campuses')
              : 'Conducted across Room 1, Room 2, Room 3, Room 4 & Room A-304'}
          </span>
          <span className="text-[#C8C0B2]">•</span>
          <span className="text-xs font-mono text-[#DF421A] font-semibold">0 - 100 Credits Max</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#14161B] tracking-tight">
              Phase {selectedPhase} Championship Leaderboard
            </h1>
            <p className="text-base text-[#5D616F] mt-2 max-w-2xl leading-relaxed">
              {selectedPhase === 1 ? (
                <>Theme: <span className="text-[#14161B] font-semibold">Retrieval-Augmented Generation (RAG)</span>. Evaluated by Nallanesh (10+ Years AI & Cyber Security Industry Architect).</>
              ) : (
                <>Theme: <span className="text-[#14161B] font-semibold">Real Business Applications & AI Chatbots</span>. Official evaluation across 6 criteria: Real Business (15), Chatbot & RAG (25), Database (15), Platform (20), Team Stack (15), Presentation (10).</>
              )}
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-white border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] font-mono text-xs text-[#5D616F]">
            <div className="text-[10px] text-[#7E8290] uppercase tracking-wider">TEAMS RECORDED</div>
            <div className="text-2xl font-bold text-[#14161B] mt-0.5">{total} Teams</div>
          </div>
        </div>

        {/* Phase 2 Official Grading Scale Banner */}
        {selectedPhase === 2 && (
          <div className="flex flex-wrap items-center gap-3 pt-3 font-mono text-xs">
            <span className="text-[#7E8290] uppercase font-bold text-[10px]">Official LevelX Grading:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> 80–100: Top Performer
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
              60–79: Passed
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              &lt;60: Needs Improvement
            </span>
          </div>
        )}
      </div>

      {/* 2. ARCHITECTURAL PODIUM COMPOSITION */}
      {!isLoading && podiumTeams.length >= 2 && !search && (
        <section className="space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-[#DF421A] font-bold flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>PHASE {selectedPhase} PODIUM & TOP PERFORMERS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            
            {/* Rank 2 or Equal Rank 1 */}
            {podiumTeams[1] && (
              <div
                onClick={() => onSelectTeam(podiumTeams[1].id)}
                className="bg-white p-6 rounded-3xl border border-[#D6CDBF] shadow-[0_2px_8px_rgba(20,22,27,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(20,22,27,0.08)] transition-all cursor-pointer group order-2 md:order-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-md bg-[#F2ECE1] text-[#3D404C] text-xs font-mono font-bold flex items-center gap-1.5 border border-[#DFD6C7]">
                    <Medal className="w-3.5 h-3.5 text-[#5D616F]" />
                    {podiumTeams[1].rank === 1 ? '1st • Champion (Tie)' : `${podiumTeams[1].rank}nd • Silver`}
                  </span>
                  {podiumTeams[1].score !== null && (
                    <span className="text-sm font-mono font-bold text-[#14161B]">
                      {podiumTeams[1].score} pts
                    </span>
                  )}
                </div>

                <div className="text-4xl font-black font-display text-[#7E8290] mb-1">
                  {podiumTeams[1].rank ? (podiumTeams[1].rank < 10 ? `0${podiumTeams[1].rank}` : podiumTeams[1].rank) : '02'}
                </div>
                
                <h3 className="font-display font-bold text-xl text-[#14161B] group-hover:text-[#DF421A] transition-colors mb-1 truncate">
                  {podiumTeams[1].team_name}
                </h3>
                
                {podiumTeams[1].project_name && (
                  <p className="text-xs font-mono text-[#5D616F] line-clamp-1 mb-3">
                    {podiumTeams[1].project_name}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {podiumTeams[1].room && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold bg-[#FAF7F2] text-[#DF421A] border-[#D6CDBF]">
                      {podiumTeams[1].room}
                    </span>
                  )}
                  {podiumTeams[1].college && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold bg-[#FAF7F2] text-[#14161B] border-[#D6CDBF]">
                      {podiumTeams[1].college}
                    </span>
                  )}
                  <Badge variant="emerald" size="sm">
                    {podiumTeams[1].grade || podiumTeams[1].award || 'Top Performer'}
                  </Badge>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8E1D5] text-[11px] font-mono text-[#7E8290] flex items-center justify-between">
                  <span>{podiumTeams[1].leader_name ? `Lead: ${podiumTeams[1].leader_name}` : `${podiumTeams[1].members_count} Builders`}</span>
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

                <h3 className="font-display font-black text-2xl text-white mb-1 truncate">
                  {podiumTeams[0].team_name}
                </h3>

                {podiumTeams[0].project_name && (
                  <p className="text-xs font-mono text-[#DF421A] font-medium line-clamp-1 mb-4">
                    {podiumTeams[0].project_name}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {podiumTeams[0].room && (
                    <span className="text-[10px] font-mono text-white/90 px-2 py-0.5 rounded bg-white/15 border border-white/25 font-bold">
                      {podiumTeams[0].room}
                    </span>
                  )}
                  {podiumTeams[0].college && (
                    <span className="text-[10px] font-mono text-white/90 px-2 py-0.5 rounded bg-white/15 border border-white/25 font-bold">
                      {podiumTeams[0].college}
                    </span>
                  )}
                  <Badge variant="brand" size="sm">
                    {podiumTeams[0].grade || podiumTeams[0].award || 'Top Performer'}
                  </Badge>
                </div>

                <div className="mt-6 pt-4 border-t border-white/15 text-[11px] font-mono text-[#B7BAC6] flex items-center justify-between">
                  <span>{podiumTeams[0].leader_name ? `Lead: ${podiumTeams[0].leader_name}` : `${podiumTeams[0].members_count} Builders`}</span>
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
                    <Medal className="w-3.5 h-3.5 text-[#9A6712]" />
                    {podiumTeams[2].rank ? `${podiumTeams[2].rank}rd • Podium` : '3rd • Bronze'}
                  </span>
                  {podiumTeams[2].score !== null && (
                    <span className="text-sm font-mono font-bold text-[#14161B]">
                      {podiumTeams[2].score} pts
                    </span>
                  )}
                </div>

                <div className="text-4xl font-black font-display text-[#7E8290] mb-1">
                  {podiumTeams[2].rank ? (podiumTeams[2].rank < 10 ? `0${podiumTeams[2].rank}` : podiumTeams[2].rank) : '03'}
                </div>

                <h3 className="font-display font-bold text-xl text-[#14161B] group-hover:text-[#DF421A] transition-colors mb-1 truncate">
                  {podiumTeams[2].team_name}
                </h3>

                {podiumTeams[2].project_name && (
                  <p className="text-xs font-mono text-[#5D616F] line-clamp-1 mb-3">
                    {podiumTeams[2].project_name}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {podiumTeams[2].room && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold bg-[#FAF7F2] text-[#DF421A] border-[#D6CDBF]">
                      {podiumTeams[2].room}
                    </span>
                  )}
                  {podiumTeams[2].college && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold bg-[#FAF7F2] text-[#14161B] border-[#D6CDBF]">
                      {podiumTeams[2].college}
                    </span>
                  )}
                  <Badge variant="amber" size="sm">
                    {podiumTeams[2].grade || podiumTeams[2].award || 'Top Performer'}
                  </Badge>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8E1D5] text-[11px] font-mono text-[#7E8290] flex items-center justify-between">
                  <span>{podiumTeams[2].leader_name ? `Lead: ${podiumTeams[2].leader_name}` : `${podiumTeams[2].members_count} Builders`}</span>
                  <span className="text-[#14161B] font-semibold group-hover:translate-x-0.5 transition-transform">Inspect Dossier →</span>
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* 3. TOOLBAR CONTROLS WITH COLLEGE (Phase 1) / ROOM (Phase 2) FILTER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E1D5] shadow-[0_1px_3px_rgba(20,22,27,0.04)] space-y-4">
        
        {/* Dynamic Filter Strip: College for Phase 1, Room for Phase 2 */}
        {selectedPhase === 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E1D5]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7E8290]">
              <Building2 className="w-4 h-4 text-[#DF421A]" />
              <span className="uppercase font-bold tracking-wider text-[11px]">COLLEGE COHORT:</span>
            </div>

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
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${active ? 'bg-white/20 text-white' : 'bg-[#E8E1D5] text-[#5D616F]'}`}>
                      {col.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E1D5]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7E8290]">
              <Building2 className="w-4 h-4 text-[#DF421A]" />
              <span className="uppercase font-bold tracking-wider text-[11px]">PHASE 2 EVALUATION ROOM:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'All', label: 'All Rooms', badge: '47' },
                { id: 'Room 1', label: 'Room 1', badge: '2' },
                { id: 'Room 2', label: 'Room 2', badge: '13' },
                { id: 'Room 3', label: 'Room 3', badge: '12' },
                { id: 'Room 4', label: 'Room 4', badge: '9' },
                { id: 'Room A-304', label: 'Room A-304', badge: '11' },
              ].map((rm) => {
                const active = selectedRoom === rm.id;
                return (
                  <button
                    key={rm.id}
                    type="button"
                    onClick={() => setSelectedRoom(rm.id)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#DF421A] text-white shadow-sm'
                        : 'bg-[#FAF7F2] text-[#5D616F] hover:text-[#14161B] border border-[#E8E1D5]'
                    }`}
                  >
                    <span>{rm.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${active ? 'bg-white/20 text-white' : 'bg-[#E8E1D5] text-[#5D616F]'}`}>
                      {rm.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#7E8290] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={selectedPhase === 1 ? "Search by team name, department or project..." : "Search by team, leader, project or room..."}
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
          <LoadingSpinner label={`Loading Phase ${selectedPhase} results board...`} />
        ) : teams.length === 0 ? (
          <EmptyState
            title="No Teams Found"
            description={search ? `No teams match "${search}". Try resetting your filter.` : `Official Phase ${selectedPhase} scoring records will appear here.`}
            icon="search"
            action={search ? <Button size="sm" variant="secondary" onClick={() => { setSearch(''); fetchResults(); }}>Reset Search</Button> : undefined}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8E1D5] divide-y divide-[#E8E1D5] overflow-hidden shadow-[0_2px_8px_rgba(20,22,27,0.04)]">
            
            {/* Header Row */}
            <div className="hidden sm:grid grid-cols-12 px-6 py-3.5 bg-[#F4EDE2] font-mono text-[11px] text-[#7E8290] uppercase tracking-wider font-semibold">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">{selectedPhase === 1 ? 'Team & Project Title' : 'Team, Leader & Project Title'}</div>
              <div className="col-span-3">{selectedPhase === 1 ? 'Department / Status' : 'Room / LevelX Grade'}</div>
              <div className="col-span-2 text-right">Score / 100</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Team Rows */}
            {teams.map((team) => {
              const isDisqualified = team.status === 'disqualified';
              const grade = team.grade || team.award;
              const isTop = grade === 'Top Performer';
              const isPassed = grade === 'Passed';

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
                    <span className={`font-mono text-base font-black ${
                      team.rank === 1 ? 'text-[#DF421A]' : team.rank && team.rank <= 3 ? 'text-amber-600' : 'text-[#14161B]'
                    }`}>
                      {isDisqualified ? '--' : team.rank ? (team.rank < 10 ? `0${team.rank}` : team.rank) : '--'}
                    </span>
                  </div>

                  {/* Team & Project Title */}
                  <div className="col-span-5 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display font-bold text-base text-[#14161B] group-hover:text-[#DF421A] transition-colors">
                        {team.team_name}
                      </h4>
                      {team.room && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] text-[#DF421A] border border-[#E8E1D5] font-semibold">
                          {team.room}
                        </span>
                      )}
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

                    {team.project_name ? (
                      <div className="text-xs font-mono text-[#5D616F] flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-[#7E8290]" />
                        <span>{team.project_name}</span>
                      </div>
                    ) : selectedPhase === 2 ? (
                      <div className="text-[11px] font-mono text-[#B7BAC6] italic">
                        [Project title not provided in source sheet]
                      </div>
                    ) : null}
                  </div>

                  {/* Grade / Room / Department */}
                  <div className="col-span-3 space-y-1">
                    {isDisqualified ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-mono font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Disqualified</span>
                      </div>
                    ) : grade ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                          isTop
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : isPassed
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {grade}
                        </span>
                        {team.department && !team.room && (
                          <span className="text-[10px] font-mono text-[#7E8290]">
                            {team.department}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-mono text-[#7E8290]">Evaluated</span>
                    )}

                    {team.evaluator_notes && (
                      <div className="text-[11px] font-mono text-[#7E8290] truncate max-w-xs">
                        "{team.evaluator_notes}"
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
