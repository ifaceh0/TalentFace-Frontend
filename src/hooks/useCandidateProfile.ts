import { useEffect, useState } from "react";
import { getProfile, getProfileCompletion } from "../services/candidate.service";
import type { CandidateProfile } from "../types/candidate.types";

export function useCandidateProfile() {
    const [profile, setProfile]       = useState<CandidateProfile | null>(null);
    const [completion, setCompletion] = useState<number>(0);

    useEffect(() => {
        getProfile().then(setProfile).catch(() => {});
    }, []);

    useEffect(() => {
        getProfileCompletion().then(({ score }) => setCompletion(score)).catch(() => {});
    }, []);

    return { profile, completion };
}