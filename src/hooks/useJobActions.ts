import { useEffect, useState } from "react";
import {
    saveJob, unsaveJob, applyToJob,
    getSavedJobIds, getAppliedJobIds,
} from "../services/candidate.service";
import type { CandidateProfile } from "../types/candidate.types";
import type { Job } from "../types/candidate.types";
import type { ShowToast } from "./useToast";

export type ResumeType = "ai" | "uploaded";

export function useJobActions(
    jobs: Job[],
    profile: CandidateProfile | null,
    showToast: ShowToast
) {
    const [savedIds, setSavedIds]           = useState<Set<string>>(new Set());
    const [appliedIds, setAppliedIds]       = useState<Set<string>>(new Set());
    const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);
    const [applying, setApplying]           = useState<boolean>(false);
    const [resumeType, setResumeType]       = useState<ResumeType>("ai");

    useEffect(() => {
        getSavedJobIds().then((ids: string[]) => setSavedIds(new Set(ids))).catch(() => {});
    }, []);

    useEffect(() => {
        getAppliedJobIds().then((ids: string[]) => setAppliedIds(new Set(ids))).catch(() => {});
    }, []);

    const canSubmit = resumeType === "ai" || !!profile?.resumeUrl;

    const handleToggleSave = async (id: string) => {
        const isSaved = savedIds.has(id);
        setSavedIds((prev) => {
            const next = new Set(prev);
            if (isSaved) next.delete(id);
            else next.add(id);
            return next;
        });
        try {
            if (isSaved) {
                await unsaveJob(id);
                showToast("Job removed from saved.", "success");
            } else {
                await saveJob(id);
                showToast("Job saved! 🔖", "success");
            }
        } catch {
            setSavedIds((prev) => {
                const next = new Set(prev);
                if (isSaved) next.add(id);
                else next.delete(id);
                return next;
            });
            showToast("Action failed. Please try again.", "error");
        }
    };

    const handleApply = (id: string) => {
        if (appliedIds.has(id)) {
            showToast("You've already applied to this role.", "error");
            return;
        }
        if (!profile) {
            showToast("Your profile is still loading. Try again in a moment.", "error");
            return;
        }
        setResumeType("ai");
        setApplyModalJob(jobs.find((j) => j._id === id) ?? null);
    };

    const confirmApply = async () => {
        if (!applyModalJob || applying) return;
        if (!canSubmit) {
            showToast("No uploaded resume found. Choose the AI resume instead.", "error");
            return;
        }
        const id = applyModalJob._id;
        setApplying(true);
        try {
            await applyToJob(id, resumeType);
            setAppliedIds((prev) => new Set(prev).add(id));
            setApplyModalJob(null);
            showToast("Applied successfully ✓  We'll notify you of updates.", "success");
        } catch (err: unknown) {
            const status = (err as { status?: number })?.status;
            if (status === 409) {
                setAppliedIds((prev) => new Set(prev).add(id));
                setApplyModalJob(null);
                showToast("You've already applied to this role.", "error");
            } else {
                showToast("Application failed. Please try again.", "error");
            }
        } finally {
            setApplying(false);
        }
    };

    return {
        savedIds, appliedIds,
        applyModalJob, setApplyModalJob,
        applying, resumeType, setResumeType, canSubmit,
        handleToggleSave, handleApply, confirmApply,
    };
}