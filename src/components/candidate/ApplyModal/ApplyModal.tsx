import { useEffect } from "react";
import JobFitCheck from "../JobFitCheck";
import JobDetailsPanel from "./JobDetailsPanel";
import ResumePicker from "./ResumePicker";
import ResumePreview from "./ResumePreview";
import type { Job } from "../JobCard";
import type { CandidateProfile } from "../../../types/candidate.types";
import type { ResumeType } from "../../../hooks/useJobActions";

interface Props {
    job: Job;
    profile: CandidateProfile;
    resumeType: ResumeType;
    onResumeTypeChange: (v: ResumeType) => void;
    canSubmit: boolean;
    applying: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ApplyModal({
    job, profile, resumeType, onResumeTypeChange,
    canSubmit, applying, onClose, onConfirm,
}: Props) {
    // Esc closes (unless a request is running) + lock page scroll while open
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !applying) onClose();
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [applying, onClose]);

    const blocked = applying || !canSubmit;

    return (
        <div
            onClick={() => { if (!applying) onClose(); }}
            style={{
                position: "fixed", inset: 0, zIndex: 200,
                background: "rgba(13,27,62,0.55)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 20,
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Apply for ${job.title}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#ffffff", borderRadius: 20,
                    width: "100%", maxWidth: 900, maxHeight: "90vh",
                    display: "flex", flexDirection: "column",
                    boxShadow: "0 32px 80px rgba(13,27,62,0.28)",
                    overflow: "hidden", border: "1.5px solid #E5E7EB",
                }}
            >
                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 22px", borderBottom: "1.5px solid #E5E7EB",
                    background: "#ffffff", flexShrink: 0,
                }}>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>
                            Applying for: <span style={{ color: "#D62B2B" }}>{job.title}</span>
                        </p>
                        <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
                            {job.company} · {job.location}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={applying}
                        aria-label="Close"
                        style={{
                            background: "#F8FAFC", border: "1.5px solid #E5E7EB",
                            borderRadius: 8, width: 32, height: 32,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: applying ? "not-allowed" : "pointer", fontSize: 16, color: "#6B7280",
                        }}
                    >✕</button>
                </div>

                {/* Body */}
                <div className="apply-body">
                    <div className="apply-left">
                        <JobDetailsPanel job={job} />
                    </div>

                    <div className="apply-right">
                        <JobFitCheck job={job} resumeType={resumeType} />
                        <p className="section-label" style={{ marginBottom: 0 }}>Choose resume to submit</p>
                        <ResumePicker value={resumeType} onChange={onResumeTypeChange} disabled={applying} />
                        <ResumePreview profile={profile} resumeType={resumeType} />
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: "14px 22px", borderTop: "1.5px solid #E5E7EB",
                    background: "#ffffff", display: "flex",
                    alignItems: "center", justifyContent: "space-between",
                    gap: 12, flexShrink: 0, flexWrap: "wrap",
                }}>
                    {canSubmit ? (
                        <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
                            Resume will be shared with <strong>{job.company}</strong>
                        </p>
                    ) : (
                        <p role="alert" style={{ fontSize: 11, color: "#D62B2B", margin: 0 }}>
                            You haven't uploaded a resume yet. Choose the AI resume to continue.
                        </p>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={onClose}
                            disabled={applying}
                            style={{
                                background: "#F8FAFC", border: "1.5px solid #E5E7EB",
                                borderRadius: 10, padding: "9px 18px", fontSize: 13,
                                fontWeight: 600, color: "#6B7280", fontFamily: "inherit",
                                cursor: applying ? "not-allowed" : "pointer",
                                opacity: applying ? 0.5 : 1,
                            }}
                        >Cancel</button>
                        <button
                            onClick={onConfirm}
                            disabled={blocked}
                            style={{
                                background: "linear-gradient(135deg,#D62B2B,#1C3FA8)",
                                border: "none", borderRadius: 10, padding: "9px 24px",
                                fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit",
                                cursor: blocked ? "not-allowed" : "pointer",
                                opacity: blocked ? 0.5 : 1,
                            }}
                        >{applying ? "Applying…" : "Confirm & Apply →"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}