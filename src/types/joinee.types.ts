// ─── Sub-document types (matching current Joinee.model.js) ───────────────────

export interface Education {
  _id?: string;
  degree?: string;
  institution?: string;
  board?: string;
  startYear?: number;
  endYear?: number;
  percentage?: number;
  cgpa?: number;
  isCurrentlyStudying?: boolean;
}

export interface WorkExperience {
  _id?: string;
  company?: string;
  role?: string;
  description?: string;
  type?: 'internship' | 'full-time' | 'part-time' | 'freelance';
  startDate?: string;
  endDate?: string;
  isCurrentlyWorking?: boolean;
}

export interface Project {
  _id?: string;
  title?: string;
  description?: string;
  techStack?: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
}

export interface SocialProfile {
  platform?: 'linkedin' | 'github' | 'twitter' | 'portfolio' | 'hackerrank' | 'leetcode' | 'other';
  url?: string;
}

export interface Address {
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

// ─── Main profile type (discriminator — inherits name/email/role from User) ───

export interface JoineeProfile {
  _id?: string;

  // From User base schema
  name?: string;
  email?: string;
  role?: string;

  // Personal
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profilePhoto?: string;

  // College
  currentCollege?: string;
  department?: string;
  course?: string;

  // Address (single object)
  address?: Address;

  // Summary
  summary?: string;

  // Skills & experience
  skills?: string[];
  experience?: number;

  // Structured sections
  education?: Education[];
  workExperience?: WorkExperience[];
  projects?: Project[];
  socialProfiles?: SocialProfile[];

  // Resume
  resumeUrl?: string;

  // Applied jobs
  appliedJobs?: string[];

  // Meta
  profileComplete?: boolean;
  profileCompletionScore?: number;

  createdAt?: string;
  updatedAt?: string;
}
