import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import type { Job } from '../../store/useStore';
import { Plus, Trash2, Users, Loader } from 'lucide-react';

const statusColors: Record<Job['status'], string> = {
  Active: 'bg-green-100 text-green-700',
  Closed: 'bg-red-100 text-red-700',
  Draft: 'bg-gray-100 text-gray-600',
};

export default function JobList() {
  const { jobs, loading, fetchJobs, createJob, deleteJob } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleAdd = async () => {
    if (!form.title || !form.department || !form.location) return;
    const jobData = {
      title: form.title,
      department: form.department,
      location: form.location,
      description: form.description,
      status: 'Active' as const,
    };
    await createJob(jobData);
    setForm({ title: '', department: '', location: '', description: '' });
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          {jobs.length} Jobs
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={15} />
          Add Job
        </button>
      </div>

      {/* Add Job Form */}
      {showForm && (
        <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-2">
          <input
            type="text"
            placeholder="Job Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 text-sm bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Save Job
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 text-sm bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition"
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
            <div key={job.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-semibold text-gray-800">{job.title}</p>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                {job.department} · {job.location}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users size={12} />
                  <span>{job.applicants} applicants</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[job.status]}`}>
                  {job.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}