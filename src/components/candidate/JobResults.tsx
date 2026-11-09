import JobCard from "./JobCard";
import type { Job } from "../../types/candidate.types";

interface Props {
    jobs: Job[];
    loading: boolean;
    loadingMore: boolean;
    hasNextPage: boolean;
    savedIds: Set<string>;
    appliedIds: Set<string>;
    onSave: (id: string) => void;
    onApply: (id: string) => void;
    onLoadMore: () => void;
    onOpenDeck: () => void;
}

function SkeletonCard() {
    return (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12 }}>
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div className="skeleton" style={{ height: 14, width: "70%" }} />
                    <div className="skeleton" style={{ height: 11, width: "40%" }} />
                </div>
            </div>
            <div className="skeleton" style={{ height: 11, width: "55%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
                <div className="skeleton" style={{ height: 13, width: 80 }} />
                <div className="skeleton" style={{ height: 34, width: 72, borderRadius: 6 }} />
            </div>
        </div>
    );
}

export default function JobResults({
    jobs, loading, loadingMore, hasNextPage,
    savedIds, appliedIds, onSave, onApply, onLoadMore, onOpenDeck,
}: Props) {
    return (
        <>
            {/* Results header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 14, color: "#202124" }}>
                    {loading ? "Loading jobs…" : <>Showing <strong>{jobs.length}</strong> job{jobs.length !== 1 ? "s" : ""}</>}
                </span>
                <button
                    onClick={onOpenDeck}
                    style={{ fontSize: 13, color: "#D62B2B", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", textDecoration: "underline" }}
                >
                    Try Job Deck instead →
                </button>
            </div>

            {/* Grid / skeleton / empty */}
            {loading ? (
                <div className="tf-grid">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : jobs.length === 0 ? (
                <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, textAlign: "center", padding: "48px 20px" }}>
                    <div style={{ color: "#6B7280", fontSize: 14 }}>No jobs match your search. Try different keywords.</div>
                </div>
            ) : (
                <div className="tf-grid">
                    {jobs.map((job) => (
                        <JobCard
                            key={job._id}
                            job={job}
                            isSaved={savedIds.has(job._id)}
                            isApplied={appliedIds.has(job._id)}
                            onSave={onSave}
                            onApply={onApply}
                        />
                    ))}
                </div>
            )}

            {/* Load more */}
            {!loading && hasNextPage && jobs.length > 0 && (
                <div style={{ textAlign: "center", marginTop: 28 }}>
                    <button className="tf-secondary" onClick={onLoadMore} disabled={loadingMore}>
                        {loadingMore ? "Loading…" : "Load more jobs"}
                    </button>
                </div>
            )}
        </>
    );
}