import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import type { Job } from '../../store/useStore';
import { Plus, Trash2, Users, Loader, AlertCircle, DollarSign } from 'lucide-react';
import LocationSelect from '../ui/LocationSelect';
import JobDetailModal from '../dashboard/JobDetailModal'; 

// ← FIXED
const statusColors: Record<Job['status'], string> = {
  Active: 'bg-green-100 text-green-700',
  Closed: 'bg-red-100 text-red-700',
  Draft: 'bg-gray-100 text-gray-600',
};

export default function JobList() {
  const { jobs, loading, error, fetchJobs, createJob, deleteJob, setSelectedJobId } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobIdLocal] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    description: '',
    salaryMin: '',
    salaryMax: '',
    maxApplicants: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this job posting? This will remove it from the database.');
    if (!confirmed) return;

    setDeletingJobId(id);
    try {
      await deleteJob(id);
      await fetchJobs();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete job.';
      window.alert(message);
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleJobClick = (jobId: string) => {
    setSelectedJobIdLocal(jobId);
    setSelectedJobId(jobId);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedJobIdLocal(null);
    setSelectedJobId(null);
  };

  const handleAdd = async () => {
    setFormError(null);

    // Validation
    if (!form.title.trim()) {
      setFormError('Job title is required');
      return;
    }
    if (!form.department.trim()) {
      setFormError('Department is required');
      return;
    }
    if (!form.location.trim()) {
      setFormError('Location is required');
      return;
    }

    // Validate salary range if provided
    if (form.salaryMin || form.salaryMax) {
      const min = form.salaryMin ? parseInt(form.salaryMin) : 0;
      const max = form.salaryMax ? parseInt(form.salaryMax) : 0;

      if (form.salaryMin && isNaN(min)) {
        setFormError('Minimum salary must be a valid number');
        return;
      }
      if (form.salaryMax && isNaN(max)) {
        setFormError('Maximum salary must be a valid number');
        return;
      }
      if (form.salaryMin && form.salaryMax && min > max) {
        setFormError('Minimum salary cannot be greater than maximum salary');
        return;
      }
    }

    // Validate max applicants if provided
    if (form.maxApplicants) {
      const max = parseInt(form.maxApplicants);
      if (isNaN(max) || max < 1) {
        setFormError('Maximum applicants must be at least 1');
        return;
      }
    }

    try {
      setSubmitting(true);

      // ✅ Send all fields including new ones
      const jobData = {
        title: form.title.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        status: 'Active' as const,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
        maxApplicants: form.maxApplicants ? parseInt(form.maxApplicants) : undefined,
      };

      console.log('📤 Sending job data:', jobData);

      await createJob(jobData);

      console.log('✅ Job created successfully');

      // Reset form
      setForm({
        title: '',
        department: '',
        location: '',
        description: '',
        salaryMin: '',
        salaryMax: '',
        maxApplicants: '',
      });
      setShowForm(false);

      // Refresh job list
      await fetchJobs();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create job';
      console.error('❌ Error creating job:', message);
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            {jobs.length} Jobs
          </span>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormError(null);
            }}
            className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={submitting}
          >
            <Plus size={15} />
            Add Job
          </button>
        </div>

        {/* Global Error */}
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

        {/* Add Job Form */}
        {showForm && (
          <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-3">
            {/* Form Error */}
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{formError}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Senior Software Engineer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                disabled={submitting}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Department *
              </label>
              <input
                type="text"
                placeholder="e.g., Engineering, Marketing"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                disabled={submitting}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Location *
              </label>
              <LocationSelect
                value={form.location}
                onChange={(location) => setForm({ ...form, location })}
                placeholder="Select location"
              />
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Min Salary (LPA)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 12"
                  value={form.salaryMin}
                  onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                  disabled={submitting}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Max Salary (LPA)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 18"
                  value={form.salaryMax}
                  onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                  disabled={submitting}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Max Applicants */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Applicants (Optional)
              </label>
              <input
                type="number"
                placeholder="Leave empty for unlimited applicants"
                value={form.maxApplicants}
                onChange={(e) => setForm({ ...form, maxApplicants: e.target.value })}
                disabled={submitting}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Job description, responsibilities, requirements..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={submitting}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAdd}
                disabled={submitting}
                className="flex-1 text-sm bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Job'
                )}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormError(null);
                }}
                disabled={submitting}
                className="flex-1 text-sm bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <Loader size={24} className="animate-spin text-indigo-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading jobs...</p>
          </div>
        )}

        {/* Job Items */}
        <div className="divide-y divide-gray-50">
          {!loading && jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No jobs posted yet.</p>
              <p className="text-xs mt-1">Click "+ Add Job" to get started.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job.id)}
                className="p-4 hover:bg-indigo-50 transition cursor-pointer border-l-4 border-transparent hover:border-indigo-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{job.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {job.department} · {job.location}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(job.id);
                    }}
                    className="text-gray-300 hover:text-red-500 transition"
                    disabled={deletingJobId === job.id}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={12} />
                    <span>{job.applicants} applicants</span>
                    {job.maxApplicants && (
                      <span className="text-gray-400">/ {job.maxApplicants}</span>
                    )}
                  </div>

                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <DollarSign size={12} />
                      <span>₹{job.salaryMin}–{job.salaryMax} LPA</span>
                    </div>
                  )}

                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[job.status]}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJobId && (
        <JobDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseModal}
          jobId={selectedJobId}
        />
      )}
    </>
  );
}