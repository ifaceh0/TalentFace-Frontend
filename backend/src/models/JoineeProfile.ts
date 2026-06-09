// models/JoineeProfile.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IJoineeProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profilePhoto?: string;
  currentCollege?: string;
  department?: string;
  course?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  summary?: string;
  skills?: string[];
  experience?: number;
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
  workExperience?: Array<{
    company?: string;
    role?: string;
    description?: string;
    type?: 'internship' | 'full-time' | 'part-time' | 'freelance';
    startDate?: string;
    endDate?: string;
    isCurrentlyWorking?: boolean;
  }>;
  projects?: Array<{
    title?: string;
    description?: string;
    techStack?: string[];
    link?: string;
    startDate?: string;
    endDate?: string;
    isOngoing?: boolean;
  }>;
  socialProfiles?: Array<{
    platform?: string;
    url?: string;
  }>;
  resumeUrl?: string;
  appliedJobs?: string[];
  profileComplete?: boolean;
  profileCompletionScore?: number;
}

const JoineeProfileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: String,
  email: String,
  role: { type: String, default: 'joinee' },
  phone: String,
  dateOfBirth: String,
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  profilePhoto: String,
  currentCollege: String,
  department: String,
  course: String,
  address: {
    line1: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  summary: String,
  skills: [String],
  experience: Number,
  education: [{
    degree: String,
    institution: String,
    board: String,
    startYear: Number,
    endYear: Number,
    percentage: Number,
    cgpa: Number,
    isCurrentlyStudying: Boolean,
  }],
  workExperience: [{
    company: String,
    role: String,
    description: String,
    type: { type: String, enum: ['internship', 'full-time', 'part-time', 'freelance'] },
    startDate: String,
    endDate: String,
    isCurrentlyWorking: Boolean,
  }],
  projects: [{
    title: String,
    description: String,
    techStack: [String],
    link: String,
    startDate: String,
    endDate: String,
    isOngoing: Boolean,
  }],
  socialProfiles: [{
    platform: String,
    url: String,
  }],
  resumeUrl: String,
  appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  profileComplete: { type: Boolean, default: false },
  profileCompletionScore: { type: Number, default: 0 },
}, { timestamps: true });

export const JoineeProfile = mongoose.model<IJoineeProfile>('JoineeProfile', JoineeProfileSchema);