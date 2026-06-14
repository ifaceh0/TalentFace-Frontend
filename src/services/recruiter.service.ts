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
  department: job.department || '',
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
    : new Date().toISOString().split('T')[0],
});

const transformCandidate = (candidate: any): Candidate => ({
  id: candidate.id || candidate._id,
  name: candidate.name,
  role: candidate.role || '',
  experience: candidate.experience || 0,
  skills: candidate.skills || [],
  location: candidate.location || '',
  status: candidate.status,
  email: candidate.email,
  appliedDate: candidate.appliedDate
    ? new Date(candidate.appliedDate).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0],
  avatar: candidate.avatar || '',
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
  updateCandidateStatus,
};