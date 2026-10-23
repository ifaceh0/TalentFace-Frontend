import type { Job } from "../JobCard";
import { richTextToPlain } from "../../../constants/candidateHome.utils";

export default function JobDetailsPanel({ job }: { job: Job }) {
    const info = [
        { label: "Location", value: job.location },
        { label: "Salary",   value: job.salary },
        { label: "Type",     value: job.type },
        { label: "Posted",   value: job.posted },
    ];

    return (
        <>
            <p className="section-label" style={{ marginBottom: 14 }}>Job Details</p>

            {/* Company + title */}
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                <div style={{
                    width: 42, height: 42, borderRadius: 10, background: job.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0,
                }}>
                    {job.logo}
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{job.company}</div>
                </div>
            </div>

            {/* Type badge */}
            <span style={{
                display: "inline-flex", alignItems: "center", fontSize: 11,
                background: "#F8FAFC", color: "#6B7280",
                border: "1px solid #E5E7EB", padding: "3px 10px",
                borderRadius: 99, marginBottom: 14,
            }}>
                {job.type}
                {job.isRemote && <span style={{ marginLeft: 6, color: "#1C3FA8" }}>· Remote</span>}
            </span>

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {info.map(({ label, value }) => (
                    <div key={label} style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{value}</div>
                    </div>
                ))}
            </div>

            {/* Tags */}
            {job.tags?.length > 0 && (
                <>
                    <p className="section-label">Skills</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                        {job.tags.map((tag) => (
                            <span key={tag} style={{
                                fontSize: 11, background: "#F8FAFC", color: "#6B7280",
                                border: "1px solid #E5E7EB", padding: "3px 9px", borderRadius: 99,
                            }}>{tag}</span>
                        ))}
                    </div>
                </>
            )}

            {/* Description */}
            {job.description && (
                <>
                    <p className="section-label">Description</p>
                    <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65, marginBottom: 16, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
                        {richTextToPlain(job.description)}
                    </p>
                </>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
                <>
                    <p className="section-label">Requirements</p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                        {job.requirements.map((req, i) => (
                            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D62B2B", flexShrink: 0, marginTop: 5 }} />
                                {req}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}