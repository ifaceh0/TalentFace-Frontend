import api from '../lib/api';
import type {
  DeckJob,
  DeckCandidate,
  SwipePayload,
  RecruiterSwipePayload,
  SwipeResponse,
  MatchDoc,
  Paginated,
} from '../types/swipe.types';

// ─── Joinee: get ranked job deck ──────────────────────────────────────────────

export const getJobDeck = async (
  page = 1,
  limit = 20,
): Promise<Paginated<DeckJob>> => {
  const { data } = await api.get('/swipe/deck', { params: { page, limit } });
  return data.data;
};

// ─── Joinee: swipe on a job ───────────────────────────────────────────────────

export const swipeJob = async (payload: SwipePayload): Promise<SwipeResponse> => {
  const { data } = await api.post('/swipe', payload);
  return data.data;
};

// ─── Joinee: get swipe history ────────────────────────────────────────────────

export const getSwipeHistory = async (
  direction?: 'left' | 'right',
  page = 1,
  limit = 20,
) => {
  const { data } = await api.get('/swipe/history', {
    params: { direction, page, limit },
  });
  return data.data;
};

// ─── Recruiter: get ranked candidate deck for a job ───────────────────────────

export const getCandidateDeck = async (
  jobId: string,
  page = 1,
  limit = 20,
): Promise<Paginated<DeckCandidate>> => {
  const { data } = await api.get('/swipe/recruiter/deck', {
    params: { jobId, page, limit },
  });
  return data.data;
};

// ─── Recruiter: swipe on a candidate ─────────────────────────────────────────

export const swipeCandidate = async (
  payload: RecruiterSwipePayload,
): Promise<SwipeResponse> => {
  const { data } = await api.post('/swipe/recruiter', payload);
  return data.data;
};

// ─── Joinee: get own matches ──────────────────────────────────────────────────

export const getJoineeMatches = async (
  status?: 'pending' | 'accepted' | 'rejected',
  page = 1,
  limit = 20,
): Promise<Paginated<MatchDoc>> => {
  const { data } = await api.get('/matches', { params: { status, page, limit } });
  return data.data;
};

// ─── Recruiter: get matches on their jobs ─────────────────────────────────────

export const getRecruiterMatches = async (
  jobId?: string,
  status?: 'pending' | 'accepted' | 'rejected',
  page = 1,
  limit = 20,
): Promise<Paginated<MatchDoc>> => {
  const { data } = await api.get('/matches/recruiter', {
    params: { jobId, status, page, limit },
  });
  return data.data;
};

// ─── Recruiter: accept / reject a match ──────────────────────────────────────

export const updateMatchStatus = async (
  matchId: string,
  status: 'accepted' | 'rejected',
): Promise<MatchDoc> => {
  const { data } = await api.patch(`/matches/${matchId}/status`, { status });
  return data.data.match;
};