import type { JobFilterState, MultiKey } from "../../hooks/useJobs";
import {
    TYPE_OPTIONS, WORK_MODE_OPTIONS, EXPERIENCE_OPTIONS, SALARY_CURRENCIES, SALARY_PRESETS,
} from "../../constants/candidateHome.constants";
import { formatAmount } from "../../constants/candidateHome.utils";
import { useState, useEffect } from "react";

interface Props {
    filters: JobFilterState;
    onToggle: (key: MultiKey, value: string) => void;
    onCurrencyChange: (currency: string | null) => void;
    onMinSalaryChange: (min: number | null) => void;
    onLocationChange: (location: string) => void;
    onReset: () => void;
}

const radioStyle = { accentColor: "#D62B2B", width: 15, height: 15, cursor: "pointer" } as const;
const groupTitle = { fontSize: 13, fontWeight: 600, color: "#202124", marginBottom: 8 } as const;
const divider = { paddingTop: 20, marginTop: 20, borderTop: "1px solid #E5E7EB" } as const;
const selectStyle = {
    width: "100%", height: 34, fontSize: 13, color: "#202124", background: "#fff",
    border: "1px solid #D1D5DB", borderRadius: 6, padding: "0 8px", marginBottom: 12, fontFamily: "inherit",
} as const;

interface GroupProps {
    title: string;
    options: { value: string; label: string }[];
    selected: string[];
    onToggle: (value: string) => void;
    first?: boolean;
}

function CheckGroup({ title, options, selected, onToggle, first }: GroupProps) {
    return (
        <div style={first ? { paddingTop: 16 } : divider}>
            <div style={groupTitle}>{title}</div>
            <div className="tf-radios" role="group" aria-label={title}>
                {options.map((o) => (
                    <label key={o.value} className="tf-radio">
                        <input
                            type="checkbox"
                            checked={selected.includes(o.value)}
                            onChange={() => onToggle(o.value)}
                            style={radioStyle}
                        />
                        {o.label}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default function JobFilters({
    filters, onToggle, onCurrencyChange, onMinSalaryChange, onReset, onLocationChange
}: Props) {
    const active =
        filters.type.length > 0 || filters.workMode.length > 0 || filters.experienceLevel.length > 0 ||
        filters.currency !== null || filters.minSalary !== null || 
        filters.location.trim() !== "";

    const presetCurrency = filters.currency ?? "INR";
    const presets = SALARY_PRESETS[presetCurrency] ?? [];
    const [locationInput, setLocationInput] = useState(filters.location ?? "");

// debounce: push to parent after 400ms of no typing
useEffect(() => {
    const t = setTimeout(() => onLocationChange(locationInput), 400);
    return () => clearTimeout(t);
}, [locationInput]);

// clear the box when Reset is pressed
useEffect(() => {
    if (filters.location === "") setLocationInput("");
}, [filters.location]);

    return (
        <aside className="tf-filters" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: 20 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid #E5E7EB" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#202124" }}>Filter</h2>
                {active && (
                    <button
                        onClick={onReset}
                        style={{ fontSize: 12, fontWeight: 600, color: "#D62B2B", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                    >
                        Reset
                    </button>
                )}
            </div>

            <CheckGroup
                first
                title="Job type"
                options={TYPE_OPTIONS}
                selected={filters.type}
                onToggle={(v) => onToggle("type", v)}
            />

            <CheckGroup
                title="Work mode"
                options={WORK_MODE_OPTIONS}
                selected={filters.workMode}
                onToggle={(v) => onToggle("workMode", v)}
            />

            <CheckGroup
                title="Experience level"
                options={EXPERIENCE_OPTIONS}
                selected={filters.experienceLevel}
                onToggle={(v) => onToggle("experienceLevel", v)}
            />

            {/* Salary */}
            <div style={divider}>
                <div style={groupTitle}>Salary</div>
                <select
                    value={filters.currency ?? ""}
                    onChange={(e) => onCurrencyChange(e.target.value || null)}
                    aria-label="Currency"
                    style={selectStyle}
                >
                    <option value="">Any currency</option>
                    {SALARY_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                    value={filters.minSalary ?? ""}
                    onChange={(e) => onMinSalaryChange(e.target.value ? Number(e.target.value) : null)}
                    aria-label="Minimum yearly salary"
                    style={{ ...selectStyle, marginBottom: 0 }}
                >
                    <option value="">Any amount</option>
                    {presets.map((v) => (
                        <option key={v} value={v}>{formatAmount(v, presetCurrency)}+ / year</option>
                    ))}
                </select>
            </div>

            {/* Location */}
<div style={divider}>
    <div style={groupTitle}>Location</div>
    <input
        type="text"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
        placeholder="City or state"
        aria-label="Location"
        style={{ ...selectStyle, padding: "0 10px", marginBottom: 0 }}
    />
</div>
        </aside>
    );
}
