import { useState, useEffect } from 'react';
import { checkJobFit } from '../../services/joinee.service';
import type { JobFitCheckResult } from '../../services/joinee.service';
import type { Job } from './JobCard';
import { useWarmPythonService } from '../../hooks/useWarmPythonService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 70) return { stroke: '#22C55E', text: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' };
  if (score >= 40) return { stroke: '#F59E0B', text: '#B45309', bg: '#FFFBEB', border: '#FDE68A' };
  return { stroke: '#D62B2B', text: '#D62B2B', bg: '#FFF5F5', border: '#FECDD3' };
}

// ─── Mini ATS Ring (smaller than the global analyzer's) ───────────────────────

function MiniRing({ score }: { score: number }) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  const colors = scoreColor(score);

  return (
    <div style={{ position: 'relative', width: 92, height: 92, flexShrink: 0 }}>
      <svg width="92" height="92" viewBox="0 0 92 92" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="46" cy="46" r={r} fill="none" stroke="#F0F4FF" strokeWidth="7" />
        <circle
          cx="46" cy="46" r={r}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: colors.text, lineHeight: 1 }}>{Math.round(score)}</span>
        <span style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 500 }}>/ 100</span>
      </div>
    </div>
  );
}

// ─── Keyword chip ─────────────────────────────────────────────────────────────

function KeywordChip({ label, matched }: { label: string; matched: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, fontWeight: 600,
      color: matched ? '#16A34A' : '#9CA3AF',
      background: matched ? '#F0FDF4' : '#F9FAFB',
      border: `1px solid ${matched ? '#BBF7D0' : '#E5E7EB'}`,
      borderRadius: 99, padding: '3px 9px',
    }}>
      {matched ? '✓' : '○'} {label}
    </span>
  );
}

// ─── List Item ────────────────────────────────────────────────────────────────

function ListItem({ text, variant }: { text: string; variant: 'strength' | 'improvement' }) {
  const isStrength = variant === 'strength';
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '5px 0' }}>
      <span style={{ flexShrink: 0, marginTop: 1, fontSize: 12, color: isStrength ? '#22C55E' : '#F59E0B' }}>
        {isStrength ? '✓' : '→'}
      </span>
      <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.55 }}>{text}</span>
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

  // ── Clear stale result if the user switches resume type after running a check ──
  useEffect(() => {
    setResult(null);
    setError(null);
    return () => cancel(); // cancel any in-flight warm-up poll if job/resumeType changes
  }, [resumeType, job._id, cancel]);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    await runWhenWarm(async () => {
      try {
        const res = await checkJobFit(job._id, resumeType);
        setResult(res);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Fit check failed. Please try again.');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div style={{
      border: '1.5px solid #E8EDF8',
      borderRadius: 14,
      padding: 16,
      background: '#FAFBFF',
    }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: result || error ? 14 : 0 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0D1B3E', margin: 0 }}>
            🎯 Check My Fit
          </p>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>
            Scored against {resumeType === 'ai' ? 'your AI-generated resume' : 'your uploaded resume'}
          </p>
        </div>

        {!loading && !warming && (
          <button
            onClick={handleCheck}
            style={{
              background: 'linear-gradient(135deg,#D62B2B,#1C3FA8)',
              border: 'none', borderRadius: 9, padding: '7px 14px',
              fontSize: 12, fontWeight: 700, color: '#fff',
              cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
            }}
          >
            {result ? 'Re-check' : 'Run Check'}
          </button>
        )}
      </div>

      {/* ── Warming up Python service (cold start) ── */}
      {warming && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: 'jfc-spin 0.8s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="#D62B2B" strokeWidth="3" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0110 10" stroke="#D62B2B" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 12, color: '#6B7280' }}>Warming up AI engine… this can take up to 30s the first time</span>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && !warming && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: 'jfc-spin 0.8s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="#1C3FA8" strokeWidth="3" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0110 10" stroke="#1C3FA8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 12, color: '#6B7280' }}>Checking your fit for this role…</span>
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#FFF5F5', border: '1px solid #FECDD3',
          borderRadius: 10, padding: '10px 12px',
        }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 12, color: '#D62B2B' }}>{error}</span>
        </div>
      )}

      {/* ── Result: filtered (Stage 1 only, no AI ran) ── */}
      {result && result.stage === 'filtered' && !loading && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <MiniRing score={result.keywordScore} />
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700,
                color: '#B45309', background: '#FFFBEB', border: '1px solid #FDE68A',
                borderRadius: 99, padding: '3px 10px', marginBottom: 6,
              }}>
                Below threshold for AI review
              </div>
              <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                {result.overallFeedback}
              </p>
            </div>
          </div>

          {(result.matchedKeywords.length > 0 || result.missingKeywords.length > 0) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {result.matchedKeywords.map((kw) => <KeywordChip key={kw} label={kw} matched />)}
              {result.missingKeywords.map((kw) => <KeywordChip key={kw} label={kw} matched={false} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Result: analyzed (Stage 2 AI ran) ── */}
      {result && result.stage === 'analyzed' && !loading && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <MiniRing score={result.atsScore ?? 0} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: result.eligible ? '#16A34A' : '#B45309',
                  background: result.eligible ? '#F0FDF4' : '#FFFBEB',
                  border: `1px solid ${result.eligible ? '#BBF7D0' : '#FDE68A'}`,
                  borderRadius: 99, padding: '3px 10px',
                }}>
                  {result.eligible ? '✓ Strong fit' : 'Moderate fit'}
                </span>
                <span style={{ fontSize: 10, color: '#9CA3AF' }}>
                  Keyword match: {Math.round(result.keywordScore)}%
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                {result.overallFeedback}
              </p>
            </div>
          </div>

          {result.strengths.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 4px' }}>
                Strengths
              </p>
              {result.strengths.map((s, i) => <ListItem key={i} text={s} variant="strength" />)}
            </div>
          )}

          {result.improvements.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 4px' }}>
                Improvements
              </p>
              {result.improvements.map((s, i) => <ListItem key={i} text={s} variant="improvement" />)}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes jfc-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}