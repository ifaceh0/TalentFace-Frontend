import api from '../lib/api';
import type { Candidate, Job } from '../store/useStore';

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

// ─── Helpers ─────────────────────────────────────────────────────

const transformJob = (job: any): Job => ({
  id: job._id || job.id,
  title: job.title,
  department: job.company || job.department || '',
  location: job.location,
  description: job.description || '',

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

const transformCandidate = (candidate: any): Candidate => ({
  id: candidate.id,
  applicationId: candidate.applicationId,
  jobId: candidate.jobId,
  name: candidate.name,
  role: candidate.role || 'Applicant',
  experience: candidate.experience ?? 0,
  skills: Array.isArray(candidate.skills) ? candidate.skills : [],
  location: candidate.location || 'Not Specified',
  status: candidate.status || 'Applied',
  email: candidate.email || '',
  appliedDate: candidate.appliedDate
    ? new Date(candidate.appliedDate).toISOString().split('T')[0]
    : '',
  avatar: candidate.avatar || candidate.name?.slice(0, 2).toUpperCase() || '??',
  jobTitle: candidate.jobTitle || candidate.appliedJob || candidate.job?.title || candidate.jobId?.title || '',
});

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

// ─── Candidates ────────────────────────────────────────────────

/**
 * GET /api/recruiter/candidates
 */
export const getRecruiterCandidates = async (): Promise<Candidate[]> => {
  const { data } =
    await api.get<ApiEnvelope<{ candidates: any[] }>>(
      '/recruiter/candidates'
    );

  console.log(
    'API RESPONSE:',
    data.data.candidates
  );

  return data.data.candidates.map(transformCandidate);
};

/**
 * GET /api/recruiter/jobs/:jobId/candidates
 * Get candidates for a specific job
 */
export const getJobCandidates = async (jobId: string): Promise<Candidate[]> => {
  const { data } =
    await api.get<ApiEnvelope<{ candidates: any[] }>>(
      `/recruiter/jobs/${jobId}/candidates`
    );

  return data.data.candidates.map(transformCandidate);
};

/**
 * PATCH /api/recruiter/candidates/:applicationId/status
 */
export const updateCandidateStatus = async (
  applicationId: string,
  status: string
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
  updateCandidateStatus,
};