import type { Candidate } from '../store/useStore';

/**
 * Tier threshold configuration.
 * ATS scores range from 0 to 100 based on JobFitCheck.model.js.
 * - Strong: ATS score >= 70 (high alignment with job description/keywords)
 * - Moderate: ATS score >= 40 and < 70 (moderate alignment)
 * - Weak: ATS score < 40 (low alignment)
 */
export const TIER_CONFIG = {
  STRONG_MIN: 70,
  MODERATE_MIN: 40,
} as const;

export type CandidateTier = 'Strong' | 'Moderate' | 'Weak' | 'Unscored';

export interface RankingOptions {
  /**
   * Optional custom tie-breaker comparator when two candidates have the exact same ATS score.
   * Default: earlier application date first, then candidate ID alphabetically.
   */
  tieBreaker?: (a: Candidate, b: Candidate) => number;
}

/**
 * Determine candidate tier from ATS score.
 * Returns 'Unscored' if score is null, undefined, or NaN. Never treats null as 0.
 */
export function getCandidateTier(score: number | null | undefined): CandidateTier {
  if (score === null || score === undefined || typeof score !== 'number' || Number.isNaN(score)) {
    return 'Unscored';
  }
  if (score >= TIER_CONFIG.STRONG_MIN) return 'Strong';
  if (score >= TIER_CONFIG.MODERATE_MIN) return 'Moderate';
  return 'Weak';
}

/**
 * Pure function to determine if a candidate is a valid applicant for a given job.
 * Isolates the application signal check behind a single defensible function.
 * 
 * Rules:
 * 1. Must belong to targetJobId (if candidate has a jobId, it must match targetJobId).
 * 2. Exclude global candidates, sourced candidates, or recommended candidate pool.
 */
export function isApplicant(candidate: Candidate | null | undefined, targetJobId: string): boolean {
  if (!candidate || !targetJobId) return false;

  // Explicit non-applicant flags (sourced or recommended pool)
  const extended = candidate as Candidate & { isSourced?: boolean; isRecommended?: boolean };
  if (extended.isSourced || extended.isRecommended) {
    return false;
  }

  // Must have a jobId that strictly matches targetJobId
  if (candidate.jobId) {
    return candidate.jobId === targetJobId;
  }

  // If candidate lacks jobId but has an application ID or applied date and is part of the job's applicants
  if (candidate.applicationId && targetJobId) {
    return true;
  }

  return false;
}

/**
 * Helper to select the most recent score record when multiple records exist for
 * the same candidate and job.
 * Recency is determined by updatedAt descending, then createdAt descending.
 */
export function getMostRecentScoreRecord<T extends { updatedAt?: string | Date; createdAt?: string | Date }>(
  records: T[]
): T | null {
  if (!records || records.length === 0) return null;
  if (records.length === 1) return records[0];

  return [...records].sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  })[0];
}

/**
 * Default deterministic tie-breaker:
 * 1. Earlier application date (oldest applicant first)
 * 2. Candidate ID ascending (lexicographical order)
 */
export function defaultTieBreaker(a: Candidate, b: Candidate): number {
  const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : Number.POSITIVE_INFINITY;
  const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : Number.POSITIVE_INFINITY;

  if (dateA !== dateB) {
    return dateA - dateB;
  }

  const idA = a.id || '';
  const idB = b.id || '';
  return idA.localeCompare(idB);
}

/**
 * Pure, unit-testable ranking function for job applicants.
 * 
 * Invariants:
 * 1. Only ranks applicants who have applied to targetJobId (never global pool, sourced, or recommended).
 * 2. Driven strictly by candidate's ATS score (derived from JobFitCheck).
 * 3. Competition ranking for ties: 1, 2, 2, 4.
 * 4. Percentile: calculated relative to the other scored applicants of the same job.
 * 5. Deterministic tie-breaking: earlier appliedDate, then candidate ID (configurable via options).
 * 6. Missing scores: null/missing ATS scores placed in a separate "Unscored" group at the bottom.
 *    Never treats null as 0.
 */
export function rankApplicants(
  candidates: Candidate[],
  targetJobId: string,
  options?: RankingOptions
): Candidate[] {
  if (!candidates || !Array.isArray(candidates) || candidates.length === 0 || !targetJobId) {
    return [];
  }

  // Step 1: Filter ONLY applicants of this specific job
  const applicants = candidates.filter((c) => isApplicant(c, targetJobId));
  if (applicants.length === 0) {
    return [];
  }

  const tieBreaker = options?.tieBreaker || defaultTieBreaker;

  // Step 2: Separate scored vs unscored candidates
  const scored: Candidate[] = [];
  const unscored: Candidate[] = [];

  for (const applicant of applicants) {
    const rawScore = applicant.atsScore;
    if (typeof rawScore === 'number' && !Number.isNaN(rawScore)) {
      scored.push({
        ...applicant,
        atsScore: Math.min(100, Math.max(0, Math.round(rawScore))),
      });
    } else {
      unscored.push({
        ...applicant,
        atsScore: null,
        rank: null,
        percentile: null,
        tier: 'Unscored',
      });
    }
  }

  // Step 3: Sort scored applicants by ATS score desc, then deterministic tie-breaker
  scored.sort((a, b) => {
    const diff = (b.atsScore as number) - (a.atsScore as number);
    if (diff !== 0) return diff;
    return tieBreaker(a, b);
  });

  const totalScored = scored.length;

  // Step 4 & 5: Compute Competition Ranking (1, 2, 2, 4) and Percentile
  const rankedScored: Candidate[] = [];

  for (let i = 0; i < totalScored; i++) {
    const current = scored[i];
    const currentScore = current.atsScore as number;

    // Standard competition ranking
    let rank: number;
    if (i === 0) {
      rank = 1;
    } else {
      const prev = rankedScored[i - 1];
      if (prev.atsScore === currentScore) {
        rank = prev.rank as number; // Tied with predecessor
      } else {
        rank = i + 1; // Competition rank skips ahead (e.g. 1, 2, 2, 4)
      }
    }

    // Percentile calculation: percentage of scored applicants with score <= currentScore
    // For single applicant: 100%
    let percentile: number;
    if (totalScored <= 1) {
      percentile = 100;
    } else {
      const countAtOrBelow = scored.filter((c) => (c.atsScore as number) <= currentScore).length;
      percentile = Math.round((countAtOrBelow / totalScored) * 100);
    }

    const tier = getCandidateTier(currentScore);

    rankedScored.push({
      ...current,
      rank,
      percentile,
      tier,
    });
  }

  // Step 6: Sort unscored applicants deterministically
  unscored.sort(tieBreaker);

  // Return scored applicants first, followed by unscored group at bottom
  return [...rankedScored, ...unscored];
}
