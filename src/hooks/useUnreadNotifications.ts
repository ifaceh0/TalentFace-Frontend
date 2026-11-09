import { useEffect, useState } from "react";
import { getUnreadCount } from "../services/candidate.service";

// Module-level cache shared by every component using the hook, so moving
// between pages never refetches while the count is still fresh.
const STALE_MS = 5 * 60 * 1000;
let cache = { count: 0, fetchedAt: 0 };
let inflight: Promise<void> | null = null;
const listeners = new Set<(count: number) => void>();

const emit = () => listeners.forEach((fn) => fn(cache.count));

export const setUnreadCount = (count: number) => {
    cache = { count: Math.max(0, count), fetchedAt: Date.now() };
    emit();
};

// Used for instant badge updates when the user reads something (no request)
export const adjustUnreadCount = (delta: number) => {
    cache = { ...cache, count: Math.max(0, cache.count + delta) };
    emit();
};

export const resetUnreadCount = () => {
    cache = { count: 0, fetchedAt: 0 };
    emit();
};

export const refreshUnreadCount = (force = false): Promise<void> => {
    if (!force && Date.now() - cache.fetchedAt < STALE_MS) return Promise.resolve();
    if (inflight) return inflight;
    inflight = getUnreadCount()
        .then(setUnreadCount)
        .catch(() => {})
        .finally(() => { inflight = null; });
    return inflight;
};

export function useUnreadNotifications(): number {
    const [count, setCount] = useState(cache.count);

    useEffect(() => {
        listeners.add(setCount);
        setCount(cache.count);
        refreshUnreadCount();

        const onWake = () => {
            if (document.visibilityState === "visible") refreshUnreadCount();
        };
        document.addEventListener("visibilitychange", onWake);
        window.addEventListener("focus", onWake);
        return () => {
            listeners.delete(setCount);
            document.removeEventListener("visibilitychange", onWake);
            window.removeEventListener("focus", onWake);
        };
    }, []);

    return count;
}