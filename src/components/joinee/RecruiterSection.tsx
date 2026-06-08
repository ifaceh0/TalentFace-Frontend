import { useRef } from 'react';
import type { JoineeProfile, SocialProfile } from '../../types/joinee.types';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Extract a social profile URL by platform from the socialProfiles[] array */
function getSocial(profiles: SocialProfile[] | undefined, platform: SocialProfile['platform']): string | undefined {
  return profiles?.find((sp) => sp.platform === platform)?.url;
}

/** Derive first/last name — prefers explicit fields, falls back to splitting `name` */
function deriveName(profile: JoineeProfile): { first: string; last: string; full: string } {
  const first = profile.firstName ?? profile.name?.split(' ')[0] ?? '';
  const last  = profile.lastName  ?? profile.name?.split(' ').slice(1).join(' ') ?? '';
  const full  = profile.name ?? [first, last].filter(Boolean).join(' ');
  return { first, last, full };
}

/** Initials for avatar fallback */
function getInitials(profile: JoineeProfile): string {
  const { first, last } = deriveName(profile);
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase() || profile.name?.[0]?.toUpperCase() || '?';
}

/** Resolve city/state from nested address object or flat fields */
function resolveLocation(profile: JoineeProfile): string {
  const city  = profile.city  ?? profile.address?.city;
  const state = profile.state ?? profile.address?.state;
  return [city, state].filter(Boolean).join(', ');
}

// ─── Tiny helper components ──────────────────────────────────────────────────

function SectionDivider({ title, icon }: { title: string; icon: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 16px' }}>
      <span style={{ fontSize: 17 }}>{icon}</span>
      <h3 style={{
        fontSize: 11.5, fontWeight: 800, color: '#0D1B3E', margin: 0,
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {title}
      </h3>
      <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(90deg,#C7D2F8,transparent)', marginLeft: 4 }} />
    </div>
  );
}

function SkillPill({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-block',
      background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)',
      color: '#3730A3',
      border: '1px solid #C7D2F8',
      borderRadius: 99,
      padding: '4px 13px',
      fontSize: 11.5,
      fontWeight: 600,
    }}>
      {label}
    </span>
  );
}

function ContactChip({ icon, text, href }: { icon: string; text: string; href?: string }) {
  const inner = (
    <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 4 }}>
      {icon} {text}
    </span>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
        {inner}
      </a>
    );
  }
  return inner;
}

function DateBadge({ start, end }: { start?: string; end?: string }) {
  if (!start && !end) return null;
  return (
    <span style={{
      fontSize: 11, color: '#6B7280',
      background: '#F8F9FF', border: '1px solid #E8EDF8',
      borderRadius: 6, padding: '3px 9px',
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {[start, end].filter(Boolean).join(' – ')}
    </span>
  );
}

function SocialLink({ href, icon, label, color, bg, border }: {
  href: string; icon: string; label: string;
  color: string; bg: string; border: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 12.5, color, background: bg,
      border: `1px solid ${border}`,
      borderRadius: 8, padding: '6px 14px',
      textDecoration: 'none', fontWeight: 600,
    }}>
      {icon} {label}
    </a>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface RecruiterSectionProps {
  profile: JoineeProfile;
}

export default function RecruiterSection({ profile }: RecruiterSectionProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Resolve data — supports both flat fields and nested schemas
  const { full } = deriveName(profile);
  const location   = resolveLocation(profile);
  const linkedIn   = profile.linkedIn   ?? getSocial(profile.socialProfiles, 'linkedin');
  const github     = profile.github     ?? getSocial(profile.socialProfiles, 'github');
  const portfolio  = profile.portfolio  ?? getSocial(profile.socialProfiles, 'portfolio');
  const twitter    = getSocial(profile.socialProfiles, 'twitter');
  const leetcode   = getSocial(profile.socialProfiles, 'leetcode');
  const hackerrank = getSocial(profile.socialProfiles, 'hackerrank');

  // Open a new window and print the resume card only
  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) { window.print(); return; }
    win.document.write(`
      <!DOCTYPE html><html>
      <head>
        <title>${full} — Resume | TalentFace</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          *{box-sizing:border-box;margin:0;padding:0;}
          body{font-family:'DM Sans',sans-serif;background:#fff;color:#1a1a2e;}
          @page{margin:.55in;}
        </style>
      </head>
      <body>${content.innerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 700);
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>

      {/* ── Top banner ── */}
      <div style={{
        background: 'linear-gradient(135deg,#0D1B3E 0%,#1C3FA8 60%,#D62B2B 100%)',
        borderRadius: 18,
        padding: '26px 32px',
        marginBottom: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        boxShadow: '0 8px 32px rgba(13,27,62,0.22)',
      }}>
        <div>
          <span style={{
            display: 'inline-block', marginBottom: 8,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            background: 'rgba(34,197,94,0.22)', color: '#86EFAC',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 99, padding: '3px 12px', textTransform: 'uppercase',
          }}>
            ✓ Live to Recruiters
          </span>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>
            📋 Your Recruiter Resume
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
            Auto-generated from your profile data · {today}
          </p>
        </div>
        <button
          onClick={handlePrint}
          style={{
            background: '#fff', color: '#D62B2B', border: 'none',
            borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 2px 8px rgba(214,43,43,0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          🖨️ Print / Download PDF
        </button>
      </div>

      {/* ── Info callout ── */}
      <div style={{
        background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12,
        padding: '12px 16px', marginBottom: 22,
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>💡</span>
        <p style={{ fontSize: 12.5, color: '#166534', lineHeight: 1.65, margin: 0 }}>
          This resume is <strong>auto-generated</strong> from the data you entered across your dashboard sections —
          Basic Details, Summary, Education, Work Experience, Skills, Projects and Social Profiles.
          Keep those sections updated to always present a fresh, accurate resume to recruiters.
        </p>
      </div>

      {/* ── Resume Card ── */}
      <div
        ref={printRef}
        id="recruiter-resume-print"
        style={{
          background: '#fff', borderRadius: 18,
          border: '1.5px solid #E8EDF8', overflow: 'hidden',
          boxShadow: '0 4px 32px rgba(13,27,62,0.09)',
        }}
      >
        {/* Header strip */}
        <div style={{
          background: 'linear-gradient(135deg,#0D1B3E 0%,#1C3FA8 100%)',
          padding: '36px 40px',
          display: 'flex', alignItems: 'center', gap: 28,
        }}>
          {/* Avatar */}
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'linear-gradient(135deg,#D62B2B,#1C3FA8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 800, color: '#fff',
            border: '3px solid rgba(255,255,255,0.22)',
            flexShrink: 0, overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.28)',
          }}>
            {profile.profilePhoto
              ? <img src={profile.profilePhoto} alt={full} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : getInitials(profile)
            }
          </div>

          {/* Name & contact row */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ color: '#fff', fontSize: 27, fontWeight: 800, margin: '0 0 4px', lineHeight: 1.1 }}>
              {full || 'Your Name'}
            </h1>
            {(profile.jobTitle || profile.course || profile.department) && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: '0 0 12px', fontWeight: 500 }}>
                {profile.jobTitle ?? [profile.course, profile.department].filter(Boolean).join(' · ')}
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {profile.email  && <ContactChip icon="✉️" text={profile.email}  href={`mailto:${profile.email}`} />}
              {profile.phone  && <ContactChip icon="📞" text={profile.phone}  href={`tel:${profile.phone}`} />}
              {location       && <ContactChip icon="📍" text={location} />}
              {linkedIn       && <ContactChip icon="🔗" text="LinkedIn"  href={linkedIn} />}
              {github         && <ContactChip icon="🐙" text="GitHub"    href={github} />}
              {portfolio      && <ContactChip icon="🌐" text="Portfolio" href={portfolio} />}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 30 }}>

          {/* Profile Summary */}
          {profile.summary && (
            <section>
              <SectionDivider title="Profile Summary" icon="👤" />
              <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.78, margin: 0 }}>
                {profile.summary}
              </p>
            </section>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <section>
              <SectionDivider title="Skills" icon="⚡" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.skills.map((skill, i) => <SkillPill key={i} label={skill} />)}
              </div>
            </section>
          )}

          {/* Work Experience */}
          {profile.workExperience && profile.workExperience.length > 0 && (
            <section>
              <SectionDivider title="Work Experience" icon="💼" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {profile.workExperience.map((exp, i) => (
                  <div key={exp._id ?? i} style={{ borderLeft: '3px solid #D62B2B', paddingLeft: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
                      <div>
                        <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#0D1B3E', margin: '0 0 2px' }}>
                          {exp.jobTitle ?? exp.role ?? 'Role'}
                        </h4>
                        <p style={{ fontSize: 13, color: '#D62B2B', fontWeight: 600, margin: '0 0 4px' }}>
                          {exp.company}
                        </p>
                        {exp.type && (
                          <span style={{
                            fontSize: 10, fontWeight: 600,
                            background: '#FFF5F5', color: '#D62B2B',
                            border: '1px solid #FECDD3',
                            borderRadius: 5, padding: '2px 7px',
                            textTransform: 'capitalize',
                          }}>
                            {exp.type}
                          </span>
                        )}
                      </div>
                      <DateBadge
                        start={exp.startDate}
                        end={exp.isCurrentlyWorking ? 'Present' : exp.endDate}
                      />
                    </div>
                    {exp.description && (
                      <p style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.65, margin: '8px 0 0' }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <section>
              <SectionDivider title="Education" icon="🎓" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {profile.education.map((edu, i) => (
                  <div key={edu._id ?? i} style={{ borderLeft: '3px solid #1C3FA8', paddingLeft: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
                      <div>
                        <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#0D1B3E', margin: '0 0 2px' }}>
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </h4>
                        <p style={{ fontSize: 13, color: '#1C3FA8', fontWeight: 600, margin: 0 }}>
                          {edu.institution ?? edu.board}
                        </p>
                      </div>
                      <DateBadge
                        start={edu.startYear ? String(edu.startYear) : undefined}
                        end={edu.isCurrentlyStudying ? 'Present' : edu.endYear ? String(edu.endYear) : undefined}
                      />
                    </div>
                    {(edu.grade ?? edu.cgpa ?? edu.percentage) && (
                      <p style={{ fontSize: 12, color: '#6B7280', margin: '5px 0 0' }}>
                        {edu.grade ? `Grade: ${edu.grade}` : edu.cgpa ? `CGPA: ${edu.cgpa}` : `${edu.percentage}%`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <section>
              <SectionDivider title="Projects" icon="🚀" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {profile.projects.map((proj, i) => (
                  <div key={proj._id ?? i} style={{ borderLeft: '3px solid #22C55E', paddingLeft: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
                      <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#0D1B3E', margin: '0 0 4px' }}>
                        {proj.title}
                      </h4>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer"
                          style={{ fontSize: 11, color: '#1C3FA8', fontWeight: 600, textDecoration: 'none' }}>
                          🔗 View
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.65, margin: '0 0 8px' }}>
                        {proj.description}
                      </p>
                    )}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {proj.techStack.map((tech, j) => (
                          <span key={j} style={{
                            fontSize: 10.5, fontWeight: 600,
                            background: '#F0FDF4', color: '#16A34A',
                            border: '1px solid #BBF7D0', borderRadius: 5, padding: '2px 8px',
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Online Profiles (resolved from socialProfiles[] array) */}
          {(linkedIn || github || portfolio || twitter || leetcode || hackerrank) && (
            <section>
              <SectionDivider title="Online Profiles" icon="🌐" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {linkedIn    && <SocialLink href={linkedIn}    icon="🔗" label="LinkedIn"   color="#1C3FA8" bg="#EEF2FF" border="#C7D2F8" />}
                {github      && <SocialLink href={github}      icon="🐙" label="GitHub"     color="#0D1B3E" bg="#F8F9FF" border="#E8EDF8" />}
                {portfolio   && <SocialLink href={portfolio}   icon="🌐" label="Portfolio"  color="#D62B2B" bg="#FFF5F5" border="#FECDD3" />}
                {twitter     && <SocialLink href={twitter}     icon="🐦" label="Twitter"    color="#0EA5E9" bg="#F0F9FF" border="#BAE6FD" />}
                {leetcode    && <SocialLink href={leetcode}    icon="🔢" label="LeetCode"   color="#F59E0B" bg="#FFFBEB" border="#FDE68A" />}
                {hackerrank  && <SocialLink href={hackerrank}  icon="💻" label="HackerRank" color="#22C55E" bg="#F0FDF4" border="#BBF7D0" />}
              </div>
            </section>
          )}

          {/* Academic Background */}
          {(profile.currentCollege || profile.department || profile.course) && (
            <section>
              <SectionDivider title="Academic Background" icon="🏫" />
              <div style={{
                background: '#F8F9FF', borderRadius: 10, padding: '14px 18px',
                border: '1px solid #E8EDF8',
              }}>
                {profile.currentCollege && (
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: '#0D1B3E', margin: '0 0 4px' }}>
                    {profile.currentCollege}
                  </p>
                )}
                {profile.course && (
                  <p style={{ fontSize: 13, color: '#4A5568', margin: '0 0 2px' }}>{profile.course}</p>
                )}
                {profile.department && (
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{profile.department}</p>
                )}
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div style={{
          background: '#F8F9FF', borderTop: '1px solid #E8EDF8',
          padding: '14px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: 11, color: '#A0AABF' }}>
            Generated by TalentFace · {today}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#16A34A',
            background: '#F0FDF4', border: '1px solid #BBF7D0',
            borderRadius: 99, padding: '3px 12px',
          }}>
            ✓ Visible to Recruiters
          </span>
        </div>
      </div>

      {/* Print-specific CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #recruiter-resume-print,
          #recruiter-resume-print * { visibility: visible !important; }
          #recruiter-resume-print {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
