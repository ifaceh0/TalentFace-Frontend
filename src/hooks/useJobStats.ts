import { useEffect, useState } from "react";
import { getJobStats } from "../services/candidate.service";

export interface Stats {
    open: number;
    companies: number;
    remote: number;
}

export function useJobStats() {
    const [stats, setStats] = useState<Stats>({ open: 0, companies: 0, remote: 0 });

    useEffect(() => {
        getJobStats().then(setStats).catch(() => {});
    }, []);

    return stats;
}