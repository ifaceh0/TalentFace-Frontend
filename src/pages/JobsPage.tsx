import JobList from '../components/jobs/JobList';

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Job Management</h3>
        <p className="text-sm text-gray-400 mb-4">Create, edit and manage job postings</p>
        <div className="max-w-xl">
          <JobList />
        </div>
      </div>
    </div>
  );
}