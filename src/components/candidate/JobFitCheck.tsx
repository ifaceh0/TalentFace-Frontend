import { useState, useEffect, useRef } from 'react';
import { checkJobFit } from '../../services/candidate.service';
import type { JobFitCheckResult } from '../../services/candidate.service';
import type { Job } from '../../types/candidate.types';
import { useWarmPythonService } from '../../hooks/useWarmPythonService';

// ─── Spinner (shared by warm-up + loading states) ─────────────────────────────

function Spinner({ color, message }: { color: string; message: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: 'jfc-spin 0.8s linear infinite' }}>
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeOpacity="0.2" />
        <path d="M12 2a10 10 0 0110 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: 12, color: '#6B7280' }}>{message}</span>
    </div>
  );
}

// ─── Result banner (eligible / not eligible) ──────────────────────────────────

function ResultBanner({ eligible }: { eligible: boolean }) {
  const t = eligible
    ? { bg: '#F0FDF4', border: '#BBF7D0', icon: '#16A34A', title: '#166534', sub: '#15803D', glyph: '✓' }
    : { bg: '#FFFBEB', border: '#FDE68A', icon: '#D97706', title: '#92400E', sub: '#B45309', glyph: '✕' };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: t.bg, border: `1px solid ${t.border}`,
      borderRadius: 12, padding: '12px 14px',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: t.icon, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 800,
      }}>
        {t.glyph}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: t.title, lineHeight: 1.2 }}>
          {eligible ? "You're eligible for this role" : 'Not a match yet'}
        </div>
        <div style={{ fontSize: 12, color: t.sub, marginTop: 3, lineHeight: 1.45 }}>
          {eligible
            ? 'Your profile fits this job. You can go ahead and apply.'
            : 'You can still apply, or update your skills and re-check.'}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface JobFitCheckProps {
  job: Job;
  resumeType: 'ai' | 'uploaded';
}

export default function JobFitCheck({ job, resumeType }: JobFitCheckProps) {
  const [result, setResult]   = useState<JobFitCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const { runWhenWarm, warming, cancel } = useWarmPythonService();

  const inFlight = useRef(false);
  const reqId    = useRef(0); // invalidates responses from a previous job / resume type

  // ── Reset everything when the job or resume type changes ──
  useEffect(() => {
    setResult(null);
    setError(null);
    return () => {
      reqId.current += 1;       // ignore any response still on its way
      inFlight.current = false;
      setLoading(false);
      cancel();                 // cancel any in-flight warm-up poll
    };
  }, [resumeType, job._id, cancel]);

  const handleCheck = async () => {
    if (inFlight.current) return; // ignore double clicks / double invokes
    inFlight.current = true;
    const myId = ++reqId.current;
    setLoading(true);
    setError(null);

    await runWhenWarm(async () => {
      try {
        const res = await checkJobFit(job._id, resumeType);
        if (myId !== reqId.current) return; // stale response, drop it
        setResult(res);
      } catch (err: unknown) {
        if (myId !== reqId.current) return;
        setError(err instanceof Error ? err.message : 'Fit check failed. Please try again.');
      } finally {
        if (myId === reqId.current) {
          setLoading(false);
          inFlight.current = false;
        }
      }
    });
  };

  const busy = loading || warming;
  const hasOutput = !!result || !!error || busy;
  // Stage 1 ("filtered") never counts as eligible, even if the backend flag is missing
  const eligible = !!result && result.stage === 'analyzed' && !!result.eligible;

  return (
    <div style={{
      border: '1.5px solid #E8EDF8',
      borderRadius: 14,
      padding: 16,
      background: '#FAFBFF',
    }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: hasOutput ? 14 : 0 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0D1B3E', margin: 0 }}>
            🎯 Check My Fit
          </p>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>
            Checked against {resumeType === 'ai' ? 'your AI-generated resume' : 'your uploaded resume'}
          </p>
        </div>

        <button
          onClick={handleCheck}
          disabled={busy}
          style={{
            background: 'linear-gradient(135deg,#D62B2B,#1C3FA8)',
            border: 'none', borderRadius: 9, padding: '7px 14px',
            fontSize: 12, fontWeight: 700, color: '#fff',
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.55 : 1,
            transition: 'opacity 0.15s',
            fontFamily: 'inherit', flexShrink: 0,
          }}
        >
          {warming ? 'Warming up…' : loading ? 'Checking…' : result ? 'Re-check' : 'Run Check'}
        </button>
      </div>

      {/* ── Busy states ── */}
      {warming && (
        <Spinner color="#D62B2B" message="Warming up AI engine… this can take up to 30s the first time" />
      )}
      {loading && !warming && (
        <Spinner color="#1C3FA8" message="Checking your fit for this role…" />
      )}

      {/* ── Error ── */}
      {error && !busy && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#FFF5F5', border: '1px solid #FECDD3',
          borderRadius: 10, padding: '10px 12px',
        }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 12, color: '#D62B2B' }}>{error}</span>
        </div>
      )}

      {/* ── Result ── */}
      {result && !busy && <ResultBanner eligible={eligible} />}

      <style>{`
        @keyframes jfc-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}