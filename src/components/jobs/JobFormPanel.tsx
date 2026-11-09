import { useEffect, useState, useCallback, useRef } from 'react';
import type { ReactNode, InputHTMLAttributes, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { X, Loader, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Job } from '../../store/useStore';
import LocationSelect from '../ui/LocationSelect';
import RichTextEditor from '../ui/RichTextEditor';
import {
  jobTypes, workModes, currencies, salaryPeriods,
  emptyForm, formFromJob, inputCls, validateJobForm,
  currencySymbol, formatSalaryRange,
} from './jobUtils';
import type { JobForm } from './jobUtils';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{title}</h3>
      {children}
    </section>
  );
}

function MoneyInput({ symbol, ...props }: { symbol: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{symbol}</span>
      <input type="number" min={0} {...props} className={`${inputCls} pl-8`} />
    </div>
  );
}

interface JobFormPanelProps {
  editingJob: Job | null;
  onClose: () => void;
}

export default function JobFormPanel({ editingJob, onClose }: JobFormPanelProps) {
  // const { createJob, updateJob, fetchJobs } = useStore();
  const { createJob, updateJob, fetchJobs } = useStore(
    useShallow((s) => ({ createJob: s.createJob, updateJob: s.updateJob, fetchJobs: s.fetchJobs }))
  );

  const isEditing = !!editingJob;
  const [form, setForm] = useState<JobForm>(() => (editingJob ? formFromJob(editingJob) : emptyForm));
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [shown, setShown] = useState(false);

  const set = <K extends keyof JobForm>(key: K, value: JobForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const salaryPreview = formatSalaryRange(
    Number(form.salaryMin) || 0,
    Number(form.salaryMax) || 0,
    form.salaryCurrency,
    form.salaryPeriod
  );

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setShown(true);
      titleRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // slide-out, then tell the parent to unmount (matches duration-200)
  const requestClose = useCallback(() => {
    setShown(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  const panelRef = useRef<HTMLElement>(null);

  // lock page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // restore focus to whatever opened the drawer
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    return () => opener?.focus?.();
  }, []);

  // keep Tab inside the drawer
  const trapTab = (e: ReactKeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const els = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[contenteditable="true"],[tabindex]:not([tabindex="-1"])'
    );
    if (!els || !els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestClose, submitting]);

  const handleSubmit = async () => {
    setFormError(null);
    const validationError = validateJobForm(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const jobData = {
      title: form.title.trim(),
      company: form.company.trim(),
      department: form.department.trim(),
      location: form.workMode === 'remote' ? 'Remote' : form.location.trim(),
      description: form.description,
      status: 'Active' as const,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : 0,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : 0,
      salaryCurrency: form.salaryCurrency,
      salaryPeriod: form.salaryPeriod,
      maxApplicants: form.maxApplicants ? parseInt(form.maxApplicants) : undefined,
      jobType: form.jobType,
      workMode: form.workMode,
      isRemote: form.workMode === 'remote',
    };

    try {
      setSubmitting(true);
      if (editingJob) await updateJob(editingJob.id, jobData);
      else await createJob(jobData);
      await fetchJobs();
      toast.success(isEditing ? 'Job updated' : 'Job created');
      requestClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save job');
      toast.error(err instanceof Error ? err.message : 'Failed to save job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={submitting ? undefined : requestClose}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${shown ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        ref={panelRef}
        onKeyDown={trapTab}
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? 'Edit job' : 'Add job'}
        className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col transition-transform duration-200 ${shown ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{isEditing ? 'Edit Job' : 'Add Job'}</h2>
          <button
            type="button"
            onClick={requestClose}
            disabled={submitting}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}

          {isEditing && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
              <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">
                This job can be edited only once within 24 hours of posting.
              </p>
            </div>
          )}

          <Section title="Basics">
            <Field label="Job Title *">
              <input
                ref={titleRef}
                type="text"
                placeholder="e.g., Senior Software Engineer"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                disabled={submitting}
                className={inputCls}
              />
            </Field>

            <Field label="Company/Organization *">
              <input
                type="text"
                placeholder="e.g., Acme Corp, Tech Startup"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                disabled={submitting}
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Department">
                <input
                  type="text"
                  placeholder="e.g., Engineering"
                  value={form.department}
                  onChange={(e) => set('department', e.target.value)}
                  disabled={submitting}
                  className={inputCls}
                />
              </Field>

              <Field label="Job Type *">
                <select
                  value={form.jobType}
                  onChange={(e) => set('jobType', e.target.value)}
                  disabled={submitting}
                  className={inputCls}
                >
                  {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Work & location">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Work Mode *">
                <select
                  value={form.workMode}
                  onChange={(e) => set('workMode', e.target.value as JobForm['workMode'])}
                  disabled={submitting}
                  className={inputCls}
                >
                  {workModes.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </Field>

              {form.workMode !== 'remote' && (
                <Field label="Location *">
                  <LocationSelect
                    value={form.location}
                    onChange={(location) => set('location', location)}
                    placeholder="Select location"
                  />
                </Field>
              )}
            </div>
          </Section>

          <Section title="Compensation">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Min">
                <MoneyInput
                  symbol={currencySymbol(form.salaryCurrency)}
                  placeholder="1000000"
                  value={form.salaryMin}
                  onChange={(e) => set('salaryMin', e.target.value)}
                  disabled={submitting}
                />
              </Field>

              <Field label="Max">
                <MoneyInput
                  symbol={currencySymbol(form.salaryCurrency)}
                  placeholder="1800000"
                  value={form.salaryMax}
                  onChange={(e) => set('salaryMax', e.target.value)}
                  disabled={submitting}
                />
              </Field>

              <Field label="Currency">
                <select
                  value={form.salaryCurrency}
                  onChange={(e) => set('salaryCurrency', e.target.value as JobForm['salaryCurrency'])}
                  disabled={submitting}
                  className={inputCls}
                >
                  {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Period">
                <select
                  value={form.salaryPeriod}
                  onChange={(e) => set('salaryPeriod', e.target.value as JobForm['salaryPeriod'])}
                  disabled={submitting}
                  className={inputCls}
                >
                  {salaryPeriods.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </Field>
            </div>

            <p className="text-xs text-gray-500">
              {salaryPreview ? (
                <>Shown to candidates as <span className="font-semibold text-gray-800">{salaryPreview}</span></>
              ) : (
                'Enter full amounts (e.g., 1800000), not LPA.'
              )}
            </p>
          </Section>

          <Section title="Details">
            <Field label="Max Applicants (Optional)">
              <input
                type="number"
                placeholder="Leave empty for unlimited applicants"
                value={form.maxApplicants}
                onChange={(e) => set('maxApplicants', e.target.value)}
                disabled={submitting}
                className={inputCls}
              />
            </Field>

            <Field label="Description">
              <RichTextEditor
                content={form.description}
                onChange={(json) => set('description', json)}
                maxChars={1000}
                minHeight={100}
              />
            </Field>
          </Section>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 text-sm bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader size={14} className="animate-spin" />
                {isEditing ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              isEditing ? 'Update Job' : 'Save Job'
            )}
          </button>

          <button
            onClick={requestClose}
            disabled={submitting}
            className="flex-1 text-sm bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </aside>
    </div>
  );
}