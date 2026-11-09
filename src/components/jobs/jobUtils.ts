import type { JSONContent } from '@tiptap/react';
import type { Job } from '../../store/useStore';

export const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']; // 'Freelance' removed: backend rejects it
export const workModes = [
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
] as const;
export const currencies = ['INR', 'USD', 'EUR', 'GBP'] as const;
export const salaryPeriods = [
  { value: 'annually', label: 'per year' },
  { value: 'monthly', label: 'per month' },
  { value: 'hourly', label: 'per hour' },
] as const;

export type JobForm = {
  title: string;
  company: string;
  department: string;
  location: string;
  description: JSONContent | string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: (typeof currencies)[number];
  salaryPeriod: (typeof salaryPeriods)[number]['value'];
  workMode: (typeof workModes)[number]['value'];
  maxApplicants: string;
  jobType: string;
};

export const emptyForm: JobForm = {
  title: '', company: '', department: '', location: '', description: '',
  salaryMin: '', salaryMax: '',
  salaryCurrency: 'INR', salaryPeriod: 'annually',
  workMode: 'onsite', maxApplicants: '', jobType: 'Full-time',
};

const PERIOD_SUFFIX = { hourly: '/hr', monthly: '/mo', annually: '/yr' } as const;

export const formatSalary = (job: Job) => {
  if (!job.salaryMax) return null;
  try {
    const nf = new Intl.NumberFormat(job.salaryCurrency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: job.salaryCurrency,
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    return `${nf.format(job.salaryMin ?? 0)}–${nf.format(job.salaryMax)} ${PERIOD_SUFFIX[job.salaryPeriod ?? 'annually']}`;
  } catch {
    return null; // old rows with a non-ISO currency like "LPA"
  }
};

export const EDIT_WINDOW_HOURS = 24;

// Single source of truth for the edit rule (window + edit-once)
export const getEditState = (job: Job) => {
  const hoursLeft = EDIT_WINDOW_HOURS - (Date.now() - new Date(job.postedDate).getTime()) / 36e5;
  if (hoursLeft <= 0) return { canEdit: false, hoursLeft: 0, reason: 'expired' as const };
  if (job.editedAt) return { canEdit: false, hoursLeft, reason: 'edited' as const };
  return { canEdit: true, hoursLeft, reason: null };
};

// Returns an error message, or null if valid
export const validateJobForm = (form: JobForm): string | null => {
  if (!form.title.trim()) return 'Job title is required';
  if (!form.company.trim()) return 'Company/Organization is required';
  if (form.workMode !== 'remote' && !form.location.trim()) return 'Location is required (or select Remote)';

  const min = form.salaryMin ? Number(form.salaryMin) : 0;
  const max = form.salaryMax ? Number(form.salaryMax) : 0;
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < 0) return 'Salary must be a valid positive number';
  if (min && !max) return 'Maximum salary is required when minimum is set';
  if (max && min > max) return 'Minimum salary cannot be greater than maximum salary';

  if (form.maxApplicants) {
    const n = parseInt(form.maxApplicants);
    if (isNaN(n) || n < 1) return 'Maximum applicants must be at least 1';
  }
  return null;
};

export const inputCls =
'w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed';

export const formFromJob = (job: Job): JobForm => ({
  title: job.title,
  company: job.company,
  department: job.department,
  location: job.location === 'Remote' ? '' : job.location,
  description: job.description ?? '',
  salaryMin: job.salaryMin?.toString() || '',
  salaryMax: job.salaryMax?.toString() || '',
  salaryCurrency: (job.salaryCurrency as JobForm['salaryCurrency']) ?? 'INR',
  salaryPeriod: job.salaryPeriod ?? 'annually',
  workMode: job.workMode ?? (job.isRemote ? 'remote' : 'onsite'),
  maxApplicants: job.maxApplicants?.toString() || '',
  jobType: job.jobType || 'Full-time',
});

export const currencySymbol = (c: string) =>
  ({ INR: '₹', USD: '$', EUR: '€', GBP: '£' } as Record<string, string>)[c] ?? c;

// Live preview for the form, e.g. "₹10L – ₹18L /yr"
export const formatSalaryRange = (
  min: number,
  max: number,
  currency: string,
  period: keyof typeof PERIOD_SUFFIX
) => {
  if (!max) return null;
  try {
    const nf = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    return `${nf.format(min || 0)} – ${nf.format(max)} ${PERIOD_SUFFIX[period]}`;
  } catch {
    return null;
  }
};