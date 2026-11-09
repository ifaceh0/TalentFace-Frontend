import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useStore } from '../../store/useStore';
import type { Job } from '../../store/useStore';
import { Plus, AlertCircle, Search, X, Briefcase } from 'lucide-react';
import JobRow from './JobRow';
import JobDetailModal from '../dashboard/JobDetailModal';
import type { JobDetailTab } from '../dashboard/JobDetailModal';
import { getEditState } from './jobUtils';
import JobFormPanel from './JobFormPanel';
import ConfirmDialog from './ConfirmDialog';
import { useShallow } from 'zustand/react/shallow';

// ---- No longer used here (moved in Steps 1–4) ----
// import type { JSONContent } from '@tiptap/react';
// import { Plus, Trash2, Users, Loader, AlertCircle, DollarSign, Edit2, Globe, Heart, Trophy } from 'lucide-react';  // row icons -> JobRow.tsx
// import LocationSelect from '../ui/LocationSelect';      // -> JobFormPanel.tsx
// import RichTextEditor from '../ui/RichTextEditor';      // -> JobFormPanel.tsx
// import { jobTypes, workModes, currencies, salaryPeriods, emptyForm, formatSalary, validateJobForm } from './jobUtils';
// import type { JobForm } from './jobUtils';
// (constants, JobForm type, emptyForm, formatSalary -> jobUtils.ts)

const FILTERS = ['All', 'Active', 'Draft', 'Closed'] as const;
type StatusFilter = (typeof FILTERS)[number];
const statusOf = (job: Job): Exclude<StatusFilter, 'All'> =>
  job.status === 'Active' ? 'Active' : job.status === 'Draft' ? 'Draft' : 'Closed';

interface JobListProps {
  onJobClick?: (jobId: string) => void;
  onReviewCandidates?: (jobId: string) => void;
  scrollable?: boolean;
}

export default function JobList({
  onJobClick,
  onReviewCandidates,
  scrollable = false,
}: JobListProps) {
  // const { jobs, loading, error, fetchJobs, deleteJob, setSelectedJobId } = useStore();
  const { jobs, loading, error, fetchJobs, deleteJob, closeJob, setSelectedJobId } = useStore(
    useShallow((s) => ({
      jobs: s.jobs,
      loading: s.loading,
      error: s.error,
      fetchJobs: s.fetchJobs,
      deleteJob: s.deleteJob,
      closeJob: s.closeJob,
      setSelectedJobId: s.setSelectedJobId,
    }))
  );
  // const { jobs, loading, error, fetchJobs, createJob, updateJob, deleteJob, setSelectedJobId } = useStore(); // createJob/updateJob -> JobFormPanel

  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmCloseId, setConfirmCloseId] = useState<string | null>(null);
  const [closingJobId, setClosingJobId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobIdLocal] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalTab, setModalTab] = useState<JobDetailTab>('ranked');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('All');

  const counts = useMemo(() => {
    const c = { All: jobs.length, Active: 0, Draft: 0, Closed: 0 };
    jobs.forEach((j) => { c[statusOf(j)]++; });
    return c;
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (filter !== 'All' && statusOf(j) !== filter) return false;
      if (!q) return true;
      return [j.title, j.company, j.department, j.location]
        .some((v) => typeof v === 'string' && v.toLowerCase().includes(q));
    });
  }, [jobs, search, filter]);

  // Form state moved to JobFormPanel.tsx:
  // const [isEditing, setIsEditing] = useState(false);
  // const [editingJobId, setEditingJobId] = useState<string | null>(null);
  // const [submitting, setSubmitting] = useState(false);
  // const [formError, setFormError] = useState<string | null>(null);
  // const [form, setForm] = useState<JobForm>(emptyForm);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // ---- Delete (Step 4: confirm dialog + toast) ----
  const handleDelete = useCallback((id: string) => setConfirmDeleteId(id), []);

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setDeletingJobId(id);
    try {
      await deleteJob(id);
      await fetchJobs();
      toast.success('Job deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete job.');
    } finally {
      setDeletingJobId(null);
      setConfirmDeleteId(null);
    }
  };

  // const handleDelete = async (id: string) => {
  //   const confirmed = window.confirm('Delete this job posting? This will remove it from the database.');
  //   if (!confirmed) return;
  //   setDeletingJobId(id);
  //   try {
  //     await deleteJob(id);
  //     await fetchJobs();
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : 'Unable to delete job.';
  //     window.alert(message);
  //   } finally {
  //     setDeletingJobId(null);
  //   }
  // };

    // ---- Close ----
  const handleClose = useCallback((id: string) => setConfirmCloseId(id), []);

  const confirmClose = async () => {
    if (!confirmCloseId) return;
    const id = confirmCloseId;
    setClosingJobId(id);
    try {
      await closeJob(id);
      toast.success('Job closed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to close job.');
    } finally {
      setClosingJobId(null);
      setConfirmCloseId(null);
    }
  };

  // ---- Edit ----
  const handleEditClick = useCallback((job: Job) => {
    const { canEdit, reason } = getEditState(job);
    if (!canEdit) {
      toast.error(
        reason === 'edited'
          ? 'Job can only be edited once within 24 hours of posting.'
          : 'The edit option is only available for the first 24 hours after posting.'
      );
      return;
    }

    // Covered by getEditState (reason === 'edited'):
    // if (job.editedAt) {
    //   alert('Job can only be edited once within 24 hours of posting.');
    //   return;
    // }

    // Drawer shows this notice inline now:
    // alert('⚠️ Note: Job can be edited only once and within 24 hours of posting. After that, it cannot be modified.');

    setEditingJob(job);
    setShowForm(true);
  }, []);

  // ---- Open detail modal ----
  const handleJobClick = useCallback(
    (jobId: string, initialTab: JobDetailTab = 'ranked') => {
      if (onJobClick) {
        onJobClick(jobId);
        return;
      }
      setSelectedJobIdLocal(jobId);
      setSelectedJobId(jobId);
      setModalTab(initialTab);
      setShowDetailModal(true);
    },
    [onJobClick, setSelectedJobId]
  );

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedJobIdLocal(null);
    setSelectedJobId(null);
  };

  const handleReview = useCallback(
    (jobId: string) => {
      setSelectedJobId(jobId);
      onReviewCandidates?.(jobId);
    },
    [setSelectedJobId, onReviewCandidates]
  );

  // resetForm, validateCustomCurrency, handleAdd -> now in JobFormPanel.tsx (handleSubmit) + jobUtils.ts (validateJobForm)

  if (showDetailModal && selectedJobId) {
    return (
      <JobDetailModal
        isOpen
        onClose={handleCloseModal}
        jobId={selectedJobId}
        displayMode="inline-fullscreen"
        initialTab={modalTab}
        onEdit={(jobId) => {
          const job = jobs.find((j) => j.id === jobId);
          if (job) {
            handleCloseModal();
            handleEditClick(job);
          }
        }}
      />
    );
  }

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 ${scrollable ? 'max-h-[480px] overflow-y-auto' : ''}`}>
        <div className={`bg-white border-b border-gray-100 ${scrollable ? 'sticky top-0 z-10' : ''}`}>
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                aria-label="Search jobs"
                className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-8 py-1.5 outline-none focus:ring-2 focus:ring-indigo-300"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setEditingJob(null);
                setShowForm(true);
              }}
              className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus size={15} />
              Add Job
            </button>
          </div>

          <div className="flex gap-1 px-4 pb-2 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition ${
                  filter === f ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f}
                <span className={`text-[10px] px-1.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{jobs.length} Jobs</span>
          <button
            onClick={() => {
              setEditingJob(null);
              setShowForm(true);
            }}
            className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus size={15} />
            Add Job
          </button>
        </div> */}

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 flex gap-3">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={() => fetchJobs()}
                className="text-xs text-red-600 hover:text-red-700 mt-1 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Old inline form block (the big {showForm && (<div ...>)} with all inputs)
            -> replaced by <JobFormPanel /> drawer rendered at the bottom of this component */}

        {/* {loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <Loader size={24} className="animate-spin text-indigo-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading jobs...</p>
          </div>
        )} */}
        {loading && jobs.length === 0 && (
          <div className="divide-y divide-gray-50">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-gray-100" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                  <div className="h-3 w-1/4 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          className="divide-y divide-gray-50"
          // className={`divide-y divide-gray-50 ${
          //   scrollable ? 'max-h-[350px] overflow-y-auto' : ''
          // }`}
        >
          {!loading && filteredJobs.length === 0 ? (
            <div className="text-center py-14 px-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 ring-1 ring-gray-200 flex items-center justify-center mx-auto mb-3">
                <Briefcase size={20} className="text-gray-400" />
              </div>
              {jobs.length === 0 ? (
                <>
                  <p className="text-sm font-medium text-gray-700">No jobs posted yet</p>
                  <p className="text-xs text-gray-400 mt-1">Post your first job to start receiving applicants.</p>
                  <button
                    onClick={() => { setEditingJob(null); setShowForm(true); }}
                    className="mt-4 inline-flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Plus size={15} />
                    Add Job
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">No matching jobs</p>
                  <button
                    onClick={() => { setSearch(''); setFilter('All'); }}
                    className="mt-2 text-xs text-indigo-600 hover:underline"
                  >
                    Clear search and filters
                  </button>
                </>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                deleting={deletingJobId === job.id}
                onOpen={handleJobClick}
                onReview={handleReview}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onClose={handleClose}
              />
            ))
          )}

          {/* {!loading && jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No jobs posted yet.</p>
              <p className="text-xs mt-1">Click "+ Add Job" to get started.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                deleting={deletingJobId === job.id}
                onOpen={handleJobClick}
                onReview={handleReview}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            ))
            // Old inline row markup (jobs.map((job) => { ... })) -> JobRow.tsx
          )} */}
        </div>
      </div>

      {confirmDeleteId && (
        <ConfirmDialog
          title="Delete this job?"
          message="This permanently removes the posting from the database."
          loading={deletingJobId === confirmDeleteId}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}

      {confirmCloseId && (
        <ConfirmDialog
          title="Close this job?"
          confirmLabel="Close job"
          variant="warning"
          message="New applications will stop immediately. This can't be undone from the dashboard."
          loading={closingJobId === confirmCloseId}
          onConfirm={confirmClose}
          onCancel={() => setConfirmCloseId(null)}
        />
      )}

      {showForm && (
        <JobFormPanel
          editingJob={editingJob}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}