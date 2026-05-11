export type CandidateStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: number;
  skills: string[];
  location: string;
  status: CandidateStatus;
  email: string;
  appliedDate: string;
  avatar: string;
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
}

export interface Stats {
  totalJobs: number;
  activeCandidates: number;
  interviewsScheduled: number;
  hiresCompleted: number;
}