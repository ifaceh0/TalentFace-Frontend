import { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Users, Clock } from 'lucide-react';
import { useStore } from '../../store/useStore';
import PipelineBoardFiltered from './PipelineBoardFiltered';

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

export default function JobDetailModal({ isOpen, onClose, jobId }: JobDetailModalProps) {
  const { jobs, jobCandidates, loading, fetchJobCandidates } = useStore();
  const [activeTab, setActiveTab] = useState<'details' | 'candidates'>('candidates');

  const job = jobs.find((j) => j.id === jobId);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobCandidates(jobId);
    }
  }, [isOpen, jobId, fetchJobCandidates]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{job?.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{job?.department}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Job Info Cards */}
        {activeTab === 'details' && job && (
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
                <PipelineBoardFiltered candidates={jobCandidates} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}