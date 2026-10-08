import { create } from 'zustand';
import { recruiterService } from '../services/recruiter.service';
import type { JSONContent } from '@tiptap/react';

const APP_STATE_KEY = 'tf_autosave_state';

const getStorageKey = (userId?: string) =>
  userId ? `${APP_STATE_KEY}_${userId}` : APP_STATE_KEY;

export type CandidateStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export const formatExperience = (value: number | null | undefined): string => {
  const yearsValue = Number(value);
  if (!Number.isFinite(yearsValue) || yearsValue <= 0) return '0 yrs';

  const totalMonths = Math.max(0, Math.round(yearsValue * 12));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ') || '0 yrs';
};

export interface CandidateWorkExperience {
  company: string;
  role: string;
  description: string;
  type: string;
  startDate?: string;
  endDate?: string;
}

export interface Candidate {
  id: string;
  applicationId?: string;
  jobId?: string;
  uniqueId?: string;

  name: string;
  role: string;
  experience: number;

  // Work experience history (for recruiter dashboard)
  workExperience?: CandidateWorkExperience[];

  skills: string[];

  location: string;

  status: CandidateStatus;

  email: string;
  phone?: string;
  resumeUrl?: string;

  appliedDate: string;

  avatar: string;

  appliedJob?: string;
  jobTitle?: string;
}


export interface Job {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  applicants: number;
  status: 'Active' | 'Closed' | 'Draft';
  postedDate: string;
  description: JSONContent | string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: 'LPA' | 'USD/year' | 'Custom';
  maxApplicants?: number | null;
  jobType?: string;
  isRemote?: boolean;
  editedAt?: Date;
}

interface RecruiterStore {
  candidates: Candidate[];
  jobCandidates: Candidate[];
  jobs: Job[];
  loading: boolean;
  error: string | null;
  selectedJobId: string | null;
  fetchJobs: () => Promise<void>;
  fetchCandidates: () => Promise<void>;
  fetchJobCandidates: (jobId: string) => Promise<void>;
  updateCandidateStatus: (id: string, status: CandidateStatus) => Promise<void>;
  createJob: (job: Omit<Job, 'id' | 'applicants' | 'postedDate'>) => Promise<void>;
  updateJob: (jobId: string, job: Partial<Omit<Job, 'id' | 'applicants' | 'postedDate'>>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  setSelectedJobId: (jobId: string | null) => void;
}

export const useStore = create<RecruiterStore>()((set) => ({
  candidates: [],
  jobCandidates: [],
  jobs: [],
  loading: false,
  error: null,
  selectedJobId: null,

  async fetchJobs() {
    set({ loading: true, error: null });
    try {
      const jobs = await recruiterService.getMyJobs();
      set({ jobs, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch jobs';
      set({ error: message, loading: false });
    }
  },

  async fetchCandidates() {
    console.log('FETCH CANDIDATES CALLED');

    set({ loading: true, error: null });

    try {
      const candidates = await recruiterService.getRecruiterCandidates();

      console.log('FETCH RESULT', candidates);

      set({
        candidates,
        loading: false,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async fetchJobCandidates(jobId: string) {
    set({ loading: true, error: null });
    try {
      const candidates = await recruiterService.getJobCandidates(jobId);
      set({ jobCandidates: candidates, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch job candidates';
      set({ error: message, loading: false });
    }
  },

  async updateCandidateStatus(id, status) {
    try {
      await recruiterService.updateCandidateStatus(id, status);
      // Optimistic update: update both candidates lists
      set((state) => {
        const updatedCandidates = state.candidates.map((c) =>
          c.id === id ? { ...c, status } : c
        );
        const updatedJobCandidates = state.jobCandidates.map((c) =>
          c.id === id ? { ...c, status } : c
        );

        return { candidates: updatedCandidates, jobCandidates: updatedJobCandidates };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update candidate status';
      set({ error: message });
    }
  },

  async createJob(job) {
    try {
      const newJob = await recruiterService.createJob(job);
      set((state) => {
        const jobs = [...state.jobs, newJob];

        return { jobs };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create job';
      set({ error: message });
    }
  },

  async updateJob(jobId, job) {
    try {
      const updatedJob = await recruiterService.updateJob(jobId, job);
      set((state) => {
        const jobs = state.jobs.map((j) => (j.id === jobId ? updatedJob : j));

        return { jobs };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update job';
      set({ error: message });
      throw err;
    }
  },

  async deleteJob(id) {
    try {
      await recruiterService.deleteJob(id);
      set((state) => {
        const jobs = state.jobs.filter((j) => j.id !== id);

        return { jobs };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete job';
      set({ error: message });
    }
  },

  setSelectedJobId(jobId: string | null) {
    set({ selectedJobId: jobId });
  },
}));

function getPersistableState() {
  const { candidates, jobs } = useStore.getState();
  return { candidates, jobs };
}

export function saveAppState(userId?: string) {
  try {
    const state = getPersistableState();
    localStorage.setItem(getStorageKey(userId), JSON.stringify(state));
  } catch {
    // Ignore write failures in browsers that block localStorage.
  }
}

export function restoreAppState(userId?: string) {
  if (typeof window === 'undefined') return;

  try {
    const key = getStorageKey(userId);
    localStorage.removeItem(key);
  } catch {
    // Silently ignore invalid saved state.
  }
}

// import { create } from 'zustand';
// import { recruiterService } from '../services/recruiter.service';
// import type { JSONContent } from '@tiptap/react';

// const APP_STATE_KEY = 'tf_autosave_state';

// const getStorageKey = (userId?: string) =>
//   userId ? `${APP_STATE_KEY}_${userId}` : APP_STATE_KEY;

// export type CandidateStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired';

// export interface CandidateWorkExperience {
//   company: string;
//   role: string;
//   description: string;
//   type: string;
//   startDate?: string;
//   endDate?: string;
// }

// export interface Candidate {
//   id: string;
//   applicationId?: string;
//   jobId?: string;

//   name: string;
//   role: string;
//   experience: number;

//   // Work experience history (for recruiter dashboard)
//   workExperience?: CandidateWorkExperience[];

//   skills: string[];

//   location: string;

//   status: CandidateStatus;

//   email: string;

//   appliedDate: string;

//   avatar: string;

//   appliedJob?: string;
//   jobTitle?: string;
// }


// export interface Job {
//   id: string;
//   title: string;
//   company: string;
//   department: string;
//   location: string;
//   applicants: number;
//   status: 'Active' | 'Closed' | 'Draft';
//   postedDate: string;
//   description: JSONContent | string;
//   salaryMin?: number;
//   salaryMax?: number;
//   salaryCurrency?: 'LPA' | 'USD/year' | 'Custom';
//   maxApplicants?: number | null;
//   jobType?: string;
//   isRemote?: boolean;
//   editedAt?: Date;
// }

// interface RecruiterStore {
//   candidates: Candidate[];
//   jobCandidates: Candidate[];
//   jobs: Job[];
//   loading: boolean;
//   error: string | null;
//   selectedJobId: string | null;
//   fetchJobs: () => Promise<void>;
//   fetchCandidates: () => Promise<void>;
//   fetchJobCandidates: (jobId: string) => Promise<void>;
//   updateCandidateStatus: (id: string, status: CandidateStatus) => Promise<void>;
//   createJob: (job: Omit<Job, 'id' | 'applicants' | 'postedDate'>) => Promise<void>;
//   updateJob: (jobId: string, job: Partial<Omit<Job, 'id' | 'applicants' | 'postedDate'>>) => Promise<void>;
//   deleteJob: (id: string) => Promise<void>;
//   setSelectedJobId: (jobId: string | null) => void;
// }

// export const useStore = create<RecruiterStore>()((set) => ({
//   candidates: [],
//   jobCandidates: [],
//   jobs: [],
//   loading: false,
//   error: null,
//   selectedJobId: null,

//   async fetchJobs() {
//     set({ loading: true, error: null });
//     try {
//       const jobs = await recruiterService.getMyJobs();
//       set({ jobs, loading: false });
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Failed to fetch jobs';
//       set({ error: message, loading: false });
//     }
//   },

//   async fetchCandidates() {
//     console.log('FETCH CANDIDATES CALLED');

//     set({ loading: true, error: null });

//     try {
//       const candidates = await recruiterService.getRecruiterCandidates();

//       console.log('FETCH RESULT', candidates);

//       set({
//         candidates,
//         loading: false,
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   },

//   async fetchJobCandidates(jobId: string) {
//     set({ loading: true, error: null });
//     try {
//       const candidates = await recruiterService.getJobCandidates(jobId);
//       set({ jobCandidates: candidates, loading: false });
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Failed to fetch job candidates';
//       set({ error: message, loading: false });
//     }
//   },

//   async updateCandidateStatus(id, status) {
//     try {
//       await recruiterService.updateCandidateStatus(id, status);
//       // Optimistic update: update both candidates lists
//       set((state) => {
//         const updatedCandidates = state.candidates.map((c) =>
//           c.id === id ? { ...c, status } : c
//         );
//         const updatedJobCandidates = state.jobCandidates.map((c) =>
//           c.id === id ? { ...c, status } : c
//         );

//         return { candidates: updatedCandidates, jobCandidates: updatedJobCandidates };
//       });
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Failed to update candidate status';
//       set({ error: message });
//     }
//   },

//   async createJob(job) {
//     try {
//       const newJob = await recruiterService.createJob(job);
//       set((state) => {
//         const jobs = [...state.jobs, newJob];

//         return { jobs };
//       });
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Failed to create job';
//       set({ error: message });
//     }
//   },

//   async updateJob(jobId, job) {
//     try {
//       const updatedJob = await recruiterService.updateJob(jobId, job);
//       set((state) => {
//         const jobs = state.jobs.map((j) => (j.id === jobId ? updatedJob : j));

//         return { jobs };
//       });
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Failed to update job';
//       set({ error: message });
//       throw err;
//     }
//   },

//   async deleteJob(id) {
//     try {
//       await recruiterService.deleteJob(id);
//       set((state) => {
//         const jobs = state.jobs.filter((j) => j.id !== id);

//         return { jobs };
//       });
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Failed to delete job';
//       set({ error: message });
//     }
//   },

//   setSelectedJobId(jobId: string | null) {
//     set({ selectedJobId: jobId });
//   },
// }));

// function getPersistableState() {
//   const { candidates, jobs } = useStore.getState();
//   return { candidates, jobs };
// }

// export function saveAppState(userId?: string) {
//   try {
//     const state = getPersistableState();
//     localStorage.setItem(getStorageKey(userId), JSON.stringify(state));
//   } catch {
//     // Ignore write failures in browsers that block localStorage.
//   }
// }

// export function restoreAppState(userId?: string) {
//   if (typeof window === 'undefined') return;

//   try {
//     const key = getStorageKey(userId);
//     localStorage.removeItem(key);
//   } catch {
//     // Silently ignore invalid saved state.
//   }
// }