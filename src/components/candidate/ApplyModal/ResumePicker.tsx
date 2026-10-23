import type { ResumeType } from "../../../hooks/useJobActions";

const OPTIONS: { value: ResumeType; title: string; desc: string }[] = [
    { value: "ai",       title: "AI generated resume", desc: "Built from your profile information" },
    { value: "uploaded", title: "Uploaded resume",     desc: "Your manually uploaded PDF or DOCX" },
];

export default function ResumePicker({
    value,
    onChange,
    disabled,
}: {
    value: ResumeType;
    onChange: (v: ResumeType) => void;
    disabled?: boolean;
}) {
    return (
        <div role="radiogroup" aria-label="Resume to submit" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {OPTIONS.map((o) => (
                <label
                    key={o.value}
                    className={`resume-option${value === o.value ? " is-selected" : ""}`}
                >
                    <input
                        type="radio"
                        name="resume-type"
                        checked={value === o.value}
                        onChange={() => onChange(o.value)}
                        disabled={disabled}
                        style={{ accentColor: "#D62B2B", width: 16, height: 16, flexShrink: 0 }}
                    />
                    <span>
                        <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#111827" }}>{o.title}</span>
                        <span style={{ display: "block", fontSize: 11, color: "#6B7280", marginTop: 2 }}>{o.desc}</span>
                    </span>
                </label>
            ))}
        </div>
    );
}