import { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Users, Clock, Edit2, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import PipelineBoardFiltered from './PipelineBoardFiltered';

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  onEdit?: (jobId: string) => void;
  displayMode?: 'modal' | 'inline-fullscreen';
}

export default function JobDetailModal({
  isOpen,
  onClose,
  jobId,
  onEdit,
  displayMode = 'modal',
}: JobDetailModalProps) {
  const { jobs, jobCandidates, loading, fetchJobCandidates, updateCandidateStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'details' | 'candidates'>('candidates');
  const [canEdit, setCanEdit] = useState(false);
  const [updatingCandidateId, setUpdatingCandidateId] = useState<string | null>(null);
  const isInlineFullscreen = displayMode === 'inline-fullscreen';

  const job = jobs.find((j) => j.id === jobId);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobCandidates(jobId);

      // Check if within 24 hours
      if (job) {
        const createdTime = new Date(job.postedDate);
        const hoursDiff = (Date.now() - createdTime.getTime()) / (1000 * 60 * 60);
        setCanEdit(hoursDiff <= 24);
      }
    }
  }, [isOpen, jobId, job, fetchJobCandidates]);

  const handleEditClick = () => {
    if (!canEdit) {
      alert('Sorry but the edit option is available for the first 24 hours of job posting.');
      return;
    }

    alert('⚠️ Note: Job can be edited only once and within 24 hours of posting. After that, it cannot be modified.');

    if (onEdit) {
      onEdit(jobId);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === 'Shortlisted') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Interview') return 'bg-purple-100 text-purple-700';
    if (status === 'Offer') return 'bg-orange-100 text-orange-700';
    if (status === 'Hired') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  const handleRejectCandidate = async (candidateId: string) => {
    try {
      setUpdatingCandidateId(candidateId);
      await updateCandidateStatus(candidateId, 'Rejected');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reject candidate.';
      window.alert(message);
    } finally {
      setUpdatingCandidateId(null);
    }
  };

  const openCandidateProfile = (uniqueID?: string) => {
    if (!uniqueID) {
      window.alert('Candidate unique ID is missing.');
      return;
    }
    window.open(`/recruiter/candidate/${uniqueID}`, '_blank');
  };

  if (!isOpen) return null;
  const visibleCandidates = jobCandidates.filter((candidate) => candidate.status !== 'Rejected');
  const rejectedCandidates = jobCandidates.filter((candidate) => candidate.status === 'Rejected');

  const modalContent = (
    <>
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{job?.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{job?.department}</p>
          </div>
          <div className="flex gap-2 items-center">
            {isInlineFullscreen && (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <ArrowLeft size={14} />
                Back to jobs
              </button>
            )}
            {canEdit && (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                title="Edit job (24-hour window)"
              >
                <Edit2 size={14} />
                Edit
              </button>
            )}
            {!isInlineFullscreen && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Job Info Cards */}
        {job && (
          <div className="border-b border-gray-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">{job.location}</p>
              </div>
            </div>

            {job.salaryMin && job.salaryMax && (
              <div className="flex items-center gap-3">
                <DollarSign size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Salary</p>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{job.salaryMin}–{job.salaryMax} LPA
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Users size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Applicants</p>
                <p className="text-sm font-medium text-gray-900">
                  {jobCandidates.length}
                  {job.maxApplicants && ` / ${job.maxApplicants}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Posted</p>
                <p className="text-sm font-medium text-gray-900">{job.postedDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              activeTab === 'details'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Job Details
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              activeTab === 'candidates'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Candidate Pipeline ({jobCandidates.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'details' && job && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Type</h3>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                  {job.jobType || 'Full-time'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Company</h3>
                <p className="text-gray-600">{job.department}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
                <div className="inline-block">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : job.status === 'Draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>

              {job.maxApplicants && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Application Limit
                  </h3>
                  <p className="text-gray-600">
                    Maximum {job.maxApplicants} applicants ({jobCandidates.length} applied so far)
                  </p>
                </div>
              )}

              {!canEdit && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ✓ Edit window has closed. This job cannot be modified further.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading candidates...</p>
                </div>
              ) : jobCandidates.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Candidate Pipeline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {visibleCandidates.map((candidate) => (
                        <div
                          key={`pipeline-card-${candidate.id}`}
                          onClick={() => openCandidateProfile(candidate.uniqueID)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              openCandidateProfile(candidate.uniqueID);
                            }
                          }}
                          className="text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition cursor-pointer"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{candidate.name}</p>
                              <p className="text-xs text-gray-600">{candidate.email || 'N/A'}</p>
                              <p className="text-xs text-gray-500 mt-1">{candidate.phone || 'Phone not provided'}</p>
                              <p className="text-xs text-gray-500">{candidate.location || 'Location not provided'}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeClass(candidate.status)}`}>
                              {candidate.status}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(candidate.skills || []).slice(0, 4).map((skill) => (
                              <span key={`${candidate.id}-${skill}`} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleRejectCandidate(candidate.id);
                              }}
                              disabled={updatingCandidateId === candidate.id}
                              className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {updatingCandidateId === candidate.id ? 'Rejecting...' : 'Reject'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <PipelineBoardFiltered candidates={visibleCandidates} />
                  {rejectedCandidates.length > 0 && (
                    <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-red-800">Rejected Candidates</h3>
                        <span className="text-xs bg-white border border-red-200 text-red-700 px-2 py-0.5 rounded-full">
                          {rejectedCandidates.length}
                        </span>
                      </div>
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {rejectedCandidates.map((candidate) => (
                          <button
                            key={`rejected-card-${candidate.id}`}
                            type="button"
                            onClick={() => openCandidateProfile(candidate.uniqueID)}
                            className="w-full text-left p-3 rounded-lg border border-red-200 bg-white hover:border-red-300 transition"
                          >
                            <p className="text-sm font-semibold text-gray-900">{candidate.name}</p>
                            <p className="text-xs text-gray-600">{candidate.email || 'N/A'}</p>
                            <p className="text-xs text-gray-500 mt-1">{candidate.phone || 'Phone not provided'}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
    </>
  );

  if (isInlineFullscreen) {
    return (
      <div className="w-full min-h-[calc(100vh-8.5rem)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {modalContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {modalContent}
      </div>
    </div>
  );
}