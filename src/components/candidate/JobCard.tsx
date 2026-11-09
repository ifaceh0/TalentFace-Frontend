import { Bookmark, Check } from "lucide-react";
import type { Job } from "../../types/candidate.types";
export interface JobCardProps {
    job: Job;
    isSaved: boolean;
    isApplied: boolean;
    onSave: (id: string) => void;
    onApply: (id: string) => void;
}
export default function JobCard({ job, isSaved, isApplied, onSave, onApply }: JobCardProps) {
    const mode = job.workMode ?? (job.isRemote ? "remote" : "onsite");
    const modeLabel = mode === "remote" ? "Remote" : mode === "hybrid" ? "Hybrid" : null;
    const metaParts = [
        job.location,
        job.type,
        modeLabel && modeLabel !== job.location ? modeLabel : null, // remote jobs already have location "Remote"
    ].filter(Boolean);
    const openDetails = () => { if (!isApplied) onApply(job._id); };
    return (
        <div
            className="job-card tf-card"
            onClick={openDetails}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" && e.target === e.currentTarget) openDetails(); }}
            style={{
                cursor: isApplied ? "default" : "pointer",
                fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}
        >
            {/* ── Header: logo + title/company + save ── */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 8,
                        background: job.color || "#202A44",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>
                        {job.logo}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#202124", lineHeight: 1.35 }}>
                            {job.title}
                        </div>
                        <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                            {job.company}
                        </div>
                    </div>
                </div>

                <button
                    className="tf-save"
                    onClick={(e) => { e.stopPropagation(); onSave(job._id); }}
                    title={isSaved ? "Unsave job" : "Save job"}
                    aria-label={isSaved ? "Unsave job" : "Save job"}
                    aria-pressed={isSaved}
                    style={{ color: isSaved ? "#D62B2B" : "#6B7280" }}
                >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                </button>
            </div>

            {/* ── Meta: location · type · remote ── */}
            <div style={{ fontSize: 13, color: "#6B7280" }}>
                {metaParts.join("  ·  ")}
            </div>

            {/* ── Tags ── */}
            {job.tags?.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {job.tags.map((tag) => (
                        <span
                            key={tag}
                            style={{
                                fontSize: 12, background: "#F3F4F6", color: "#374151",
                                padding: "2px 8px", borderRadius: 4, fontWeight: 500,
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* ── Footer: salary + posted, apply ── */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                marginTop: "auto", paddingTop: 12, borderTop: "1px solid #E5E7EB",
            }}>
                <div style={{ minWidth: 0 }}>
                    {job.salary && (
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#202A44" }}>
                            {job.salary}
                        </div>
                    )}
                    {job.posted && (
                        <div style={{ fontSize: 12, color: "#6B7280", marginTop: job.salary ? 2 : 0 }}>
                            {job.posted}
                        </div>
                    )}
                </div>

                <button
                    className="tf-apply"
                    onClick={(e) => { e.stopPropagation(); onApply(job._id); }}
                    disabled={isApplied}
                >
                    {isApplied && <Check size={14} />}
                    {isApplied ? "Applied" : "Apply"}
                </button>
            </div>
        </div>
    );
}
