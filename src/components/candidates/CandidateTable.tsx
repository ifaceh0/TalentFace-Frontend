import { Fragment, useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, Filter, Loader, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatExperience } from '../../store/useStore';
import type { Candidate, CandidateStatus } from '../../store/useStore';
import LocationSelect from '../ui/LocationSelect';
import CandidateActions from './CandidateActions';

const statusColors: Record<CandidateStatus, string> = {
  Applied: 'bg-blue-100 text-blue-700',
  Shortlisted: 'bg-yellow-100 text-yellow-700',
  Interview: 'bg-purple-100 text-purple-700',
  Offer: 'bg-orange-100 text-orange-700',
  Hired: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const STAGE_ORDER: CandidateStatus[] = ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Hired'];

// Most advanced stage across a person's applications (Rejected only if nothing else)
const topStatus = (apps: Candidate[]): CandidateStatus =>
  apps.reduce(
    (best, a) => (STAGE_ORDER.indexOf(a.status) > STAGE_ORDER.indexOf(best) ? a.status : best),
    apps[0].status
  );

const PAGE_SIZE = 10;
type SortKey = 'name' | 'experience' | 'status';
export default function CandidateTable() {
  const candidates = useStore((state) => state.candidates);
  const loading = useStore((state) => state.loading);
  const fetchCandidates = useStore((state) => state.fetchCandidates);

  const [skillFilter, setSkillFilter] = useState<string>('');
  const [expFilter, setExpFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [stageFilter, setStageFilter] = useState<CandidateStatus | ''>('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [skillFilter, expFilter, locationFilter, stageFilter, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s?.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }));

  const toggleExpanded = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  useEffect(() => {
    fetchCandidates();
    return () => {
    };
  }, [fetchCandidates]);

  const filtered = candidates.filter((candidate) => {
    // Skill filter
    const matchSkill = skillFilter
      ? candidate.skills.some((skill) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      : true;

    // Experience filter
    const matchExperience =
      expFilter === '0-2'
        ? candidate.experience <= 2
        : expFilter === '2-5'
        ? candidate.experience > 2 && candidate.experience <= 5
        : expFilter === '5+'
        ? candidate.experience > 5
        : true;

    // Location filter
    const trimmedLocation = locationFilter.trim().toLowerCase();

    const matchLocation = trimmedLocation
      ? candidate.location?.toLowerCase().includes(trimmedLocation)
      : true;

    const matchStage = stageFilter ? candidate.status === stageFilter : true;

    return matchSkill && matchExperience && matchLocation && matchStage;
  });

  const groupMap = new Map<string, Candidate[]>();
  filtered.forEach((c) => {
    const key = c.uniqueId || c.email || c.id;
    groupMap.set(key, [...(groupMap.get(key) ?? []), c]);
  });
  const groups = Array.from(groupMap, ([key, apps]) => ({ key, apps, main: apps[0] }));

  
  const sortedGroups = sort
    ? [...groups].sort((a, b) => {
        const cmp =
          sort.key === 'name'
            ? a.main.name.localeCompare(b.main.name)
            : sort.key === 'experience'
            ? a.main.experience - b.main.experience
            : STAGE_ORDER.indexOf(topStatus(a.apps)) - STAGE_ORDER.indexOf(topStatus(b.apps));
        return sort.dir === 'asc' ? cmp : -cmp;
      })
    : groups;

  const totalPages = Math.max(1, Math.ceil(sortedGroups.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageGroups = sortedGroups.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const chips: (CandidateStatus | '')[] = ['', ...STAGE_ORDER, 'Rejected'];
  const stageCount = (s: CandidateStatus) => candidates.filter((c) => c.status === s).length;

  const sortHeader = (key: SortKey, label: string) => (
    <th className="px-4 py-3">
      <button type="button" onClick={() => toggleSort(key)} className="flex items-center gap-1 hover:text-gray-700">
        {label}
        {sort?.key === key && (sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </button>
    </th>
  );

  const handleClearFilters = (): void => {
    setSkillFilter('');
    setExpFilter('');
    setLocationFilter('');
    setStageFilter('');
  };

  const activeFilterCount = [
    skillFilter,
    expFilter,
    locationFilter,
    stageFilter,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Filters */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />

            <span className="text-sm font-semibold text-gray-700">
              Filters
            </span>

            {hasActiveFilters && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {activeFilterCount} active
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition"
            >
              <X size={14} />
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Skill Filter */}
          <input
            type="text"
            placeholder="Search by skill..."
            value={skillFilter}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSkillFilter(event.target.value)
            }
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 w-40"
          />

          {/* Experience Filter */}
          <select
            value={expFilter}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setExpFilter(event.target.value)
            }
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All Experience</option>
            <option value="0-2">0–2 Years</option>
            <option value="2-5">2–5 Years</option>
            <option value="5+">5+ Years</option>
          </select>

          {/* Location Filter */}
          <div className="w-40">
            <LocationSelect
              value={locationFilter}
              onChange={(location: string) => {
                setLocationFilter(location);
              }}
              placeholder="Filter by location..."
            />
          </div>
        </div>
      </div>

      {/* Stage chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {chips.map((s) => (
            <button
              key={s || 'all'}
              type="button"
              onClick={() => setStageFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                stageFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s || 'All'} <span className="opacity-70">{s ? stageCount(s) : candidates.length}</span>
            </button>
          ))}
        </div>

      {/* Loading State */}
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

      {/* Candidates Table */}
      <div className="relative max-h-[500px] overflow-x-auto overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="bg-gray-50 text-gray-500 text-left">
              {sortHeader('name', 'Name')}
              {sortHeader('experience', 'Experience')}
              <th className="px-4 py-3">Education</th>
              <th className="px-4 py-3">Applied Job</th>
              <th className="px-4 py-3">Location</th>
              {sortHeader('status', 'Status')}
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-400"
                >
                  {candidates.length === 0 ? (
                    <span>
                      No candidates found. Check back later!
                    </span>
                  ) : (
                    <div>
                      <p>No candidates match your filters.</p>

                      <button
                        type="button"
                        onClick={handleClearFilters}
                        className="text-xs text-blue-600 hover:text-blue-700 mt-2 underline"
                      >
                        Clear filters to see all candidates
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              pageGroups.map(({ key, apps, main }) => {
                const multi = apps.length > 1;
                const open = expanded.has(key);
                const status = topStatus(apps);
                return (
                  <Fragment key={key}>
                    <tr
                      onClick={() => {
                        if (main.uniqueId) {
                          window.open(`/recruiter/candidate/${encodeURIComponent(main.uniqueId)}`, '_blank');
                        }
                      }}
                      className={`border-t border-gray-50 hover:bg-gray-50 transition ${main.uniqueId ? 'cursor-pointer' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
                            {main.avatar}
                          </div>
                          <span>{main.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">{formatExperience(main.experience)}</td>
                      <td className="px-4 py-3">{main.role}</td>
                      <td className="px-4 py-3">
                        {multi ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(key);
                            }}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            {apps.length} applications
                          </button>
                        ) : (
                          main.appliedJob || main.jobTitle || '-'
                        )}
                      </td>
                      <td className="px-4 py-3">{main.location || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        {!multi && <CandidateActions candidate={main} />}
                      </td>
                    </tr>

                    {multi &&
                      open &&
                      apps.map((app) => (
                        <tr key={app.id} className="bg-gray-50/60 border-t border-gray-50">
                          <td colSpan={3} />
                          <td className="px-4 py-2 text-gray-600">{app.appliedJob || app.jobTitle || '-'}</td>
                          <td />
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <CandidateActions candidate={app} />
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                );
              })
              // filtered.map((candidate) => (
              //   <tr
              //     key={candidate.id}
              //     onClick={() => {
              //       if (candidate.uniqueId) {
              //         window.open(`/recruiter/candidate/${encodeURIComponent(candidate.uniqueId)}`, '_blank');
              //       }
              //     }}
              //     className={`border-t border-gray-50 hover:bg-gray-50 transition ${candidate.uniqueId ? 'cursor-pointer' : ''}`}
              //   >
              //     {/* Name */}
              //     <td className="px-4 py-3">
              //       <div className="flex items-center gap-2">
              //         <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
              //           {candidate.avatar}
              //         </div>

              //         <span>{candidate.name}</span>
              //       </div>
              //     </td>

              //     {/* Experience */}
              //     <td className="px-4 py-3 font-medium text-gray-700">
              //       {formatExperience(candidate.experience)}
              //     </td>

              //     {/* Role */}
              //     <td className="px-4 py-3">
              //       {candidate.role}
              //     </td>

              //     {/* Applied Job */}
              //     <td className="px-4 py-3">
              //       {candidate.appliedJob ||
              //         candidate.jobTitle ||
              //         '-'}
              //     </td>

              //     {/* Location */}
              //     <td className="px-4 py-3">
              //       {candidate.location || '-'}
              //     </td>

              //     {/* Status */}
              //     <td className="px-4 py-3">
              //       <span
              //         className={`px-2 py-1 rounded-full text-xs font-medium ${
              //           statusColors[candidate.status]
              //         }`}
              //       >
              //         {candidate.status}
              //       </span>
              //     </td>
              //   </tr>
              // ))
            )}
          </tbody>
        </table>
      </div>
      {sortedGroups.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          <span>
            {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, sortedGroups.length)} of{' '}
            {sortedGroups.length} candidates
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage(safePage + 1)}
              className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}