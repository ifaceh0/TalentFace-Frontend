import { useEffect } from 'react';
import PipelineBoard from '../components/pipeline/PipelineBoard';
import CandidateTable from '../components/candidates/CandidateTable';
import JobList from '../components/jobs/JobList';
import HiringChart from '../components/dashboard/HiringChart';
import JobOverviewGrid from '../components/dashboard/JobOverviewGrid';
import { useStore } from '../store/useStore';

export default function DashboardPage() {
  const { fetchJobs, fetchCandidates } = useStore();

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, [fetchJobs, fetchCandidates]);

  return (
    <div className="space-y-8 max-w-full">
      {/* Overview - Job Postings Grid */}
      <div>
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Overview</h3>
        <JobOverviewGrid />
      </div>

      {/* Pipeline */}
      <div>
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Candidate Pipeline</h3>
        <PipelineBoard />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Candidate List</h3>
          <CandidateTable />
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Job Postings</h3>
            <JobList />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Hiring Overview</h3>
            <HiringChart />
          </div>
        </div>
      </div>
    </div>
  );
}