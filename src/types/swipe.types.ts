// ─── Shared score breakdown ───────────────────────────────────────────────────

export interface ScoreBreakdown {
  skills: number;
  experience: number;
  location: number;
}

// ─── Job deck (joinee sees jobs) ──────────────────────────────────────────────

export interface DeckJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  type: string;
  salary?: string;
  tags: string[];
  experienceLevel: string;
  logo?: string;
  color?: string;
  posted?: string;
  status: string;
  description?: string;
  // Attached by Python batch scoring
  matchScore: number;
  matchLabel: 'Excellent' | 'Good' | 'Fair' | 'Low' | 'Unknown';
  isMatch: boolean;
  scoreBreakdown: ScoreBreakdown;
}

// ─── Candidate deck (recruiter sees joinees) ─────────────────────────────────

export interface DeckCandidate {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  skills: string[];
  experience: number;
  address?: { city?: string; state?: string; country?: string };
  matchScore: number;
  matchLabel: 'Excellent' | 'Good' | 'Fair' | 'Low' | 'Unknown';
  isMatch: boolean;
  scoreBreakdown: ScoreBreakdown;
}

// ─── Swipe request / response ─────────────────────────────────────────────────

export interface SwipePayload {
  jobId: string;
  direction: 'left' | 'right';
}

export interface RecruiterSwipePayload {
  joineeId: string;
  jobId: string;
  direction: 'left' | 'right';
}

export interface SwipeResponse {
  swipe: {
    _id: string;
    direction: 'left' | 'right';
    matchScore?: number;
    matchLabel?: string;
    scoreBreakdown?: ScoreBreakdown;
  };
  match?: MatchDoc | null;
}

// ─── Match document ───────────────────────────────────────────────────────────

export interface MatchDoc {
  _id: string;
  joinee: string | { _id: string; name: string; email: string };
  job: string | { _id: string; title: string; company: string };
  recruiter?: string;
  matchScore: number;
  matchLabel: string;
  scoreBreakdown: ScoreBreakdown;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// ─── Paginated API wrapper ────────────────────────────────────────────────────

export interface Paginated<T> {
  jobs?: T[];        // joinee deck
  candidates?: T[];  // recruiter deck
  matches?: T[];
  swipes?: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}