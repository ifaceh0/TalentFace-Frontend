import { useEffect, useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Mail, MapPin, Phone, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getCandidateProfile, type CandidateProfile } from '../../services/recruiter.service';
import { formatExperience } from '../../store/useStore';

const summaryText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  const doc = value as { content?: Array<{ content?: Array<{ text?: string }> }> };
  return (doc.content || [])
    .flatMap((paragraph) => paragraph.content || [])
    .map((item) => item.text || '')
    .join(' ');
};

const thumbnailUrl = (url: string): string => {
  return url.replace(/\/upload\/(?:v\d+\/)?/, '/upload/pg_1,f_jpg/');
};

const leaveDetailPage = () => {
  if (window.opener && !window.opener.closed) {
    window.close();
    return;
  }
  window.history.back();
};

export default function CandidateDetailPage() {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumePreviewFailed, setResumePreviewFailed] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);

  useEffect(() => {
    if (!uniqueId) return;
    getCandidateProfile(uniqueId)
      .then(setCandidate)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load candidate profile.'))
      .finally(() => setLoading(false));
  }, [uniqueId]);

  const hasResume = Boolean(candidate?.resumeUrl?.trim());
  const isCloudinaryRaw = Boolean(
    hasResume && candidate?.resumeUrl && /res\.cloudinary\.com\/[^/]+\/raw\/upload\//i.test(candidate.resumeUrl),
  );
  const isPdf = Boolean(
    hasResume &&
    (candidate?.resumeUrl && /\.pdf(?:[?#]|$)/i.test(candidate.resumeUrl) ||
      isCloudinaryRaw),
  );
  const transformedThumbnailUrl =
    candidate?.resumeUrl && !isCloudinaryRaw ? thumbnailUrl(candidate.resumeUrl) : '';
  const resumePreviewUrl = `${import.meta.env.VITE_API_BASE_URL}/recruiter/candidates/${encodeURIComponent(candidate?.uniqueId || uniqueId || '')}/resume/preview`;

  useEffect(() => {
    console.log('Candidate Resume URL:', candidate?.resumeUrl);
    if (candidate?.resumeUrl) {
      console.log('Candidate resume thumbnail URL:', transformedThumbnailUrl || 'raw PDF viewer fallback');
    }
  }, [candidate?.resumeUrl, transformedThumbnailUrl]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading candidate profile...</div>;
  if (error || !candidate) return <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500"><p>{error || (uniqueId ? 'Candidate not found.' : 'Candidate identifier is missing.')}</p><button onClick={leaveDetailPage} className="text-indigo-600">Go back</button></div>;

  const location = candidate.location || 'Location not specified';
  const summary = summaryText(candidate.summary);

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={leaveDetailPage} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mb-6"><ArrowLeft size={16} /> Back</button>
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {candidate.profilePhoto ? <img src={candidate.profilePhoto} alt="" className="w-20 h-20 rounded-full object-cover" /> : <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">{candidate.avatar}</div>}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-500">{candidate.role}</p>
              <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${candidate.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}>{candidate.status}</span>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Mail size={14} />{candidate.email || 'No email'}</span>
                {candidate.phone && <span className="flex items-center gap-1"><Phone size={14} />{candidate.phone}</span>}
                <span className="flex items-center gap-1"><MapPin size={14} />{location}</span>
                <span>{formatExperience(candidate.experience)} experience</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="md:col-span-2 space-y-6">
              {summary && <Section title="About"><p className="text-gray-600 whitespace-pre-wrap">{summary}</p></Section>}
              <Section title="Skills"><div className="flex flex-wrap gap-2">{candidate.skills.map((skill) => <span key={skill} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm">{skill}</span>)}</div></Section>
              {candidate.education && candidate.education.length > 0 && <Section title="Education"><div className="space-y-3">{candidate.education.map((education, index) => <div key={index}><p className="font-medium text-gray-900">{education.degree || 'Education'}</p><p className="text-sm text-gray-600">{education.institution || education.board || 'Institution not specified'}{education.startYear || education.endYear ? ` · ${education.startYear || ''}-${education.endYear || 'Present'}` : ''}</p></div>)}</div></Section>}
              {candidate.workExperience && candidate.workExperience.length > 0 && <Section title="Work Experience"><div className="space-y-4">{candidate.workExperience.map((experience, index) => <div key={index}><p className="font-medium text-gray-900">{experience.role || 'Role'}{experience.company ? ` · ${experience.company}` : ''}</p><p className="text-sm text-gray-600">{summaryText(experience.description)}</p></div>)}</div></Section>}
              {candidate.socialProfiles && candidate.socialProfiles.length > 0 && <Section title="Links"><div className="flex flex-wrap gap-3">{candidate.socialProfiles.map((profile, index) => profile.url ? <a key={index} href={profile.url} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline capitalize">{profile.platform || 'Profile'}</a> : null)}</div></Section>}
            </div>
            <div>
              <Section title="Resume">
                {isPdf && !resumePreviewFailed ? <div className="relative rounded-lg overflow-hidden border border-gray-200">{isCloudinaryRaw ? <iframe src={`${resumePreviewUrl}#toolbar=0&page=1`} title="Resume Snapshot" className="w-full h-64" /> : <img src={transformedThumbnailUrl} alt="Resume Snapshot" onError={(event) => { console.error('Resume thumbnail failed to load:', event.currentTarget.src, 'Original PDF:', candidate.resumeUrl); setResumePreviewFailed(true); }} className="w-full h-auto rounded border object-cover" />}<div className="absolute inset-0 flex items-center justify-center bg-black/20"><button type="button" onClick={() => setShowResumePreview(true)} className="bg-white text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><ExternalLink size={15} /> View Resume</button></div></div> : <div className="h-40 rounded-lg bg-gray-100 flex flex-col items-center justify-center gap-2 text-sm text-gray-500"><span className="text-3xl">PDF</span><span>{isPdf ? 'Preview unavailable' : 'Resume not provided'}</span>{isPdf && <button type="button" onClick={() => setShowResumePreview(true)} className="text-indigo-600 underline">Open PDF viewer</button>}</div>}
                {isPdf && <a href={`${import.meta.env.VITE_API_BASE_URL}/recruiter/candidates/${encodeURIComponent(candidate.uniqueId || uniqueId || '')}/resume/download`} className="mt-3 w-full justify-center flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"><Download size={15} /> Download PDF</a>}
              </Section>
            </div>
          </div>
        </section>
      </div>
      {showResumePreview && isPdf && (
        <div className="fixed inset-0 z-50 bg-black/75 p-4 sm:p-8 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Resume preview">
          <div className="bg-white rounded-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Resume Preview</h2>
              <button type="button" onClick={() => setShowResumePreview(false)} aria-label="Close resume preview" className="p-1 text-gray-500 hover:text-gray-900"><X size={20} /></button>
            </div>
            <iframe
              src={`${resumePreviewUrl}#toolbar=0`}
              title="Candidate resume"
              className="w-full flex-1"
              onError={() => console.error('Resume PDF viewer failed to load:', candidate.resumeUrl)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-base font-semibold text-gray-900 mb-2">{title}</h2>{children}</section>;
}
