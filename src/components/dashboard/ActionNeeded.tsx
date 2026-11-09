import { ChevronRight, UserPlus, CalendarCheck, FileSignature, Briefcase, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface Props {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

export default function ActionNeeded({ setActivePage }: Props) {
  const { jobs, candidates } = useStore();

  const count = (s: string) => candidates.filter((c) => c.status === s).length;
  const emptyJobs = jobs.filter((j) => j.status === 'Active' && j.applicants === 0).length;

  const items = [
    { Icon: UserPlus, n: count('Applied'), text: 'new applicants to review', page: 'candidates' },
    { Icon: CalendarCheck, n: count('Interview'), text: 'candidates in interview stage', page: 'candidates' },
    { Icon: FileSignature, n: count('Offer'), text: 'offers awaiting response', page: 'candidates' },
    { Icon: Briefcase, n: emptyJobs, text: 'active jobs with no applicants', page: 'jobs' },
  ].filter((i) => i.n > 0);

  return (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
      {items.length === 0 ? (
        <div className="flex items-center gap-3 p-5 text-sm text-gray-500">
          <CheckCircle2 size={18} className="text-green-500" /> You're all caught up.
        </div>
      ) : (
        items.map(({ Icon, n, text, page }) => (
          <button
            key={text}
            onClick={() => setActivePage(page)}
            className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Icon size={18} />
            </div>
            <p className="flex-1 text-sm text-gray-700">
              <span className="font-semibold text-blue-900">{n}</span> {text}
            </p>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))
      )}
    </div>
  );
}