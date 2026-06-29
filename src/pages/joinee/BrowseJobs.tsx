import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    getJobs,
    saveJob,
    unsaveJob,
    applyToJob,
    getSavedJobIds,
    getAppliedJobIds,
} from "../../services/joinee.service";
import JobCard, { type Job } from "../../components/joinee/JobCard";

type FilterOption = "All" | "Full-time" | "Part-time" | "Contract" | "Remote";
const FILTERS: FilterOption[] = ["All", "Full-time", "Part-time", "Contract", "Remote"];

export default function BrowseJobs() {
    const navigate = useNavigate();

    const [jobs, setJobs]                 = useState<Job[]>([]);
    const [search, setSearch]             = useState("");
    const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
    const [savedIds, setSavedIds]         = useState<Set<string>>(new Set());
    const [appliedIds, setAppliedIds]     = useState<Set<string>>(new Set());
    const [loading, setLoading]           = useState(true);
    const [loadingMore, setLoadingMore]   = useState(false);
    const [hasNextPage, setHasNextPage]   = useState(true);
    const [page, setPage]                 = useState(1);
    const [toast, setToast]               = useState("");
    const [toastType, setToastType]       = useState<"success" | "error">("success");
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Initial fetches ──────────────────────────────────────────────────────
    useEffect(() => { fetchJobs(1, "All", ""); }, []);

    useEffect(() => {
        getSavedJobIds().then((ids) => setSavedIds(new Set(ids))).catch(() => {});
    }, []);

    useEffect(() => {
        getAppliedJobIds().then((ids) => setAppliedIds(new Set(ids))).catch(() => {});
    }, []);

    // ── Core fetch ───────────────────────────────────────────────────────────
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

    // ── Filter ───────────────────────────────────────────────────────────────
    const handleFilterChange = (f: FilterOption) => {
        setActiveFilter(f);
        setPage(1);
        fetchJobs(1, f, search);
    };

    // ── Save / Unsave ────────────────────────────────────────────────────────
    const handleToggleSave = async (id: string) => {
        const isSaved = savedIds.has(id);
        setSavedIds((prev) => {
            const next = new Set(prev);
            isSaved ? next.delete(id) : next.add(id);
            return next;
        });
        try {
            if (isSaved) { await unsaveJob(id); showToast("Job removed from saved.", "success"); }
            else          { await saveJob(id);   showToast("Job saved! 🔖", "success"); }
        } catch {
            setSavedIds((prev) => {
                const next = new Set(prev);
                isSaved ? next.add(id) : next.delete(id);
                return next;
            });
            showToast("Action failed. Please try again.", "error");
        }
    };

    // ── Apply ────────────────────────────────────────────────────────────────
    const handleApply = async (id: string) => {
        if (appliedIds.has(id)) { showToast("You've already applied to this role.", "error"); return; }
        try {
            await applyToJob(id);
            setAppliedIds((prev) => new Set(prev).add(id));
            showToast("Applied successfully ✓", "success");
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
        const next = page + 1;
        setPage(next);
        fetchJobs(next, activeFilter, search, true);
    };

    // ── Toast ────────────────────────────────────────────────────────────────
    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast(msg);
        setToastType(type);
        setTimeout(() => setToast(""), 3500);
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F8FAFC", minHeight: "100vh", color: "#111827" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@600;700&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                input::placeholder { color: #A0AABF; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: #D0D8F0; border-radius: 99px; }
                .job-card { transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
                .job-card:hover { border-color: #D62B2B !important; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(214,43,43,0.08) !important; }
                .apply-btn:hover { opacity: 0.88; }
                .apply-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                @keyframes skeleton-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
                .skeleton { animation: skeleton-pulse 1.4s ease-in-out infinite; background: #E5E7EB; border-radius: 8px; }
            `}</style>

            {/* ── Header ── */}
            <div style={{
                background: "#fff", borderBottom: "1px solid #E5E7EB",
                padding: "24px 32px", position: "sticky", top: 0, zIndex: 10,
                boxShadow: "0 2px 8px rgba(13,27,62,0.05)",
            }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <div>
                            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 700, color: "#111827" }}>
                                Browse Jobs
                            </h1>
                            {!loading && (
                                <p style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>
                                    {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate("/joinee/swipe")}
                            style={{
                                background: "#FFF5F5", border: "1px solid #FECDD3",
                                borderRadius: 10, padding: "8px 16px", fontSize: 13,
                                fontWeight: 600, color: "#D62B2B", cursor: "pointer",
                                fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
                            }}
                        >
                            🃏 Try Job Deck instead
                        </button>
                    </div>

                    {/* Search */}
                    <div style={{
                        display: "flex", alignItems: "center",
                        background: "#F8FAFC", border: "1.5px solid #E8EDF8",
                        borderRadius: 12, padding: "6px 6px 6px 14px",
                        marginBottom: 14,
                    }}>
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
                        {search && (
                            <button
                                onClick={() => { setSearch(""); setPage(1); fetchJobs(1, activeFilter, ""); }}
                                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#A0AABF", padding: "0 6px" }}
                            >✕</button>
                        )}
                    </div>

                    {/* Filters */}
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                        {FILTERS.map((f) => {
                            const isActive = activeFilter === f;
                            return (
                                <button
                                    key={f}
                                    onClick={() => handleFilterChange(f)}
                                    style={{
                                        border: `1.5px solid ${isActive ? "#D62B2B" : "#E5E7EB"}`,
                                        borderRadius: 30, padding: "5px 15px", fontSize: 12,
                                        fontWeight: isActive ? 600 : 500, cursor: "pointer",
                                        fontFamily: "inherit",
                                        background: isActive ? "#D62B2B" : "#fff",
                                        color: isActive ? "#fff" : "#6B7280",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {f}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Job Grid ── */}
            <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 60px" }}>
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
                                    {[60, 80, 50].map((w, j) => <div key={j} className="skeleton" style={{ height: 20, width: w }} />)}
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #F0F4FF" }}>
                                    <div className="skeleton" style={{ height: 13, width: 80 }} />
                                    <div className="skeleton" style={{ height: 34, width: 80, borderRadius: 9 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 0" }}>
                        <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
                        <div style={{ color: "#6B7280", fontSize: 14 }}>No jobs match your search. Try different keywords.</div>
                        {search && (
                            <button
                                onClick={() => { setSearch(""); setPage(1); fetchJobs(1, activeFilter, ""); }}
                                style={{ marginTop: 14, background: "none", border: "1px solid #E5E7EB", borderRadius: 8, padding: "7px 16px", fontSize: 13, color: "#6B7280", cursor: "pointer", fontFamily: "inherit" }}
                            >
                                Clear search
                            </button>
                        )}
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
                            style={{
                                background: "#fff", border: "1.5px solid #E8EDF8",
                                borderRadius: 10, padding: "10px 32px", fontSize: 13,
                                fontWeight: 500, color: loadingMore ? "#A0AABF" : "#4A5568",
                                cursor: loadingMore ? "not-allowed" : "pointer",
                                fontFamily: "inherit", boxShadow: "0 2px 8px rgba(13,27,62,0.05)",
                            }}
                        >
                            {loadingMore ? "Loading…" : "Load more jobs"}
                        </button>
                    </div>
                )}
            </main>

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