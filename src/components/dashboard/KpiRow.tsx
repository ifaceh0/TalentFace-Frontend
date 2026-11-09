import { Briefcase, Users, CalendarCheck, Award } from 'lucide-react';
import { useStore } from '../../store/useStore';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const isThisWeek = (date?: string) => {
  const t = date ? new Date(date).getTime() : NaN;
  return Number.isFinite(t) && Date.now() - t <= WEEK_MS;
};

export default function KpiRow() {
  const { jobs, candidates } = useStore();

  const activeJobs = jobs.filter((j) => j.status === 'Active');
  const newJobs = activeJobs.filter((j) => isThisWeek(j.postedDate)).length;
  const newApplicants = candidates.filter((c) => isThisWeek(c.appliedDate)).length;
  const interviews = candidates.filter((c) => c.status === 'Interview').length;
  const offers = candidates.filter((c) => c.status === 'Offer').length;
  const hired = candidates.filter((c) => c.status === 'Hired').length;

  const cards = [
    { label: 'Active Jobs', value: activeJobs.length, sub: `+${newJobs} this week`, Icon: Briefcase },
    { label: 'Total Applicants', value: candidates.length, sub: `+${newApplicants} this week`, Icon: Users },
    { label: 'In Interview', value: interviews, sub: 'Currently in process', Icon: CalendarCheck },
    { label: 'Offers / Hired', value: `${offers} / ${hired}`, sub: 'Offers out / hired', Icon: Award },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, sub, Icon }) => (
        <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-semibold text-blue-900 leading-tight">{value}</p>
            <p className="text-xs text-gray-400 truncate">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}