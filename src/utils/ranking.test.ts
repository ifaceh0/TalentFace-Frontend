import test from 'node:test';
import assert from 'node:assert/strict';
import {
  rankApplicants,
  isApplicant,
  getCandidateTier,
  getMostRecentScoreRecord,
  TIER_CONFIG,
} from './ranking.ts';
import type { Candidate } from '../store/useStore.ts';

interface ExtendedCandidate extends Candidate {
  isSourced?: boolean;
  isRecommended?: boolean;
}

// Helper to manufacture test candidates
const createTestCandidate = (overrides: Partial<ExtendedCandidate> = {}): ExtendedCandidate => ({
  id: 'cand-1',
  name: 'Candidate 1',
  role: 'Frontend Developer',
  experience: 3,
  skills: ['React', 'TypeScript'],
  location: 'Bangalore',
  status: 'Applied',
  email: 'cand1@example.com',
  appliedDate: '2026-05-01T10:00:00.000Z',
  avatar: 'C1',
  jobId: 'job-100',
  atsScore: 85,
  ...overrides,
});

test('TIER_CONFIG has expected thresholds', () => {
  assert.equal(TIER_CONFIG.STRONG_MIN, 70);
  assert.equal(TIER_CONFIG.MODERATE_MIN, 40);
});

test('getCandidateTier assigns tiers correctly without treating null as 0', () => {
  assert.equal(getCandidateTier(95), 'Strong');
  assert.equal(getCandidateTier(70), 'Strong');
  assert.equal(getCandidateTier(69), 'Moderate');
  assert.equal(getCandidateTier(40), 'Moderate');
  assert.equal(getCandidateTier(39), 'Weak');
  assert.equal(getCandidateTier(0), 'Weak'); // 0 is scored, not Unscored!
  assert.equal(getCandidateTier(null), 'Unscored');
  assert.equal(getCandidateTier(undefined), 'Unscored');
  assert.equal(getCandidateTier(Number.NaN), 'Unscored');
});

test('isApplicant accepts candidates for target job and rejects non-applicants', () => {
  const applicant = createTestCandidate({ jobId: 'job-100' });
  const otherJobCandidate = createTestCandidate({ jobId: 'job-200' });
  const sourcedCandidate = createTestCandidate({
    jobId: 'job-100',
    isSourced: true,
  });
  const recommendedCandidate = createTestCandidate({
    jobId: 'job-100',
    isRecommended: true,
  });
  const noJobCandidate = createTestCandidate({ jobId: undefined, applicationId: undefined });

  assert.equal(isApplicant(applicant, 'job-100'), true);
  assert.equal(isApplicant(otherJobCandidate, 'job-100'), false);
  assert.equal(isApplicant(sourcedCandidate, 'job-100'), false);
  assert.equal(isApplicant(recommendedCandidate, 'job-100'), false);
  assert.equal(isApplicant(noJobCandidate, 'job-100'), false);
  assert.equal(isApplicant(null, 'job-100'), false);
});

test('Empty applicant list returns empty array', () => {
  assert.deepEqual(rankApplicants([], 'job-100'), []);
  assert.deepEqual(rankApplicants([] as Candidate[], 'job-100'), []);
  assert.deepEqual(rankApplicants([createTestCandidate({ jobId: 'job-other' })], 'job-100'), []);
});

test('Single applicant gets rank 1, 100th percentile, and correct tier', () => {
  const single = createTestCandidate({
    id: 'cand-single',
    jobId: 'job-100',
    atsScore: 82,
  });

  const ranked = rankApplicants([single], 'job-100');
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].rank, 1);
  assert.equal(ranked[0].percentile, 100);
  assert.equal(ranked[0].tier, 'Strong');
  assert.equal(ranked[0].atsScore, 82);
});

test('Non-applicant with high score is excluded from ranking', () => {
  const applicant1 = createTestCandidate({
    id: 'cand-app-1',
    name: 'Real Applicant',
    jobId: 'job-100',
    atsScore: 75,
  });

  const highScoringNonApplicant = createTestCandidate({
    id: 'cand-outsider',
    name: 'Outsider from Job 200',
    jobId: 'job-200',
    atsScore: 99,
  });

  const highScoringSourced = createTestCandidate({
    id: 'cand-sourced',
    name: 'Sourced Candidate',
    jobId: 'job-100',
    atsScore: 98,
    isSourced: true,
  });

  const ranked = rankApplicants([applicant1, highScoringNonApplicant, highScoringSourced], 'job-100');

  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].id, 'cand-app-1');
  assert.equal(ranked[0].rank, 1);
  assert.equal(ranked[0].percentile, 100);
});

test('Competition ranking for ties follows 1, 2, 2, 4 pattern with deterministic tie-break', () => {
  const candidates: Candidate[] = [
    createTestCandidate({
      id: 'cand-1',
      name: 'Alice',
      atsScore: 95,
      appliedDate: '2026-05-01T10:00:00Z',
    }),
    createTestCandidate({
      id: 'cand-2',
      name: 'Bob',
      atsScore: 85,
      appliedDate: '2026-05-02T10:00:00Z', // later than Charlie
    }),
    createTestCandidate({
      id: 'cand-3',
      name: 'Charlie',
      atsScore: 85,
      appliedDate: '2026-05-01T12:00:00Z', // earlier than Bob -> should break tie first
    }),
    createTestCandidate({
      id: 'cand-4',
      name: 'David',
      atsScore: 60,
      appliedDate: '2026-05-03T10:00:00Z',
    }),
  ];

  const ranked = rankApplicants(candidates, 'job-100');

  assert.equal(ranked.length, 4);

  // Check 1st place
  assert.equal(ranked[0].id, 'cand-1');
  assert.equal(ranked[0].rank, 1);
  assert.equal(ranked[0].atsScore, 95);
  assert.equal(ranked[0].percentile, 100);
  assert.equal(ranked[0].tier, 'Strong');

  // Check 2nd place (Charlie applied earlier than Bob)
  assert.equal(ranked[1].id, 'cand-3');
  assert.equal(ranked[1].rank, 2);
  assert.equal(ranked[1].atsScore, 85);
  assert.equal(ranked[1].percentile, 75); // 3 out of 4 candidates have score <= 85
  assert.equal(ranked[1].tier, 'Strong');

  // Check 3rd entry (Bob tied with Charlie at score 85 -> rank 2, competition ranking)
  assert.equal(ranked[2].id, 'cand-2');
  assert.equal(ranked[2].rank, 2);
  assert.equal(ranked[2].atsScore, 85);
  assert.equal(ranked[2].percentile, 75); // equal percentile for tied score
  assert.equal(ranked[2].tier, 'Strong');

  // Check 4th place (David -> competition ranking skips to rank 4!)
  assert.equal(ranked[3].id, 'cand-4');
  assert.equal(ranked[3].rank, 4);
  assert.equal(ranked[3].atsScore, 60);
  assert.equal(ranked[3].percentile, 25); // 1 out of 4 has score <= 60
  assert.equal(ranked[3].tier, 'Moderate');
});

test('Tie-breaker falls back to candidate ID when application dates are identical', () => {
  const candidates: Candidate[] = [
    createTestCandidate({
      id: 'cand-Z',
      atsScore: 80,
      appliedDate: '2026-05-01T10:00:00Z',
    }),
    createTestCandidate({
      id: 'cand-A',
      atsScore: 80,
      appliedDate: '2026-05-01T10:00:00Z',
    }),
  ];

  const ranked = rankApplicants(candidates, 'job-100');

  assert.equal(ranked[0].id, 'cand-A');
  assert.equal(ranked[0].rank, 1);
  assert.equal(ranked[1].id, 'cand-Z');
  assert.equal(ranked[1].rank, 1);
});

test('Missing scores go to separate Unscored group at bottom and null is never treated as 0', () => {
  const candidates: Candidate[] = [
    createTestCandidate({
      id: 'cand-null',
      name: 'Null Score Applicant',
      atsScore: null,
      appliedDate: '2026-05-01T10:00:00Z',
    }),
    createTestCandidate({
      id: 'cand-high',
      name: 'High Score Applicant',
      atsScore: 90,
      appliedDate: '2026-05-02T10:00:00Z',
    }),
    createTestCandidate({
      id: 'cand-zero',
      name: 'Zero Score Applicant',
      atsScore: 0, // Valid 0 score! Must NOT be treated as null!
      appliedDate: '2026-05-03T10:00:00Z',
    }),
    createTestCandidate({
      id: 'cand-missing',
      name: 'Undefined Score Applicant',
      atsScore: undefined,
      appliedDate: '2026-05-04T10:00:00Z',
    }),
  ];

  const ranked = rankApplicants(candidates, 'job-100');

  assert.equal(ranked.length, 4);

  // 1st: Score 90
  assert.equal(ranked[0].id, 'cand-high');
  assert.equal(ranked[0].rank, 1);
  assert.equal(ranked[0].tier, 'Strong');

  // 2nd: Score 0 (scored candidate!)
  assert.equal(ranked[1].id, 'cand-zero');
  assert.equal(ranked[1].rank, 2);
  assert.equal(ranked[1].tier, 'Weak');
  assert.equal(ranked[1].atsScore, 0);

  // 3rd & 4th: Unscored group at bottom
  assert.equal(ranked[2].id, 'cand-null');
  assert.equal(ranked[2].rank, null);
  assert.equal(ranked[2].percentile, null);
  assert.equal(ranked[2].tier, 'Unscored');
  assert.equal(ranked[2].atsScore, null);

  assert.equal(ranked[3].id, 'cand-missing');
  assert.equal(ranked[3].rank, null);
  assert.equal(ranked[3].percentile, null);
  assert.equal(ranked[3].tier, 'Unscored');
  assert.equal(ranked[3].atsScore, null);
});

test('getMostRecentScoreRecord returns most recent record based on updatedAt and createdAt', () => {
  const records = [
    { id: '1', atsScore: 65, updatedAt: '2026-05-01T10:00:00Z', createdAt: '2026-05-01T09:00:00Z' },
    { id: '2', atsScore: 88, updatedAt: '2026-05-05T12:00:00Z', createdAt: '2026-05-01T09:00:00Z' },
    { id: '3', atsScore: 72, updatedAt: '2026-05-03T10:00:00Z', createdAt: '2026-05-01T09:00:00Z' },
  ];

  const latest = getMostRecentScoreRecord(records);
  assert.equal(latest?.id, '2');
  assert.equal(latest?.atsScore, 88);
});
