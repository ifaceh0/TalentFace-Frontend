// models/Job.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  location: string;
  applicants: number;
  status: 'Active' | 'Closed' | 'Draft';
  postedDate: Date;
  description: string;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  applicants: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Draft' },
  postedDate: { type: Date, default: Date.now },
  description: { type: String, required: true },
}, {
  timestamps: true,
});

export const Job = mongoose.model<IJob>('Job', JobSchema);