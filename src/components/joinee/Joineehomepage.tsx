import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract";
    salary: string;
    tags: string[];
    posted: string;
    logo: string;
    color: string;
}

interface Profile {
    name: string;
    initials: string;
    title: string;
    applications: number;
    savedJobs: number;
    completionPercent: number;
}

interface Stats {
    open: number;
    companies: number;
    remote: number;
}

type FilterOption = "All" | "Full-time" | "Part-time" | "Contract" | "Remote";

// ─────────────────────────────────────────────
// MOCK DATA
// TODO: Replace all mock data with real API calls
// ─────────────────────────────────────────────

// TODO: GET /api/jobs?status=open&page=1&limit=12
//       Headers: { Authorization: "Bearer <token>" }
const MOCK_JOBS: Job[] = [
    { id: 1, title: "Senior Frontend Engineer", company: "Stripe", location: "Remote · Worldwide", type: "Full-time", salary: "₹32–48 LPA", tags: ["React", "TypeScript", "GraphQL"], posted: "2d ago", logo: "S", color: "#635BFF" },
    { id: 2, title: "Product Designer", company: "Notion", location: "San Francisco, CA", type: "Full-time", salary: "₹28–38 LPA", tags: ["Figma", "UX Research", "Systems"], posted: "3d ago", logo: "N", color: "#1C3FA8" },
    { id: 3, title: "Backend Engineer – Go", company: "Cloudflare", location: "Remote · APAC", type: "Full-time", salary: "₹30–44 LPA", tags: ["Go", "Kubernetes", "Distributed"], posted: "1d ago", logo: "C", color: "#D62B2B" },
    { id: 4, title: "ML Engineer", company: "Cohere", location: "Toronto · Hybrid", type: "Full-time", salary: "₹40–60 LPA", tags: ["Python", "PyTorch", "LLMs"], posted: "5d ago", logo: "C", color: "#0D1B3E" },
    { id: 5, title: "iOS Engineer", company: "Linear", location: "Remote · US/EU", type: "Full-time", salary: "₹26–36 LPA", tags: ["Swift", "SwiftUI", "CoreData"], posted: "Today", logo: "L", color: "#1C3FA8" },
    { id: 6, title: "DevOps Engineer", company: "Vercel", location: "Remote · Worldwide", type: "Contract", salary: "₹22–32 LPA", tags: ["AWS", "Terraform", "CI/CD"], posted: "1d ago", logo: "V", color: "#0D1B3E" },
    { id: 7, title: "Data Analyst", company: "Razorpay", location: "Bengaluru, IN", type: "Full-time", salary: "₹14–22 LPA", tags: ["SQL", "Python", "Tableau"], posted: "4d ago", logo: "R", color: "#D62B2B" },
    { id: 8, title: "Technical Writer", company: "Postman", location: "Bengaluru · Hybrid", type: "Part-time", salary: "₹8–14 LPA", tags: ["API Docs", "Markdown", "REST"], posted: "6d ago", logo: "P", color: "#1C3FA8" },
    { id: 9, title: "Security Engineer", company: "Zerodha", location: "Bengaluru, IN", type: "Full-time", salary: "₹18–30 LPA", tags: ["Pentesting", "SIEM", "IAM"], posted: "2d ago", logo: "Z", color: "#D62B2B" },
];

// TODO: GET /api/profile/me
//       Headers: { Authorization: "Bearer <token>" }
const MOCK_PROFILE: Profile = {
    name: "Arjun Sharma",
    initials: "AS",
    title: "Full Stack Developer",
    applications: 4,
    savedJobs: 7,
    completionPercent: 72,
};

// TODO: GET /api/jobs/stats
const MOCK_STATS: Stats = { open: 1284, companies: 312, remote: 641 };

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const FILTERS: FilterOption[] = ["All", "Full-time", "Part-time", "Contract", "Remote"];

const TYPE_META: Record<string, { bg: string; border: string; text: string }> = {
    "Full-time": { bg: "#FFF5F5", border: "#FECDD3", text: "#D62B2B" },
    "Part-time": { bg: "#EEF2FF", border: "#C7D2F8", text: "#1C3FA8" },
    "Contract": { bg: "#F0F4FF", border: "#BFCAEE", text: "#0D1B3E" },
};

const NAV_LINKS = [
    { label: "Browse Jobs", href: "/joinee/browse" },
    { label: "Companies", href: "/joinee/companies" },
    { label: "Saved", href: "/joinee/saved" },
];

const DASHBOARD_LINKS = [
    { icon: "🏠", label: "My Dashboard", href: "/joinee/dashboard" },
    { icon: "📄", label: "My Resume", href: "/joinee/resume" },
    { icon: "📬", label: "Applications", href: "/joinee/applications" },
    { icon: "🔔", label: "Notifications", href: "/joinee/notifications" },
    { icon: "⚙️", label: "Settings", href: "/joinee/settings" },
];

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────
export default function JoineeHomepage() {
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [profile, setProfile] = useState<Profile>(MOCK_PROFILE);
    const [stats, setStats] = useState<Stats>(MOCK_STATS);
    const [search, setSearch] = useState<string>("");
    const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
    const [savedIds, setSavedIds] = useState<Set<number>>(new Set([3]));
    const [profileOpen, setProfileOpen] = useState<boolean>(false);
    const [toast, setToast] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // ── Fetch jobs on mount ──────────────────────────────────────────────────
    useEffect(() => {
        // TODO: Replace mock with real API call
        // setLoading(true);
        // fetch("/api/jobs?status=open&page=1&limit=12", {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // })
        //   .then((r) => r.json())
        //   .then((data) => { setJobs(data.jobs); setLoading(false); })
        //   .catch(() => setLoading(false));
    }, []);

    // ── Fetch profile on mount ───────────────────────────────────────────────
    useEffect(() => {
        // TODO: GET /api/profile/me
        // fetch("/api/profile/me", {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // })
        //   .then((r) => r.json())
        //   .then((data) => setProfile(data));
    }, []);

    // ── Fetch stats on mount ─────────────────────────────────────────────────
    useEffect(() => {
        // TODO: GET /api/jobs/stats
        // fetch("/api/jobs/stats")
        //   .then((r) => r.json())
        //   .then((data) => setStats(data));
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

    // ── Derived: filtered jobs ───────────────────────────────────────────────
    const filteredJobs = jobs.filter((j) => {
        const q = search.toLowerCase();
        const matchSearch =
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            j.tags.some((t) => t.toLowerCase().includes(q));
        const matchFilter =
            activeFilter === "All" ? true :
                activeFilter === "Remote" ? j.location.toLowerCase().includes("remote") :
                    j.type === activeFilter;
        return matchSearch && matchFilter;
    });

    // ── Actions ──────────────────────────────────────────────────────────────
    const handleToggleSave = (id: number) => {
        const isSaved = savedIds.has(id);
        // TODO: if isSaved → DELETE /api/jobs/:id/save
        //       else       → POST   /api/jobs/:id/save
        //       Headers: { Authorization: `Bearer ${token}` }
        setSavedIds((prev) => {
            const next = new Set(prev);
            isSaved ? next.delete(id) : next.add(id);
            return next;
        });
        showToast(isSaved ? "Job removed from saved." : "Job saved! 🔖");
    };

    const handleApply = (id: number) => {
        // TODO: POST /api/applications
        //       Body:    JSON.stringify({ jobId: id })
        //       Headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        //       On 201: showToast + disable button + increment profile.applications
        //       On 409: showToast("You've already applied to this role.")
        showToast("Applied successfully ✓  We'll notify you of updates.");
    };

    const handleLogout = () => {
        // TODO: POST /api/auth/logout
        //       Headers: { Authorization: `Bearer ${token}` }
        //       Then: localStorage.removeItem("token") + navigate("/")
        console.log("Logout → POST /api/auth/logout");
    };

    const handleLoadMore = () => {
        // TODO: GET /api/jobs?page=nextPage&q=search&type=activeFilter
        //       Append response.jobs to existing jobs state
        //       Hide button if response.hasNextPage === false
        console.log("Load more → GET /api/jobs?page=2");
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    // ─────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────
    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F8F9FF", minHeight: "100vh", color: "#0D1B3E" }}>

            {/* Google Fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #A0AABF; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #D0D8F0; border-radius: 99px; }
        .job-card { transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
        .job-card:hover { border-color: #D62B2B !important; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(214,43,43,0.08) !important; }
        .apply-btn:hover { opacity: 0.88; }
        .nav-link:hover { color: #D62B2B !important; }
        .menu-item:hover { background: rgba(214,43,43,0.06) !important; }
      `}</style>

            {/* ══ NAV ══ */}
            <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 62, borderBottom: "2px solid #E8EDF8", background: "#fff", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(13,27,62,0.06)" }}>

                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>J</div>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px", color: "#0D1B3E" }}>joinnee</span>
                    <span style={{ fontSize: 10, background: "#EEF2FF", color: "#1C3FA8", padding: "2px 8px", borderRadius: 20, fontWeight: 600, border: "1px solid #C7D2F8" }}>Joinee</span>
                </div>

                {/* Nav links — TODO: wrap in <Link> from react-router-dom */}
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {NAV_LINKS.map(({ label, href }) => (
                        <a key={label} href={href} className="nav-link"
                            style={{ background: "none", border: "none", color: "#4A5568", fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 7, cursor: "pointer", transition: "color 0.15s", textDecoration: "none" }}>
                            {label}
                        </a>
                    ))}
                </div>

                {/* Profile button */}
                {/* TODO: populate from GET /api/profile/me */}
                <div ref={profileRef} style={{ position: "relative" }}>
                    <button
                        onClick={() => setProfileOpen((p) => !p)}
                        style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F5FF", border: "1.5px solid #C7D2F8", borderRadius: 40, padding: "4px 14px 4px 4px", cursor: "pointer", transition: "background 0.2s" }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                            {profile.initials}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#0D1B3E" }}>{profile.name.split(" ")[0]}</span>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Profile dropdown */}
                    {profileOpen && (
                        <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 256, background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 16, padding: 6, zIndex: 100, boxShadow: "0 24px 60px rgba(13,27,62,0.14)" }}>

                            {/* Header */}
                            <div style={{ padding: "12px 14px", borderBottom: "1px solid #F0F4FF", marginBottom: 4 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                                        {profile.initials}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0D1B3E" }}>{profile.name}</div>
                                        <div style={{ fontSize: 11, color: "#6B7280" }}>{profile.title}</div>
                                    </div>
                                </div>
                                {/* TODO: profile.completionPercent from GET /api/profile/me */}
                                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 5 }}>Profile {profile.completionPercent}% complete</div>
                                <div style={{ height: 4, background: "#F0F4FF", borderRadius: 99 }}>
                                    <div style={{ height: "100%", width: `${profile.completionPercent}%`, background: "linear-gradient(90deg,#D62B2B,#1C3FA8)", borderRadius: 99 }} />
                                </div>
                            </div>

                            {/* Quick stats — TODO: from GET /api/profile/me */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "4px 6px", borderBottom: "1px solid #F0F4FF", marginBottom: 4 }}>
                                <div style={{ background: "#FFF5F5", border: "1px solid #FECDD3", borderRadius: 8, padding: 8, textAlign: "center" }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "#D62B2B" }}>{profile.applications}</div>
                                    <div style={{ fontSize: 10, color: "#9DA3B4", marginTop: 1 }}>Applications</div>
                                </div>
                                <div style={{ background: "#EEF2FF", border: "1px solid #C7D2F8", borderRadius: 8, padding: 8, textAlign: "center" }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1C3FA8" }}>{profile.savedJobs}</div>
                                    <div style={{ fontSize: 10, color: "#9DA3B4", marginTop: 1 }}>Saved Jobs</div>
                                </div>
                            </div>

                            {/* Dashboard nav links */}
                            {DASHBOARD_LINKS.map(({ icon, label, href }) => (
                                <a key={label} href={href} className="menu-item"
                                    style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 8, color: "#0D1B3E", fontSize: 12, textDecoration: "none", transition: "background 0.15s" }}>
                                    <span style={{ fontSize: 14 }}>{icon}</span>
                                    {label}
                                    <span style={{ marginLeft: "auto", fontSize: 10, color: "#A0AABF" }}>{href}</span>
                                </a>
                            ))}

                            <div style={{ borderTop: "1px solid #F0F4FF", marginTop: 3, paddingTop: 3 }}>
                                {/* TODO: POST /api/auth/logout → clear token → navigate("/") */}
                                <button
                                    onClick={handleLogout}
                                    style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", background: "none", border: "none", padding: "7px 10px", borderRadius: 8, cursor: "pointer", color: "#D62B2B", fontSize: 12, fontFamily: "inherit", transition: "background 0.15s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(214,43,43,0.08)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
                                    <span style={{ fontSize: 14 }}>🚪</span> Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* ══ HERO ══ */}
            <section style={{ padding: "60px 32px 40px", textAlign: "center", background: "linear-gradient(160deg,#fff 60%,#F3F5FF 100%)", borderBottom: "1px solid #E8EDF8", position: "relative", overflow: "hidden" }}>
                {/* Decorative circles */}
                <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", border: "40px solid rgba(214,43,43,0.07)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -60, left: -60, width: 260, height: 260, borderRadius: "50%", border: "50px solid rgba(28,63,168,0.06)", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Live badge — TODO: count from GET /api/jobs/stats → stats.open */}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#FFF5F5", border: "1px solid #FECDD3", borderRadius: 30, padding: "5px 14px", fontSize: 11, color: "#D62B2B", fontWeight: 600, marginBottom: 20 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D62B2B", display: "inline-block" }} />
                        {stats.open.toLocaleString()} active openings right now
                    </div>

                    <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 44, fontWeight: 700, lineHeight: 1.1, color: "#0D1B3E", margin: "0 0 14px", letterSpacing: "-1.5px" }}>
                        Find your next<br />
                        <span style={{ background: "linear-gradient(90deg,#D62B2B,#1C3FA8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            great opportunity
                        </span>
                    </h1>

                    <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.65 }}>
                        Browse roles from {stats.companies}+ companies. Apply in one click with your Joinnee profile.
                    </p>

                    {/* Search bar */}
                    {/* TODO: onChange → GET /api/jobs?q=searchTerm  (debounce 300ms) */}
                    <div style={{ display: "flex", alignItems: "center", maxWidth: 560, margin: "0 auto", background: "#fff", border: "2px solid #E8EDF8", borderRadius: 14, padding: "5px 5px 5px 16px", boxShadow: "0 4px 20px rgba(13,27,62,0.08)" }}>
                        <svg width="15" height="15" viewBox="0 0 17 17" fill="none" style={{ marginRight: 9, flexShrink: 0 }}>
                            <circle cx="7" cy="7" r="5.5" stroke="#A0AABF" strokeWidth="1.5" />
                            <path d="M11 11l4 4" stroke="#A0AABF" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search jobs, companies, skills…"
                            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: "#0D1B3E", fontFamily: "inherit" }}
                        />
                        <button
                            style={{ background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* ══ STATS BAR ══ */}
            {/* TODO: values from GET /api/jobs/stats */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E8EDF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {[
                    { value: `${stats.open.toLocaleString()}+`, label: "Open positions", color: "#D62B2B" },
                    { value: `${stats.companies}+`, label: "Companies hiring", color: "#1C3FA8" },
                    { value: `${stats.remote}+`, label: "Remote friendly", color: "#0D1B3E" },
                ].map(({ value, label, color }, i, arr) => (
                    <div key={label} style={{ textAlign: "center", padding: "18px 44px", borderRight: i < arr.length - 1 ? "1px solid #E8EDF8" : "none" }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'Sora',sans-serif" }}>{value}</div>
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* ══ MAIN ══ */}
            <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 60px" }}>

                {/* Filter pills */}
                {/* TODO: onClick → GET /api/jobs?type=filter&q=searchTerm (server-side filter) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                        {FILTERS.map((f) => {
                            const isActive = activeFilter === f;
                            return (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    style={{
                                        border: `1.5px solid ${isActive ? "#D62B2B" : "#E8EDF8"}`,
                                        borderRadius: 30,
                                        padding: "5px 15px",
                                        fontSize: 12,
                                        fontWeight: isActive ? 600 : 500,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        transition: "all 0.15s",
                                        fontFamily: "inherit",
                                        background: isActive ? "#D62B2B" : "#fff",
                                        color: isActive ? "#fff" : "#4A5568",
                                    }}
                                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "#1C3FA8"; e.currentTarget.style.color = "#1C3FA8"; } }}
                                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "#E8EDF8"; e.currentTarget.style.color = "#4A5568"; } }}>
                                    {f}
                                </button>
                            );
                        })}
                    </div>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>
                        {filteredJobs.length} result{filteredJobs.length !== 1 ? "s" : ""} found
                    </span>
                </div>

                {/* Job grid */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: 80, color: "#6B7280" }}>Loading jobs…</div>
                ) : filteredJobs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                        <div style={{ color: "#6B7280", fontSize: 14 }}>No jobs match your search. Try different keywords.</div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
                        {filteredJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                isSaved={savedIds.has(job.id)}
                                onSave={handleToggleSave}
                                onApply={handleApply}
                            />
                        ))}
                    </div>
                )}

                {/* Load more */}
                {/* TODO: GET /api/jobs?page=nextPage&q=search&type=activeFilter */}
                {filteredJobs.length > 0 && (
                    <div style={{ textAlign: "center", marginTop: 36 }}>
                        <button
                            onClick={handleLoadMore}
                            style={{ background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 10, padding: "10px 30px", fontSize: 13, fontWeight: 500, color: "#4A5568", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", boxShadow: "0 2px 8px rgba(13,27,62,0.05)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D62B2B"; e.currentTarget.style.color = "#D62B2B"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EDF8"; e.currentTarget.style.color = "#4A5568"; }}>
                            Load more jobs
                        </button>
                    </div>
                )}
            </main>

            {/* Toast */}
            {toast && (
                <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#0D1B3E", color: "#fff", fontSize: 13, padding: "10px 22px", borderRadius: 30, zIndex: 999, boxShadow: "0 8px 32px rgba(13,27,62,0.25)", whiteSpace: "nowrap", fontFamily: "inherit", borderLeft: "4px solid #D62B2B" }}>
                    {toast}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// JOB CARD COMPONENT
// ─────────────────────────────────────────────
interface JobCardProps {
    job: Job;
    isSaved: boolean;
    onSave: (id: number) => void;
    onApply: (id: number) => void;
}

function JobCard({ job, isSaved, onSave, onApply }: JobCardProps) {
    const tm = TYPE_META[job.type] ?? { bg: "#F8F9FF", border: "#E8EDF8", text: "#0D1B3E" };

    return (
        <div className="job-card" style={{ background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 13, boxShadow: "0 2px 8px rgba(13,27,62,0.04)" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    {/* Company logo */}
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: job.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {job.logo}
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0D1B3E", lineHeight: 1.3 }}>{job.title}</div>
                        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{job.company}</div>
                    </div>
                </div>
                {/* Save button */}
                {/* TODO: isSaved → DELETE /api/jobs/:id/save  else → POST /api/jobs/:id/save */}
                <button
                    onClick={() => onSave(job.id)}
                    title={isSaved ? "Unsave job" : "Save job"}
                    style={{ background: isSaved ? "#FFF5F5" : "#F8F9FF", border: `1.5px solid ${isSaved ? "#FECDD3" : "#E8EDF8"}`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 15, transition: "all 0.15s" }}>
                    {isSaved ? "🔖" : "🏷️"}
                </button>
            </div>

            {/* Type badge + location */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, background: tm.bg, color: tm.text, border: `1px solid ${tm.border}`, padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>{job.type}</span>
                <span style={{ fontSize: 11, color: "#6B7280" }}>📍 {job.location}</span>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {job.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: 10, background: "#F8F9FF", color: "#4A5568", border: "1px solid #E8EDF8", padding: "2px 8px", borderRadius: 5, fontWeight: 500 }}>
                        {tag}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTop: "1px solid #F0F4FF" }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#D62B2B" }}>{job.salary}</div>
                    <div style={{ fontSize: 10, color: "#A0AABF", marginTop: 2 }}>{job.posted}</div>
                </div>
                {/* TODO: POST /api/applications  { jobId: job.id }  Authorization: Bearer <token> */}
                <button
                    className="apply-btn"
                    onClick={() => onApply(job.id)}
                    style={{ background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", border: "none", borderRadius: 9, padding: "9px 20px", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s" }}>
                    Apply →
                </button>
            </div>
        </div>
    );
}