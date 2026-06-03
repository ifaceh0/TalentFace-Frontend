import api from '../lib/api';
import type { Candidate, Job } from '../store/useStore';

/**
 * Transform MongoDB job document to frontend Job type
 */
const transformJob = (job: any): Job => ({
  id: job._id || job.id,
  title: job.title,
  department: job.department,
  location: job.location,
  description: job.description || '',
  status: job.status || 'Active',
  applicants: job.applicants || 0,
  postedDate: job.postedDate ? new Date(job.postedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
});

/**
 * Transform MongoDB candidate/application document to frontend Candidate type
 */
const transformCandidate = (candidate: any): Candidate => ({
  id: candidate.id || candidate._id,
  name: candidate.name,
  role: candidate.role || '',
  experience: candidate.experience || 0,
  skills: candidate.skills || [],
  location: candidate.location || '',
  status: candidate.status,
  email: candidate.email,
  appliedDate: candidate.appliedDate ? new Date(candidate.appliedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  avatar: candidate.avatar || '',
});

export const recruiterService = {
  // ── Job Management ────────────────────────────────────────────────────────────

  /**
   * GET /api/jobs
   * Fetch all jobs posted by the current recruiter
   */
  async getMyJobs(): Promise<Job[]> {
    const response = await api.get<{ data: { jobs: any[] } }>('/jobs');
    return response.data.data.jobs.map(transformJob);
  },

  /**
   * POST /api/jobs
   * Create a new job posting
   */
  async createJob(data: Omit<Job, 'id' | 'applicants' | 'postedDate'>): Promise<Job> {
    const response = await api.post<{ data: { job: any } }>('/jobs', data);
    return transformJob(response.data.data.job);
  },

  /**
   * PATCH /api/jobs/:id
   * Update an existing job
   */
  async updateJob(jobId: string, updates: Partial<Omit<Job, 'id' | 'applicants' | 'postedDate'>>): Promise<Job> {
    const response = await api.patch<{ data: { job: any } }>(`/jobs/${jobId}`, updates);
    return transformJob(response.data.data.job);
  },

  /**
   * DELETE /api/jobs/:id
   * Delete a job posting
   */
  async deleteJob(jobId: string): Promise<void> {
    await api.delete(`/jobs/${jobId}`);
  },

  // ── Candidate Management ──────────────────────────────────────────────────────

  /**
   * GET /api/jobs/all/candidates
   * Fetch all candidates across all recruiter's jobs
   */
  async getRecruiterCandidates(): Promise<Candidate[]> {
    const response = await api.get<{ data: { candidates: any[] } }>('/jobs/all/candidates');
    return response.data.data.candidates.map(transformCandidate);
  },

  /**
   * PATCH /api/jobs/candidates/:applicationId/status
   * Update candidate status (drag-and-drop pipeline)
   */
  async updateCandidateStatus(applicationId: string, status: string): Promise<void> {
    await api.patch(`/jobs/candidates/${applicationId}/status`, { status });
  },
};