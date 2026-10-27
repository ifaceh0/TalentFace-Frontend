import "./candidate-home.css";
import "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useJobActions } from "../../hooks/useJobActions";
import { useJobs } from "../../hooks/useJobs";
import { useCandidateProfile } from "../../hooks/useCandidateProfile";
import { useJobStats } from "../../hooks/useJobStats";
import { HomeBanners } from "./JobDeckBanner";
import ApplyModal from "./ApplyModal/ApplyModal";
import CandidateNavbar from "./CandidateNavbar";
import JobFilters from "./JobFilters";
import JobSearchCard from "./JobSearchCard";
import JobResults from "./JobResults";


export default function CandidateHomepage() {
    const navigate = useNavigate();
    const { toast, toastType, showToast } = useToast();
    const { profile, completion } = useCandidateProfile();
    const stats = useJobStats();
    const { jobs, loading, loadingMore, hasNextPage, search, filters,
            handleSearchChange, submitSearch,
            toggleFilter, setCurrency, setMinSalary, setLocation, resetFilters,
            handleLoadMore } = useJobs(showToast);
    const { savedIds, appliedIds, applyModalJob, setApplyModalJob, applying,
            resumeType, setResumeType, canSubmit,
            handleToggleSave, handleApply, confirmApply } = useJobActions(jobs, profile, showToast);
    // ─────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────
    return (
       <div className="candidate-home" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            {/* ══ NAV ══ */}
            <CandidateNavbar
                profile={profile}
                completion={completion}
                appliedCount={appliedIds.size}
                savedCount={savedIds.size}
               
            />
            {/* ══ MAIN ══ */}
            <main className="tf-main">
                <div className="tf-layout">
                    <JobFilters
                        filters={filters}
                        onToggle={toggleFilter}
                        onCurrencyChange={setCurrency}
                        onMinSalaryChange={setMinSalary}
                        onLocationChange={setLocation}
                        onReset={resetFilters}
                    />
                    <section style={{ minWidth: 0 }}>
                        <HomeBanners />
                        <JobSearchCard
                            search={search}
                            onSearchChange={handleSearchChange}
                            onSubmit={submitSearch}
                            stats={stats}
                            savedCount={savedIds.size}
                        />
                        <JobResults
                            jobs={jobs}
                            loading={loading}
                            loadingMore={loadingMore}
                            hasNextPage={hasNextPage}
                            savedIds={savedIds}
                            appliedIds={appliedIds}
                            onSave={handleToggleSave}
                            onApply={handleApply}
                            onLoadMore={handleLoadMore}
                            onOpenDeck={() => navigate("/candidate/swipe")}
                        />
                    </section>
                </div>
            </main>

            {/* ══ Apply Resume Modal ══ */}
            {applyModalJob && profile && (
                <ApplyModal
                    job={applyModalJob}
                    profile={profile}
                    resumeType={resumeType}
                    onResumeTypeChange={setResumeType}
                    canSubmit={canSubmit}
                    applying={applying}
                    onClose={() => setApplyModalJob(null)}
                    onConfirm={confirmApply}
                />
            )}
            {/* Toast */}
                {toast && (
                    <div
                        role="status"
                        aria-live="polite"
                        style={{
                            position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
                            background: toastType === "error" ? "#D62B2B" : "#0D1B3E",
                            color: "#fff", fontSize: 13, padding: "10px 22px", borderRadius: 30,
                            zIndex: 999, boxShadow: "0 8px 32px rgba(13,27,62,0.25)",
                            maxWidth: "90vw", textAlign: "center", fontFamily: "inherit",
                            borderLeft: `4px solid ${toastType === "error" ? "#fff" : "#D62B2B"}`,
                        }}
                    >
                    {toast}
                </div>
                )}
        
            </div>
        );
    }
