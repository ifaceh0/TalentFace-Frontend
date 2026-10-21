import api from '../lib/api';
import type { Candidate, Job } from '../store/useStore';
import { rankApplicants, getCandidateTier } from '../utils/ranking';

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

// ─── Helpers ─────────────────────────────────────────────────────

const transformJob = (job: any): Job => ({
  id: job._id || job.id,
  title: job.title,
  company: job.company || job.department || '',
  department: job.company || job.department || '',
  location: job.location,
  description: job.description || '',
  jobType: job.type || 'Full-time',
  editedAt: job.editedAt,

  // Convert backend status to frontend status
  status:
    job.status?.toLowerCase() === 'open'
      ? 'Active'
      : job.status?.toLowerCase() === 'closed'
      ? 'Closed'
      : job.status?.toLowerCase() === 'draft'
      ? 'Draft'
      : 'Active',

  applicants: job.applicants || 0,

  postedDate: job.postedDate
    ? new Date(job.postedDate).toISOString().split('T')[0]
    : job.createdAt
    ? new Date(job.createdAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0],

  salaryMin: job.salaryMin || undefined,
  salaryMax: job.salaryMax || undefined,
  maxApplicants: job.maxApplicants || undefined,
});

const transformCandidate = (candidate: any): Candidate => {
  // Extract ATS score from candidate payload (direct, snapshot, or fitCheck)
  let resolvedAtsScore: number | null = null;
  if (typeof candidate.atsScore === 'number' && !Number.isNaN(candidate.atsScore)) {
    resolvedAtsScore = candidate.atsScore;
  } else if (
    candidate.jobAnalysisSnapshot &&
    typeof candidate.jobAnalysisSnapshot.atsScore === 'number' &&
    !Number.isNaN(candidate.jobAnalysisSnapshot.atsScore)
  ) {
    resolvedAtsScore = candidate.jobAnalysisSnapshot.atsScore;
  } else if (
    candidate.jobAnalysisSnapshot &&
    typeof candidate.jobAnalysisSnapshot.ats_score === 'number' &&
    !Number.isNaN(candidate.jobAnalysisSnapshot.ats_score)
  ) {
    resolvedAtsScore = candidate.jobAnalysisSnapshot.ats_score;
  } else if (
    candidate.fitCheck &&
    typeof candidate.fitCheck.atsScore === 'number' &&
    !Number.isNaN(candidate.fitCheck.atsScore)
  ) {
    resolvedAtsScore = candidate.fitCheck.atsScore;
  }

  const tier = candidate.tier || getCandidateTier(resolvedAtsScore);

  return {
    id: candidate.id || candidate._id,
    applicationId: candidate.applicationId || (candidate._id ? candidate._id.toString() : undefined),
    jobId: candidate.jobId || candidate.job?._id || (typeof candidate.job === 'string' ? candidate.job : undefined),
    uniqueId: candidate.uniqueId,
    name: candidate.name,
    role: candidate.role || 'Applicant',
    experience: Number(candidate.experience ?? candidate.applicant?.experience ?? 0) || 0,

    workExperience: Array.isArray(candidate.workExperience)
      ? candidate.workExperience.map((w: any) => ({
          company: w.company || '',
          role: w.role || '',
          description: w.description || '',
          type: w.type || '',
          startDate: w.startDate ? new Date(w.startDate).toISOString() : undefined,
          endDate: w.endDate ? new Date(w.endDate).toISOString() : undefined,
        }))
      : [],

    skills: Array.isArray(candidate.skills)
      ? candidate.skills
      : Array.isArray(candidate.skillList)
        ? candidate.skillList
        : [],
    location: candidate.location || 'Not Specified',
    status: candidate.status || 'Applied',
    email: candidate.email || '',
    phone: candidate.phone || '',
    resumeUrl:
      candidate.resumeUrl ||
      candidate.resume ||
      candidate.user?.resumeUrl ||
      candidate.user?.resume ||
      candidate.resumeSnapshot?.url ||
      '',
    appliedDate: candidate.appliedDate
      ? new Date(candidate.appliedDate).toISOString().split('T')[0]
      : candidate.createdAt
      ? new Date(candidate.createdAt).toISOString().split('T')[0]
      : '',
    avatar: candidate.avatar || candidate.name?.slice(0, 2).toUpperCase() || '??',
    jobTitle: candidate.jobTitle || candidate.appliedJob || candidate.job?.title || candidate.jobId?.title || '',

    atsScore: resolvedAtsScore,
    rank: typeof candidate.rank === 'number' ? candidate.rank : null,
    percentile: typeof candidate.percentile === 'number' ? candidate.percentile : null,
    tier,
  };
};

export interface CandidateProfile extends Candidate {
  profilePhoto?: string;
  summary?: unknown;
  education?: Array<{
    degree?: string;
    institution?: string;
    board?: string;
    startYear?: number;
    endYear?: number;
    percentage?: number;
    cgpa?: number;
    isCurrentlyStudying?: boolean;
  }>;
  socialProfiles?: Array<{ platform?: string; url?: string }>;
  currentCollege?: string;
  department?: string;
  course?: string;
}


// ─── Jobs ───────────────────────────────────────────────────────

/**
 * GET /api/recruiter/jobs
 */
export const getMyJobs = async (): Promise<Job[]> => {
  const { data } =
    await api.get<ApiEnvelope<{ jobs: any[] }>>('/recruiter/jobs');

  return data.data.jobs.map(transformJob);
};

/**
 * POST /api/recruiter/jobs
 */
export const createJob = async (
  payload: Omit<Job, 'id' | 'applicants' | 'postedDate'>
): Promise<Job> => {
  const { data } =
    await api.post<ApiEnvelope<{ job: any }>>(
      '/recruiter/jobs',
      payload
    );

  return transformJob(data.data.job);
};

/**
 * PATCH /api/recruiter/jobs/:id
 * Update job within 24-hour window (can only edit once)
 */
export const updateJob = async (
  jobId: string,
  payload: Partial<Omit<Job, 'id' | 'applicants' | 'postedDate'>>
): Promise<Job> => {
  const { data } =
    await api.patch<ApiEnvelope<{ job: any }>>(
      `/recruiter/jobs/${jobId}`,
      payload
    );

  return transformJob(data.data.job);
};

/**
 * DELETE /api/recruiter/jobs/:id
 */
export const deleteJob = async (
  jobId: string
): Promise<void> => {
  await api.delete(`/recruiter/jobs/${jobId}`);
};

// ─── PROFILE ──────────────────────────────────────────────────

export interface RecruiterProfile {
  _id?: string;
  name: string;
  email: string;
  countryCode?: string;
  phone?: string;
  companyName: string;
  designation?: string;
  companyWebsite?: string;
  isVerified?: boolean;
}

export type UpdateRecruiterProfilePayload = {
  name: string;
  countryCode: string;
  phone: string;
  companyName: string;
  designation: string;
  companyWebsite: string;
};

/**
 * GET /api/recruiter/profile
 */
export const getRecruiterProfile = async (): Promise<RecruiterProfile> => {
  const { data } =
    await api.get<ApiEnvelope<{ recruiter: RecruiterProfile }>>(
      '/recruiter/profile'
    );

  return data.data.recruiter;
};

/**
 * PATCH /api/recruiter/profile
 */
export const updateRecruiterProfile = async (
  payload: UpdateRecruiterProfilePayload
): Promise<RecruiterProfile> => {
  const { data } =
    await api.patch<ApiEnvelope<{ recruiter: RecruiterProfile }>>(
      '/recruiter/profile',
      payload
    );

  return data.data.recruiter;
};

// ─── Candidates ────────────────────────────────────────────────

/**
 * GET /api/recruiter/candidates
 */
export const getRecruiterCandidates = async (): Promise<Candidate[]> => {
  const { data } =
    await api.get<ApiEnvelope<{ candidates: any[] }>>(
      '/recruiter/candidates'
    );

  return data.data.candidates.map(transformCandidate);
};

/**
 * GET /api/recruiter/jobs/:jobId/candidates
 * Fetches candidates for a specific job and applies pure ATS ranking.
 */
export const getJobCandidates = async (jobId: string): Promise<Candidate[]> => {
  const { data } =
    await api.get<ApiEnvelope<{ candidates: any[] }>>(
      `/recruiter/jobs/${jobId}/candidates`
    );

  const transformed = data.data.candidates.map((c: any) =>
    transformCandidate({ ...c, jobId: c.jobId || jobId })
  );

  // Apply pure ranking function on the applicants for this specific job
  return rankApplicants(transformed, jobId);
};

/**
 * GET /api/recruiter/candidates/:uniqueId/profile
 */
export const getCandidateProfile = async (
  uniqueId: string
): Promise<CandidateProfile> => {
  const { data } = await api.get<ApiEnvelope<{ candidate: any }>>(
    `/recruiter/candidates/${encodeURIComponent(uniqueId)}/profile`
  );

  return {
    ...transformCandidate(data.data.candidate),
    profilePhoto: data.data.candidate.profilePhoto,
    summary: data.data.candidate.summary,
    education: data.data.candidate.education || [],
    socialProfiles: data.data.candidate.socialProfiles || [],
    currentCollege: data.data.candidate.currentCollege,
    department: data.data.candidate.department,
    course: data.data.candidate.course,
  };
};

/**
 * PATCH /api/recruiter/candidates/:applicationId/status
 */
export const updateCandidateStatus = async (
  applicationId: string,
  status: Candidate['status']
): Promise<void> => {
  await api.patch(
    `/recruiter/candidates/${applicationId}/status`,
    { status }
  );
};

export const recruiterService = {
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterCandidates,
  getJobCandidates,
  getCandidateProfile,
  updateCandidateStatus,
  getRecruiterProfile,
  updateRecruiterProfile,
};