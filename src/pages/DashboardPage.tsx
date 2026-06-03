import { useEffect } from 'react';
import { Briefcase, Users, Calendar, UserCheck } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineBoard from '../components/pipeline/PipelineBoard';
import CandidateTable from '../components/candidates/CandidateTable';
import JobList from '../components/jobs/JobList';
import HiringChart from '../components/dashboard/HiringChart';
import { useStore } from '../store/useStore';

export default function DashboardPage() {
  const { candidates, jobs, fetchJobs, fetchCandidates } = useStore();

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, [fetchJobs, fetchCandidates]);

  const stats = [
    { title: 'Total Jobs Posted', value: jobs.length, icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Active Candidates', value: candidates.length, icon: Users, color: 'text-red-600', bgColor: 'bg-red-100' },
    { title: 'Interviews Scheduled', value: candidates.filter((c) => c.status === 'Interview').length, icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Hires Completed', value: candidates.filter((c) => c.status === 'Hired').length, icon: UserCheck, color: 'text-red-600', bgColor: 'bg-red-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div>
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
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