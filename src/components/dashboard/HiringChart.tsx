import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '../../store/useStore';

export default function HiringChart() {
  const { candidates } = useStore();

  const data = [
    { stage: 'Applied', count: candidates.filter((c) => c.status === 'Applied').length },
    { stage: 'Shortlisted', count: candidates.filter((c) => c.status === 'Shortlisted').length },
    { stage: 'Interview', count: candidates.filter((c) => c.status === 'Interview').length },
    { stage: 'Offer', count: candidates.filter((c) => c.status === 'Offer').length },
    { stage: 'Hired', count: candidates.filter((c) => c.status === 'Hired').length },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h4 className="text-sm font-semibold text-blue-900 mb-4">Candidates by Stage</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
          <Bar dataKey="count" fill="#dc2626" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}