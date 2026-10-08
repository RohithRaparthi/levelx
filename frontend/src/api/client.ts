import type {
  PhaseSummary,
  PhaseDetail,
  TeamListResponse,
  TeamDetail,
  ProjectListResponse,
  Achievement,
  AchievementListResponse,
  Highlight,
  BackendHealthResponse,
} from '../types';

function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

  let baseUrl = envUrl;
  if (!baseUrl) {
    baseUrl = import.meta.env.DEV
      ? 'http://localhost:8000/api/v1'
      : 'https://levelx-chjd.onrender.com/api/v1';
  }

  // Strip trailing slashes
  baseUrl = baseUrl.replace(/\/+$/, '');

  // Ensure /api/v1 path is included even if env variable only gave the root domain
  if (!baseUrl.endsWith('/api/v1')) {
    if (baseUrl.endsWith('/api')) {
      baseUrl = `${baseUrl}/v1`;
    } else {
      baseUrl = `${baseUrl}/api/v1`;
    }
  }

  return baseUrl;
}

const API_BASE_URL = getApiBaseUrl();

async function fetchJson<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorJson = await response.json();

      if (errorJson.detail) {
        errorDetail =
          typeof errorJson.detail === 'string'
            ? errorJson.detail
            : JSON.stringify(errorJson.detail);
      }
    } catch {
      // ignore
    }

    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Health
  getHealth: () => fetchJson<BackendHealthResponse>('/health'),

  // Phases
  getPhases: () => fetchJson<PhaseSummary[]>('/phases'),

  getPhaseById: (id: number) =>
    fetchJson<PhaseDetail>(`/phases/${id}`),

  // Teams
  getTeams: (params?: {
    phase_id?: number;
    college?: string;
    status?: string;
    search?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }) => {
    const query = new URLSearchParams();

    if (params?.phase_id !== undefined) {
      query.set('phase_id', params.phase_id.toString());
    }

    if (params?.college) {
      query.set('college', params.college);
    }

    if (params?.status) {
      query.set('status', params.status);
    }

    if (params?.search) {
      query.set('search', params.search);
    }

    if (params?.sort) {
      query.set('sort', params.sort);
    }

    if (params?.limit !== undefined) {
      query.set('limit', params.limit.toString());
    }

    if (params?.offset !== undefined) {
      query.set('offset', params.offset.toString());
    }

    const qs = query.toString();

    return fetchJson<TeamListResponse>(
      `/teams${qs ? `?${qs}` : ''}`
    );
  },

  getTeamById: (id: number) =>
    fetchJson<TeamDetail>(`/teams/${id}`),

  // Projects
  getProjects: (params?: {
    phase_id?: number;
    college?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const query = new URLSearchParams();

    if (params?.phase_id !== undefined) {
      query.set('phase_id', params.phase_id.toString());
    }

    if (params?.college) {
      query.set('college', params.college);
    }

    if (params?.search) {
      query.set('search', params.search);
    }

    if (params?.limit !== undefined) {
      query.set('limit', params.limit.toString());
    }

    if (params?.offset !== undefined) {
      query.set('offset', params.offset.toString());
    }

    const qs = query.toString();

    return fetchJson<ProjectListResponse>(
      `/projects${qs ? `?${qs}` : ''}`
    );
  },

  // Achievements
  getAchievements: async (params?: {
    phase_id?: number;
    college?: string;
  }): Promise<Achievement[]> => {
    const query = new URLSearchParams();
    if (params?.phase_id !== undefined) {
      query.set('phase_id', params.phase_id.toString());
    }
    if (params?.college) {
      query.set('college', params.college);
    }
    const qs = query.toString();
    const res = await fetchJson<
      AchievementListResponse | Achievement[]
    >(`/achievements${qs ? `?${qs}` : ''}`);

    if (Array.isArray(res)) {
      return res;
    }

    if (
      res &&
      Array.isArray(
        (res as AchievementListResponse).items
      )
    ) {
      return (res as AchievementListResponse).items;
    }

    return [];
  },

  // Highlights
  getHighlights: () =>
    fetchJson<Highlight[]>('/highlights'),
};