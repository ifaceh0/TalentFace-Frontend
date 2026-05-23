import { useState, useCallback, useEffect } from "react";
import SwipeCard, { SwipeButtons, ScoreBadge, SwipeDeckEmpty } from "../../components/common/SwipeCard";
import { getJobDeck, swipeJob } from "../../services/swipe.service";
import type { DeckJob } from "../../types/swipe.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const locationTypeColor: Record<string, string> = {
  remote: "#059669", hybrid: "#D97706", onsite: "#1D4ED8",
};

const formatSalary = (s?: string) => s && s !== "Not disclosed" ? s : null;

// ─── Swipe result state (local, not from server — server already processed) ───

interface LocalSwipeResult {
  jobId: string;
  direction: "left" | "right";
  matchScore: number;
  matchLabel: string;
  scoreBreakdown: { skills: number; experience: number; location: number };
  isMatch: boolean;
}

// ─── Job Card Inner ───────────────────────────────────────────────────────────

function JobCardInner({ job, swipeResult, animatingOut, direction }: {
  job: DeckJob;
  swipeResult?: LocalSwipeResult;
  animatingOut?: boolean;
  direction?: "left" | "right";
}) {
  const sal = formatSalary(job.salary);

  return (
    <div
      className="rounded-3xl overflow-hidden w-full"
      style={{
        background: "#fff",
        border: "1px solid #E8EAF6",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        transition: animatingOut ? "transform 0.4s ease, opacity 0.3s" : undefined,
        transform: animatingOut
          ? direction === "right" ? "translateX(120%) rotate(20deg)" : "translateX(-120%) rotate(-20deg)"
          : undefined,
        opacity: animatingOut ? 0 : 1,
      }}
    >
      <div className="h-2 w-full" style={{ background: "linear-gradient(90deg, #E53E3E, #1D4ED8)" }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-white flex-shrink-0"
            style={{ background: job.color || "linear-gradient(135deg,#E53E3E,#1D4ED8)" }}
          >
            {job.logo || job.company.charAt(0)}
          </div>
          <span
            className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full"
            style={{
              background: `${locationTypeColor[job.isRemote ? "remote" : "onsite"]}15`,
              color: locationTypeColor[job.isRemote ? "remote" : "onsite"],
            }}
          >
            {job.isRemote ? "Remote" : "Onsite"}
          </span>
        </div>

        <h2 className="text-gray-900 font-black text-xl leading-tight mb-1">{job.title}</h2>
        <p className="text-gray-500 font-bold text-sm mb-1">{job.company}</p>
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="font-bold">{job.location}</span>
          <span className="mx-1">·</span>
          <span className="font-bold">{job.type}</span>
        </div>

        {job.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{job.description}</p>
        )}

        {/* Skills / tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.slice(0, 5).map((tag) => (
            <span key={tag} className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: "#F0F4FF", color: "#1D4ED8" }}>
              {tag}
            </span>
          ))}
          {job.tags.length > 5 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500">
              +{job.tags.length - 5}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Experience</p>
            <p className="text-gray-700 font-black text-sm">{job.experienceLevel}</p>
          </div>
          {sal && (
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Salary</p>
              <p className="font-black text-sm text-gray-700">{sal}</p>
            </div>
          )}
          {job.posted && (
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Posted</p>
              <p className="text-gray-700 font-black text-sm">{job.posted}</p>
            </div>
          )}
        </div>

        {/* Score reveal after right swipe */}
        {swipeResult?.direction === "right" && swipeResult.jobId === job._id && (
          <div className="mt-4 animate-[fadeIn_0.4s_ease]">
            <ScoreBadge score={swipeResult.matchScore} breakdown={swipeResult.scoreBreakdown} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobSwipe() {
  const [deck, setDeck]                     = useState<DeckJob[]>([]);
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [swipeResult, setSwipeResult]       = useState<LocalSwipeResult | null>(null);
  const [animatingOut, setAnimatingOut]     = useState(false);
  const [outDirection, setOutDirection]     = useState<"left" | "right" | null>(null);
  const [history, setHistory]               = useState<LocalSwipeResult[]>([]);
  const [loading, setLoading]               = useState(false);
  const [deckLoading, setDeckLoading]       = useState(true);
  const [deckError, setDeckError]           = useState<string | null>(null);
  const [matchPopup, setMatchPopup]         = useState(false);
  const [page, setPage]                     = useState(1);
  const [hasMore, setHasMore]               = useState(true);

  // ── Load deck ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setDeckLoading(true);
    setDeckError(null);

    getJobDeck(page, 20)
      .then((res) => {
        if (cancelled) return;
        setDeck((prev) => [...prev, ...(res.jobs ?? [])]);
        setHasMore(res.hasNextPage);
      })
      .catch((err) => {
        if (cancelled) return;
        setDeckError(err.message || "Failed to load jobs.");
      })
      .finally(() => { if (!cancelled) setDeckLoading(false); });

    return () => { cancelled = true; };
  }, [page]);

  // ── Load next page when nearing end of deck ─────────────────────────────────
  useEffect(() => {
    if (deck.length > 0 && currentIndex >= deck.length - 5 && hasMore && !deckLoading) {
      setPage((p) => p + 1);
    }
  }, [currentIndex, deck.length, hasMore, deckLoading]);

  const currentJob = deck[currentIndex];
  const hasNext    = currentIndex < deck.length;

  const handleSwipe = useCallback(async (direction: "left" | "right") => {
    if (!currentJob || loading || animatingOut) return;

    setOutDirection(direction);
    setAnimatingOut(true);
    setLoading(true);

    try {
      const res = await swipeJob({ jobId: currentJob._id, direction });

      setTimeout(() => {
        setAnimatingOut(false);
        setOutDirection(null);
        setLoading(false);

        if (direction === "right") {
          const result: LocalSwipeResult = {
            jobId: currentJob._id,
            direction,
            matchScore:     res.swipe.matchScore     ?? currentJob.matchScore,
            matchLabel:     res.swipe.matchLabel     ?? currentJob.matchLabel,
            scoreBreakdown: res.swipe.scoreBreakdown ?? currentJob.scoreBreakdown,
            isMatch:        !!res.match,
          };
          setSwipeResult(result);
          if (res.match) setMatchPopup(true);
          setHistory((h) => [...h, result]);
        } else {
          setSwipeResult(null);
          setHistory((h) => [...h, {
            jobId: currentJob._id, direction,
            matchScore: 0, matchLabel: "Low",
            scoreBreakdown: { skills: 0, experience: 0, location: 0 },
            isMatch: false,
          }]);
        }

        setCurrentIndex((i) => i + 1);
      }, 380);
    } catch (err: any) {
      // If already swiped (409) just advance silently
      setTimeout(() => {
        setAnimatingOut(false);
        setOutDirection(null);
        setLoading(false);
        setCurrentIndex((i) => i + 1);
      }, 200);
    }
  }, [currentJob, loading, animatingOut]);

  const handleUndo = () => {
    if (history.length === 0 || currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    setSwipeResult(null);
    setHistory((h) => h.slice(0, -1));
  };

  const applied  = history.filter((h) => h.direction === "right").length;
  const skipped  = history.filter((h) => h.direction === "left").length;
  const total    = deck.length;
  const progress = total > 0 ? (currentIndex / total) * 100 : 0;

  // ── Render ──────────────────────────────────────────────────────────────────

  if (deckLoading && deck.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F9FF" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading jobs…</p>
        </div>
      </div>
    );
  }

  if (deckError && deck.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F9FF" }}>
        <div className="text-center">
          <p className="text-red-500 font-black text-lg mb-2">Failed to load jobs</p>
          <p className="text-gray-400 text-sm">{deckError}</p>
          <button
            onClick={() => { setDeckError(null); setPage(1); }}
            className="mt-4 px-6 py-2 rounded-xl font-black text-white text-sm"
            style={{ background: "linear-gradient(135deg,#E53E3E,#1D4ED8)" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Rajdhani',sans-serif]" style={{ background: "#F8F9FF" }}>

      {/* Match popup */}
      {matchPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          onClick={() => setMatchPopup(false)}
        >
          <div
            className="rounded-3xl p-8 text-center max-w-xs w-full mx-4"
            style={{ background: "#fff", boxShadow: "0 24px 64px rgba(29,78,216,0.25)", border: "1px solid #E8EAF6" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-gray-900 font-black text-2xl uppercase tracking-wider mb-2">It's a Match!</h2>
            <p className="text-gray-500 text-sm mb-6">
              The recruiter is also interested in your profile. Check your matches!
            </p>
            <button
              onClick={() => setMatchPopup(false)}
              className="w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm text-white"
              style={{ background: "linear-gradient(135deg,#E53E3E,#1D4ED8)" }}
            >
              Keep Swiping
            </button>
          </div>
        </div>
      )}

      {/* Topbar */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
        style={{ background: "#fff", borderBottom: "1px solid #E8EAF6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        <div>
          <h1 className="text-gray-900 font-black text-xl uppercase tracking-wide leading-none">
            Job <span className="text-red-500">Deck</span>
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">{Math.max(total - currentIndex, 0)} jobs remaining</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-2.5 rounded-xl border transition-all disabled:opacity-30"
            style={{ border: "1px solid #E8EAF6", background: "#fff" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>
            </svg>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "#F0F4FF" }}>
            <span className="text-blue-600 font-black text-sm">{applied}</span>
            <span className="text-gray-400 text-xs font-bold">applied</span>
            <span className="text-gray-300 mx-1">|</span>
            <span className="text-red-500 font-black text-sm">{skipped}</span>
            <span className="text-gray-400 text-xs font-bold">skipped</span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100">
        <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#E53E3E,#1D4ED8)" }} />
      </div>

      {/* Main */}
      <main className="max-w-md mx-auto px-4 py-8">
        {!hasNext ? (
          <SwipeDeckEmpty message="You've seen all available jobs. Check back later for new postings." />
        ) : (
          <>
            <div className="relative h-[520px] flex items-center justify-center">
              {[2, 1].map((offset) => {
                const idx = currentIndex + offset;
                if (idx >= deck.length) return null;
                return (
                  <div
                    key={deck[idx]._id}
                    className="absolute w-full pointer-events-none"
                    style={{ transform: `scale(${1 - offset * 0.04}) translateY(${offset * 12}px)`, zIndex: 10 - offset, opacity: 1 - offset * 0.2 }}
                  >
                    <JobCardInner job={deck[idx]} />
                  </div>
                );
              })}

              <div className="absolute w-full" style={{ zIndex: 10 }}>
                <SwipeCard
                  onSwipeLeft={() => handleSwipe("left")}
                  onSwipeRight={() => handleSwipe("right")}
                  disabled={loading || animatingOut}
                >
                  <JobCardInner
                    job={currentJob}
                    swipeResult={swipeResult ?? undefined}
                    animatingOut={animatingOut}
                    direction={outDirection ?? undefined}
                  />
                </SwipeCard>
              </div>
            </div>

            <SwipeButtons
              onLeft={() => handleSwipe("left")}
              onRight={() => handleSwipe("right")}
              disabled={loading || animatingOut}
            />

            <p className="text-center text-gray-400 text-xs mt-4 font-bold uppercase tracking-widest">
              ← Skip &nbsp;·&nbsp; Drag or tap &nbsp;·&nbsp; Apply →
            </p>
          </>
        )}
      </main>
    </div>
  );
}