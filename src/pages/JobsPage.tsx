import JobList from '../components/jobs/JobList';

interface JobsPageProps {
  onReviewCandidates?: (jobId: string) => void;
}

export default function JobsPage({ onReviewCandidates }: JobsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Job Management</h3>
        <p className="text-sm text-gray-400 mb-4">Create, edit and manage job postings</p>
        <JobList onReviewCandidates={onReviewCandidates} />
      </div>
    </div>
  );
}

// import JobList from '../components/jobs/JobList';

// export default function JobsPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-2">Job Management</h3>
//         <p className="text-sm text-gray-400 mb-4">Create, edit and manage job postings</p>
//         <JobList />
//       </div>
//     </div>
//   );
// }

// // import JobList from '../components/jobs/JobList';

// // export default function JobsPage() {
// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h3 className="text-lg font-semibold text-gray-700 mb-2">Job Management</h3>
// //         <p className="text-sm text-gray-400 mb-4">Create, edit and manage job postings</p>
// //         <JobList />
// //       </div>
// //     </div>
// //   );
// // }