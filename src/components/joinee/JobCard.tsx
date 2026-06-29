// ─────────────────────────────────────────────
// components/joinee/JobCard.tsx
// ─────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────────────────────
// If you already have `Job` in joinee.types.ts, remove this local declaration
// and import it from there instead:
//   import type { Job } from "../../types/joinee.types";

export interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract";
    salary: string;
    tags: string[];
    posted: string;
    logo: string;
    color: string;
    description?: string;
    requirements?: string[];
    isRemote?: boolean;
}

export interface JobCardProps {
    job: Job;
    isSaved: boolean;
    isApplied: boolean;
    onSave: (id: string) => void;
    onApply: (id: string) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────
// Moved here from JoineeHomepage since TYPE_META is only used by JobCard
const TYPE_META: Record<string, { bg: string; border: string; text: string }> = {
    "Full-time": { bg: "#FFF5F5", border: "#FECDD3", text: "#D62B2B" },
    "Part-time": { bg: "#EEF2FF", border: "#C7D2F8", text: "#1C3FA8" },
    "Contract":  { bg: "#F0F4FF", border: "#BFCAEE", text: "#0D1B3E" },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function JobCard({ job, isSaved, isApplied, onSave, onApply }: JobCardProps) {
    const tm = TYPE_META[job.type] ?? { bg: "#F8F9FF", border: "#E8EDF8", text: "#0D1B3E" };

    return (
        <div
            className="job-card"
            style={{
                background: "#fff",
                border: "1.5px solid #E8EDF8",
                borderRadius: 14,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 13,
                boxShadow: "0 2px 8px rgba(13,27,62,0.04)",
            }}
        >
            {/* ── Header: logo + title + save button ── */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 10,
                        background: job.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>
                        {job.logo}
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0D1B3E", lineHeight: 1.3 }}>
                            {job.title}
                        </div>
                        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                            {job.company}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onSave(job._id)}
                    title={isSaved ? "Unsave job" : "Save job"}
                    style={{
                        background: isSaved ? "#FFF5F5" : "#F8F9FF",
                        border: `1.5px solid ${isSaved ? "#FECDD3" : "#E8EDF8"}`,
                        borderRadius: 8, width: 34, height: 34,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", flexShrink: 0, fontSize: 15, transition: "all 0.15s",
                    }}
                >
                    {isSaved ? "🔖" : "🏷️"}
                </button>
            </div>

            {/* ── Type pill + location ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                <span style={{
                    fontSize: 11, background: tm.bg, color: tm.text,
                    border: `1px solid ${tm.border}`,
                    padding: "3px 9px", borderRadius: 20, fontWeight: 600,
                }}>
                    {job.type}
                </span>
                <span style={{ fontSize: 11, color: "#6B7280" }}>📍 {job.location}</span>
            </div>

            {/* ── Tags ── */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {job.tags.map((tag) => (
                    <span
                        key={tag}
                        style={{
                            fontSize: 10, background: "#F8F9FF", color: "#4A5568",
                            border: "1px solid #E8EDF8", padding: "2px 8px",
                            borderRadius: 5, fontWeight: 500,
                        }}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* ── Footer: salary + apply button ── */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginTop: "auto", paddingTop: 10, borderTop: "1px solid #F0F4FF",
            }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#D62B2B" }}>
                        {job.salary}
                    </div>
                    <div style={{ fontSize: 10, color: "#A0AABF", marginTop: 2 }}>
                        {job.posted}
                    </div>
                </div>

                <button
                    className="apply-btn"
                    onClick={() => onApply(job._id)}
                    disabled={isApplied}
                    style={{
                        background: isApplied
                            ? "#E8EDF8"
                            : "linear-gradient(135deg,#D62B2B,#1C3FA8)",
                        border: "none", borderRadius: 9, padding: "9px 20px",
                        fontSize: 12, fontWeight: 600,
                        color: isApplied ? "#A0AABF" : "#fff",
                        cursor: isApplied ? "not-allowed" : "pointer",
                        fontFamily: "inherit", transition: "opacity 0.15s",
                    }}
                >
                    {isApplied ? "Applied ✓" : "Apply →"}
                </button>
            </div>
        </div>
    );
}