// models/Candidate.ts
import mongoose, { Schema, Document } from 'mongoose';

export type CandidateStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired';

export interface ICandidate extends Document {
  name: string;
  role: string;
  experience: number;
  skills: string[];
  location: string;
  status: CandidateStatus;
  email: string;
  appliedDate: Date;
  avatar: string;
}

const CandidateSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: Number, required: true },
  skills: [{ type: String }],
  location: { type: String, required: true },
  status: { type: String, enum: ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Hired'], required: true },
  email: { type: String, required: true },
  appliedDate: { type: Date, default: Date.now },
  avatar: { type: String },
}, {
  timestamps: true,
});

export const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);