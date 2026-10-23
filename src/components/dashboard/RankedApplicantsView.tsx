import { useState, useMemo } from 'react';
import type { Candidate, CandidateStatus, CandidateTier } from '../../store/useStore';
import { useStore } from '../../store/useStore';
import { rankApplicants, TIER_CONFIG } from '../../utils/ranking';
import {
  Trophy,
  Award,
  Filter,
  Search,
  ExternalLink,
  Calendar,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface RankedApplicantsViewProps {
  jobId: string;
  candidates?: Candidate[];
}

const statusColors: Record<CandidateStatus, { bg: string; text: string; border: string }> = {
  Applied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Shortlisted: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  Interview: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Offer: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Hired: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const tierStyles: Record<CandidateTier, { bg: string; text: string; border: string; label: string }> = {
  Strong: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Strong Match',
  },
  Moderate: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Moderate Match',
  },
  Weak: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    label: 'Weak Match',
  },
  Unscored: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
    label: 'Unscored',
  },
};

const allStages: CandidateStatus[] = [
  'Applied',
  'Shortlisted',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

export default function RankedApplicantsView({ jobId, candidates: propCandidates }: RankedApplicantsViewProps) {
  const storeJobCandidates = useStore((state) => state.jobCandidates);
  const updateCandidateStatus = useStore((state) => state.updateCandidateStatus);

  // Use passed candidates or fallback to store's jobCandidates
  const rawCandidates = propCandidates ?? storeJobCandidates;

  const [tierFilter, setTierFilter] = useState<'All' | CandidateTier>('All');
  const [stageFilter, setStageFilter] = useState<'All' | CandidateStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Compute official ranked applicants using pure function
  const rankedApplicants = useMemo(() => {
    return rankApplicants(rawCandidates, jobId);
  }, [rawCandidates, jobId]);

  // Compute breakdown metrics
  const metrics = useMemo(() => {
    const total = rankedApplicants.length;
    const scoredList = rankedApplicants.filter((c) => typeof c.atsScore === 'number');
    const unscoredList = rankedApplicants.filter((c) => c.atsScore === null || c.atsScore === undefined);

    const strongCount = scoredList.filter((c) => c.tier === 'Strong').length;
    const moderateCount = scoredList.filter((c) => c.tier === 'Moderate').length;
    const weakCount = scoredList.filter((c) => c.tier === 'Weak').length;

    const avgScore =
      scoredList.length > 0
        ? Math.round(scoredList.reduce((acc, c) => acc + (c.atsScore || 0), 0) / scoredList.length)
        : null;

    const topScore = scoredList.length > 0 ? (scoredList[0].atsScore as number) : null;

    return {
      total,
      scored: scoredList.length,
      unscored: unscoredList.length,
      strongCount,
      moderateCount,
      weakCount,
      avgScore,
      topScore,
    };
  }, [rankedApplicants]);

  // Filtered applicants for table view
  const filteredApplicants = useMemo(() => {
    return rankedApplicants.filter((applicant) => {
      // Tier filter
      if (tierFilter !== 'All' && applicant.tier !== tierFilter) {
        return false;
      }

      // Stage filter
      if (stageFilter !== 'All' && applicant.status !== stageFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = applicant.name.toLowerCase().includes(query);
        const emailMatch = applicant.email.toLowerCase().includes(query);
        const roleMatch = applicant.role.toLowerCase().includes(query);
        const skillMatch = applicant.skills?.some((s) => s.toLowerCase().includes(query));
        return nameMatch || emailMatch || roleMatch || skillMatch;
      }

      return true;
    });
  }, [rankedApplicants, tierFilter, stageFilter, searchQuery]);

  // Separate filtered applicants into scored and unscored
  const scoredFiltered = useMemo(
    () => filteredApplicants.filter((c) => typeof c.atsScore === 'number'),
    [filteredApplicants]
  );

  const unscoredFiltered = useMemo(
    () => filteredApplicants.filter((c) => c.atsScore === null || c.atsScore === undefined),
    [filteredApplicants]
  );

  const handleStatusChange = async (candidateId: string, newStatus: CandidateStatus) => {
    setUpdatingId(candidateId);
    try {
      await updateCandidateStatus(candidateId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenProfile = (uniqueId?: string) => {
    if (!uniqueId) return;
    window.open(`/recruiter/candidate/${encodeURIComponent(uniqueId)}`, '_blank');
  };

  const renderRankBadge = (rank: number | null | undefined) => {
    if (rank === null || rank === undefined) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
          —
        </span>
      );
    }

    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
          <Trophy size={13} className="text-amber-600" /> #1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
          <Award size={13} className="text-slate-600" /> #2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300 shadow-xs">
          <Award size={13} className="text-orange-600" /> #3
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
        #{rank}
      </span>
    );
  };

  const renderScoreIndicator = (score: number | null | undefined) => {
    if (score === null || score === undefined) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium italic">
          <HelpCircle size={13} /> Unscored
        </span>
      );
    }

    let colorClass = 'text-rose-600 bg-rose-50 border-rose-200';
    let barColor = 'bg-rose-500';

    if (score >= TIER_CONFIG.STRONG_MIN) {
      colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      barColor = 'bg-emerald-500';
    } else if (score >= TIER_CONFIG.MODERATE_MIN) {
      colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
      barColor = 'bg-amber-500';
    }

    return (
      <div className="flex flex-col gap-1 min-w-[90px]">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${colorClass}`}>
            {score} <span className="font-normal opacity-70">/ 100</span>
          </span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
        </div>
      </div>
    );
  };

  if (rankedApplicants.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <AlertCircle size={40} className="mx-auto text-gray-400 mb-3 opacity-60" />
        <h4 className="text-base font-semibold text-gray-700">No applicants yet</h4>
        <p className="text-sm text-gray-400 max-w-md mx-auto mt-1">
          When candidates apply to this specific job, they will be scored and automatically ranked here based on their ATS score.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Top Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs">
          <p className="text-xs font-medium text-gray-500">Total Applicants</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{metrics.total}</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs">
          <p className="text-xs font-medium text-gray-500">Top ATS Score</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {metrics.topScore !== null ? `${metrics.topScore}%` : '—'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs">
          <p className="text-xs font-medium text-gray-500">Average Score</p>
          <p className="text-xl font-bold text-blue-900 mt-1">
            {metrics.avgScore !== null ? `${metrics.avgScore}%` : '—'}
          </p>
        </div>

        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 shadow-xs">
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-800">
            <Sparkles size={12} /> Strong Match
          </div>
          <p className="text-xl font-bold text-emerald-700 mt-1">{metrics.strongCount}</p>
        </div>

        <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100 shadow-xs">
          <p className="text-xs font-medium text-amber-800">Moderate Match</p>
          <p className="text-xl font-bold text-amber-700 mt-1">{metrics.moderateCount}</p>
        </div>

        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-medium text-gray-600">Unscored</p>
          <p className="text-xl font-bold text-gray-700 mt-1">{metrics.unscored}</p>
        </div>
      </div>

      {/* ── Filters & Search Bar ── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="relative w-full max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidate, email, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tier Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Filter size={13} className="text-gray-400" />
            <span className="font-medium">Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as 'All' | CandidateTier)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="All">All Tiers ({metrics.total})</option>
              <option value="Strong">Strong ({metrics.strongCount})</option>
              <option value="Moderate">Moderate ({metrics.moderateCount})</option>
              <option value="Weak">Weak ({metrics.weakCount})</option>
              <option value="Unscored">Unscored ({metrics.unscored})</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="font-medium">Stage:</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as 'All' | CandidateStatus)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="All">All Stages</option>
              {allStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          {(tierFilter !== 'All' || stageFilter !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setTierFilter('All');
                setStageFilter('All');
                setSearchQuery('');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Main Ranked Applicants Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3 w-16 text-center">Rank</th>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">ATS Score</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Percentile</th>
                <th className="px-4 py-3">Applied Date</th>
                <th className="px-4 py-3">Pipeline Stage</th>
                <th className="px-4 py-3 text-right">Profile</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {scoredFiltered.length === 0 && unscoredFiltered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No applicants match your current filters.
                  </td>
                </tr>
              ) : (
                scoredFiltered.map((candidate) => {
                  const currentTier = candidate.tier || 'Unscored';
                  const tierStyle = tierStyles[currentTier];

                  return (
                    <tr
                      key={candidate.id}
                      className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                      onClick={() => handleOpenProfile(candidate.uniqueId)}
                    >
                      {/* Rank */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {renderRankBadge(candidate.rank)}
                      </td>

                      {/* Candidate Details */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                            {candidate.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5 truncate">
                              {candidate.name}
                            </p>
                            <p className="text-gray-400 text-[11px] truncate">{candidate.email}</p>
                            {candidate.skills && candidate.skills.length > 0 && (
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {candidate.skills.slice(0, 2).map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600"
                                  >
                                    {s}
                                  </span>
                                ))}
                                {candidate.skills.length > 2 && (
                                  <span className="text-[10px] text-gray-400">
                                    +{candidate.skills.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ATS Score */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderScoreIndicator(candidate.atsScore)}
                      </td>

                      {/* Tier Badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}
                        >
                          {currentTier === 'Strong' && <CheckCircle2 size={12} />}
                          {currentTier === 'Moderate' && <Clock size={12} />}
                          {currentTier === 'Weak' && <AlertCircle size={12} />}
                          {tierStyle.label}
                        </span>
                      </td>

                      {/* Percentile */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {candidate.percentile !== null && candidate.percentile !== undefined ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-800">
                              {candidate.percentile}
                              <span className="text-[10px] font-normal text-gray-500">th</span>
                            </span>
                            <span className="text-[11px] text-gray-400">percentile</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Applied Date */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Calendar size={12} className="text-gray-400" />
                          <span>
                            {candidate.appliedDate
                              ? new Date(candidate.appliedDate).toLocaleDateString()
                              : '—'}
                          </span>
                        </div>
                      </td>

                      {/* Pipeline Stage Select */}
                      <td
                        className="px-4 py-3 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={candidate.status}
                          disabled={updatingId === candidate.id}
                          onChange={(e) =>
                            handleStatusChange(candidate.id, e.target.value as CandidateStatus)
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border outline-none cursor-pointer transition ${
                            statusColors[candidate.status].bg
                          } ${statusColors[candidate.status].text} ${
                            statusColors[candidate.status].border
                          }`}
                        >
                          {allStages.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {candidate.uniqueId && (
                          <button
                            type="button"
                            onClick={() => handleOpenProfile(candidate.uniqueId)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-gray-100 transition"
                            title="View candidate profile"
                          >
                            <ExternalLink size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Separate Unscored Applicants Section ── */}
        {unscoredFiltered.length > 0 && (
          <div className="border-t-2 border-gray-200 bg-gray-50/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                  <HelpCircle size={14} className="text-gray-400" /> Unscored Applicants ({unscoredFiltered.length})
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  These applicants have submitted applications for this job but do not have an ATS fit check score yet. They are excluded from ranking calculations and placed at the bottom.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100/70 border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2 w-16 text-center">Rank</th>
                    <th className="px-4 py-2">Applicant</th>
                    <th className="px-4 py-2">ATS Score</th>
                    <th className="px-4 py-2">Tier</th>
                    <th className="px-4 py-2">Applied Date</th>
                    <th className="px-4 py-2">Pipeline Stage</th>
                    <th className="px-4 py-2 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {unscoredFiltered.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => handleOpenProfile(candidate.uniqueId)}
                    >
                      <td className="px-4 py-2.5 text-center text-gray-400 font-mono">—</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-400 text-white font-bold flex items-center justify-center text-xs">
                            {candidate.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{candidate.name}</p>
                            <p className="text-gray-400 text-[10px]">{candidate.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[11px] font-medium text-gray-400 italic">
                          Pending / None
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          Unscored
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 text-[11px]">
                        {candidate.appliedDate
                          ? new Date(candidate.appliedDate).toLocaleDateString()
                          : '—'}
                      </td>
                      <td
                        className="px-4 py-2.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={candidate.status}
                          disabled={updatingId === candidate.id}
                          onChange={(e) =>
                            handleStatusChange(candidate.id, e.target.value as CandidateStatus)
                          }
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full border outline-none ${
                            statusColors[candidate.status].bg
                          } ${statusColors[candidate.status].text} ${
                            statusColors[candidate.status].border
                          }`}
                        >
                          {allStages.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td
                        className="px-4 py-2.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {candidate.uniqueId && (
                          <button
                            type="button"
                            onClick={() => handleOpenProfile(candidate.uniqueId)}
                            className="p-1 rounded text-gray-400 hover:text-indigo-600"
                          >
                            <ExternalLink size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
