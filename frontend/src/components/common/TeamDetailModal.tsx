import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Users, Code, FileText, AlertCircle } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { api } from '../../api/client';
import type { TeamDetail } from '../../types';

interface TeamDetailModalProps {
  teamId: number | null;
  onClose: () => void;
}

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({ teamId, onClose }) => {
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setTeam(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    api.getTeamById(teamId)
      .then((data) => setTeam(data))
      .catch((err) => setError(err.message || 'Failed to load team profile'))
      .finally(() => setIsLoading(false));
  }, [teamId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!teamId) return null;

  const isDisqualified = team?.status === 'disqualified';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#14161B]/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl z-10 my-8"
        >
          <div className="bg-white rounded-3xl border border-[#D6CDBF] shadow-[0_20px_60px_-10px_rgba(20,22,27,0.25)] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#F4EDE2] text-[#5D616F] hover:text-[#14161B] hover:bg-[#EAE1D3] transition-colors cursor-pointer border border-[#DFD6C7]"
            >
              <X className="w-4 h-4" />
            </button>

            {isLoading ? (
              <LoadingSpinner label="Loading team profile and dossier..." className="py-20" />
            ) : error || !team ? (
              <div className="text-center py-12 space-y-4">
                <div className="p-3 rounded-2xl bg-red-50 text-red-600 w-fit mx-auto border border-red-200">
                  <X className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#14161B]">Unable to Load Team Details</h3>
                <p className="text-sm text-[#5D616F]">{error || 'Team record could not be retrieved.'}</p>
                <Button size="sm" variant="secondary" onClick={onClose}>
                  Close Window
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Header Section */}
                <div className="pr-10">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {team.phase_name && (
                      <Badge variant="brand" size="sm">
                        {team.phase_name}
                      </Badge>
                    )}
                    {isDisqualified ? (
                      <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-mono font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Disqualified
                      </span>
                    ) : team.rank ? (
                      <Badge variant="neutral" size="sm">
                        Rank #{team.rank}
                      </Badge>
                    ) : null}
                    {team.award && !isDisqualified && (
                      <Badge variant="emerald" size="sm">
                        {team.award}
                      </Badge>
                    )}
                    {team.room && (
                      <span className="text-[11px] font-mono font-semibold text-[#DF421A] px-2.5 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#E8E1D5]">
                        {team.room}
                      </span>
                    )}
                    {team.source_team_id && (
                      <span className="text-[11px] font-mono text-[#7E8290] px-2.5 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#E8E1D5]">
                        Original ID: {team.source_team_id}
                      </span>
                    )}
                    {team.leader_name && (
                      <span className="text-[11px] font-mono text-[#14161B] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#E8E1D5]">
                        Lead: {team.leader_name}
                      </span>
                    )}
                    {team.college && (
                      <span className="text-[11px] font-mono text-[#7E8290] px-2.5 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#E8E1D5]">
                        {team.college}
                      </span>
                    )}
                    {team.department && !team.room && (
                      <span className="text-[11px] font-mono text-[#7E8290] px-2.5 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#E8E1D5]">
                        Dept: {team.department}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[#14161B]">
                    {team.team_name}
                  </h2>
                  {team.project_name && (
                    <p className="text-sm font-mono text-[#DF421A] font-semibold mt-1">
                      {team.project_name}
                    </p>
                  )}
                </div>

                {/* Score & Evaluation Slabs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5]">
                    <div className="text-[10px] text-[#7E8290] uppercase tracking-wider">OFFICIAL SCORE</div>
                    <div className="text-xl font-bold text-[#14161B] mt-0.5">
                      {isDisqualified ? 'N/A' : team.score !== null && team.score !== undefined ? `${team.score} / 100` : 'Pending'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5]">
                    <div className="text-[10px] text-[#7E8290] uppercase tracking-wider">OFFICIAL GRADE</div>
                    <div className="text-sm font-bold text-[#14161B] mt-1">
                      {team.grade || team.award || 'Evaluated'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-[#7E8290] uppercase tracking-wider">STATUS</div>
                    <div className={`text-sm font-bold mt-1 ${isDisqualified ? 'text-red-600' : 'text-[#156B3F]'}`}>
                      {isDisqualified ? 'Disqualified' : 'Evaluated'}
                    </div>
                  </div>
                </div>

                {/* Phase 2: 6 Official Scoring Criteria Breakdown */}
                {(team.score_real_business !== null && team.score_real_business !== undefined ||
                  team.score_chatbot_rag !== null && team.score_chatbot_rag !== undefined ||
                  team.score_database !== null && team.score_database !== undefined) && (
                  <div className="space-y-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#DF421A]">
                        Phase 2 Official Evaluation Scorecard (100 Pts)
                      </span>
                      <span className="text-xs font-mono font-bold text-[#14161B]">
                        Total: {team.score} / 100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#E8E1D5]">
                        <div className="text-[10px] text-[#7E8290]">Real Business (15)</div>
                        <div className="text-sm font-bold text-[#14161B] mt-0.5">
                          {team.score_real_business !== null && team.score_real_business !== undefined ? `${team.score_real_business} / 15` : 'N/A'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#E8E1D5]">
                        <div className="text-[10px] text-[#7E8290]">Chatbot & RAG (25)</div>
                        <div className="text-sm font-bold text-[#14161B] mt-0.5">
                          {team.score_chatbot_rag !== null && team.score_chatbot_rag !== undefined ? `${team.score_chatbot_rag} / 25` : 'N/A'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#E8E1D5]">
                        <div className="text-[10px] text-[#7E8290]">Database Used (15)</div>
                        <div className="text-sm font-bold text-[#14161B] mt-0.5">
                          {team.score_database !== null && team.score_database !== undefined ? `${team.score_database} / 15` : 'N/A'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#E8E1D5]">
                        <div className="text-[10px] text-[#7E8290]">Platform Function (20)</div>
                        <div className="text-sm font-bold text-[#14161B] mt-0.5">
                          {team.score_platform !== null && team.score_platform !== undefined ? `${team.score_platform} / 20` : 'N/A'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#E8E1D5]">
                        <div className="text-[10px] text-[#7E8290]">Tech Stack & Und. (15)</div>
                        <div className="text-sm font-bold text-[#14161B] mt-0.5">
                          {team.score_team_understanding !== null && team.score_team_understanding !== undefined ? `${team.score_team_understanding} / 15` : 'N/A'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#E8E1D5]">
                        <div className="text-[10px] text-[#7E8290]">Presentation (10)</div>
                        <div className="text-sm font-bold text-[#14161B] mt-0.5">
                          {team.score_presentation !== null && team.score_presentation !== undefined ? `${team.score_presentation} / 10` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disqualified or Evaluator Notes Warning */}
                {team.evaluator_notes && (
                  <div className={`p-4 rounded-2xl border text-xs font-mono space-y-1 ${
                    isDisqualified ? 'bg-red-50 border-red-200 text-red-700' : 'bg-[#FAF7F2] border-[#E8E1D5] text-[#14161B]'
                  }`}>
                    <div className="font-bold uppercase tracking-wider text-[10px]">EVALUATOR REMARKS</div>
                    <p className="text-sm">{team.evaluator_notes}</p>
                  </div>
                )}

                {/* Project Abstract / Description */}
                {team.project_description && (
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#7E8290] font-bold uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Project Problem & Abstract</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#484B56] leading-relaxed">
                      {team.project_description}
                    </p>
                  </div>
                )}

                {/* Student Builder Roster */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#7E8290] font-bold uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5" />
                    <span>Student Builder Roster ({team.members.length || (team.leader_name ? 1 : 0)})</span>
                  </div>

                  {team.members.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] text-xs font-mono text-[#7E8290] text-center border border-[#E8E1D5] space-y-1">
                      {team.leader_name ? (
                        <>
                          <div className="font-bold text-[#14161B]">Designated Team Leader: {team.leader_name}</div>
                          <div>Individual team members were not separately enumerated in the Phase 2 room scoring sheet.</div>
                        </>
                      ) : (
                        <div>Team leader and roster details were not provided in the source record.</div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {team.members.map((member, idx) => (
                        <div
                          key={member.id || idx}
                          className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] flex items-center gap-3"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white border border-[#D6CDBF] flex items-center justify-center shrink-0 font-mono text-xs font-bold text-[#14161B]">
                            {idx + 1}
                          </div>

                          <div className="min-w-0">
                            <div className="text-sm font-bold text-[#14161B] truncate">
                              {member.name}
                            </div>
                            <div className="text-xs font-mono text-[#7E8290] truncate">
                              {member.participant_id ? `Roll: ${member.participant_id}` : member.college || 'Builder'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#E8E1D5] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {team.github_url && (
                      <a
                        href={team.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-white text-[#14161B] text-xs font-semibold border border-[#D6CDBF] hover:bg-[#FAF7F2] flex items-center gap-1.5 transition-colors"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {team.demo_url && (
                      <a
                        href={team.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#DF421A] text-white text-xs font-semibold hover:bg-[#C83812] flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Prototype</span>
                      </a>
                    )}
                  </div>

                  <Button size="sm" variant="secondary" onClick={onClose}>
                    Close Dossier
                  </Button>
                </div>

              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
