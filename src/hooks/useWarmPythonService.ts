import { useState, useRef, useCallback } from 'react';
import { checkPythonHealth } from '../services/joinee.service';

// ─── Constants ────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 3000;   // check every 3s while waiting
const MAX_WAIT_MS       = 45000; // give up after 45s — Render cold starts are usually 20-40s

/**
 * useWarmPythonService
 * ─────────────────────
 * Ensures the Python service is awake before running a callback that depends
 * on it. If the first health check succeeds immediately, the callback runs
 * with zero visible delay. If the service is cold, shows a "warming up" state
 * and polls until healthy (or times out), then runs the callback.
 *
 * Usage:
 *   const { runWhenWarm, warming } = useWarmPythonService();
 *   const handleClick = () => runWhenWarm(() => actualApiCall());
 */
export function useWarmPythonService() {
  const [warming, setWarming] = useState(false);
  const cancelled = useRef(false);

  const runWhenWarm = useCallback(async (callback: () => void | Promise<void>) => {
    cancelled.current = false;

    const isHealthy = await checkPythonHealth();
    if (isHealthy) {
      await callback();
      return;
    }

    // ── Cold start detected — show warming state and poll ──────────────────
    setWarming(true);
    const startTime = Date.now();

    while (Date.now() - startTime < MAX_WAIT_MS) {
      if (cancelled.current) {
        setWarming(false);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      const healthy = await checkPythonHealth();
      if (healthy) {
        setWarming(false);
        await callback();
        return;
      }
    }

    // ── Timed out — run the callback anyway; let the real request's own
    //    error handling take over (better than blocking the user forever) ──
    setWarming(false);
    await callback();
  }, []);

  const cancel = useCallback(() => {
    cancelled.current = true;
    setWarming(false);
  }, []);

  return { runWhenWarm, warming, cancel };
}