export interface BackendHealthResponse {
  status: 'healthy' | 'degraded' | 'offline';
  platform: string;
  version: string;
  environment: string;
  timestamp: string;
  services: {
    api: string;
    database_driver: string;
    cors: string;
  };
}

export interface PhaseSummary {
  id: number;
  name: string;
  theme?: string | null;
  status: string;
  date?: string | null;
  teams_count: number;
}

export interface PhaseDetail extends PhaseSummary {
  teams: TeamSummary[];
}

export interface Student {
  id: number;
  name: string;
  email?: string | null;
  college?: string | null;
  participant_id?: string | null;
}

export interface TeamSummary {
  id: number;
  phase_id: number;
  phase_name?: string | null;
  team_name: string;
  project_name?: string | null;
  score?: number | null;
  rank?: number | null;
  award?: string | null;
  project_description?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  college?: string | null;
  status?: string | null;
  department?: string | null;
  evaluator_notes?: string | null;
  source_team_id?: string | null;
  room?: string | null;
  leader_name?: string | null;
  grade?: string | null;
  score_real_business?: number | null;
  score_chatbot_rag?: number | null;
  score_database?: number | null;
  score_platform?: number | null;
  score_team_understanding?: number | null;
  score_presentation?: number | null;
  category_scores?: string | null;
  members_count: number;
}

export interface TeamDetail extends TeamSummary {
  members: Student[];
}

export interface TeamListResponse {
  total: number;
  limit: number;
  offset: number;
  items: TeamSummary[];
}

export interface ProjectItem {
  team_id: number;
  team_name: string;
  phase_id?: number;
  phase_name?: string | null;
  project_name: string;
  project_description?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  award?: string | null;
  score?: number | null;
  rank?: number | null;
  college?: string | null;
  leader_name?: string | null;
  room?: string | null;
  grade?: string | null;
  members_count?: number;
}

export interface ProjectListResponse {
  total: number;
  limit: number;
  offset: number;
  items: ProjectItem[];
}

export interface Highlight {
  id: number;
  title: string;
  media_url: string;
  media_type: string;
  description?: string | null;
}

export type HighlightItem = Highlight;

export interface Achievement {
  team_id: number;
  team_name: string;
  phase_id?: number;
  phase_name?: string | null;
  award: string;
  project_name?: string | null;
  score?: number | null;
  rank?: number | null;
  college?: string | null;
  leader_name?: string | null;
  room?: string | null;
  grade?: string | null;
}

export type AchievementItem = Achievement;

export interface AchievementListResponse {
  total: number;
  items: Achievement[];
}

export interface TrackItem {
  id: string;
  title: string;
  tagline: string;
  category: string;
  accent: 'brand' | 'sapphire' | 'violet' | 'emerald' | 'amber' | 'neutral';
  iconName: 'Cpu' | 'Coins' | 'HeartPulse' | 'Leaf' | 'Sparkles';
  prizePool: string;
  tags: string[];
}

export type PageView =
  | 'home'
  | 'hackathons'
  | 'results'
  | 'projects'
  | 'achievements'
  | 'highlights'
  | 'journey'
  | 'about';
