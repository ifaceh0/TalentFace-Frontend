// pages/CandidatesPage.tsx
import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function CandidatesPage() {
  const { candidates, loading, error, fetchCandidates } = useStore();

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleCandidateClick = (uniqueID?: string): void => {
    if (!uniqueID) {
      window.alert('Candidate unique ID is missing.');
      return;
    }
    window.open(`/recruiter/candidate/${uniqueID}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading candidates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
        <p className="text-gray-600 mt-2">Click on any candidate to view full profile and resume</p>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {candidates.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No candidates found
          </div>
        ) : (
          candidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => handleCandidateClick(candidate.uniqueID)}
              className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-lg hover:border-blue-400 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                  <p className="text-sm text-gray-600">{candidate.email}</p>
                  <p className="text-xs text-gray-500 mt-1">{candidate.location || 'Location not specified'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{candidate.appliedJob}</p>
                  <p className="text-sm text-gray-600 mt-1">{candidate.experience ?? 'Experience not specified'}</p>
                </div>
              </div>
              {candidate.skills && candidate.skills.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {candidate.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 3 && (
                    <span className="text-gray-500 text-xs">+{candidate.skills.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}