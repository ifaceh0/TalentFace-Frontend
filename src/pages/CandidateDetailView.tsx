// components/CandidateDetailView.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X, Download, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { recruiterService } from '../services/recruiter.service';
import type { CandidateDetail } from '../services/recruiter.service';

export default function CandidateDetailView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');

  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    if (window.opener && !window.opener.closed) {
      window.opener.focus();
      window.close();
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/recruiter/dashboard', { replace: true });
  };

  const getStatusBadgeClass = (status?: CandidateDetail['status']) => {
    if (status === 'Shortlisted') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Interview') return 'bg-purple-100 text-purple-700';
    if (status === 'Offer') return 'bg-orange-100 text-orange-700';
    if (status === 'Hired') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  useEffect(() => {
    if (!id) {
      setError('No candidate ID provided');
      setLoading(false);
      return;
    }

    const fetchCandidate = async () => {
      try {
        const data = await recruiterService.getCandidateDetail(id);
        setCandidate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="text-red-400">Error: {error}</div>
    </div>
  );

  if (!candidate) return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="text-white">Candidate not found</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{candidate.name || 'N/A'}</h1>
            {candidate.appliedJob && (
              <p className="text-blue-100 mt-1">Applied for: {candidate.appliedJob}</p>
            )}
            <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-semibold ${getStatusBadgeClass(candidate.status)}`}>
              {candidate.status || 'Applied'}
            </span>
          </div>
          <button
            onClick={handleBack}
            className="p-2 hover:bg-blue-500 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-3 gap-8">

          <div className="col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                <p className="flex items-center gap-2 text-gray-900 mt-1 text-sm break-all">
                  <Mail size={16} className="flex-shrink-0" />
                  {candidate.email || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                <p className="flex items-center gap-2 text-gray-900 mt-1 text-sm">
                  <Phone size={16} className="flex-shrink-0" />
                  {candidate.phone || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Location</p>
                <p className="flex items-center gap-2 text-gray-900 mt-1 text-sm">
                  <MapPin size={16} className="flex-shrink-0" />
                  {candidate.location || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Experience</p>
                <p className="flex items-center gap-2 text-gray-900 mt-1 text-sm">
                  <Briefcase size={16} className="flex-shrink-0" />
                  {candidate.experience || 'N/A'}
                </p>
              </div>

              {candidate.skills && candidate.skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2 space-y-6">

            {candidate.bio && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed text-sm">{candidate.bio}</p>
              </div>
            )}

            {candidate.education && candidate.education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Education</h2>
                <div className="space-y-3">
                  {candidate.education.map((edu, i) => (
                    <div key={i} className="border-l-4 border-blue-600 pl-4">
                      <p className="font-semibold text-gray-900 text-sm">{edu.degree || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{edu.institution || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{edu.year || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {candidate.resumeUrl && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold text-gray-900">Resume</h2>
                  
                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>

                {candidate.resumeUrl.includes('pdf') ? (
                  <embed
                    src={candidate.resumeUrl}
                    type="application/pdf"
                    width="100%"
                    height="600"
                    className="border border-gray-300 rounded-lg"
                  />
                ) : (
                  <img
                    src={candidate.resumeUrl}
                    alt="Resume"
                    className="w-full border border-gray-300 rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}