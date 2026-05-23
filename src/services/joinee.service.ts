import api from '../lib/api';
import type {
  JoineeProfile,
  Education,
  WorkExperience,
  Project,
  SocialProfile,
  Address,
} from '../types/joinee.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ApiEnvelope<T> = { success: boolean; message: string; data: T };

// ─── 1. Profile ───────────────────────────────────────────────────────────────

export const getProfile = async (): Promise<JoineeProfile> => {
  const { data } = await api.get<ApiEnvelope<{ joinee: JoineeProfile }>>('/joinee/profile');
  return data.data.joinee;
};

export const getProfileCompletion = async (): Promise<{ score: number; profileComplete: boolean }> => {
  const { data } = await api.get<ApiEnvelope<{ score: number; profileComplete: boolean }>>('/joinee/profile/completion');
  return data.data;
};

export const updateBasicDetails = async (payload: Partial<JoineeProfile>): Promise<JoineeProfile> => {
  const { data } = await api.patch<ApiEnvelope<{ joinee: JoineeProfile }>>('/joinee/profile/basic', payload);
  return data.data.joinee;
};

export const updateSummary = async (summary: string): Promise<{ summary: string }> => {
  const { data } = await api.patch<ApiEnvelope<{ summary: string }>>('/joinee/profile/summary', { summary });
  return data.data;
};

export const updateAddress = async (address: Address): Promise<{ address: Address }> => {
  const { data } = await api.patch<ApiEnvelope<{ address: Address }>>('/joinee/profile/address', { address });
  return data.data;
};

// export const uploadProfilePhoto = async (file: File): Promise<{ profilePhoto: string }> => {
//   const form = new FormData();
//   form.append('photo', file);
//   const { data } = await api.post<ApiEnvelope<{ profilePhoto: string }>>('/joinee/profile/photo', form, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data.data;
// };
export const uploadProfilePhoto = async (file: File): Promise<{ profilePhoto: string }> => {
  const form = new FormData();
  form.append('photo', file);
  const { data } = await api.post<ApiEnvelope<{ profilePhoto: string }>>(
    '/joinee/profile/photo',
    form
    // ← no headers needed; axios + browser sets the correct multipart boundary automatically
  );
  return data.data;
};

// ─── 2. Education ─────────────────────────────────────────────────────────────

export const getEducation = async (): Promise<Education[]> => {
  const { data } = await api.get<ApiEnvelope<{ education: Education[] }>>('/joinee/education');
  return data.data.education;
};

export const addEducation = async (payload: Education): Promise<Education[]> => {
  const { data } = await api.post<ApiEnvelope<{ education: Education[] }>>('/joinee/education', payload);
  return data.data.education;
};

export const updateEducation = async (eduId: string, payload: Education): Promise<Education[]> => {
  const { data } = await api.patch<ApiEnvelope<{ education: Education[] }>>(`/joinee/education/${eduId}`, payload);
  return data.data.education;
};

export const deleteEducation = async (eduId: string): Promise<Education[]> => {
  const { data } = await api.delete<ApiEnvelope<{ education: Education[] }>>(`/joinee/education/${eduId}`);
  return data.data.education;
};

// ─── 3. Work Experience ───────────────────────────────────────────────────────

export const getWorkExperience = async (): Promise<WorkExperience[]> => {
  const { data } = await api.get<ApiEnvelope<{ workExperience: WorkExperience[] }>>('/joinee/work-experience');
  return data.data.workExperience;
};

export const addWorkExperience = async (payload: WorkExperience): Promise<WorkExperience[]> => {
  const { data } = await api.post<ApiEnvelope<{ workExperience: WorkExperience[] }>>('/joinee/work-experience', payload);
  return data.data.workExperience;
};

export const updateWorkExperience = async (expId: string, payload: WorkExperience): Promise<WorkExperience[]> => {
  const { data } = await api.patch<ApiEnvelope<{ workExperience: WorkExperience[] }>>(`/joinee/work-experience/${expId}`, payload);
  return data.data.workExperience;
};

export const deleteWorkExperience = async (expId: string): Promise<WorkExperience[]> => {
  const { data } = await api.delete<ApiEnvelope<{ workExperience: WorkExperience[] }>>(`/joinee/work-experience/${expId}`);
  return data.data.workExperience;
};

// ─── 4. Skills ────────────────────────────────────────────────────────────────

export const updateSkills = async (skills: string[]): Promise<{ skills: string[] }> => {
  const { data } = await api.patch<ApiEnvelope<{ skills: string[] }>>('/joinee/skills', { skills });
  return data.data;
};

// ─── 5. Projects ──────────────────────────────────────────────────────────────

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<ApiEnvelope<{ projects: Project[] }>>('/joinee/projects');
  return data.data.projects;
};

export const addProject = async (payload: Project): Promise<Project[]> => {
  const { data } = await api.post<ApiEnvelope<{ projects: Project[] }>>('/joinee/projects', payload);
  return data.data.projects;
};

export const updateProject = async (projectId: string, payload: Project): Promise<Project[]> => {
  const { data } = await api.patch<ApiEnvelope<{ projects: Project[] }>>(`/joinee/projects/${projectId}`, payload);
  return data.data.projects;
};

export const deleteProject = async (projectId: string): Promise<Project[]> => {
  const { data } = await api.delete<ApiEnvelope<{ projects: Project[] }>>(`/joinee/projects/${projectId}`);
  return data.data.projects;
};

// ─── 6. Social Profiles ───────────────────────────────────────────────────────

export const updateSocialProfiles = async (socialProfiles: SocialProfile[]): Promise<SocialProfile[]> => {
  const { data } = await api.patch<ApiEnvelope<{ socialProfiles: SocialProfile[] }>>('/joinee/social-profiles', { socialProfiles });
  return data.data.socialProfiles;
};

// ─── 7. Resume ────────────────────────────────────────────────────────────────

// export const uploadResume = async (file: File): Promise<{ resumeUrl: string }> => {
//   const form = new FormData();
//   form.append('resume', file);
//   const { data } = await api.post<ApiEnvelope<{ resumeUrl: string }>>('/joinee/resume', form, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data.data;
// };
export const uploadResume = async (file: File): Promise<{ resumeUrl: string }> => {
  const form = new FormData();
  form.append('resume', file);
  const { data } = await api.post<ApiEnvelope<{ resumeUrl: string }>>(
    '/joinee/resume',
    form
  );
  return data.data;
};
// ── Jobs ──────────────────────────────────────────────────────────────────────

/**
 * GET /api/jobs
 * Params: status, page, limit, q (search), type (Full-time | Part-time | Contract | remote)
 * Returns: { jobs: Job[], hasNextPage: boolean, total: number }
 */
export const getJobs = async (
  params: Record<string, string> = {}
): Promise<{ jobs: any[]; hasNextPage: boolean; total: number }> => {
  const qs = new URLSearchParams(params).toString();
  const { data } = await api.get<ApiEnvelope<{ jobs: any[]; hasNextPage: boolean; total: number }>>(
    `/jobs${qs ? `?${qs}` : ''}`
  );
  return data.data; // ✅ unwrap the envelope
};

/**
 * GET /api/jobs/stats
 * Returns: { open: number, companies: number, remote: number }
 */
export const getJobStats = async (): Promise<{ open: number; companies: number; remote: number }> => {
  const { data } = await api.get<ApiEnvelope<{ open: number; companies: number; remote: number }>>('/jobs/stats');
  return data.data; // ✅
};
// ── Save / Unsave ─────────────────────────────────────────────────────────────

/**
 * POST /api/jobs/:id/save
 * Saves a job to the current user's saved list
 */
export const saveJob = async (jobId: number): Promise<void> => {
  await api.post(`/jobs/${jobId}/save`);
};

/**
 * DELETE /api/jobs/:id/save
 * Removes a job from the current user's saved list
 */
export const unsaveJob = async (jobId: number): Promise<void> => {
  await api.delete(`/jobs/${jobId}/save`);
};

/**
 * GET /api/jobs/saved/ids
 * Returns the list of job IDs the current user has saved
 * Returns: number[]
 *
 * If your backend returns full saved job objects instead, map to IDs:
 *   return res.data.map((j: any) => j.id);
 */
export const getSavedJobIds = async (): Promise<number[]> => {
  const { data } = await api.get<ApiEnvelope<number[]>>('/jobs/saved/ids');
  return data.data; // ✅
};
// ── Applications ──────────────────────────────────────────────────────────────

/**
 * POST /api/applications
 * Body: { jobId: number }
 * Returns 201 on success, 409 if already applied
 * Throws with .status = 409 if duplicate
 */
export const applyToJob = async (jobId: number): Promise<void> => {
  try {
    await api.post("/applications", { jobId });
  } catch (err: any) {
    // Re-throw with status so the caller can detect 409 duplicate
    const status = err?.response?.status;
    const error = new Error(err?.response?.data?.message ?? "Application failed") as any;
    error.status = status;
    throw error;
  }
};

