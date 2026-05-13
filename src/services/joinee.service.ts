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
