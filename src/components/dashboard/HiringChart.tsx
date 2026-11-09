import { useStore } from '../../store/useStore';

const STAGES = ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Hired'] as const;

export default function HiringChart() {
  const { candidates } = useStore();

  // Rejected candidates are excluded: their furthest stage isn't tracked
  const active = candidates.filter((c) => c.status !== 'Rejected');
  const rejected = candidates.length - active.length;

  // "Reached" = currently at this stage or beyond it
  const reached = STAGES.map((stage, i) => ({
    stage,
    count: active.filter((c) => STAGES.indexOf(c.status as (typeof STAGES)[number]) >= i).length,
  }));

  const top = reached[0].count || 1;

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* <h4 className="text-sm font-semibold text-blue-900 mb-4">Hiring Funnel</h4> */}
      <div className="space-y-3">
        {reached.map(({ stage, count }, i) => {
          const prev = i === 0 ? null : reached[i - 1].count;
          const conv = prev ? Math.round((count / prev) * 100) : null;
          return (
            <div key={stage}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">{stage}</span>
                <span className="text-gray-500">
                  <span className="font-semibold text-blue-900">{count}</span>
                  {conv !== null && <span className="ml-2 text-gray-400">{conv}% of {STAGES[i - 1]}</span>}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${(count / top) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {rejected > 0 && <p className="mt-4 text-xs text-gray-400">{rejected} rejected (not in funnel)</p>}
    </div>
  );
}
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import { useStore } from '../../store/useStore';

// export default function HiringChart() {
//   const { candidates } = useStore();

//   const data = [
//     { stage: 'Applied', count: candidates.filter((c) => c.status === 'Applied').length },
//     { stage: 'Shortlisted', count: candidates.filter((c) => c.status === 'Shortlisted').length },
//     { stage: 'Interview', count: candidates.filter((c) => c.status === 'Interview').length },
//     { stage: 'Offer', count: candidates.filter((c) => c.status === 'Offer').length },
//     { stage: 'Hired', count: candidates.filter((c) => c.status === 'Hired').length },
//   ];

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//       <h4 className="text-sm font-semibold text-blue-900 mb-4">Candidates by Stage</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <BarChart data={data} barSize={36}>
//           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
//           <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//           <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//           <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
//           <Bar dataKey="count" fill="#dc2626" radius={[6, 6, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import { useStore } from '../../store/useStore';

// export default function HiringChart() {
//   const { candidates } = useStore();

//   const data = [
//     { stage: 'Applied', count: candidates.filter((c) => c.status === 'Applied').length },
//     { stage: 'Shortlisted', count: candidates.filter((c) => c.status === 'Shortlisted').length },
//     { stage: 'Interview', count: candidates.filter((c) => c.status === 'Interview').length },
//     { stage: 'Offer', count: candidates.filter((c) => c.status === 'Offer').length },
//     { stage: 'Hired', count: candidates.filter((c) => c.status === 'Hired').length },
//   ];

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//       <h4 className="text-sm font-semibold text-blue-900 mb-4">Candidates by Stage</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <BarChart data={data} barSize={36}>
//           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
//           <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//           <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//           <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
//           <Bar dataKey="count" fill="#dc2626" radius={[6, 6, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }