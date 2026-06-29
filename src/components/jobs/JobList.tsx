import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import type { Job } from '../../store/useStore';
import { Plus, Trash2, Users, Loader, AlertCircle, DollarSign, Edit2, Globe, ChevronDown } from 'lucide-react';
import LocationSelect from '../ui/LocationSelect';
import JobDetailModal from '../dashboard/JobDetailModal';

const statusColors: Record<Job['status'], string> = {
  Active: 'bg-green-100 text-green-700',
  Closed: 'bg-red-100 text-red-700',
  Draft: 'bg-gray-100 text-gray-600',
};

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const salaryTypes = ['LPA', 'USD/year', 'Custom'];

// Valid currency codes
const VALID_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 
  'MXN', 'SGD', 'HKD', 'NZD', 'ZAR', 'BRL', 'RUB', 'SEK', 'NOK',
  'DKK', 'NZD', 'AED', 'SAR', 'KWD', 'QAR', 'BHD', 'OMR', 'JOD'
];

export default function JobList() {
  const { jobs, loading, error, fetchJobs, createJob, deleteJob, setSelectedJobId } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobIdLocal] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCurrencyChecklist, setShowCurrencyChecklist] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    department: '',
    location: '',
    description: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'LPA' as 'LPA' | 'USD/year' | 'Custom',
    customCurrency: '',
    maxApplicants: '',
    jobType: 'Full-time',
    isRemote: false,
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

  const handleEditClick = (job: Job) => {
    const createdTime = new Date(job.postedDate);
    const currentTime = new Date();
    const hoursDiff = (currentTime.getTime() - createdTime.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      alert('Sorry but the edit option is available for the first 24 hours of job posting.');
      return;
    }

    if (job.editedAt) {
      alert('Job can only be edited once within 24 hours of posting.');
      return;
    }

    alert('⚠️ Note: Job can be edited only once and within 24 hours of posting. After that, it cannot be modified.');

    setIsEditing(true);
    setEditingJobId(job.id);
    setForm({
      title: job.title,
      company: job.department || '',
      department: job.department || '',
      location: job.location === 'Remote' ? '' : job.location,
      description: job.description,
      salaryMin: job.salaryMin?.toString() || '',
      salaryMax: job.salaryMax?.toString() || '',
      salaryCurrency: job.salaryCurrency || 'LPA',
      customCurrency: job.salaryCurrency === 'Custom' ? job.salaryCurrency : '',
      maxApplicants: job.maxApplicants?.toString() || '',
      jobType: job.jobType || 'Full-time',
      isRemote: job.isRemote || false,
    });
    setShowForm(true);
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

  const resetForm = () => {
    setForm({
      title: '',
      company: '',
      department: '',
      location: '',
      description: '',
      salaryMin: '',
      salaryMax: '',
      salaryCurrency: 'LPA',
      customCurrency: '',
      maxApplicants: '',
      jobType: 'Full-time',
      isRemote: false,
    });
    setIsEditing(false);
    setEditingJobId(null);
    setFormError(null);
    setShowCurrencyChecklist(false);
  };

  const validateCustomCurrency = (currency: string): boolean => {
    const upperCurrency = currency.toUpperCase().trim();
    return /^[A-Z]{3}$/.test(upperCurrency) && VALID_CURRENCIES.includes(upperCurrency);
  };

  const handleAdd = async () => {
    setFormError(null);

    if (!form.title.trim()) {
      setFormError('Job title is required');
      return;
    }
    if (!form.company.trim()) {
      setFormError('Company/Organization is required');
      return;
    }
    if (!form.isRemote && !form.location.trim()) {
      setFormError('Location is required (or select Remote)');
      return;
    }

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

    if (form.salaryCurrency === 'Custom') {
      if (!form.customCurrency.trim()) {
        setFormError('Please enter a valid currency code (e.g., USD, EUR, GBP)');
        return;
      }
      if (!validateCustomCurrency(form.customCurrency)) {
        setFormError('Invalid currency code. Must be a 3-letter code (e.g., USD, EUR, GBP)');
        return;
      }
    }

    if (form.maxApplicants) {
      const max = parseInt(form.maxApplicants);
      if (isNaN(max) || max < 1) {
        setFormError('Maximum applicants must be at least 1');
        return;
      }
    }

    try {
      setSubmitting(true);

      const jobData = {
        title: form.title.trim(),
        company: form.company.trim(),
        department: form.department.trim(),
        location: form.isRemote ? 'Remote' : form.location.trim(),
        description: form.description.trim(),
        status: 'Active' as const,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
        salaryCurrency: form.salaryCurrency === 'Custom' ? form.customCurrency.toUpperCase() : form.salaryCurrency,
        maxApplicants: form.maxApplicants ? parseInt(form.maxApplicants) : undefined,
        jobType: form.jobType,
        isRemote: form.isRemote,
      };

      console.log(isEditing ? '📝 Updating job:' : '📤 Creating job:', jobData);

      if (isEditing && editingJobId) {
        await createJob(jobData);
      } else {
        await createJob(jobData);
      }

      console.log('✅ Job saved successfully');

      resetForm();
      setShowForm(false);
      await fetchJobs();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save job';
      console.error('❌ Error:', message);
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalary = (job: Job) => {
    if (!job.salaryMin || !job.salaryMax) return null;

    switch (job.salaryCurrency) {
      case 'LPA':
        return `₹${job.salaryMin}–${job.salaryMax} LPA`;
      case 'USD/year':
        return `$${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()} USD/year`;
      default:
        return `${job.salaryMin}–${job.salaryMax} ${job.salaryCurrency}`;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            {jobs.length} Jobs
          </span>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={submitting}
          >
            <Plus size={15} />
            Add Job
          </button>
        </div>

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

        {showForm && (
          <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-3">
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
                  ⚠️ This job can be edited only once within 24 hours of posting.
                </p>
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
                Company/Organization *
              </label>
              <input
                type="text"
                placeholder="e.g., Acme Corp, Tech Startup"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                disabled={submitting}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Department
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

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Location *
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <LocationSelect
                    value={form.location}
                    onChange={(location) => setForm({ ...form, location })}
                    placeholder="Select location"
                  />
                </div>
                <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    checked={form.isRemote}
                    onChange={(e) => setForm({ ...form, isRemote: e.target.checked })}
                    disabled={submitting}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <Globe size={14} className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Remote</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Job Type *
              </label>
              <select
                value={form.jobType}
                onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                disabled={submitting}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Salary</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Min</label>
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
                  <label className="block text-xs text-gray-600 mb-1">Max</label>
                  <input
                    type="number"
                    placeholder="e.g., 18"
                    value={form.salaryMax}
                    onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                    disabled={submitting}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Currency</label>
                  <select
                    value={form.salaryCurrency}
                    onChange={(e) => {
                      setForm({ ...form, salaryCurrency: e.target.value as 'LPA' | 'USD/year' | 'Custom' });
                      if (e.target.value === 'Custom') {
                        setShowCurrencyChecklist(true);
                      }
                    }}
                    disabled={submitting}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {salaryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {form.salaryCurrency === 'Custom' && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Custom Currency Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., USD, EUR, GBP, INR"
                        value={form.customCurrency}
                        onChange={(e) => setForm({ ...form, customCurrency: e.target.value.toUpperCase() })}
                        disabled={submitting}
                        className="w-full text-sm border border-blue-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-blue-600 mt-1">Must be a 3-letter currency code</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCurrencyChecklist(!showCurrencyChecklist)}
                      className="mt-6 px-2 py-1 text-blue-600 hover:bg-blue-100 rounded transition"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  {showCurrencyChecklist && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Common Currencies:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY', 'MXN', 'SGD', 'HKD'].map((curr) => (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => setForm({ ...form, customCurrency: curr })}
                            className={`text-xs px-2 py-1 rounded transition ${
                              form.customCurrency === curr
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Select a currency or type a custom 3-letter code (e.g., BRL, RUB, SEK)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

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
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  isEditing ? 'Update Job' : 'Save Job'
                )}
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                disabled={submitting}
                className="flex-1 text-sm bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <Loader size={24} className="animate-spin text-indigo-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading jobs...</p>
          </div>
        )}

        <div className="divide-y divide-gray-50">
          {!loading && jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No jobs posted yet.</p>
              <p className="text-xs mt-1">Click "+ Add Job" to get started.</p>
            </div>
          ) : (
            jobs.map((job) => {
              const createdTime = new Date(job.postedDate);
              const currentTime = new Date();
              const hoursDiff = (currentTime.getTime() - createdTime.getTime()) / (1000 * 60 * 60);
              const canEdit = hoursDiff <= 24;
              const salaryDisplay = formatSalary(job);

              return (
                <div
                  key={job.id}
                  onClick={() => handleJobClick(job.id)}
                  className="p-4 hover:bg-indigo-50 transition cursor-pointer border-l-4 border-transparent hover:border-indigo-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{job.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {job.department} · {job.location}{job.isRemote ? ' (Remote)' : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(job);
                          }}
                          className="text-gray-400 hover:text-blue-500 transition"
                          title="Edit job (24-hour window)"
                        >
                          <Edit2 size={15} />
                        </button>
                      )}
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
                  </div>

                  <div className="flex items-center gap-3 flex-wrap mt-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users size={12} />
                      <span>{job.applicants} applicants</span>
                      {job.maxApplicants && (
                        <span className="text-gray-400">/ {job.maxApplicants}</span>
                      )}
                    </div>

                    {salaryDisplay && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <DollarSign size={12} />
                        <span>{salaryDisplay}</span>
                      </div>
                    )}

                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                      {job.jobType || 'Full-time'}
                    </span>

                    {job.isRemote && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
                        <Globe size={10} />
                        Remote
                      </span>
                    )}

                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      job.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : job.status === 'Draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {job.status}
                    </span>

                    {!canEdit && (
                      <span className="text-xs text-gray-400 italic">
                        Edit window closed
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

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