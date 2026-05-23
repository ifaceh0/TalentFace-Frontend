import { useState, useCallback, useEffect } from "react";
import SwipeCard, { ScoreBadge, SwipeDeckEmpty } from "../../components/common/SwipeCard";
import { getCandidateDeck, swipeCandidate } from "../../services/swipe.service";
import type { DeckCandidate } from "../../types/swipe.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocalSwipeResult {
  candidateId: string;
  direction: "left" | "right";
  matchScore: number;
  matchLabel: string;
  scoreBreakdown: { skills: number; experience: number; location: number };
  isMutualMatch: boolean;
}

// ─── Avatar gradients ─────────────────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#E53E3E,#FC8181)",
  "linear-gradient(135deg,#1D4ED8,#60A5FA)",
  "linear-gradient(135deg,#059669,#34D399)",
  "linear-gradient(135deg,#D97706,#FCD34D)",
];

// ─── Candidate Card Inner ─────────────────────────────────────────────────────

function CandidateCardInner({ candidate, swipeResult, animatingOut, direction }: {
  candidate: DeckCandidate;
  swipeResult?: LocalSwipeResult;
  animatingOut?: boolean;
  direction?: "left" | "right";
}) {
  const initials   = candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const avatarGrad = AVATAR_GRADIENTS[parseInt(candidate._id.slice(-1), 16) % AVATAR_GRADIENTS.length];
  const score      = candidate.matchScore;
  const scoreColor = score >= 85 ? "#1D4ED8" : score >= 65 ? "#059669" : score >= 45 ? "#D97706" : "#E53E3E";
  const city       = candidate.address?.city || "";
  const country    = candidate.address?.country || "";

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
      <div className="h-2" style={{ background: "linear-gradient(90deg,#1D4ED8,#E53E3E)" }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          {candidate.profilePhoto ? (
            <img src={candidate.profilePhoto} alt={candidate.name}
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
          ) : (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl text-white flex-shrink-0"
              style={{ background: avatarGrad }}
            >
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-gray-900 font-black text-xl leading-tight">{candidate.name}</h2>
            <p className="text-gray-400 text-sm font-bold truncate">{candidate.email}</p>
            {(city || country) && (
              <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="font-bold">{[city, country].filter(Boolean).join(", ")}</span>
              </div>
            )}
          </div>

          {/* Pre-score indicator */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${scoreColor}12`, border: `1.5px solid ${scoreColor}30` }}
          >
            <span className="text-xs font-black" style={{ color: scoreColor }}>
              {swipeResult?.direction === "right" ? score.toFixed(0) : "?"}
            </span>
          </div>
        </div>

        {/* Experience */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3" style={{ background: "#F8F9FF" }}>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Experience</p>
            <p className="text-gray-900 font-black text-sm">
              {candidate.experience} yr{candidate.experience !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "#F8F9FF" }}>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Match</p>
            <p className="font-black text-sm" style={{ color: scoreColor }}>{candidate.matchLabel}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {candidate.skills.slice(0, 6).map((skill) => (
            <span key={skill} className="text-xs font-bold px-2.5 py-1 rounded-lg"
              style={{ background: "#FEF2F2", color: "#E53E3E" }}>
              {skill}
            </span>
          ))}
          {candidate.skills.length > 6 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500">
              +{candidate.skills.length - 6}
            </span>
          )}
        </div>

        {/* Score reveal after right swipe */}
        {swipeResult?.direction === "right" && swipeResult.candidateId === candidate._id && (
          <div className="animate-[fadeIn_0.4s_ease]">
            <ScoreBadge score={swipeResult.matchScore} breakdown={swipeResult.scoreBreakdown} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Job selector (shown when no jobId prop passed) ───────────────────────────

function JobIdPrompt({ onSubmit }: { onSubmit: (id: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F9FF" }}>
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-lg border border-gray-100">
        <h2 className="text-gray-900 font-black text-xl mb-2">Select a Job</h2>
        <p className="text-gray-400 text-sm mb-6">Enter the Job ID to review candidates for that posting.</p>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-400 mb-4"
          placeholder="Job ID"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <button
          disabled={!val.trim()}
          onClick={() => onSubmit(val.trim())}
          className="w-full py-3 rounded-xl font-black text-white text-sm disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#1D4ED8,#3B82F6)" }}
        >
          Load Candidates
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface CandidateSwipeProps {
  jobId?: string; // can be passed as a route param via wrapper
}

export default function CandidateSwipe({ jobId: propJobId }: CandidateSwipeProps) {
  const [jobId, setJobId]                   = useState(propJobId || "");
  const [deck, setDeck]                     = useState<DeckCandidate[]>([]);
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [swipeResult, setSwipeResult]       = useState<LocalSwipeResult | null>(null);
  const [animatingOut, setAnimatingOut]     = useState(false);
  const [outDirection, setOutDirection]     = useState<"left" | "right" | null>(null);
  const [history, setHistory]               = useState<LocalSwipeResult[]>([]);
  const [loading, setLoading]               = useState(false);
  const [deckLoading, setDeckLoading]       = useState(false);
  const [deckError, setDeckError]           = useState<string | null>(null);
  const [matchPopup, setMatchPopup]         = useState<DeckCandidate | null>(null);
  const [page, setPage]                     = useState(1);
  const [hasMore, setHasMore]               = useState(true);

  // ── Load deck when jobId is set ─────────────────────────────────────────────
  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    setDeckLoading(true);
    setDeckError(null);

    getCandidateDeck(jobId, page, 20)
      .then((res) => {
        if (cancelled) return;
        setDeck((prev) => [...prev, ...(res.candidates ?? [])]);
        setHasMore(res.hasNextPage);
      })
      .catch((err) => { if (!cancelled) setDeckError(err.message || "Failed to load candidates."); })
      .finally(() => { if (!cancelled) setDeckLoading(false); });

    return () => { cancelled = true; };
  }, [jobId, page]);

  // ── Auto-load next page ─────────────────────────────────────────────────────
  useEffect(() => {
    if (deck.length > 0 && currentIndex >= deck.length - 5 && hasMore && !deckLoading) {
      setPage((p) => p + 1);
    }
  }, [currentIndex, deck.length, hasMore, deckLoading]);

  const currentCandidate = deck[currentIndex];
  const hasNext          = currentIndex < deck.length;

  const handleSwipe = useCallback(async (direction: "left" | "right") => {
    if (!currentCandidate || loading || animatingOut) return;

    setOutDirection(direction);
    setAnimatingOut(true);
    setLoading(true);

    try {
      const res = await swipeCandidate({
        joineeId: currentCandidate._id,
        jobId,
        direction,
      });

      setTimeout(() => {
        setAnimatingOut(false);
        setOutDirection(null);
        setLoading(false);

        const result: LocalSwipeResult = {
          candidateId:    currentCandidate._id,
          direction,
          matchScore:     res.swipe.matchScore     ?? currentCandidate.matchScore,
          matchLabel:     res.swipe.matchLabel     ?? currentCandidate.matchLabel,
          scoreBreakdown: res.swipe.scoreBreakdown ?? currentCandidate.scoreBreakdown,
          isMutualMatch:  !!res.match,
        };

        if (direction === "right") {
          setSwipeResult(result);
          if (res.match) setMatchPopup(currentCandidate);
        } else {
          setSwipeResult(null);
        }

        setHistory((h) => [...h, result]);
        setCurrentIndex((i) => i + 1);
      }, 380);
    } catch {
      setTimeout(() => {
        setAnimatingOut(false);
        setOutDirection(null);
        setLoading(false);
        setCurrentIndex((i) => i + 1);
      }, 200);
    }
  }, [currentCandidate, loading, animatingOut, jobId]);

  const handleUndo = () => {
    if (history.length === 0 || currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    setSwipeResult(null);
    setHistory((h) => h.slice(0, -1));
  };

  const shortlisted = history.filter((h) => h.direction === "right").length;
  const passed      = history.filter((h) => h.direction === "left").length;
  const progress    = deck.length > 0 ? (currentIndex / deck.length) * 100 : 0;

  // ── No jobId yet ────────────────────────────────────────────────────────────
  if (!jobId) return <JobIdPrompt onSubmit={setJobId} />;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (deckLoading && deck.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F9FF" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading candidates…</p>
        </div>
      </div>
    );
  }

  if (deckError && deck.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F9FF" }}>
        <div className="text-center">
          <p className="text-red-500 font-black text-lg mb-2">Failed to load candidates</p>
          <p className="text-gray-400 text-sm mb-4">{deckError}</p>
          <button onClick={() => { setDeckError(null); setPage(1); }}
            className="px-6 py-2 rounded-xl font-black text-white text-sm"
            style={{ background: "linear-gradient(135deg,#E53E3E,#1D4ED8)" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Rajdhani',sans-serif]" style={{ background: "#F8F9FF" }}>

      {/* Mutual match popup */}
      {matchPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          onClick={() => setMatchPopup(null)}
        >
          <div
            className="rounded-3xl p-8 text-center max-w-xs w-full mx-4"
            style={{ background: "#fff", boxShadow: "0 24px 64px rgba(229,62,62,0.2)", border: "1px solid #E8EAF6" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-gray-900 font-black text-2xl uppercase tracking-wider mb-2">Mutual Match!</h2>
            <p className="text-gray-500 text-sm mb-1">
              <span className="font-black text-gray-700">{matchPopup.name}</span> also swiped right on your job.
            </p>
            <p className="text-gray-400 text-xs mb-6">They've been notified. Check your matches!</p>
            <button
              onClick={() => setMatchPopup(null)}
              className="w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm text-white"
              style={{ background: "linear-gradient(135deg,#1D4ED8,#E53E3E)" }}
            >
              Keep Reviewing
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
            Candidate <span className="text-blue-600">Deck</span>
          </h1>
          <p className="text-gray-400 text-xs mt-0.5 font-bold">Job: {jobId}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleUndo} disabled={history.length === 0}
            className="p-2.5 rounded-xl border transition-all disabled:opacity-30"
            style={{ border: "1px solid #E8EAF6", background: "#fff" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>
            </svg>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "#F0F4FF" }}>
            <span className="text-blue-600 font-black text-sm">{shortlisted}</span>
            <span className="text-gray-400 text-xs font-bold">shortlisted</span>
            <span className="text-gray-300 mx-1">|</span>
            <span className="text-red-500 font-black text-sm">{passed}</span>
            <span className="text-gray-400 text-xs font-bold">passed</span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="h-1 w-full bg-gray-100">
        <div className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "linear-gradient(90deg,#1D4ED8,#E53E3E)" }} />
      </div>

      {/* Main */}
      <main className="max-w-md mx-auto px-4 py-8">
        {!hasNext ? (
          <SwipeDeckEmpty message="You've reviewed all candidates who applied to this job." />
        ) : (
          <>
            <div className="relative h-[560px] flex items-center justify-center">
              {[2, 1].map((offset) => {
                const idx = currentIndex + offset;
                if (idx >= deck.length) return null;
                return (
                  <div key={deck[idx]._id} className="absolute w-full pointer-events-none"
                    style={{ transform: `scale(${1 - offset * 0.04}) translateY(${offset * 12}px)`, zIndex: 10 - offset, opacity: 1 - offset * 0.2 }}>
                    <CandidateCardInner candidate={deck[idx]} />
                  </div>
                );
              })}

              <div className="absolute w-full" style={{ zIndex: 10 }}>
                <SwipeCard
                  onSwipeLeft={() => handleSwipe("left")}
                  onSwipeRight={() => handleSwipe("right")}
                  disabled={loading || animatingOut}
                >
                  <CandidateCardInner
                    candidate={currentCandidate}
                    swipeResult={swipeResult ?? undefined}
                    animatingOut={animatingOut}
                    direction={outDirection ?? undefined}
                  />
                </SwipeCard>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <button onClick={() => handleSwipe("left")} disabled={loading || animatingOut}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-40"
                style={{ background: "#fff", border: "2px solid #FECACA", boxShadow: "0 4px 20px rgba(229,62,62,0.15)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <button onClick={() => handleSwipe("right")} disabled={loading || animatingOut}
                className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", boxShadow: "0 6px 28px rgba(29,78,216,0.4)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </button>
            </div>

            <p className="text-center text-gray-400 text-xs mt-4 font-bold uppercase tracking-widest">
              ← Pass &nbsp;·&nbsp; Drag or tap &nbsp;·&nbsp; Shortlist →
            </p>
          </>
        )}
      </main>
    </div>
  );
}