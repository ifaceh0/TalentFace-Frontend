import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import type { CandidateStatus } from '../../store/useStore';
import { Filter, Loader } from 'lucide-react';
import LocationSelect from '../ui/LocationSelect';

const statusColors: Record<CandidateStatus, string> = {
  Applied: 'bg-blue-100 text-blue-700',
  Shortlisted: 'bg-yellow-100 text-yellow-700',
  Interview: 'bg-purple-100 text-purple-700',
  Offer: 'bg-orange-100 text-orange-700',
  Hired: 'bg-green-100 text-green-700',
};

export default function CandidateTable() {
  const candidates = useStore((state) => state.candidates);
  const loading = useStore((state) => state.loading);
  const fetchCandidates = useStore((state) => state.fetchCandidates);

  const [skillFilter, setSkillFilter] = useState('');
  const [expFilter, setExpFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    console.log('CandidateTable MOUNTED');

    fetchCandidates();

    return () => {
      console.log('CandidateTable UNMOUNTED');
    };
  }, []);

  console.log('TABLE RECEIVED:', candidates);

  const filtered = candidates.filter((c) => {
    const matchSkill = skillFilter
      ? c.skills.some((s) =>
          s.toLowerCase().includes(skillFilter.toLowerCase())
        )
      : true;

    const matchExp =
      expFilter === '0-2'
        ? c.experience <= 2
        : expFilter === '2-5'
        ? c.experience > 2 && c.experience <= 5
        : expFilter === '5+'
        ? c.experience > 5
        : true;

    const matchLocation = locationFilter
      ? c.location?.toLowerCase() === locationFilter.toLowerCase()
      : true;

    return matchSkill && matchExp && matchLocation;
  });

  console.log('FILTERED:', filtered);
  console.log(
  JSON.stringify(
    candidates,
    null,
    2
  )
);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">
            Filters
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by skill..."
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 w-40"
          />

          <select
            value={expFilter}
            onChange={(e) => setExpFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All Experience</option>
            <option value="0-2">0–2 Years</option>
            <option value="2-5">2–5 Years</option>
            <option value="5+">5+ Years</option>
          </select>

          <div className="w-40">
            <LocationSelect
              value={locationFilter}
              onChange={setLocationFilter}
              placeholder="Filter by location..."
            />
          </div>
        </div>
      </div>

      {loading && candidates.length === 0 && (
        <div className="text-center py-12">
          <Loader
            size={24}
            className="animate-spin text-indigo-600 mx-auto mb-2"
          />
          <p className="text-sm text-gray-500">
            Loading candidates...
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Skills</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Applied Job</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-400"
                >
                  No candidates found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">
                    {c.skills.join(', ')}
                  </td>
                  <td className="px-4 py-3">
                    {c.experience} yrs
                  </td>
                  <td className="px-4 py-3">{c.role}</td>
                  <td className="px-4 py-3">
                    {c.appliedJob || c.jobTitle || '-'}
                  </td>
                  <td className="px-4 py-3">{c.location}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}