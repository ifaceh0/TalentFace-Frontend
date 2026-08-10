import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, MapPin, Phone, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { recruiterService } from '../../services/recruiter.service';
import type { CandidateDetail } from '../../services/recruiter.service';

// ─── Resume Modal ──────────────────────────────────────────────────────────────

interface ResumeModalProps {
  candidate: CandidateDetail;
  onClose: () => void;
}

function ResumeModal({ candidate, onClose }: ResumeModalProps) {
  const { resumeUrl, resumeMimeType, name } = candidate;
  const [iframeError, setIframeError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Mirrors backend isCloudinaryRawPdf logic:
  // treat /raw/upload/ Cloudinary URLs as PDFs (they're uploaded as raw but are PDFs)
  const isPdf = resumeMimeType
    ? resumeMimeType === 'application/pdf'
    : /\.pdf(?:$|\?)/i.test(resumeUrl || '') ||
      (/res\.cloudinary\.com/i.test(resumeUrl || '') && /\/raw\/upload\//i.test(resumeUrl || ''));

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Close when clicking outside the modal card
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // For Cloudinary raw PDFs: use Google Docs Viewer as the primary embed method
  // because cross-origin PDF embeds are often blocked by browser security policies.
  const googleDocsViewerUrl = isPdf
    ? `https://docs.google.com/gview?url=${encodeURIComponent(resumeUrl!)}&embedded=true`
    : null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Resume of ${name}`}
    >
      <div
        className="relative flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: '90vw', maxWidth: '960px', height: '90vh', maxHeight: '900px' }}
      >
        {/* ── Modal Header ─────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)' }}
        >
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-white opacity-90" />
            <div>
              <h2 className="text-white font-semibold text-base leading-tight">
                {name}'s Resume
              </h2>
              <p className="text-blue-200 text-xs mt-0.5">
                {isPdf ? 'PDF Document' : 'Image Document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Image-specific controls */}
            {!isPdf && (
              <>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                  title="Zoom Out"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-white text-xs w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                  title="Zoom In"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  title="Rotate"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <RotateCw size={16} />
                </button>
              </>
            )}

            <button
              type="button"
              id="resume-modal-close"
              onClick={onClose}
              title="Close (Esc)"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Modal Body ───────────────────────────────────── */}
        <div className="flex-1 overflow-auto bg-gray-100 relative">
          {isPdf ? (
            iframeError ? (
              /* Fallback: direct link when both methods fail */
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                <FileText size={56} className="text-gray-400" />
                <p className="text-gray-600 text-sm max-w-sm">
                  Your browser is blocking the PDF preview due to security restrictions.
                  Click below to open it in a new tab.
                </p>
                <a
                  href={resumeUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  <FileText size={16} />
                  Open PDF in New Tab
                </a>
              </div>
            ) : (
              <iframe
                key={googleDocsViewerUrl}
                src={googleDocsViewerUrl!}
                title={`Resume of ${name}`}
                className="w-full h-full border-0"
                allow="autoplay"
                onError={() => setIframeError(true)}
              />
            )
          ) : (
            /* Image resume */
            <div className="flex items-start justify-center min-h-full p-6">
              <img
                src={resumeUrl!}
                alt={`Resume of ${name}`}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.25s ease',
                  transformOrigin: 'top center',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}
        </div>

        {/* ── Modal Footer ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white flex-shrink-0">
          <p className="text-xs text-gray-500">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600 font-mono text-xs">Esc</kbd> or click outside to close
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CandidateDetailPage ───────────────────────────────────────────────────────

export default function CandidateDetailPage() {
  const { uniqueID = '' } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

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
    const loadCandidate = async () => {
      try {
        setLoading(true);
        const result = await recruiterService.getCandidateDetail(uniqueID);
        setCandidate(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load candidate.');
      } finally {
        setLoading(false);
      }
    };

    if (!uniqueID) {
      setError('Candidate ID is missing.');
      setLoading(false);
      return;
    }

    loadCandidate();
  }, [uniqueID]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-sm">{error || 'Candidate not found.'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

          {/* Back button */}
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Header card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900">{candidate.name || 'N/A'}</h1>
            <p className="text-sm text-gray-500 mt-1">Candidate ID: {candidate.uniqueID || 'N/A'}</p>
            <p className="text-sm text-gray-600 mt-2">Applied for: {candidate.appliedJob || 'N/A'}</p>
            <span className={`inline-block mt-3 text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusBadgeClass(candidate.status)}`}>
              {candidate.status || 'Applied'}
            </span>
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left column: contact + skills ─────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="text-sm text-gray-700 flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <span className="break-all">{candidate.email || 'N/A'}</span>
              </div>
              <div className="text-sm text-gray-700 flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <span>{candidate.phone || 'N/A'}</span>
              </div>
              <div className="text-sm text-gray-700 flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <span>{candidate.location || 'N/A'}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Experience</p>
                <p className="text-sm text-gray-800 mt-1">{candidate.experience || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {(candidate.skills || []).length > 0 ? (
                    candidate.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Not specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right column: bio + education + resume ──────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Bio */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Bio</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {candidate.bio || 'Not provided'}
                </p>
              </div>

              {/* Education */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
                {(candidate.education || []).length > 0 ? (
                  <div className="space-y-3">
                    {candidate.education?.map((edu, index) => (
                      <div key={`${edu.degree}-${index}`} className="border-l-2 border-blue-600 pl-3">
                        <p className="text-sm font-medium text-gray-900">{edu.degree || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{edu.institution || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{edu.year || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Not provided</p>
                )}
              </div>

              {/* Resume Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Resume</h2>

                {candidate.resumeUrl ? (
                  <div className="space-y-3">
                    {/* Thumbnail snapshot with "View Resume" overlay */}
                    <div
                      className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer group"
                      onClick={() => setShowResumeModal(true)}
                      role="button"
                      tabIndex={0}
                      aria-label="Click to view resume"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setShowResumeModal(true);
                      }}
                    >
                      {/* Snapshot */}
                      {candidate.resumeThumbnailUrl ? (
                        <img
                          src={candidate.resumeThumbnailUrl}
                          alt="Resume snapshot"
                          className="w-full h-72 object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                          onError={(e) => {
                            // If thumbnail fails to load, hide it and show placeholder
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                            const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {/* Placeholder — shown when no thumbnail or thumbnail fails */}
                      <div
                        className="w-full h-72 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center gap-3"
                        style={{ display: candidate.resumeThumbnailUrl ? 'none' : 'flex' }}
                      >
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <FileText size={32} className="text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-700">Resume Available</p>
                          <p className="text-xs text-gray-500 mt-0.5">Click to view the full document</p>
                        </div>
                      </div>

                      {/* Hover / always-visible overlay with "View Resume" CTA */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                        <button
                          id="view-resume-btn"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowResumeModal(true);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                          View Resume
                        </button>
                      </div>
                    </div>

                    {/* Standalone "View Resume" button below the thumbnail */}
                    <button
                      id="view-resume-standalone-btn"
                      type="button"
                      onClick={() => setShowResumeModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
                    >
                      <FileText size={16} />
                      View Full Resume
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2">
                    <FileText size={40} className="text-gray-300" />
                    <p className="text-sm text-gray-500">Resume not provided</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Resume Viewer Modal ─────────────────────────────── */}
      {showResumeModal && candidate.resumeUrl && (
        <ResumeModal
          candidate={candidate}
          onClose={() => setShowResumeModal(false)}
        />
      )}
    </>
  );
}
