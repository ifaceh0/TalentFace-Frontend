import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getCandidateProfile, type CandidateProfile } from '../../services/recruiter.service';

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
  const marker = '/upload/';
  return url.includes(marker) ? url.replace(marker, '/upload/pg_1,f_jpg/') : url;
};

export default function CandidateDetailPage() {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uniqueId) {
      setError('Candidate identifier is missing.');
      setLoading(false);
      return;
    }
    getCandidateProfile(uniqueId)
      .then(setCandidate)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load candidate profile.'))
      .finally(() => setLoading(false));
  }, [uniqueId]);

  const isPdf = useMemo(
    () => Boolean(candidate?.resumeUrl && /\.pdf(?:[?#]|$)/i.test(candidate.resumeUrl)),
    [candidate?.resumeUrl],
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading candidate profile...</div>;
  if (error || !candidate) return <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500"><p>{error || 'Candidate not found.'}</p><button onClick={() => window.history.back()} className="text-indigo-600">Go back</button></div>;

  const location = candidate.location || 'Location not specified';
  const summary = summaryText(candidate.summary);

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mb-6"><ArrowLeft size={16} /> Back</button>
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {candidate.profilePhoto ? <img src={candidate.profilePhoto} alt="" className="w-20 h-20 rounded-full object-cover" /> : <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">{candidate.avatar}</div>}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-500">{candidate.role}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Mail size={14} />{candidate.email || 'No email'}</span>
                {candidate.phone && <span className="flex items-center gap-1"><Phone size={14} />{candidate.phone}</span>}
                <span className="flex items-center gap-1"><MapPin size={14} />{location}</span>
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
                {isPdf ? <div className="relative rounded-lg overflow-hidden border border-gray-200"><img src={thumbnailUrl(candidate.resumeUrl!)} alt="Resume preview" className="w-full aspect-[3/4] object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/20"><a href={candidate.resumeUrl} target="_blank" rel="noreferrer" className="bg-white text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><ExternalLink size={15} /> View Resume</a></div></div> : <div className="h-40 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">Resume not provided</div>}
                {isPdf && <a href={`${import.meta.env.VITE_API_BASE_URL}/recruiter/candidates/${encodeURIComponent(candidate.uniqueId || uniqueId || '')}/resume/download`} className="mt-3 w-full justify-center flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"><Download size={15} /> Download PDF</a>}
              </Section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-base font-semibold text-gray-900 mb-2">{title}</h2>{children}</section>;
}
