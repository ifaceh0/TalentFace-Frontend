import { useEffect } from 'react';
//import RecruiterSitemap from '../components/dashboard/RecruiterSitemap';
import CandidateTable from '../components/candidates/CandidateTable';
import JobList from '../components/jobs/JobList';
import HiringChart from '../components/dashboard/HiringChart';
import KpiRow from '../components/dashboard/KpiRow';
import ActionNeeded from '../components/dashboard/ActionNeeded';
import JobOverviewGrid from '../components/dashboard/JobOverviewGrid';
import { useStore } from '../store/useStore';

interface DashboardPageProps {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

export default function DashboardPage({ setActivePage }: DashboardPageProps) {
  const { fetchJobs, fetchCandidates } = useStore();

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, [fetchJobs, fetchCandidates]);

  return (
    <div className="space-y-8 max-w-full">
      {/* Overview - Job Postings Grid */}
      <KpiRow />
      <div className="space-y-8">
        <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Job Overview</h3>
            <JobOverviewGrid setActivePage={setActivePage}/>
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Action needed</h3>
            <ActionNeeded setActivePage={setActivePage} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Hiring Funnel</h3>
            <HiringChart />
          </div>
        </div>
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
            <JobList scrollable onReviewCandidates={() => setActivePage('swipe')} />
          </div>
          {/* <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Hiring Overview</h3>
            <HiringChart />
          </div> */}
        </div>
      </div>
      {/* <RecruiterSitemap /> */}
    </div>
  );
}
