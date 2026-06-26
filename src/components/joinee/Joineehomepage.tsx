
import RecruiterSection from "../joinee/RecruiterSection";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
    getJobs,
    getJobStats,
    saveJob,
    unsaveJob,
    applyToJob,
    getSavedJobIds,
    getAppliedJobIds,
    getProfileCompletion,
    getProfile
} from "../../services/joinee.service";
import type { JoineeProfile } from "../../types/joinee.types";
import JobCard, { type Job } from "./JobCard";
import JobFitCheck from "./JobFitCheck";


// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
// interface Job {
//     _id: string;
//     title: string;
//     company: string;
//     location: string;
//     type: "Full-time" | "Part-time" | "Contract";
//     salary: string;
//     tags: string[];
//     posted: string;
//     logo: string;
//     color: string;
//      description?: string;
//     requirements?: string[];
//     isRemote?: boolean;
// }


interface Stats {
    open: number;
    companies: number;
    remote: number;
}

type FilterOption = "All" | "Full-time" | "Part-time" | "Contract" | "Remote";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const FILTERS: FilterOption[] = ["All", "Full-time", "Part-time", "Contract", "Remote"];


// const TYPE_META: Record<string, { bg: string; border: string; text: string }> = {
//     "Full-time": { bg: "#FFF5F5", border: "#FECDD3", text: "#D62B2B" },
//     "Part-time": { bg: "#EEF2FF", border: "#C7D2F8", text: "#1C3FA8" },
//     "Contract":  { bg: "#F0F4FF", border: "#BFCAEE", text: "#0D1B3E" },
// };

const NAV_LINKS = [
    { label: "Browse Jobs", href: "/joinee/browse" },
    { label: "Companies",   href: "/joinee/companies" },
    { label: "Saved",       href: "/joinee/saved" },
];

const DASHBOARD_LINKS = [
    { icon: "🏠", label: "My Dashboard", href: "/joinee/dashboard" },
    { icon: "📄", label: "My Resume",    href: "/joinee/dashboard?section=resume" },
    { icon: "📬", label: "Applications", href: "/joinee/applications" },
    { icon: "🔔", label: "Notifications",href: "/joinee/notifications" },
    { icon: "⚙️", label: "Settings",     href: "/joinee/setting" },
];

// ─────────────────────────────────────────────
// JOB DECK BANNER
// ─────────────────────────────────────────────
function JobDeckBanner({ onEnter }: { onEnter: () => void }) {
    return (
        <div style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "28px 32px 0",
        }}>
            <div style={{
                background: "linear-gradient(120deg, #0D1B3E 0%, #1C3FA8 55%, #D62B2B 100%)",
                borderRadius: 18,
                padding: "28px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(13,27,62,0.18)",
            }}>
                {/* Decorative circles */}
                <div style={{ position: "absolute", top: -30, right: 180, width: 120, height: 120, borderRadius: "50%", border: "24px solid rgba(255,255,255,0.07)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -40, right: 60, width: 160, height: 160, borderRadius: "50%", border: "32px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />

                {/* Left: text */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>🃏</span>
                        <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                            textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
                            background: "rgba(255,255,255,0.1)", padding: "2px 10px",
                            borderRadius: 20, border: "1px solid rgba(255,255,255,0.15)"
                        }}>
                            AI-Powered · New
                        </span>
                    </div>
                    <h2 style={{
                        fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 700,
                        color: "#fff", lineHeight: 1.2, marginBottom: 6,
                    }}>
                        Your personalised Job Deck
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", maxWidth: 420, lineHeight: 1.6 }}>
                        Swipe through jobs ranked by your skills, experience and location.
                        Right swipe to apply — left swipe to skip. Matches appear when a recruiter likes you back.
                    </p>

                    {/* Mini feature pills */}
                    <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                        {["⚡ Ranked by AI match score", "🎯 Tailored to your profile", "🤝 Mutual matching"].map((pill) => (
                            <span key={pill} style={{
                                fontSize: 11, color: "rgba(255,255,255,0.75)",
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                padding: "3px 10px", borderRadius: 20, fontWeight: 500,
                            }}>
                                {pill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: CTA */}
                <div style={{ position: "relative", zIndex: 1, flexShrink: 0, textAlign: "center" }}>
                    {/* Stacked card preview */}
                    <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 16px" }}>
                        {[2, 1, 0].map((i) => (
                            <div key={i} style={{
                                position: "absolute",
                                width: 64, height: 80,
                                background: i === 0 ? "#fff" : `rgba(255,255,255,${0.3 + i * 0.15})`,
                                borderRadius: 12,
                                top: i * 6,
                                left: "50%",
                                transform: `translateX(-50%) rotate(${(i - 1) * 6}deg)`,
                                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: i === 0 ? 22 : 0,
                            }}>
                                {i === 0 ? "💼" : ""}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={onEnter}
                        style={{
                            background: "#fff",
                            border: "none",
                            borderRadius: 12,
                            padding: "11px 28px",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#0D1B3E",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                            transition: "transform 0.15s, box-shadow 0.15s",
                            display: "block",
                            width: "100%",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
                        }}
                    >
                        Open Job Deck →
                    </button>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
                        Swipe right to apply instantly
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function JoineeHomepage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [jobs, setJobs]                 = useState<Job[]>([]);
    const [profile, setProfile]           = useState<JoineeProfile | null>(null);
    const [stats, setStats]               = useState<Stats>({ open: 0, companies: 0, remote: 0 });
    const [search, setSearch]             = useState<string>("");
    const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
    const [savedIds, setSavedIds]         = useState<Set<string>>(new Set());
    const [profileOpen, setProfileOpen]   = useState<boolean>(false);
    const [toast, setToast]               = useState<string>("");
    const [toastType, setToastType]       = useState<"success" | "error">("success");
    const [loading, setLoading]           = useState<boolean>(true);
    const [loadingMore, setLoadingMore]   = useState<boolean>(false);
    const [hasNextPage, setHasNextPage]   = useState<boolean>(true);
    const [page, setPage]                 = useState<number>(1);
    const [appliedIds, setAppliedIds]     = useState<Set<string>>(new Set());
    const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);
    const profileRef    = useRef<HTMLDivElement>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [resumeType, setResumeType] = useState<"ai" | "uploaded">("ai");

    // ── Fetch jobs on mount ──────────────────────────────────────────────────
    useEffect(() => { fetchJobs(1, "All", ""); }, []);

    // ── Fetch profile on mount ───────────────────────────────────────────────
    useEffect(() => {
        getProfile().then((p) => setProfile(p)).catch(() => {});
    }, []);
    // ── Fetch profile completion score on mount ──────────────────────────────
    useEffect(() => {
    getProfileCompletion()
        .then(({ score }) => setProfile((p) => p ? { ...p, completionPercent: score } : p))
        .catch(() => {});
    }, []);

    // ── Fetch stats on mount ─────────────────────────────────────────────────
    useEffect(() => {
        getJobStats().then((d) => setStats(d)).catch(() => {});
    }, []);

    // ── Fetch saved job IDs on mount ─────────────────────────────────────
    useEffect(() => {
    getSavedJobIds()
        .then((ids: string[]) => {
            setSavedIds(new Set(ids));
            setProfile((p) => p ? { ...p, savedJobs: ids.length } : p);
        })
        .catch(() => {});
}, []);

   // ── Fetch applied job IDs on mount ───────────────────────────────────
    useEffect(() => {
    getAppliedJobIds()
        .then((ids: string[]) => {
            setAppliedIds(new Set(ids));
            setProfile((p) => p ? { ...p, applications: ids.length } : p);
        })
        .catch(() => {});
}, []);
    // ── Close dropdown on outside click ─────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Core fetch function ──────────────────────────────────────────────────
    const fetchJobs = async (
        pageNum: number,
        filter: FilterOption,
        query: string,
        append = false
    ) => {
        try {
            if (!append) setLoading(true);
            else setLoadingMore(true);

            const params: Record<string, string> = {
                status: "open",
                page: String(pageNum),
                limit: "12",
            };
            if (query.trim()) params.q = query.trim();
            if (filter !== "All") params.type = filter === "Remote" ? "remote" : filter;

            const data = await getJobs(params);
            setJobs((prev) => append ? [...prev, ...data.jobs] : data.jobs);
            setHasNextPage(data.hasNextPage ?? false);
        } catch {
            showToast("Failed to load jobs. Please try again.", "error");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // ── Debounced search ─────────────────────────────────────────────────────
    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setPage(1);
            fetchJobs(1, activeFilter, value);
        }, 300);
    };

    // ── Filter change ────────────────────────────────────────────────────────
    const handleFilterChange = (f: FilterOption) => {
        setActiveFilter(f);
        setPage(1);
        fetchJobs(1, f, search);
    };

    // ── Save / unsave ────────────────────────────────────────────────────────
    const handleToggleSave = async (id: string) => {
        const isSaved = savedIds.has(id);
        // Optimistic update
        setSavedIds((prev) => {
            const next = new Set(prev);
            isSaved ? next.delete(id) : next.add(id);
            return next;
        });
        setProfile((p) =>
            p ? { ...p, savedJobs: (p.savedJobs ?? 0) + (isSaved ? -1 : 1) } : p
        );
        try {
            if (isSaved) {
                await unsaveJob(id);
                showToast("Job removed from saved.", "success");
            } else {
                await saveJob(id);
                showToast("Job saved! 🔖", "success");
            }
        } catch {
            // Rollback on failure
            setSavedIds((prev) => {
                const next = new Set(prev);
                isSaved ? next.add(id) : next.delete(id);
                return next;
            });
            setProfile((p) =>
                p ? { ...p, savedJobs: (p.savedJobs ?? 0) + (isSaved ? 1 : -1) } : p
            );
            showToast("Action failed. Please try again.", "error");
        }
    };

    // ── Apply ────────────────────────────────────────────────────────────────
    // ── Apply — opens resume modal first ────────────────────────────────────
const handleApply = (id: string) => {
    if (appliedIds.has(id)) {
        showToast("You've already applied to this role.", "error");
        return;
    }
    const job = jobs.find((j) => j._id === id) ?? null;
    setResumeType("ai");        // ← add this line
    setApplyModalJob(job);
};

const confirmApply = async () => {
    if (!applyModalJob) return;
    const id = applyModalJob._id;
    setApplyModalJob(null);
    try {
        await applyToJob(id);
        setAppliedIds((prev) => new Set(prev).add(id));
        setProfile((p) =>
            p ? { ...p, applications: (p.applications ?? 0) + 1 } : p
        );
        showToast("Applied successfully ✓  We'll notify you of updates.", "success");
    } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        if (status === 409) {
            showToast("You've already applied to this role.", "error");
            setAppliedIds((prev) => new Set(prev).add(id));
        } else {
            showToast("Application failed. Please try again.", "error");
        }
    }
};
    // ── Load more ────────────────────────────────────────────────────────────
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchJobs(nextPage, activeFilter, search, true);
    };

    // ── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    // ── Toast helper ─────────────────────────────────────────────────────────
    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast(msg);
        setToastType(type);
        setTimeout(() => setToast(""), 3500);
    };

    // ─────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────
    return (
       <div className="joinee-home" style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--bg-primary)", minHeight: "100vh", color: "#111827" }}>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@600;700&display=swap');
        .joinee-home * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #A0AABF; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #D0D8F0; border-radius: 99px; }
        .job-card { transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
        .job-card:hover { border-color: #D62B2B !important; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(214,43,43,0.08) !important; }
        .apply-btn:hover { opacity: 0.88; }
        .apply-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .nav-link:hover { color: #D62B2B !important; }
        .menu-item:hover { background: rgba(214,43,43,0.06) !important; }
        @keyframes skeleton-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .skeleton { animation: skeleton-pulse 1.4s ease-in-out infinite; background: #E5E7EB; border-radius: 8px; }
      `}</style>

            {/* ══ NAV ══ */}
            <nav style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 32px", height: 62, borderBottom: "2px solid #E5E7EB",
                // background: "#FFFFFF", 
                background: "#ffffff",position: "sticky", top: 0, zIndex: 50,
                boxShadow: "0 2px 12px rgba(13,27,62,0.06)"
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>J</div>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px", color: "#111827" }}>joinnee</span>
                    <span style={{ fontSize: 10, background: "#EEF2FF", color: "#1C3FA8", padding: "2px 8px", borderRadius: 20, fontWeight: 600, border: "1px solid #C7D2F8" }}>Joinee</span>
                </div>

                {/* Nav links */}
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {NAV_LINKS.map(({ label, href }) => (
                        <button
                            key={label}
                            onClick={() => navigate(href)}
                            className="nav-link"
                            style={{
                                color: "#4A5568", fontSize: 13, fontWeight: 500,
                                padding: "6px 14px", borderRadius: 7, cursor: "pointer",
                                transition: "color 0.15s", background: "none",
                                border: "none", fontFamily: "inherit",
                            }}
                        >
                            {label}
                        </button>
                    ))}
                    {/* Job Deck nav link */}
                    <button
                        onClick={() => navigate("/joinee/swipe")}
                        className="nav-link"
                        style={{
                            color: "#D62B2B", fontSize: 13, fontWeight: 600,
                            padding: "6px 14px", borderRadius: 7, cursor: "pointer",
                            background: "#FFF5F5", border: "1px solid #FECDD3",
                            fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
                        }}
                    >
                        🃏 Job Deck
                    </button>
                </div>

                {/* Profile button */}
                <div ref={profileRef} style={{ position: "relative" }}>
                    <button
                        onClick={() => setProfileOpen((p) => !p)}
                        style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F5FF", border: "1.5px solid #C7D2F8", borderRadius: 40, padding: "4px 14px 4px 4px", cursor: "pointer" }}
                    >
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                            {profile?.initials ?? "?"}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                            {profile?.name?.split(" ")[0] ?? "…"}
                        </span>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* ── Profile dropdown ── */}
                    {profileOpen && (
                        <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 256, background: "#FFFFFF", border: "1.5px solid #E5E7EB", borderRadius: 16, padding: 6, zIndex: 100, boxShadow: "0 24px 60px rgba(13,27,62,0.14)" }}>

                            {/* Header */}
                            <div style={{ padding: "12px 14px", borderBottom: "1px solid #E5E7EB", marginBottom: 4 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                                        {profile?.initials ?? "?"}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{profile?.name ?? "Loading…"}</div>
                                        <div style={{ fontSize: 11, color: "#6B7280" }}>{profile?.title ?? ""}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 5 }}>
                                    Profile {profile?.completionPercent ?? 0}% complete
                                </div>
                                <div style={{ height: 4, background: "#F8FAFC", borderRadius: 99 }}>
                                    <div style={{ height: "100%", width: `${profile?.completionPercent ?? 0}%`, background: "linear-gradient(90deg,#D62B2B,#1C3FA8)", borderRadius: 99 }} />
                                </div>
                            </div>

                            {/* Quick stats */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "4px 6px", borderBottom: "1px solid #E5E7EB", marginBottom: 4 }}>
                                <div style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 8, padding: 8, textAlign: "center" }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "#D62B2B" }}>{profile?.applications ?? 0}</div>
                                    <div style={{ fontSize: 10, color: "#9DA3B4", marginTop: 1 }}>Applications</div>
                                </div>
                                <div style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 8, padding: 8, textAlign: "center" }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1C3FA8" }}>{profile?.savedJobs ?? 0}</div>
                                    <div style={{ fontSize: 10, color: "#9DA3B4", marginTop: 1 }}>Saved Jobs</div>
                                </div>
                            </div>

                            {/* Dashboard nav links */}
                            {DASHBOARD_LINKS.map(({ icon, label, href }) => (
                                <button
                                    key={label}
                                    className="menu-item"
                                    onClick={() => { setProfileOpen(false); navigate(href); }}
                                    style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "7px 10px", borderRadius: 8, color: "#0D1B3E", fontSize: 12, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.15s" }}
                                >
                                    <span style={{ fontSize: 14 }}>{icon}</span>
                                    <span style={{ flex: 1 }}>{label}</span>
                                    <span style={{ fontSize: 10, color: "#A0AABF" }}>{href}</span>
                                </button>
                            ))}

                            <div style={{ borderTop: "1px solid #F0F4FF", marginTop: 3, paddingTop: 3 }}>
                                <button
                                    onClick={handleLogout}
                                    style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", background: "none", border: "none", padding: "7px 10px", borderRadius: 8, cursor: "pointer", color: "#D62B2B", fontSize: 12, fontFamily: "inherit" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(214,43,43,0.08)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                                >
                                    <span style={{ fontSize: 14 }}>🚪</span> Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* ══ HERO ══ */}
            <section style={{ padding: "60px 32px 40px", textAlign: "center", background: "linear-gradient(160deg,#fff 60%,#F3F5FF 100%)", borderBottom: "1px solid #E5E7EB", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", border: "40px solid rgba(214,43,43,0.07)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -60, left: -60, width: 260, height: 260, borderRadius: "50%", border: "50px solid rgba(28,63,168,0.06)", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 30, padding: "5px 14px", fontSize: 11, color: "var(--accent-color)", fontWeight: 600, marginBottom: 20 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D62B2B", display: "inline-block" }} />
                        {stats.open > 0 ? `${stats.open.toLocaleString()} active openings right now` : "Loading openings…"}
                    </div>

                    <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 44, fontWeight: 700, lineHeight: 1.1, color: "#111827", margin: "0 0 14px", letterSpacing: "-1.5px" }}>
                        Find your next<br />
                        <span style={{ background: "linear-gradient(90deg,#D62B2B,#1C3FA8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            great opportunity
                        </span>
                    </h1>

                    <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.65 }}>
                        Browse roles from {stats.companies > 0 ? `${stats.companies}+` : "hundreds of"} companies. Apply in one click with your Joinnee profile.
                    </p>

                    {/* Search bar */}
                    <div style={{ display: "flex", alignItems: "center", maxWidth: 560, margin: "0 auto", background: "#fff", border: "2px solid #E8EDF8", borderRadius: 14, padding: "5px 5px 5px 16px", boxShadow: "0 4px 20px rgba(13,27,62,0.08)" }}>
                        <svg width="15" height="15" viewBox="0 0 17 17" fill="none" style={{ marginRight: 9, flexShrink: 0 }}>
                            <circle cx="7" cy="7" r="5.5" stroke="#A0AABF" strokeWidth="1.5" />
                            <path d="M11 11l4 4" stroke="#A0AABF" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search jobs, companies, skills…"
                            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: "#0D1B3E", fontFamily: "inherit" }}
                        />
                        <button
                            onClick={() => { if (searchTimeout.current) clearTimeout(searchTimeout.current); setPage(1); fetchJobs(1, activeFilter, search); }}
                            style={{ background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* ══ STATS BAR ══ */}
            {/* background: "#FFFFFF", */}
            <div style={{  background: "#ffffff",borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {[
                    { value: stats.open > 0      ? `${stats.open.toLocaleString()}+`  : "—", label: "Open positions",   color: "#D62B2B" },
                    { value: stats.companies > 0  ? `${stats.companies}+`              : "—", label: "Companies hiring", color: "#1C3FA8" },
                    { value: stats.remote > 0     ? `${stats.remote}+`                 : "—", label: "Remote friendly",  color: "#111827" },
                ].map(({ value, label, color }, i, arr) => (
                    <div key={label} style={{ textAlign: "center", padding: "18px 44px", borderRight: i < arr.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'Sora',sans-serif" }}>{value}</div>
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* ══ JOB DECK BANNER ══ */}
            <JobDeckBanner onEnter={() => navigate("/joinee/swipe")} />

            {/* ══ MAIN ══ */}
            <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 60px" }}>

                {/* Section heading */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: "#111827" }}>
                        Browse all jobs
                    </h2>
                    <button
                        onClick={() => navigate("/joinee/swipe")}
                        style={{ fontSize: 12, color: "#D62B2B", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", textDecoration: "underline" }}
                    >
                        Try Job Deck instead →
                    </button>
                </div>

                {/* Filter pills */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                        {FILTERS.map((f) => {
                            const isActive = activeFilter === f;
                            return (
                                <button
                                    key={f}
                                    onClick={() => handleFilterChange(f)}
                                    style={{ border: `1.5px solid ${isActive ? "#D62B2B" : "#E5E7EB"}`, borderRadius: 30, padding: "5px 15px", fontSize: 12, fontWeight: isActive ? 600 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s", fontFamily: "inherit", background: isActive ? "#D62B2B" : "#FFFFFF", color: isActive ? "#fff" : "#6B7280" }}
                                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "#1C3FA8"; e.currentTarget.style.color = "#1C3FA8"; } }}
                                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "#E8EDF8"; e.currentTarget.style.color = "#4A5568"; } }}
                                >
                                    {f}
                                </button>
                            );
                        })}
                    </div>
                    {!loading && (
                        <span style={{ fontSize: 12, color: "#6B7280" }}>
                            {jobs.length} result{jobs.length !== 1 ? "s" : ""} found
                        </span>
                    )}
                </div>

                {/* Job grid */}
                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} style={{ background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ display: "flex", gap: 11 }}>
                                    <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0 }} />
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                                        <div className="skeleton" style={{ height: 14, width: "70%" }} />
                                        <div className="skeleton" style={{ height: 11, width: "40%" }} />
                                    </div>
                                </div>
                                <div className="skeleton" style={{ height: 11, width: "55%" }} />
                                <div style={{ display: "flex", gap: 5 }}>
                                    {[60, 80, 50].map((w, j) => (
                                        <div key={j} className="skeleton" style={{ height: 20, width: w }} />
                                    ))}
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #F0F4FF" }}>
                                    <div className="skeleton" style={{ height: 13, width: 80 }} />
                                    <div className="skeleton" style={{ height: 34, width: 80, borderRadius: 9 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                        <div style={{ color: "#6B7280", fontSize: 14 }}>No jobs match your search. Try different keywords.</div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                isSaved={savedIds.has(job._id)}
                                isApplied={appliedIds.has(job._id)}
                                onSave={handleToggleSave}
                                onApply={handleApply}
                            />
                        ))}
                    </div>
                )}

                {/* Load more */}
                {!loading && hasNextPage && jobs.length > 0 && (
                    <div style={{ textAlign: "center", marginTop: 36 }}>
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            style={{ background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 10, padding: "10px 30px", fontSize: 13, fontWeight: 500, color: loadingMore ? "#A0AABF" : "#4A5568", cursor: loadingMore ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.15s", boxShadow: "0 2px 8px rgba(13,27,62,0.05)" }}
                            onMouseEnter={(e) => { if (!loadingMore) { e.currentTarget.style.borderColor = "#D62B2B"; e.currentTarget.style.color = "#D62B2B"; } }}
                            onMouseLeave={(e) => { if (!loadingMore) { e.currentTarget.style.borderColor = "#E8EDF8"; e.currentTarget.style.color = "#4A5568"; } }}
                        >
                            {loadingMore ? "Loading…" : "Load more jobs"}
                        </button>
                    </div>
                )}
            </main>
            {/* ══ Apply Resume Modal ══ */}
{applyModalJob && profile && (
    <div
        onClick={() => setApplyModalJob(null)}
        style={{
            position: "fixed", inset: 0, zIndex: 200,
            // background: "rgba(13,27,62,0.55)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
        }}
    >
        <div
            onClick={(e) => e.stopPropagation()}
            style={{
                // background: "#FFFFFF", 
                background: "#ffffff",borderRadius: 20,
                width: "100%", maxWidth: 900,
                maxHeight: "90vh", display: "flex", flexDirection: "column",
                boxShadow: "0 32px 80px rgba(13,27,62,0.28)",
                overflow: "hidden", border: "1.5px solid #E5E7EB",
            }}
        >
            {/* ── Modal header ── */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 22px", borderBottom: "1.5px solid #E5E7EB",
                // background: "#FFFFFF", 
                background: "#ffffff",flexShrink: 0,
            }}>
                <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>
                        Applying for: <span style={{ color: "#D62B2B" }}>{applyModalJob.title}</span>
                    </p>
                    <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
                        {applyModalJob.company} · {applyModalJob.location}
                    </p>
                </div>
                <button
                    onClick={() => setApplyModalJob(null)}
                    style={{
                        background: "#F8FAFC", border: "1.5px solid #E5E7EB",
                        borderRadius: 8, width: 32, height: 32,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", fontSize: 16, color: "#6B7280",
                    }}
                >✕</button>
            </div>

            {/* ── Two column body ── */}
            <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                flex: 1, minHeight: 0, overflowY: "auto",
            }}>
                {/* ── Left: job details ── */}
                <div style={{
                    borderRight: "1.5px solid #E5E7EB",
                    padding: "22px", overflowY: "auto",
                }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                        Job Details
                    </p>

                    {/* Company + title */}
                    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: 10,
                            background: applyModalJob.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0,
                        }}>
                            {applyModalJob.logo}
                        </div>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{applyModalJob.title}</div>
                            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{applyModalJob.company}</div>
                        </div>
                    </div>

                    {/* Type badge */}
                    <span style={{
                        display: "inline-flex", alignItems: "center", fontSize: 11,
                        background: "#F8FAFC", color: "#6B7280",
                        border: "1px solid #E5E7EB", padding: "3px 10px",
                        borderRadius: 99, marginBottom: 14,
                    }}>
                        {applyModalJob.type}
                        {applyModalJob.isRemote && <span style={{ marginLeft: 6, color: "#1C3FA8" }}>· Remote</span>}
                    </span>

                    {/* Info grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                        {[
                            { label: "Location", value: applyModalJob.location },
                            { label: "Salary",   value: applyModalJob.salary   },
                            { label: "Type",     value: applyModalJob.type     },
                            { label: "Posted",   value: applyModalJob.posted   },
                        ].map(({ label, value }) => (
                            <div key={label} style={{
                                background: "#F8FAFC", border: "1px solid #E5E7EB",
                                borderRadius: 10, padding: "10px 12px",
                            }}>
                                <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 3 }}>{label}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    {applyModalJob.tags?.length > 0 && (
                        <>
                            <p style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Skills</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                                {applyModalJob.tags.map((tag) => (
                                    <span key={tag} style={{
                                        fontSize: 11, background: "#F8FAFC", color: "#6B7280",
                                        border: "1px solid #E5E7EB", padding: "3px 9px", borderRadius: 99,
                                    }}>{tag}</span>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Description */}
                    {applyModalJob.description && (
                        <>
                            <p style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Description</p>
                            <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65, marginBottom: 16 }}>
                                {applyModalJob.description}
                            </p>
                        </>
                    )}

                    {/* Requirements */}
                    {applyModalJob.requirements && applyModalJob.requirements.length > 0 && (
                        <>
                            <p style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Requirements</p>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                                {applyModalJob.requirements.map((req, i) => (
                                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D62B2B", flexShrink: 0, marginTop: 5 }} />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {/* ── Right: resume picker ── */}
                <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: 14 }}>
                    <JobFitCheck job={applyModalJob} resumeType={resumeType} />
                    <p style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Choose resume to submit
                    </p>

                    {/* Radio options */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(["ai", "uploaded"] as const).map((opt) => {
                            const isSelected = resumeType === opt;
                            return (
                                <div
                                    key={opt}
                                    onClick={() => setResumeType(opt)}
                                    style={{
                                        border: isSelected
                                            ? "2px solid #2563EB"
                                            : "1.5px solid #E5E7EB",
                                        borderRadius: 12,
                                        padding: "14px 16px",
                                        cursor: "pointer",
                                        background: isSelected
                                            ? "#EFF6FF"
                                            : "#FFFFFF",
                                        boxShadow: isSelected
                                            ? "0 2px 8px rgba(37,99,235,0.12)"
                                            : "0 1px 3px rgba(0,0,0,0.04)",
                                        transition: "all .2s ease",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        {/* Radio circle */}
                                        {/* <div style={{
                                            width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                                            border: `2px solid ${isSelected ? "#111827" : "#E5E7EB"}`,
                                            background: isSelected
                                                ? "#F8FAFC"
                                                : "#FFFFFF",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            {isSelected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFFFFF" }} />}
                                        </div> */}
                                        <div
                                            style={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: "50%",
                                                flexShrink: 0,
                                                border: `2px solid ${isSelected ? "#D62B2B" : "#CFCFCF"}`,
                                                background: isSelected ? "#D62B2B" : "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
>
                                            {isSelected && (
                                                <div
                                                    style={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: "50%",
                                                        background: "#fff",
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                                                {opt === "ai" ? "AI generated resume" : "Uploaded resume"}
                                            </div>
                                            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                                                {opt === "ai" ? "Built from your profile information" : "Your manually uploaded PDF or DOCX"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Resume preview */}
                    <div
                        style={{
                            flex:1,
                            border:"1px solid #E5E7EB",
                            borderRadius:12,
                            overflow:"hidden",
                            background:"#F9FAFB",
                            minHeight:200,
                        }}
                        >
                        {/* {resumeType === "ai" ? (
                            <div style={{ overflowY: "auto", height: "100%", padding: "16px" }}>
                                <RecruiterSection profile={profile} />
                            </div>
                        ) : (
                            <div style={{
                                height: "100%", minHeight: 200,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexDirection: "column", gap: 8,
                            }}>
                                <span style={{ fontSize: 28, color: "#6B7280" }}>📄</span>
                                <p style={{ fontSize: 12, color: "#6B7280" }}>No resume uploaded yet</p>
                            </div>
                        )} */}
                        {resumeType === "ai" ? (
    <div style={{ overflowY: "auto", height: "100%", padding: "16px" }}>
        <RecruiterSection profile={profile} />
    </div>
) : profile.resumeUrl ? (
    <div style={{
        height: "100%", minHeight: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 10,
    }}>
        <span style={{ fontSize: 32 }}>📄</span>
        <p style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>Resume on file</p>
        <a
            href={`https://docs.google.com/viewer?url=${encodeURIComponent(profile.resumeUrl)}&embedded=false`}
            target="_blank"
            rel="noreferrer"
            style={{
                fontSize: 12, color: "#1C3FA8", fontWeight: 600,
                textDecoration: "underline", cursor: "pointer",
            }}
        >
            View full resume →
        </a>
    </div>
) : (
    <div style={{
        height: "100%", minHeight: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 8,
    }}>
        <span style={{ fontSize: 28, color: "#6B7280" }}>📄</span>
        <p style={{ fontSize: 12, color: "#6B7280" }}>No resume uploaded yet</p>
    </div>
)}
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div style={{
                padding: "14px 22px", borderTop: "1.5px solid #E5E7EB",
                // background: "#FFFFFF", 
                background: "#ffffff",display: "flex",
                alignItems: "center", justifyContent: "space-between",
                gap: 12, flexShrink: 0,
            }}>
                <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
                    Resume will be shared with <strong>{applyModalJob.company}</strong>
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={() => setApplyModalJob(null)}
                        style={{
                            background: "#F8FAFC", border: "1.5px solid #E5E7EB",
                            borderRadius: 10, padding: "9px 18px", fontSize: 13,
                            fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "inherit",
                        }}
                    >Cancel</button>
                    <button
                        onClick={confirmApply}
                        style={{
                            background: "linear-gradient(135deg,#D62B2B,#1C3FA8)",
                            border: "none", borderRadius: 10, padding: "9px 24px",
                            fontSize: 13, fontWeight: 700, color: "#fff",
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >Confirm &amp; Apply →</button>
                </div>
            </div>
        </div>
    </div>
)}
        {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
                    background: toastType === "error" ? "#D62B2B" : "#0D1B3E",
                    color: "#fff", fontSize: 13, padding: "10px 22px", borderRadius: 30,
                    zIndex: 999, boxShadow: "0 8px 32px rgba(13,27,62,0.25)",
                    whiteSpace: "nowrap", fontFamily: "inherit",
                    borderLeft: `4px solid ${toastType === "error" ? "#fff" : "#D62B2B"}`,
                }}>
                    {toast}
                </div>
            )}
        
        </div>
    );
}

// ─────────────────────────────────────────────
// JOB CARD COMPONENT
// ─────────────────────────────────────────────
// interface JobCardProps {
//     job: Job;
//     isSaved: boolean;
//     isApplied: boolean;
//     onSave: (id: string) => void;
//     onApply: (id: string) => void;
// }

// function JobCard({ job, isSaved, isApplied, onSave, onApply }: JobCardProps) {
//     const tm = TYPE_META[job.type] ?? { bg: "#F8F9FF", border: "#E8EDF8", text: "#0D1B3E" };

//     return (
//         <div className="job-card" style={{ background: "#FFFFFF", border: "1.5px solid #E5E7EB", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 13, boxShadow: "0 2px 8px rgba(13,27,62,0.04)" }}>
//             <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
//                     <div style={{ width: 42, height: 42, borderRadius: 10, background: job.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
//                         {job.logo}
//                     </div>
//                     <div>
//                         <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>{job.title}</div>
//                         <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{job.company}</div>
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => onSave(job._id)}
//                     title={isSaved ? "Unsave job" : "Save job"}
//                     style={{ background: isSaved ? "#FFF5F5" : "#F8F9FF", border: `1.5px solid ${isSaved ? "#FECDD3" : "#E8EDF8"}`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 15, transition: "all 0.15s" }}
//                 >
//                     {isSaved ? "🔖" : "🏷️"}
//                 </button>
//             </div>

//             <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
//                 <span style={{ fontSize: 11, background: tm.bg, color: tm.text, border: `1px solid ${tm.border}`, padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>{job.type}</span>
//                 <span style={{ fontSize: 11, color: "#6B7280" }}>📍 {job.location}</span>
//             </div>

//             <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
//                 {job.tags.map((tag) => (
//                     <span key={tag} style={{ fontSize: 10, background: "#F8F9FF", color: "#4A5568", border: "1px solid #E8EDF8", padding: "2px 8px", borderRadius: 5, fontWeight: 500 }}>
//                         {tag}
//                     </span>
//                 ))}
//             </div>

//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTop: "1px solid #E5E7EB" }}>
//                 <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-color)" }}>{job.salary}</div>
//                     <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{job.posted}</div>
//                 </div>
//                 <button
//                     className="apply-btn"
//                     onClick={() => onApply(job._id)}
//                     disabled={isApplied}
//                     style={{ background: isApplied ? "#FFFFFF" : "linear-gradient(135deg,#D62B2B,#1C3FA8)", border: "none", borderRadius: 9, padding: "9px 20px", fontSize: 12, fontWeight: 600, color: isApplied ? "#6B7280" : "#fff", cursor: isApplied ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "opacity 0.15s" }}
//                 >
//                     {isApplied ? "Applied ✓" : "Apply →"}
//                 </button>
//             </div>
//         </div>
//     );
// }
// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/useAuth";
// import {
//     getJobs,
//     getJobStats,
//     saveJob,
//     unsaveJob,
//     applyToJob,
//     getSavedJobIds,
// } from "../../services/joinee.service";
// import { getProfile } from "../../services/joinee.service";
// import type { JoineeProfile } from "../../types/joinee.types";


// // ─────────────────────────────────────────────
// // TYPES
// // ─────────────────────────────────────────────
// // REPLACE the entire Job interface with:
// interface Job {
//     _id: string;
//     title: string;
//     company: string;
//     location: string;
//     type: "Full-time" | "Part-time" | "Contract";
//     salary: string;
//     tags: string[];
//     posted: string;
//     logo: string;
//     color: string;
// }
// interface Stats {
//     open: number;
//     companies: number;
//     remote: number;
// }

// type FilterOption = "All" | "Full-time" | "Part-time" | "Contract" | "Remote";

// // ─────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────
// const FILTERS: FilterOption[] = ["All", "Full-time", "Part-time", "Contract", "Remote"];

// const TYPE_META: Record<string, { bg: string; border: string; text: string }> = {
//     "Full-time": { bg: "#FFF5F5", border: "#FECDD3", text: "#D62B2B" },
//     "Part-time": { bg: "#EEF2FF", border: "#C7D2F8", text: "#1C3FA8" },
//     "Contract": { bg: "#F0F4FF", border: "#BFCAEE", text: "#0D1B3E" },
// };

// const NAV_LINKS = [
//     { label: "Browse Jobs", href: "/joinee/browse" },
//     { label: "Companies", href: "/joinee/companies" },
//     { label: "Saved", href: "/joinee/saved" },
// ];

// // Maps dropdown label → dashboard route
// const DASHBOARD_LINKS = [
//     { icon: "🏠", label: "My Dashboard", href: "/joinee/dashboard" },
//     { icon: "📄", label: "My Resume", href: "/joinee/dashboard?section=resume" },
//     { icon: "📬", label: "Applications", href: "/joinee/applications" },
//     { icon: "🔔", label: "Notifications", href: "/joinee/notifications" },
//     { icon: "⚙️", label: "Settings", href: "/joinee/settings" },
// ];

// // ─────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────
// export default function JoineeHomepage() {
//     const navigate = useNavigate();
//     const { logout } = useAuth();

//     const [jobs, setJobs] = useState<Job[]>([]);
//     const [profile, setProfile] = useState<JoineeProfile | null>(null);
//     const [stats, setStats] = useState<Stats>({ open: 0, companies: 0, remote: 0 });
//     const [search, setSearch] = useState<string>("");
//     const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
//    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
//     const [profileOpen, setProfileOpen] = useState<boolean>(false);
//     const [toast, setToast] = useState<string>("");
//     const [toastType, setToastType] = useState<"success" | "error">("success");
//     const [loading, setLoading] = useState<boolean>(true);
//     const [loadingMore, setLoadingMore] = useState<boolean>(false);
//     const [hasNextPage, setHasNextPage] = useState<boolean>(true);
//     const [page, setPage] = useState<number>(1);
//     const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
//     const profileRef = useRef<HTMLDivElement>(null);
//     const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

//     // ── Fetch jobs on mount ────────────────────────────────────────────────────
//     useEffect(() => {
//         fetchJobs(1, "All", "");
//     }, []);

//     // ── Fetch profile on mount ─────────────────────────────────────────────────
//     useEffect(() => {
//         getProfile()
//             .then((p) => setProfile(p))
//             .catch(() => {/* profile not critical for homepage */ });
//     }, []);

//     // ── Fetch stats on mount ───────────────────────────────────────────────────
//     useEffect(() => {
//         getJobStats()
//             .then((data) => setStats(data))
//             .catch(() => {/* keep zeros */ });
//     }, []);

//     // ── Fetch saved job IDs on mount ───────────────────────────────────────────
//     useEffect(() => {
//         getSavedJobIds()
//            .then((ids: string[]) => setSavedIds(new Set(ids)))
//             .catch(() => {/* not critical */ });
//     }, []);

//     // ── Close dropdown on outside click ────────────────────────────────────────
//     useEffect(() => {
//         const handler = (e: MouseEvent) => {
//             if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
//                 setProfileOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handler);
//         return () => document.removeEventListener("mousedown", handler);
//     }, []);

//     // ── Core fetch function ────────────────────────────────────────────────────
//     const fetchJobs = async (
//         pageNum: number,
//         filter: FilterOption,
//         query: string,
//         append = false
//     ) => {
//         try {
//             if (!append) setLoading(true);
//             else setLoadingMore(true);

//             const params: Record<string, string> = {
//                 status: "open",
//                 page: String(pageNum),
//                 limit: "12",
//             };
//             if (query.trim()) params.q = query.trim();
//             if (filter !== "All") params.type = filter === "Remote" ? "remote" : filter;

//             const data = await getJobs(params);
//             console.log('First job:', JSON.stringify(data.jobs[0])); // ← add this
//             // getJobs should return: { jobs: Job[], hasNextPage: boolean }
//             setJobs((prev) => append ? [...prev, ...data.jobs] : data.jobs);
//             setHasNextPage(data.hasNextPage ?? false);
//         } catch {
//             showToast("Failed to load jobs. Please try again.", "error");
//         } finally {
//             setLoading(false);
//             setLoadingMore(false);
//         }
//     };

//     // ── Debounced search ───────────────────────────────────────────────────────
//     const handleSearchChange = (value: string) => {
//         setSearch(value);
//         if (searchTimeout.current) clearTimeout(searchTimeout.current);
//         searchTimeout.current = setTimeout(() => {
//             setPage(1);
//             fetchJobs(1, activeFilter, value);
//         }, 300);
//     };

//     // ── Filter change ──────────────────────────────────────────────────────────
//     const handleFilterChange = (f: FilterOption) => {
//         setActiveFilter(f);
//         setPage(1);
//         fetchJobs(1, f, search);
//     };

//     // ── Save / unsave ──────────────────────────────────────────────────────────
//     const handleToggleSave = async (id: string) => {
//     const isSaved = savedIds.has(id);
//         // Optimistic update
//         setSavedIds((prev) => {
//             const next = new Set(prev);
//             isSaved ? next.delete(id) : next.add(id);
//             return next;
//         });
//         setProfile((p) =>
//             p ? { ...p, savedJobs: (p.savedJobs ?? 0) + (isSaved ? -1 : 1) } : p
//         );

//         try {
//             if (isSaved) {
//                 await unsaveJob(id);          // DELETE /api/jobs/:id/save
//                 showToast("Job removed from saved.", "success");
//             } else {
//                 await saveJob(id);            // POST /api/jobs/:id/save
//                 showToast("Job saved! 🔖", "success");
//             }
//         } catch {
//             // Rollback optimistic update on failure
//             setSavedIds((prev) => {
//                 const next = new Set(prev);
//                 isSaved ? next.add(id) : next.delete(id);
//                 return next;
//             });
//             setProfile((p) =>
//                 p ? { ...p, savedJobs: (p.savedJobs ?? 0) + (isSaved ? 1 : -1) } : p
//             );
//             showToast("Action failed. Please try again.", "error");
//         }
//     };

//     // ── Apply ──────────────────────────────────────────────────────────────────
//     const handleApply = async (id: string) => { 

//         if (appliedIds.has(id)) {
//             showToast("You've already applied to this role.", "error");
//             return;
//         }
//         try {
//             await applyToJob(id);           // POST /api/applications { jobId: id }
//             setAppliedIds((prev) => new Set(prev).add(id));
//             setProfile((p) =>
//                 p ? { ...p, applications: (p.applications ?? 0) + 1 } : p
//             );
//             showToast("Applied successfully ✓  We'll notify you of updates.", "success");
//         } catch (err: unknown) {
//             const status = (err as { status?: number })?.status;
//             if (status === 409) {
//                 showToast("You've already applied to this role.", "error");
//                 setAppliedIds((prev) => new Set(prev).add(id));
//             } else {
//                 showToast("Application failed. Please try again.", "error");
//             }
//         }
//     };

//     // ── Load more ──────────────────────────────────────────────────────────────
//     const handleLoadMore = () => {
//         const nextPage = page + 1;
//         setPage(nextPage);
//         fetchJobs(nextPage, activeFilter, search, true);
//     };

//     // ── Logout ─────────────────────────────────────────────────────────────────
//     const handleLogout = async () => {
//         await logout();                   // POST /api/auth/logout + clears token
//         navigate("/login", { replace: true });
//     };

//     // ── Toast helper ───────────────────────────────────────────────────────────
//     const showToast = (msg: string, type: "success" | "error" = "success") => {
//         setToast(msg);
//         setToastType(type);
//         setTimeout(() => setToast(""), 3500);
//     };

//     // ─────────────────────────────────────────────
//     // RENDER
//     // ─────────────────────────────────────────────
//     return (
//         <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F8F9FF", minHeight: "100vh", color: "#0D1B3E" }}>

//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@600;700&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         input::placeholder { color: #A0AABF; }
//         ::-webkit-scrollbar { width: 4px; height: 4px; }
//         ::-webkit-scrollbar-thumb { background: #D0D8F0; border-radius: 99px; }
//         .job-card { transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
//         .job-card:hover { border-color: #D62B2B !important; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(214,43,43,0.08) !important; }
//         .apply-btn:hover { opacity: 0.88; }
//         .apply-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//         .nav-link:hover { color: #D62B2B !important; }
//         .menu-item:hover { background: rgba(214,43,43,0.06) !important; }
//         @keyframes skeleton-pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.4; }
//         }
//         .skeleton { animation: skeleton-pulse 1.4s ease-in-out infinite; background: #E8EDF8; border-radius: 8px; }
//       `}</style>

//             {/* ══ NAV ══ */}
//             <nav style={{
//                 display: "flex", alignItems: "center", justifyContent: "space-between",
//                 padding: "0 32px", height: 62, borderBottom: "2px solid #E8EDF8",
//                 background: "#fff", position: "sticky", top: 0, zIndex: 50,
//                 boxShadow: "0 2px 12px rgba(13,27,62,0.06)"
//             }}>
//                 {/* Logo */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                     <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>J</div>
//                     <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px", color: "#0D1B3E" }}>joinnee</span>
//                     <span style={{ fontSize: 10, background: "#EEF2FF", color: "#1C3FA8", padding: "2px 8px", borderRadius: 20, fontWeight: 600, border: "1px solid #C7D2F8" }}>Joinee</span>
//                 </div>

//                 {/* Nav links */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     {NAV_LINKS.map(({ label, href }) => (
//                         <button
//                             key={label}
//                             onClick={() => navigate(href)}
//                             className="nav-link"
//                             style={{
//                                 color: "#4A5568",
//                                 fontSize: 13,
//                                 fontWeight: 500,
//                                 padding: "6px 14px",
//                                 borderRadius: 7,
//                                 cursor: "pointer",
//                                 transition: "color 0.15s",
//                                 background: "none",
//                                 border: "none",
//                                 fontFamily: "inherit"
//                             }}
//                         >
//                             {label}
//                         </button>

//                     ))}
//                 </div>

//                 {/* Profile button */}
//                 <div ref={profileRef} style={{ position: "relative" }}>
//                     <button
//                         onClick={() => setProfileOpen((p) => !p)}
//                         style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F5FF", border: "1.5px solid #C7D2F8", borderRadius: 40, padding: "4px 14px 4px 4px", cursor: "pointer" }}>
//                         <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
//                             {profile?.initials ?? "?"}
//                         </div>
//                         <span style={{ fontSize: 13, fontWeight: 600, color: "#0D1B3E" }}>
//                             {profile?.name?.split(" ")[0] ?? "…"}
//                         </span>
//                         <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
//                             <path d="M2 4l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
//                         </svg>
//                     </button>

//                     {/* ── Profile dropdown ── */}
//                     {profileOpen && (
//                         <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 256, background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 16, padding: 6, zIndex: 100, boxShadow: "0 24px 60px rgba(13,27,62,0.14)" }}>

//                             {/* Header */}
//                             <div style={{ padding: "12px 14px", borderBottom: "1px solid #F0F4FF", marginBottom: 4 }}>
//                                 <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
//                                     <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
//                                         {profile?.initials ?? "?"}
//                                     </div>
//                                     <div>
//                                         <div style={{ fontSize: 14, fontWeight: 700, color: "#0D1B3E" }}>{profile?.name ?? "Loading…"}</div>
//                                         <div style={{ fontSize: 11, color: "#6B7280" }}>{profile?.title ?? ""}</div>
//                                     </div>
//                                 </div>
//                                 <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 5 }}>
//                                     Profile {profile?.completionPercent ?? 0}% complete
//                                 </div>
//                                 <div style={{ height: 4, background: "#F0F4FF", borderRadius: 99 }}>
//                                     <div style={{ height: "100%", width: `${profile?.completionPercent ?? 0}%`, background: "linear-gradient(90deg,#D62B2B,#1C3FA8)", borderRadius: 99 }} />
//                                 </div>
//                             </div>

//                             {/* Quick stats */}
//                             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "4px 6px", borderBottom: "1px solid #F0F4FF", marginBottom: 4 }}>
//                                 <div style={{ background: "#FFF5F5", border: "1px solid #FECDD3", borderRadius: 8, padding: 8, textAlign: "center" }}>
//                                     <div style={{ fontSize: 18, fontWeight: 700, color: "#D62B2B" }}>{profile?.applications ?? 0}</div>
//                                     <div style={{ fontSize: 10, color: "#9DA3B4", marginTop: 1 }}>Applications</div>
//                                 </div>
//                                 <div style={{ background: "#EEF2FF", border: "1px solid #C7D2F8", borderRadius: 8, padding: 8, textAlign: "center" }}>
//                                     <div style={{ fontSize: 18, fontWeight: 700, color: "#1C3FA8" }}>{profile?.savedJobs ?? 0}</div>
//                                     <div style={{ fontSize: 10, color: "#9DA3B4", marginTop: 1 }}>Saved Jobs</div>
//                                 </div>
//                             </div>

//                             {/* Dashboard nav links — use navigate() for SPA routing */}
//                             {DASHBOARD_LINKS.map(({ icon, label, href }) => (
//                                 <button
//                                     key={label}
//                                     className="menu-item"
//                                     onClick={() => { setProfileOpen(false); navigate(href); }}
//                                     style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "7px 10px", borderRadius: 8, color: "#0D1B3E", fontSize: 12, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.15s" }}>
//                                     <span style={{ fontSize: 14 }}>{icon}</span>
//                                     <span style={{ flex: 1 }}>{label}</span>
//                                     <span style={{ fontSize: 10, color: "#A0AABF" }}>{href}</span>
//                                 </button>
//                             ))}

//                             <div style={{ borderTop: "1px solid #F0F4FF", marginTop: 3, paddingTop: 3 }}>
//                                 <button
//                                     onClick={handleLogout}
//                                     style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", background: "none", border: "none", padding: "7px 10px", borderRadius: 8, cursor: "pointer", color: "#D62B2B", fontSize: 12, fontFamily: "inherit" }}
//                                     onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(214,43,43,0.08)")}
//                                     onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
//                                     <span style={{ fontSize: 14 }}>🚪</span> Sign out
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </nav>

//             {/* ══ HERO ══ */}
//             <section style={{ padding: "60px 32px 40px", textAlign: "center", background: "linear-gradient(160deg,#fff 60%,#F3F5FF 100%)", borderBottom: "1px solid #E8EDF8", position: "relative", overflow: "hidden" }}>
//                 <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", border: "40px solid rgba(214,43,43,0.07)", pointerEvents: "none" }} />
//                 <div style={{ position: "absolute", bottom: -60, left: -60, width: 260, height: 260, borderRadius: "50%", border: "50px solid rgba(28,63,168,0.06)", pointerEvents: "none" }} />

//                 <div style={{ position: "relative", zIndex: 1 }}>
//                     <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#FFF5F5", border: "1px solid #FECDD3", borderRadius: 30, padding: "5px 14px", fontSize: 11, color: "#D62B2B", fontWeight: 600, marginBottom: 20 }}>
//                         <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D62B2B", display: "inline-block" }} />
//                         {stats.open > 0 ? `${stats.open.toLocaleString()} active openings right now` : "Loading openings…"}
//                     </div>

//                     <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 44, fontWeight: 700, lineHeight: 1.1, color: "#0D1B3E", margin: "0 0 14px", letterSpacing: "-1.5px" }}>
//                         Find your next<br />
//                         <span style{{ background: "linear-gradient(90deg,#D62B2B,#1C3FA8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
//                             great opportunity
//                         </span>
//                     </h1>

//                     <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.65 }}>
//                         Browse roles from {stats.companies > 0 ? `${stats.companies}+` : "hundreds of"} companies. Apply in one click with your Joinnee profile.
//                     </p>

//                     {/* Search bar — debounced, calls GET /api/jobs?q=... */}
//                     <div style={{ display: "flex", alignItems: "center", maxWidth: 560, margin: "0 auto", background: "#fff", border: "2px solid #E8EDF8", borderRadius: 14, padding: "5px 5px 5px 16px", boxShadow: "0 4px 20px rgba(13,27,62,0.08)" }}>
//                         <svg width="15" height="15" viewBox="0 0 17 17" fill="none" style={{ marginRight: 9, flexShrink: 0 }}>
//                             <circle cx="7" cy="7" r="5.5" stroke="#A0AABF" strokeWidth="1.5" />
//                             <path d="M11 11l4 4" stroke="#A0AABF" strokeWidth="1.5" strokeLinecap="round" />
//                         </svg>
//                         <input
//                             value={search}
//                             onChange={(e) => handleSearchChange(e.target.value)}
//                             placeholder="Search jobs, companies, skills…"
//                             style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: "#0D1B3E", fontFamily: "inherit" }}
//                         />
//                         <button
//                             onClick={() => { if (searchTimeout.current) clearTimeout(searchTimeout.current); setPage(1); fetchJobs(1, activeFilter, search); }}
//                             style={{ background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
//                             Search
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             {/* ══ STATS BAR ══ */}
//             <div style={{ background: "#fff", borderBottom: "1px solid #E8EDF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 {[
//                     { value: stats.open > 0 ? `${stats.open.toLocaleString()}+` : "—", label: "Open positions", color: "#D62B2B" },
//                     { value: stats.companies > 0 ? `${stats.companies}+` : "—", label: "Companies hiring", color: "#1C3FA8" },
//                     { value: stats.remote > 0 ? `${stats.remote}+` : "—", label: "Remote friendly", color: "#0D1B3E" },
//                 ].map(({ value, label, color }, i, arr) => (
//                     <div key={label} style={{ textAlign: "center", padding: "18px 44px", borderRight: i < arr.length - 1 ? "1px solid #E8EDF8" : "none" }}>
//                         <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'Sora',sans-serif" }}>{value}</div>
//                         <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{label}</div>
//                     </div>
//                 ))}
//             </div>

//             {/* ══ MAIN ══ */}
//             <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 60px" }}>

//                 {/* Filter pills — calls GET /api/jobs?type=... server-side */}
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
//                         {FILTERS.map((f) => {
//                             const isActive = activeFilter === f;
//                             return (
//                                 <button
//                                     key={f}
//                                     onClick={() => handleFilterChange(f)}
//                                     style={{ border: `1.5px solid ${isActive ? "#D62B2B" : "#E8EDF8"}`, borderRadius: 30, padding: "5px 15px", fontSize: 12, fontWeight: isActive ? 600 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s", fontFamily: "inherit", background: isActive ? "#D62B2B" : "#fff", color: isActive ? "#fff" : "#4A5568" }}
//                                     onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "#1C3FA8"; e.currentTarget.style.color = "#1C3FA8"; } }}
//                                     onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "#E8EDF8"; e.currentTarget.style.color = "#4A5568"; } }}>
//                                     {f}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                     {!loading && (
//                         <span style={{ fontSize: 12, color: "#6B7280" }}>
//                             {jobs.length} result{jobs.length !== 1 ? "s" : ""} found
//                         </span>
//                     )}
//                 </div>

//                 {/* Job grid */}
//                 {loading ? (
//                     // Skeleton loader
//                     <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
//                         {Array.from({ length: 9 }).map((_, i) => (
//                             <div key={i} style={{ background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
//                                 <div style={{ display: "flex", gap: 11 }}>
//                                     <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0 }} />
//                                     <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
//                                         <div className="skeleton" style={{ height: 14, width: "70%" }} />
//                                         <div className="skeleton" style={{ height: 11, width: "40%" }} />
//                                     </div>
//                                 </div>
//                                 <div className="skeleton" style={{ height: 11, width: "55%" }} />
//                                 <div style={{ display: "flex", gap: 5 }}>
//                                     {[60, 80, 50].map((w, j) => (
//                                         <div key={j} className="skeleton" style={{ height: 20, width: w }} />
//                                     ))}
//                                 </div>
//                                 <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #F0F4FF" }}>
//                                     <div className="skeleton" style={{ height: 13, width: 80 }} />
//                                     <div className="skeleton" style={{ height: 34, width: 80, borderRadius: 9 }} />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : jobs.length === 0 ? (
//                     <div style={{ textAlign: "center", padding: "60px 0" }}>
//                         <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
//                         <div style={{ color: "#6B7280", fontSize: 14 }}>No jobs match your search. Try different keywords.</div>
//                     </div>
//                 ) : (
//                     <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
//                         {jobs.map((job) => (
//                             <JobCard
//                                 key={job._id}
//                                 job={job}
//                                 isSaved={savedIds.has(job._id)}
//                                 isApplied={appliedIds.has(job._id)}   
//                                 onSave={handleToggleSave}
//                                 onApply={handleApply}
//                             />
//                         ))}
//                     </div>
//                 )}

//                 {/* Load more */}
//                 {!loading && hasNextPage && jobs.length > 0 && (
//                     <div style={{ textAlign: "center", marginTop: 36 }}>
//                         <button
//                             onClick={handleLoadMore}
//                             disabled={loadingMore}
//                             style={{ background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 10, padding: "10px 30px", fontSize: 13, fontWeight: 500, color: loadingMore ? "#A0AABF" : "#4A5568", cursor: loadingMore ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.15s", boxShadow: "0 2px 8px rgba(13,27,62,0.05)" }}
//                             onMouseEnter={(e) => { if (!loadingMore) { e.currentTarget.style.borderColor = "#D62B2B"; e.currentTarget.style.color = "#D62B2B"; } }}
//                             onMouseLeave={(e) => { if (!loadingMore) { e.currentTarget.style.borderColor = "#E8EDF8"; e.currentTarget.style.color = "#4A5568"; } }}>
//                             {loadingMore ? "Loading…" : "Load more jobs"}
//                         </button>
//                     </div>
//                 )}
//             </main>

//             {/* Toast */}
//             {toast && (
//                 <div style={{
//                     position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
//                     background: toastType === "error" ? "#D62B2B" : "#0D1B3E",
//                     color: "#fff", fontSize: 13, padding: "10px 22px", borderRadius: 30,
//                     zIndex: 999, boxShadow: "0 8px 32px rgba(13,27,62,0.25)",
//                     whiteSpace: "nowrap", fontFamily: "inherit",
//                     borderLeft: `4px solid ${toastType === "error" ? "#fff" : "#D62B2B"}`
//                 }}>
//                     {toast}
//                 </div>
//             )}
//         </div>
//     );
// }

// // ─────────────────────────────────────────────
// // JOB CARD COMPONENT
// // ─────────────────────────────────────────────
// interface JobCardProps {
//     job: Job;
//     isSaved: boolean;
//     isApplied: boolean;
//     onSave: (id: string) => void;   // ← was number
//     onApply: (id: string) => void;  // ← was number
// }

// function JobCard({ job, isSaved, isApplied, onSave, onApply }: JobCardProps) {
//     const tm = TYPE_META[job.type] ?? { bg: "#F8F9FF", border: "#E8EDF8", text: "#0D1B3E" };

//     return (
//         <div className="job-card" style={{ background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 13, boxShadow: "0 2px 8px rgba(13,27,62,0.04)" }}>
//             <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
//                     <div style={{ width: 42, height: 42, borderRadius: 10, background: job.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
//                         {job.logo}
//                     </div>
//                     <div>
//                         <div style={{ fontSize: 14, fontWeight: 600, color: "#0D1B3E", lineHeight: 1.3 }}>{job.title}</div>
//                         <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{job.company}</div>
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => onSave(job._id)}

//                     title={isSaved ? "Unsave job" : "Save job"}
//                     style={{ background: isSaved ? "#FFF5F5" : "#F8F9FF", border: `1.5px solid ${isSaved ? "#FECDD3" : "#E8EDF8"}`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 15, transition: "all 0.15s" }}>
//                     {isSaved ? "🔖" : "🏷️"}
//                 </button>
//             </div>

//             <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
//                 <span style={{ fontSize: 11, background: tm.bg, color: tm.text, border: `1px solid ${tm.border}`, padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>{job.type}</span>
//                 <span style={{ fontSize: 11, color: "#6B7280" }}>📍 {job.location}</span>
//             </div>

//             <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
//                 {job.tags.map((tag) => (
//                     <span key={tag} style={{ fontSize: 10, background: "#F8F9FF", color: "#4A5568", border: "1px solid #E8EDF8", padding: "2px 8px", borderRadius: 5, fontWeight: 500 }}>
//                         {tag}
//                     </span>
//                 ))}
//             </div>

//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTop: "1px solid #F0F4FF" }}>
//                 <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: "#D62B2B" }}>{job.salary}</div>
//                     <div style={{ fontSize: 10, color: "#A0AABF", marginTop: 2 }}>{job.posted}</div>
//                 </div>
//                 <button
//                     className="apply-btn"
//                     onClick={() => onApply(job._id)}
//                     disabled={isApplied}
//                     style={{ background: isApplied ? "#E8EDF8" : "linear-gradient(135deg,#D62B2B,#1C3FA8)", border: "none", borderRadius: 9, padding: "9px 20px", fontSize: 12, fontWeight: 600, color: isApplied ? "#A0AABF" : "#fff", cursor: isApplied ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "opacity 0.15s" }}>
//                     {isApplied ? "Applied ✓" : "Apply →"}
//                 </button>
//             </div>
//         </div>
//     );
// }