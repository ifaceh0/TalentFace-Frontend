import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedJobIds, unsaveJob } from "../../services/joinee.service";
import { getSavedJobs } from "../../services/joinee.service";

export default function SavedJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState("");

    useEffect(() => {
    getSavedJobs()
        .then(setJobs)
        .catch(() => showToast("Failed to load saved jobs."))
        .finally(() => setLoading(false));
}, []);
    const handleUnsave = async (id: string) => {
        
        setJobs((prev) => prev.filter((j) => j.id !== id));
        try {
              await unsaveJob(id.toString());
            showToast("Job removed from saved.");
        } catch {
            showToast("Failed to remove. Please retry.");
            // re-fetch to restore state
            getSavedJobIds().then(setJobs);
        }
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3500);
    };

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F8F9FF", minHeight: "100vh", color: "#0D1B3E" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

            {/* Nav — same as homepage */}
            <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 62, borderBottom: "2px solid #E8EDF8", background: "#fff", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(13,27,62,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/joinee/home")}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>J</div>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>joinnee</span>
                </div>
                <button onClick={() => navigate(-1)} style={{ background: "none", border: "1.5px solid #E8EDF8", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 13, color: "#4A5568", fontFamily: "inherit" }}>← Back</button>
            </nav>

            <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 32px 60px" }}>
                <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 700, color: "#0D1B3E", marginBottom: 6 }}>Saved Jobs</h1>
                <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 28 }}>
                    {loading ? "Loading…" : `${jobs.length} saved job${jobs.length !== 1 ? "s" : ""}`}
                </p>

                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} style={{ background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 14, padding: 20, height: 160, animation: "pulse 1.4s ease-in-out infinite" }} />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 0" }}>
                        <div style={{ fontSize: 48, marginBottom: 14 }}>🔖</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#0D1B3E", marginBottom: 6 }}>No saved jobs yet</div>
                        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 22 }}>Jobs you save from the browse page will appear here.</div>
                        <button onClick={() => navigate("/joinee/browse")} style={{ background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                            Browse Jobs →
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
                        {jobs.map((job) => (
                            <div key={job.id} style={{ background: "#fff", border: "1.5px solid #E8EDF8", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 13, boxShadow: "0 2px 8px rgba(13,27,62,0.04)" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                                        <div style={{ width: 42, height: 42, borderRadius: 10, background: job.color ?? "#1C3FA8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff" }}>
                                            {job.logo ?? job.company?.[0]}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: "#0D1B3E" }}>{job.title}</div>
                                            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{job.company}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleUnsave(job.id)} title="Remove from saved" style={{ background: "#FFF5F5", border: "1.5px solid #FECDD3", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15 }}>
                                        🔖
                                    </button>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                    <span style={{ fontSize: 11, background: "#FFF5F5", color: "#D62B2B", border: "1px solid #FECDD3", padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>{job.type}</span>
                                    <span style={{ fontSize: 11, color: "#6B7280" }}>📍 {job.location}</span>
                                </div>

                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const }}>
                                    {(job.tags ?? []).map((tag: string) => (
                                        <span key={tag} style={{ fontSize: 10, background: "#F8F9FF", color: "#4A5568", border: "1px solid #E8EDF8", padding: "2px 8px", borderRadius: 5 }}>{tag}</span>
                                    ))}
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTop: "1px solid #F0F4FF" }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#D62B2B" }}>{job.salary}</div>
                                        <div style={{ fontSize: 10, color: "#A0AABF", marginTop: 2 }}>{job.posted}</div>
                                    </div>
                                    <button onClick={() => navigate(`/joinee/jobs/${job.id}`)} style={{ background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", border: "none", borderRadius: 9, padding: "9px 20px", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                                        View →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {toast && (
                <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#0D1B3E", color: "#fff", fontSize: 13, padding: "10px 22px", borderRadius: 30, zIndex: 999, whiteSpace: "nowrap", borderLeft: "4px solid #D62B2B" }}>
                    {toast}
                </div>
            )}
        </div>
    );
}