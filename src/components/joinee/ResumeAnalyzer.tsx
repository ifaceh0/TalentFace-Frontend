import { useState, useEffect } from 'react';
import { analyzeResume, getExistingAnalysis } from '../../services/joinee.service';
import type { ResumeAnalysis } from '../../types/joinee.types';
import { useWarmPythonService } from '../../hooks/useWarmPythonService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 70) return { stroke: '#22C55E', text: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', label: 'Strong' };
  if (score >= 40) return { stroke: '#F59E0B', text: '#B45309', bg: '#FFFBEB', border: '#FDE68A', label: 'Average' };
  return { stroke: '#D62B2B', text: '#D62B2B', bg: '#FFF5F5', border: '#FECDD3', label: 'Weak' };
}

// ─── ATS Score Ring ───────────────────────────────────────────────────────────

function ATSRing({ score }: { score: number }) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  const colors = scoreColor(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="70" cy="70" r={r} fill="none" stroke="#F0F4FF" strokeWidth="10" />
          {/* Progress */}
          <circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        {/* Center label */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: colors.text, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>/ 100</span>
        </div>
      </div>

      {/* Score label pill */}
      <div style={{
        fontSize: 12, fontWeight: 700,
        color: colors.text,
        background: colors.bg,
        border: `1.5px solid ${colors.border}`,
        borderRadius: 99, padding: '4px 14px',
      }}>
        {colors.label} ATS Score
      </div>
    </div>
  );
}

// ─── Source Badge ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: 'generated' | 'uploaded' }) {
  const isUploaded = source === 'uploaded';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 600,
      color: isUploaded ? '#1C3FA8' : '#6B7280',
      background: isUploaded ? '#EEF2FF' : '#F9FAFB',
      border: `1px solid ${isUploaded ? '#C7D2FE' : '#E5E7EB'}`,
      borderRadius: 99, padding: '3px 10px',
    }}>
      <span>{isUploaded ? '📄' : '🧠'}</span>
      {isUploaded ? 'Analyzed from uploaded PDF' : 'Generated from profile data'}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function Card({
  title,
  icon,
  accentColor,
  children,
}: {
  title: string;
  icon: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8EDF8',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '14px 18px',
        borderBottom: '1px solid #F0F4FF',
        background: '#FAFBFF',
      }}>
        <span style={{
          fontSize: 14, background: accentColor + '18',
          borderRadius: 8, width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0D1B3E' }}>{title}</span>
      </div>
      <div style={{ padding: '16px 18px' }}>{children}</div>
    </div>
  );
}

// ─── Skill Chip ───────────────────────────────────────────────────────────────

function SkillChip({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 12, fontWeight: 600,
      color: '#1C3FA8',
      background: '#EEF2FF',
      border: '1px solid #C7D2FE',
      borderRadius: 99,
      padding: '4px 12px',
    }}>
      {label}
    </span>
  );
}

// ─── List Item ────────────────────────────────────────────────────────────────

function ListItem({ text, variant }: { text: string; variant: 'strength' | 'improvement' }) {
  const isStrength = variant === 'strength';
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      padding: '8px 0',
      borderBottom: '1px solid #F8F9FF',
    }}>
      <span style={{
        flexShrink: 0,
        marginTop: 1,
        fontSize: 13,
        color: isStrength ? '#22C55E' : '#F59E0B',
      }}>
        {isStrength ? '✓' : '→'}
      </span>
      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{text}</span>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAnalyze, loading }: { onAnalyze: () => void; loading: boolean }) {
  return (
    <div style={{
      background: '#fff',
      border: '1.5px dashed #C7D2FE',
      borderRadius: 20,
      padding: '56px 32px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0D1B3E', margin: '0 0 8px' }}>
        No Analysis Yet
      </h3>
      <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
        Run the AI analyzer to get your ATS score, extracted skills, strengths, and
        personalized improvement tips.
      </p>
      <AnalyzeButton onClick={onAnalyze} loading={loading} />
    </div>
  );
}

// ─── Analyze Button ───────────────────────────────────────────────────────────

function AnalyzeButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #D62B2B, #1C3FA8)',
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        padding: '11px 24px',
        fontSize: 13, fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        transition: 'opacity 0.2s',
        boxShadow: loading ? 'none' : '0 4px 14px rgba(28,63,168,0.25)',
      }}
    >
      {loading ? (
        <>
          <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none"
            style={{ animation: 'spin 0.8s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Analyzing…
        </>
      ) : (
        <>✨ Analyze My Resume</>
      )}
    </button>
  );
}

// ─── Timestamp ────────────────────────────────────────────────────────────────

function Timestamp({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <span style={{ fontSize: 11, color: '#9CA3AF' }}>
      Last analyzed {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      {' at '}
      {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

// ─── Cooldown Banner ──────────────────────────────────────────────────────────

function CooldownBanner({ nextAvailableAt }: { nextAvailableAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const diff = new Date(nextAvailableAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Available now'); return; }

      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0)    setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      else             setTimeLeft(`${minutes}m ${seconds}s`);
    };

    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [nextAvailableAt]);

  return (
    <div style={{
      background: '#FFFBEB',
      border: '1px solid #FDE68A',
      borderRadius: 12,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>⏳</span>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#B45309', margin: 0 }}>
            Showing cached analysis
          </p>
          <p style={{ fontSize: 11, color: '#92400E', margin: '2px 0 0' }}>
            Next re-analysis available in{' '}
            <strong>{timeLeft}</strong>
          </p>
        </div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600,
        color: '#B45309',
        background: '#FEF3C7',
        border: '1px solid #FDE68A',
        borderRadius: 99,
        padding: '3px 10px',
      }}>
        7-day cooldown
      </div>
    </div>
  );
}

// ─── Locked Re-analyze Button ─────────────────────────────────────────────────

function LockedButton({ nextAvailableAt }: { nextAvailableAt: string }) {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const check = () => {
      const now = Date.now();
      setIsAvailable(now >= new Date(nextAvailableAt).getTime());
    };

    check();
    const t = setInterval(check, 1000);
    return () => clearInterval(t);
  }, [nextAvailableAt]);

  if (isAvailable) return null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: '#F3F4F6',
      color: '#9CA3AF',
      border: '1px solid #E5E7EB',
      borderRadius: 12,
      padding: '11px 20px',
      fontSize: 13, fontWeight: 600,
      cursor: 'not-allowed',
      userSelect: 'none',
    }}>
      🔒 Re-analyze locked
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResumeAnalyzer() {
  const [analysis, setAnalysis]           = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading]             = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [cached, setCached]               = useState(false);
  const [nextAvailableAt, setNextAvailableAt] = useState<string | null>(null);
  const { runWhenWarm, warming, cancel }  = useWarmPythonService();

  // ── Auto-load existing analysis on mount ──────────────────────────────────
  useEffect(() => {
    getExistingAnalysis()
      .then((existing) => {
        if (existing) {
          setAnalysis(existing);
          // Compute nextAvailableAt from updatedAt (7-day cooldown)
          const next = new Date(new Date(existing.updatedAt).getTime() + 7 * 24 * 60 * 60 * 1000);
          const isCached = Date.now() < next.getTime();
          setCached(isCached);
          setNextAvailableAt(next.toISOString());
        }
      })
      .finally(() => setInitialLoading(false));
    return () => cancel(); // cancel any in-flight warm-up poll on unmount
  }, [cancel]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    await runWhenWarm(async () => {
      try {
        const result = await analyzeResume();
        setAnalysis(result.analysis);
        setCached(result.cached);
        setNextAvailableAt(result.nextAvailableAt);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      } finally {
        setLoading(false);
      }
    });
  };

  const canReanalyze = nextAvailableAt ? Date.now() >= new Date(nextAvailableAt).getTime() : true;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0D1B3E', margin: '0 0 4px' }}>
          Resume Analyzer
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
          AI-powered ATS scoring and skill extraction for your resume.
        </p>
      </div>

      {/* ── Initial page load ── */}
      {initialLoading && (
        <div style={{
          background: '#fff', border: '1px solid #E8EDF8',
          borderRadius: 20, padding: '48px 32px', textAlign: 'center',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
            style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }}>
            <circle cx="12" cy="12" r="10" stroke="#1C3FA8" strokeWidth="3" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0110 10" stroke="#1C3FA8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Loading your analysis…</p>
        </div>
      )}

      {/* ── Empty state ── */}
      {!initialLoading && !analysis && !loading && !warming && (
        <EmptyState onAnalyze={handleAnalyze} loading={loading} />
      )}

      {/* ── Warming up Python service (cold start) ── */}
      {warming && !analysis && (
        <div style={{
          background: '#fff',
          border: '1px solid #E8EDF8',
          borderRadius: 20,
          padding: '48px 32px',
          textAlign: 'center',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}>
            <circle cx="12" cy="12" r="10" stroke="#D62B2B" strokeWidth="3" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0110 10" stroke="#D62B2B" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
            Warming up AI engine…
          </p>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0' }}>
            This can take up to 30 seconds the first time
          </p>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && !warming && !analysis && (
        <div style={{
          background: '#fff',
          border: '1px solid #E8EDF8',
          borderRadius: 20,
          padding: '48px 32px',
          textAlign: 'center',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}>
            <circle cx="12" cy="12" r="10" stroke="#1C3FA8" strokeWidth="3" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0110 10" stroke="#1C3FA8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
            AI is reading your resume…
          </p>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0' }}>
            This usually takes 5–10 seconds
          </p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: '#FFF5F5', border: '1px solid #FECDD3',
          borderRadius: 12, padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 20,
        }}>
          <span>⚠️</span>
          <span style={{ fontSize: 13, color: '#D62B2B' }}>{error}</span>
        </div>
      )}

      {/* ── Results ── */}
      {!initialLoading && analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.3s ease' }}>

          {/* ── Cooldown banner ── */}
          {cached && nextAvailableAt && (
            <CooldownBanner nextAvailableAt={nextAvailableAt} />
          )}

          {/* ── Top bar: score ring + meta ── */}
          <div style={{
            background: '#fff',
            border: '1px solid #E8EDF8',
            borderRadius: 20,
            padding: '28px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            flexWrap: 'wrap',
          }}>
            <ATSRing score={analysis.atsScore} />

            {/* Divider */}
            <div style={{ width: 1, height: 100, background: '#F0F4FF', flexShrink: 0 }} />

            {/* Meta info */}
            <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SourceBadge source={analysis.source} />

              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Experience Summary
                </p>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>
                  {analysis.experienceSummary}
                </p>
              </div>

              <Timestamp iso={analysis.updatedAt} />
            </div>

            {/* Re-analyze button — locked during cooldown */}
            <div style={{ marginLeft: 'auto' }}>
              {canReanalyze
                ? <AnalyzeButton onClick={handleAnalyze} loading={loading} />
                : <LockedButton nextAvailableAt={nextAvailableAt!} />
              }
            </div>
          </div>

          {/* ── Extracted Skills ── */}
          {analysis.extractedSkills.length > 0 && (
            <Card title="Extracted Skills" icon="🏷️" accentColor="#1C3FA8">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {analysis.extractedSkills.map((skill) => (
                  <SkillChip key={skill} label={skill} />
                ))}
              </div>
            </Card>
          )}

          {/* ── Strengths + Improvements side by side ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            <Card title="Strengths" icon="💪" accentColor="#22C55E">
              <div>
                {analysis.strengths.map((s, i) => (
                  <ListItem key={i} text={s} variant="strength" />
                ))}
              </div>
            </Card>

            <Card title="Improvements" icon="🎯" accentColor="#F59E0B">
              <div>
                {analysis.improvements.map((s, i) => (
                  <ListItem key={i} text={s} variant="improvement" />
                ))}
              </div>
            </Card>

          </div>

          {/* ── Overall Feedback ── */}
          <Card title="Overall Feedback" icon="📝" accentColor="#1C3FA8">
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, margin: 0 }}>
              {analysis.overallFeedback}
            </p>
          </Card>

        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { analyzeResume, getExistingAnalysis } from '../../services/joinee.service';
// import type { ResumeAnalysis } from '../../types/joinee.types';

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function scoreColor(score: number) {
//   if (score >= 70) return { stroke: '#22C55E', text: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', label: 'Strong' };
//   if (score >= 40) return { stroke: '#F59E0B', text: '#B45309', bg: '#FFFBEB', border: '#FDE68A', label: 'Average' };
//   return { stroke: '#D62B2B', text: '#D62B2B', bg: '#FFF5F5', border: '#FECDD3', label: 'Weak' };
// }

// // ─── ATS Score Ring ───────────────────────────────────────────────────────────

// function ATSRing({ score }: { score: number }) {
//   const r = 54;
//   const circumference = 2 * Math.PI * r;
//   const dash = (score / 100) * circumference;
//   const colors = scoreColor(score);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
//       <div style={{ position: 'relative', width: 140, height: 140 }}>
//         <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
//           {/* Track */}
//           <circle cx="70" cy="70" r={r} fill="none" stroke="#F0F4FF" strokeWidth="10" />
//           {/* Progress */}
//           <circle
//             cx="70" cy="70" r={r}
//             fill="none"
//             stroke={colors.stroke}
//             strokeWidth="10"
//             strokeLinecap="round"
//             strokeDasharray={`${dash} ${circumference}`}
//             style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
//           />
//         </svg>
//         {/* Center label */}
//         <div style={{
//           position: 'absolute', inset: 0,
//           display: 'flex', flexDirection: 'column',
//           alignItems: 'center', justifyContent: 'center',
//         }}>
//           <span style={{ fontSize: 28, fontWeight: 800, color: colors.text, lineHeight: 1 }}>{score}</span>
//           <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>/ 100</span>
//         </div>
//       </div>

//       {/* Score label pill */}
//       <div style={{
//         fontSize: 12, fontWeight: 700,
//         color: colors.text,
//         background: colors.bg,
//         border: `1.5px solid ${colors.border}`,
//         borderRadius: 99, padding: '4px 14px',
//       }}>
//         {colors.label} ATS Score
//       </div>
//     </div>
//   );
// }

// // ─── Source Badge ─────────────────────────────────────────────────────────────

// function SourceBadge({ source }: { source: 'generated' | 'uploaded' }) {
//   const isUploaded = source === 'uploaded';
//   return (
//     <div style={{
//       display: 'inline-flex', alignItems: 'center', gap: 6,
//       fontSize: 11, fontWeight: 600,
//       color: isUploaded ? '#1C3FA8' : '#6B7280',
//       background: isUploaded ? '#EEF2FF' : '#F9FAFB',
//       border: `1px solid ${isUploaded ? '#C7D2FE' : '#E5E7EB'}`,
//       borderRadius: 99, padding: '3px 10px',
//     }}>
//       <span>{isUploaded ? '📄' : '🧠'}</span>
//       {isUploaded ? 'Analyzed from uploaded PDF' : 'Generated from profile data'}
//     </div>
//   );
// }

// // ─── Section Card ─────────────────────────────────────────────────────────────

// function Card({
//   title,
//   icon,
//   accentColor,
//   children,
// }: {
//   title: string;
//   icon: string;
//   accentColor: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div style={{
//       background: '#fff',
//       border: '1px solid #E8EDF8',
//       borderRadius: 16,
//       overflow: 'hidden',
//     }}>
//       {/* Header */}
//       <div style={{
//         display: 'flex', alignItems: 'center', gap: 8,
//         padding: '14px 18px',
//         borderBottom: '1px solid #F0F4FF',
//         background: '#FAFBFF',
//       }}>
//         <span style={{
//           fontSize: 14, background: accentColor + '18',
//           borderRadius: 8, width: 28, height: 28,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//         }}>{icon}</span>
//         <span style={{ fontSize: 13, fontWeight: 700, color: '#0D1B3E' }}>{title}</span>
//       </div>
//       <div style={{ padding: '16px 18px' }}>{children}</div>
//     </div>
//   );
// }

// // ─── Skill Chip ───────────────────────────────────────────────────────────────

// function SkillChip({ label }: { label: string }) {
//   return (
//     <span style={{
//       display: 'inline-block',
//       fontSize: 12, fontWeight: 600,
//       color: '#1C3FA8',
//       background: '#EEF2FF',
//       border: '1px solid #C7D2FE',
//       borderRadius: 99,
//       padding: '4px 12px',
//     }}>
//       {label}
//     </span>
//   );
// }

// // ─── List Item ────────────────────────────────────────────────────────────────

// function ListItem({ text, variant }: { text: string; variant: 'strength' | 'improvement' }) {
//   const isStrength = variant === 'strength';
//   return (
//     <div style={{
//       display: 'flex', gap: 10, alignItems: 'flex-start',
//       padding: '8px 0',
//       borderBottom: '1px solid #F8F9FF',
//     }}>
//       <span style={{
//         flexShrink: 0,
//         marginTop: 1,
//         fontSize: 13,
//         color: isStrength ? '#22C55E' : '#F59E0B',
//       }}>
//         {isStrength ? '✓' : '→'}
//       </span>
//       <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{text}</span>
//     </div>
//   );
// }

// // ─── Empty State ──────────────────────────────────────────────────────────────

// function EmptyState({ onAnalyze, loading }: { onAnalyze: () => void; loading: boolean }) {
//   return (
//     <div style={{
//       background: '#fff',
//       border: '1.5px dashed #C7D2FE',
//       borderRadius: 20,
//       padding: '56px 32px',
//       textAlign: 'center',
//     }}>
//       <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
//       <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0D1B3E', margin: '0 0 8px' }}>
//         No Analysis Yet
//       </h3>
//       <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
//         Run the AI analyzer to get your ATS score, extracted skills, strengths, and
//         personalized improvement tips.
//       </p>
//       <AnalyzeButton onClick={onAnalyze} loading={loading} />
//     </div>
//   );
// }

// // ─── Analyze Button ───────────────────────────────────────────────────────────

// function AnalyzeButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={loading}
//       style={{
//         display: 'inline-flex', alignItems: 'center', gap: 8,
//         background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #D62B2B, #1C3FA8)',
//         color: '#fff',
//         border: 'none',
//         borderRadius: 12,
//         padding: '11px 24px',
//         fontSize: 13, fontWeight: 700,
//         cursor: loading ? 'not-allowed' : 'pointer',
//         fontFamily: 'inherit',
//         transition: 'opacity 0.2s',
//         boxShadow: loading ? 'none' : '0 4px 14px rgba(28,63,168,0.25)',
//       }}
//     >
//       {loading ? (
//         <>
//           <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none"
//             style={{ animation: 'spin 0.8s linear infinite' }}>
//             <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
//             <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
//           </svg>
//           Analyzing…
//         </>
//       ) : (
//         <>✨ Analyze My Resume</>
//       )}
//     </button>
//   );
// }

// // ─── Timestamp ────────────────────────────────────────────────────────────────

// function Timestamp({ iso }: { iso: string }) {
//   const d = new Date(iso);
//   return (
//     <span style={{ fontSize: 11, color: '#9CA3AF' }}>
//       Last analyzed {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
//       {' at '}
//       {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
//     </span>
//   );
// }

// // ─── Cooldown Banner ──────────────────────────────────────────────────────────

// function CooldownBanner({ nextAvailableAt }: { nextAvailableAt: string }) {
//   const [timeLeft, setTimeLeft] = useState('');

//   useEffect(() => {
//     const calc = () => {
//       const diff = new Date(nextAvailableAt).getTime() - Date.now();
//       if (diff <= 0) { setTimeLeft('Available now'); return; }

//       const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//       if (days > 0)    setTimeLeft(`${days}d ${hours}h ${minutes}m`);
//       else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
//       else             setTimeLeft(`${minutes}m ${seconds}s`);
//     };

//     calc();
//     const timer = setInterval(calc, 1000);
//     return () => clearInterval(timer);
//   }, [nextAvailableAt]);

//   return (
//     <div style={{
//       background: '#FFFBEB',
//       border: '1px solid #FDE68A',
//       borderRadius: 12,
//       padding: '12px 16px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       flexWrap: 'wrap',
//       gap: 8,
//     }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//         <span style={{ fontSize: 16 }}>⏳</span>
//         <div>
//           <p style={{ fontSize: 12, fontWeight: 700, color: '#B45309', margin: 0 }}>
//             Showing cached analysis
//           </p>
//           <p style={{ fontSize: 11, color: '#92400E', margin: '2px 0 0' }}>
//             Next re-analysis available in{' '}
//             <strong>{timeLeft}</strong>
//           </p>
//         </div>
//       </div>
//       <div style={{
//         fontSize: 11, fontWeight: 600,
//         color: '#B45309',
//         background: '#FEF3C7',
//         border: '1px solid #FDE68A',
//         borderRadius: 99,
//         padding: '3px 10px',
//       }}>
//         7-day cooldown
//       </div>
//     </div>
//   );
// }

// // ─── Locked Re-analyze Button ─────────────────────────────────────────────────

// function LockedButton({ nextAvailableAt }: { nextAvailableAt: string }) {
//   const isAvailable = Date.now() >= new Date(nextAvailableAt).getTime();
//   if (isAvailable) return null;
//   return (
//     <div style={{
//       display: 'inline-flex', alignItems: 'center', gap: 8,
//       background: '#F3F4F6',
//       color: '#9CA3AF',
//       border: '1px solid #E5E7EB',
//       borderRadius: 12,
//       padding: '11px 20px',
//       fontSize: 13, fontWeight: 600,
//       cursor: 'not-allowed',
//       userSelect: 'none',
//     }}>
//       🔒 Re-analyze locked
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function ResumeAnalyzer() {
//   const [analysis, setAnalysis]           = useState<ResumeAnalysis | null>(null);
//   const [loading, setLoading]             = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [error, setError]                 = useState<string | null>(null);
//   const [cached, setCached]               = useState(false);
//   const [nextAvailableAt, setNextAvailableAt] = useState<string | null>(null);

//   // ── Auto-load existing analysis on mount ──────────────────────────────────
//   useEffect(() => {
//     getExistingAnalysis()
//       .then((existing) => {
//         if (existing) {
//           setAnalysis(existing);
//           // Compute nextAvailableAt from updatedAt (7-day cooldown)
//           const next = new Date(new Date(existing.updatedAt).getTime() + 7 * 24 * 60 * 60 * 1000);
//           const isCached = Date.now() < next.getTime();
//           setCached(isCached);
//           setNextAvailableAt(next.toISOString());
//         }
//       })
//       .finally(() => setInitialLoading(false));
//   }, []);

//   const handleAnalyze = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await analyzeResume();
//       setAnalysis(result.analysis);
//       setCached(result.cached);
//       setNextAvailableAt(result.nextAvailableAt);
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const canReanalyze = nextAvailableAt ? Date.now() >= new Date(nextAvailableAt).getTime() : true;

//   return (
//     <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

//       {/* ── Page Header ── */}
//       <div style={{ marginBottom: 24 }}>
//         <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0D1B3E', margin: '0 0 4px' }}>
//           Resume Analyzer
//         </h1>
//         <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
//           AI-powered ATS scoring and skill extraction for your resume.
//         </p>
//       </div>

//       {/* ── Initial page load ── */}
//       {initialLoading && (
//         <div style={{
//           background: '#fff', border: '1px solid #E8EDF8',
//           borderRadius: 20, padding: '48px 32px', textAlign: 'center',
//         }}>
//           <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
//             style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }}>
//             <circle cx="12" cy="12" r="10" stroke="#1C3FA8" strokeWidth="3" strokeOpacity="0.2" />
//             <path d="M12 2a10 10 0 0110 10" stroke="#1C3FA8" strokeWidth="3" strokeLinecap="round" />
//           </svg>
//           <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Loading your analysis…</p>
//         </div>
//       )}

//       {/* ── Empty state ── */}
//       {!initialLoading && !analysis && !loading && (
//         <EmptyState onAnalyze={handleAnalyze} loading={loading} />
//       )}

//       {/* ── Loading skeleton ── */}
//       {loading && !analysis && (
//         <div style={{
//           background: '#fff',
//           border: '1px solid #E8EDF8',
//           borderRadius: 20,
//           padding: '48px 32px',
//           textAlign: 'center',
//         }}>
//           <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
//             style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}>
//             <circle cx="12" cy="12" r="10" stroke="#1C3FA8" strokeWidth="3" strokeOpacity="0.2" />
//             <path d="M12 2a10 10 0 0110 10" stroke="#1C3FA8" strokeWidth="3" strokeLinecap="round" />
//           </svg>
//           <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
//             AI is reading your resume…
//           </p>
//           <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0' }}>
//             This usually takes 5–10 seconds
//           </p>
//         </div>
//       )}

//       {/* ── Error ── */}
//       {error && (
//         <div style={{
//           background: '#FFF5F5', border: '1px solid #FECDD3',
//           borderRadius: 12, padding: '14px 18px',
//           display: 'flex', alignItems: 'center', gap: 10,
//           marginBottom: 20,
//         }}>
//           <span>⚠️</span>
//           <span style={{ fontSize: 13, color: '#D62B2B' }}>{error}</span>
//         </div>
//       )}

//       {/* ── Results ── */}
//       {!initialLoading && analysis && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.3s ease' }}>

//           {/* ── Cooldown banner ── */}
//           {cached && nextAvailableAt && (
//             <CooldownBanner nextAvailableAt={nextAvailableAt} />
//           )}

//           {/* ── Top bar: score ring + meta ── */}
//           <div style={{
//             background: '#fff',
//             border: '1px solid #E8EDF8',
//             borderRadius: 20,
//             padding: '28px 28px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: 32,
//             flexWrap: 'wrap',
//           }}>
//             <ATSRing score={analysis.atsScore} />

//             {/* Divider */}
//             <div style={{ width: 1, height: 100, background: '#F0F4FF', flexShrink: 0 }} />

//             {/* Meta info */}
//             <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
//               <SourceBadge source={analysis.source} />

//               <div>
//                 <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//                   Experience Summary
//                 </p>
//                 <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>
//                   {analysis.experienceSummary}
//                 </p>
//               </div>

//               <Timestamp iso={analysis.updatedAt} />
//             </div>

//             {/* Re-analyze button — locked during cooldown */}
//             <div style={{ marginLeft: 'auto' }}>
//               {canReanalyze
//                 ? <AnalyzeButton onClick={handleAnalyze} loading={loading} />
//                 : <LockedButton nextAvailableAt={nextAvailableAt!} />
//               }
//             </div>
//           </div>

//           {/* ── Extracted Skills ── */}
//           {analysis.extractedSkills.length > 0 && (
//             <Card title="Extracted Skills" icon="🏷️" accentColor="#1C3FA8">
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                 {analysis.extractedSkills.map((skill) => (
//                   <SkillChip key={skill} label={skill} />
//                 ))}
//               </div>
//             </Card>
//           )}

//           {/* ── Strengths + Improvements side by side ── */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

//             <Card title="Strengths" icon="💪" accentColor="#22C55E">
//               <div>
//                 {analysis.strengths.map((s, i) => (
//                   <ListItem key={i} text={s} variant="strength" />
//                 ))}
//               </div>
//             </Card>

//             <Card title="Improvements" icon="🎯" accentColor="#F59E0B">
//               <div>
//                 {analysis.improvements.map((s, i) => (
//                   <ListItem key={i} text={s} variant="improvement" />
//                 ))}
//               </div>
//             </Card>

//           </div>

//           {/* ── Overall Feedback ── */}
//           <Card title="Overall Feedback" icon="📝" accentColor="#1C3FA8">
//             <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, margin: 0 }}>
//               {analysis.overallFeedback}
//             </p>
//           </Card>

//         </div>
//       )}

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }

