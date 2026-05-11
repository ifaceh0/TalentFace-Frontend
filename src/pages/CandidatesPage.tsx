import CandidateTable from '../components/candidates/CandidateTable';

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">All Candidates</h3>
        <p className="text-sm text-gray-400 mb-4">Manage and filter all applicants</p>
        <CandidateTable />
      </div>
    </div>
  );
}