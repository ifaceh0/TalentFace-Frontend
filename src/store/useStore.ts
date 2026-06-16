import { create } from 'zustand';
import { recruiterService } from '../services/recruiter.service';

const APP_STATE_KEY = 'tf_autosave_state';

const getStorageKey = (userId?: string) =>
  userId ? `${APP_STATE_KEY}_${userId}` : APP_STATE_KEY;

export type CandidateStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired';

export interface Candidate {
  id: string;
  applicationId?: string;
  jobId?: string;

  name: string;
  role: string;
  experience: number;
  skills: string[];

  location: string;

  status: CandidateStatus;

  email: string;

  appliedDate: string;

  avatar: string;

  appliedJob?: string;
  jobTitle?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  applicants: number;
  status: 'Active' | 'Closed' | 'Draft';
  postedDate: string;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  maxApplicants?: number | null;
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
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Array.isArray(parsed.jobs) &&
      Array.isArray(parsed.candidates)
    ) {
      useStore.setState({
        jobs: parsed.jobs,
        candidates: parsed.candidates,
      });
    }
  } catch {
    // Silently ignore invalid saved state.
  }
}