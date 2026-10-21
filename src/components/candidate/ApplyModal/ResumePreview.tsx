import RecruiterSection from "../RecruiterSection";
import type { CandidateProfile } from "../../../types/candidate.types";
import type { ResumeType } from "../../../hooks/useJobActions";

const centered: React.CSSProperties = {
    height: "100%", minHeight: 200,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: 8,
};

export default function ResumePreview({
    profile,
    resumeType,
}: {
    profile: CandidateProfile;
    resumeType: ResumeType;
}) {
    return (
        <div style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden", background: "#F9FAFB", minHeight: 200 }}>
            {resumeType === "ai" ? (
                <div style={{ overflowY: "auto", height: "100%", padding: 16 }}>
                    <RecruiterSection profile={profile} />
                </div>
            ) : profile.resumeUrl ? (
                <div style={{ ...centered, gap: 10 }}>
                    <span style={{ fontSize: 32 }}>📄</span>
                    <p style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>Resume on file</p>
                    <a
                        href={`https://docs.google.com/viewer?url=${encodeURIComponent(profile.resumeUrl)}&embedded=false`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 12, color: "#1C3FA8", fontWeight: 600, textDecoration: "underline" }}
                    >
                        View full resume →
                    </a>
                </div>
            ) : (
                <div style={centered}>
                    <span style={{ fontSize: 28, color: "#6B7280" }}>📄</span>
                    <p style={{ fontSize: 12, color: "#6B7280" }}>No resume uploaded yet</p>
                </div>
            )}
        </div>
    );
}