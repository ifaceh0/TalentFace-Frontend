import type { FormEvent } from "react";
import type { Stats } from "../../hooks/useJobStats";

interface Props {
    search: string;
    onSearchChange: (v: string) => void;
    onSubmit: () => void;
    stats: Stats;
}

export default function JobSearchCard({ search, onSearchChange, onSubmit, stats }: Props) {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: 20, marginBottom: 20 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#202124", marginBottom: 4 }}>
                Search jobs
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
                {stats.open > 0
                    ? `${stats.open.toLocaleString()}+ open positions${stats.companies > 0 ? ` from ${stats.companies}+ companies` : ""}`
                    : "Loading openings…"}
            </p>

            <form onSubmit={handleSubmit} role="search" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div className="tf-search" style={{ flex: "1 1 260px", display: "flex", alignItems: "center", background: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: 6, padding: "0 12px", height: 42 }}>
                    <svg width="15" height="15" viewBox="0 0 17 17" fill="none" style={{ marginRight: 9, flexShrink: 0 }} aria-hidden="true">
                        <circle cx="7" cy="7" r="5.5" stroke="#9CA3AF" strokeWidth="1.5" />
                        <path d="M11 11l4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search jobs, companies, skills…"
                        aria-label="Search jobs"
                        style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "#202124", fontFamily: "inherit" }}
                    />
                </div>
                <button type="submit" className="tf-primary">Search</button>
            </form>
        </div>
    );
}