import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Users, Loader } from 'lucide-react';
import Modal from '../ui/Modal';
import { useStore } from '../../store/useStore';
import type { Job } from '../../store/useStore';

const statusColors: Record<Job['status'], string> = {
  Active: 'bg-green-100 text-green-700',
  Closed: 'bg-red-100 text-red-700',
  Draft: 'bg-gray-100 text-gray-600',
};

export default function JobOverviewGrid() {
  const { jobs, loading, fetchJobs } = useStore();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
  fetchJobs();
}, []);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedJob(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => handleJobClick(job)}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{job.title}</h3>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600 text-xs">
                <span className="font-medium text-gray-700">{job.department}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-xs">
                <MapPin size={14} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-xs">
                <Users size={14} />
                <span>{job.applicants} applicants</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[job.status]}`}>
                {job.status}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Briefcase size={48} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No job postings yet</p>
          <p className="text-gray-400 text-sm">Create your first job posting to get started</p>
        </div>
      )}

      {/* Dialog Modal */}
      <Modal
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title={selectedJob?.title || 'Job Details'}
        size="md"
      >
        <div className="p-6">
          {/* Empty dialog content as per your requirement */}
        </div>
      </Modal>
    </>
  );
}
