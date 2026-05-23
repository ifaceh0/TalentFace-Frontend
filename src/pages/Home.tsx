// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div
//       className="min-h-screen bg-white text-gray-900 overflow-x-hidden"
//       style={{ fontFamily: "'Inter', sans-serif" }}
//     >
//       {/* ───────────────── NAVBAR ───────────────── */}
//       <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
//         <div className="w-full mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <div
//               className="w-9 h-9 rounded-xl flex items-center justify-center"
//               style={{ background: "#DC2626" }}
//             >
//               <TfIcon />
//             </div>

//             <span className="font-bold text-lg tracking-tight">
//               TalentFace
//             </span>
//           </div>

//           {/* Nav Links */}
//           <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
//             <a href="#features" className="hover:text-gray-900 transition">
//               Features
//             </a>

//             <a href="#how" className="hover:text-gray-900 transition">
//               How it Works
//             </a>

//             <a href="#ai" className="hover:text-gray-900 transition">
//               AI Matching
//             </a>
//           </div>

//           {/* Auth Buttons */}
//           <div className="flex items-center gap-3">
//             <Link
//               to="/login"
//               className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition"
//             >
//               Login
//             </Link>

//             <Link
//               to="/signup/joinee"
//               className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
//               style={{
//                 background:
//                   "linear-gradient(135deg, #1D4ED8, #2563EB)",
//                 boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
//               }}
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* ───────────────── HERO ───────────────── */}
//       <section className="relative pt-36 pb-24 px-6 lg:px-10">
//         {/* Background glow */}
//         <div
//           className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
//           style={{
//             background:
//               "radial-gradient(circle, #2563EB, transparent 70%)",
//           }}
//         />

//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
//           {/* Left */}
//           <div>
//             <div
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
//               style={{
//                 background: "#EFF6FF",
//                 color: "#1D4ED8",
//               }}
//             >
//               🚀 AI-Powered Recruitment Platform
//             </div>

//             <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
//               Where Talent
//               <br />
//               <span style={{ color: "#1D4ED8" }}>
//                 Meets Opportunity.
//               </span>
//             </h1>

//             <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
//               TalentFace connects recruiters with the right candidates
//               using modern AI-driven matching, streamlined hiring,
//               and smarter recruitment workflows.
//             </p>

//             <div className="flex flex-wrap gap-4 mt-10">
//               <Link
//                 to="/signup/joinee"
//                 className="px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #1D4ED8, #2563EB)",
//                   boxShadow: "0 8px 24px rgba(37,99,235,0.25)",
//                 }}
//               >
//                 Join as Candidate
//               </Link>

//               <Link
//                 to="/signup/recruiter"
//                 className="px-6 py-3 rounded-2xl text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 transition"
//               >
//                 Hire Talent
//               </Link>
//             </div>

//             {/* Stats */}
//             <div className="flex gap-10 mt-14">
//               {[
//                 ["10K+", "Recruiters"],
//                 ["50K+", "Candidates"],
//                 ["95%", "Match Accuracy"],
//               ].map(([value, label]) => (
//                 <div key={label}>
//                   <p className="text-3xl font-bold text-gray-900">
//                     {value}
//                   </p>

//                   <p className="text-sm text-gray-500 mt-1">
//                     {label}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right mock dashboard */}
//           <div className="relative">
//             <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6">
//               {/* Header */}
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-semibold text-gray-900">
//                     Recruitment Dashboard
//                   </p>

//                   <p className="text-sm text-gray-500 mt-1">
//                     AI Candidate Matching
//                   </p>
//                 </div>

//                 <div
//                   className="px-3 py-1 rounded-full text-xs font-semibold"
//                   style={{
//                     background: "#DCFCE7",
//                     color: "#16A34A",
//                   }}
//                 >
//                   Live
//                 </div>
//               </div>

//               {/* Cards */}
//               <div className="grid grid-cols-2 gap-4 mt-6">
//                 {[
//                   ["124", "Applicants"],
//                   ["42", "Interviews"],
//                   ["18", "Offers"],
//                   ["91%", "Success"],
//                 ].map(([value, label]) => (
//                   <div
//                     key={label}
//                     className="rounded-2xl border border-gray-100 p-5"
//                   >
//                     <p className="text-2xl font-bold text-gray-900">
//                       {value}
//                     </p>

//                     <p className="text-sm text-gray-500 mt-1">
//                       {label}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* Candidate cards */}
//               <div className="mt-6 space-y-4">
//                 {[1, 2, 3].map((item) => (
//                   <div
//                     key={item}
//                     className="flex items-center justify-between p-4 rounded-2xl bg-gray-50"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className="w-11 h-11 rounded-xl"
//                         style={{
//                           background:
//                             "linear-gradient(135deg, #1D4ED8, #2563EB)",
//                         }}
//                       />

//                       <div>
//                         <p className="font-semibold text-sm text-gray-900">
//                           Frontend Developer
//                         </p>

//                         <p className="text-xs text-gray-500">
//                           React • TypeScript • Node.js
//                         </p>
//                       </div>
//                     </div>

//                     <div
//                       className="px-3 py-1 rounded-full text-xs font-semibold"
//                       style={{
//                         background: "#EFF6FF",
//                         color: "#1D4ED8",
//                       }}
//                     >
//                       92% Match
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Floating glow */}
//             <div
//               className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full blur-3xl opacity-20"
//               style={{
//                 background:
//                   "radial-gradient(circle, #DC2626, transparent 70%)",
//               }}
//             />
//           </div>
//         </div>
//       </section>

//       {/* ───────────────── FEATURES ───────────────── */}
//       <section
//         id="features"
//         className="py-24 px-6 lg:px-10 bg-gray-50"
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center max-w-2xl mx-auto">
//             <p
//               className="text-sm font-semibold uppercase tracking-wider"
//               style={{ color: "#1D4ED8" }}
//             >
//               Features
//             </p>

//             <h2 className="text-4xl font-bold mt-3 tracking-tight">
//               Everything Needed For Modern Hiring
//             </h2>

//             <p className="text-gray-500 mt-4">
//               Built for recruiters and candidates with a clean,
//               scalable workflow.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6 mt-16">
//             {[
//               {
//                 title: "AI Candidate Matching",
//                 desc: "Smart profile matching using modern recruitment intelligence.",
//               },
//               {
//                 title: "Recruiter Dashboard",
//                 desc: "Manage jobs, candidates, applications, and interviews.",
//               },
//               {
//                 title: "One-Click Applications",
//                 desc: "Candidates can apply faster with streamlined onboarding.",
//               },
//             ].map((item) => (
//               <div
//                 key={item.title}
//                 className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
//               >
//                 <div
//                   className="w-14 h-14 rounded-2xl mb-6"
//                   style={{
//                     background:
//                       "linear-gradient(135deg, #1D4ED8, #2563EB)",
//                   }}
//                 />

//                 <h3 className="text-xl font-bold text-gray-900">
//                   {item.title}
//                 </h3>

//                 <p className="text-gray-500 mt-3 leading-relaxed">
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ───────────────── CTA ───────────────── */}
//       <section className="py-24 px-6 lg:px-10">
//         <div
//           className="max-w-6xl mx-auto rounded-[40px] p-12 lg:p-16 text-center relative overflow-hidden"
//           style={{
//             background:
//               "linear-gradient(145deg, #0F172A 0%, #1E3A8A 60%, #1D4ED8 100%)",
//           }}
//         >
//           <div
//             className="absolute inset-0 opacity-[0.06]"
//             style={{
//               backgroundImage:
//                 "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
//               backgroundSize: "48px 48px",
//             }}
//           />

//           <div className="relative z-10">
//             <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
//               Ready to Transform Hiring?
//             </h2>

//             <p className="mt-5 text-blue-200 text-lg max-w-2xl mx-auto">
//               Join TalentFace today and discover a smarter way to
//               connect talent with opportunity.
//             </p>

//             <div className="flex flex-wrap justify-center gap-4 mt-10">
//               <Link
//                 to="/signup/recruiter"
//                 className="px-6 py-3 rounded-2xl text-sm font-semibold bg-white text-gray-900"
//               >
//                 Join as Recruiter
//               </Link>

//               <Link
//                 to="/signup/joinee"
//                 className="px-6 py-3 rounded-2xl text-sm font-semibold text-white border border-white/20"
//               >
//                 Join as Candidate
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ───────────────── FOOTER ───────────────── */}
//       <footer className="border-t border-gray-100 py-8 px-6 lg:px-10">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
//           <p className="text-sm text-gray-500">
//             © 2025 TalentFace. All rights reserved.
//           </p>

//           <div className="flex items-center gap-6 text-sm text-gray-500">
//             <a href="#">Privacy</a>
//             <a href="#">Terms</a>
//             <a href="#">Contact</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// function TfIcon() {
//   return (
//     <svg
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="white"
//       strokeWidth="2.5"
//       strokeLinecap="round"
//     >
//       <path d="M3 6h18M3 12h12M3 18h7" />
//     </svg>
//   );
// }
import { Link } from "react-router-dom";
import { useState, useRef, useCallback } from "react";

// ─── Demo job data ────────────────────────────────────────────────────────────

const DEMO_JOBS = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Oscorp Industries",
    location: "Mumbai · Hybrid",
    locType: "hybrid",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    exp: "1–4 yrs",
    salary: "₹8L – 14L",
    desc: "Build cutting-edge web interfaces for internal tools and client-facing products.",
    grad: "linear-gradient(135deg,#1D4ED8,#2563EB)",
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "Daily Bugle Tech",
    location: "Remote",
    locType: "remote",
    skills: ["Node.js", "MongoDB", "Express"],
    exp: "2–5 yrs",
    salary: "₹10L – 18L",
    desc: "Design and maintain scalable backend services powering our news platform.",
    grad: "linear-gradient(135deg,#DC2626,#EF4444)",
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "Stark Innovations",
    location: "Bangalore · Onsite",
    locType: "onsite",
    skills: ["React", "Python", "FastAPI"],
    exp: "3–7 yrs",
    salary: "₹15L – 25L",
    desc: "Join our team to build next-generation enterprise software solutions.",
    grad: "linear-gradient(135deg,#059669,#10B981)",
  },
  {
    id: "4",
    title: "React Native Developer",
    company: "Spider Industries",
    location: "Mumbai · Hybrid",
    locType: "hybrid",
    skills: ["React Native", "Redux", "Firebase"],
    exp: "1–3 yrs",
    salary: "₹6L – 10L",
    desc: "Develop cross-platform mobile apps used by millions daily.",
    grad: "linear-gradient(135deg,#7C3AED,#8B5CF6)",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "Horizon Labs",
    location: "Remote",
    locType: "remote",
    skills: ["Docker", "Kubernetes", "AWS"],
    exp: "2–6 yrs",
    salary: "₹12L – 22L",
    desc: "Manage and scale our cloud infrastructure for high-availability services.",
    grad: "linear-gradient(135deg,#D97706,#F59E0B)",
  },
];

const LOC_BADGE: Record<string, { bg: string; color: string }> = {
  remote: { bg: "#D1FAE5", color: "#065F46" },
  hybrid: { bg: "#FEF3C7", color: "#92400E" },
  onsite: { bg: "#DBEAFE", color: "#1E40AF" },
};

// ─── Swipe Demo ───────────────────────────────────────────────────────────────

function SwipeDemo() {
  const [idx, setIdx]           = useState(0);
  const [applied, setApplied]   = useState(0);
  const [skipped, setSkipped]   = useState(0);
  const [animOut, setAnimOut]   = useState<"left" | "right" | null>(null);
  const [dragging, setDragging] = useState(false);
  const [offsetX, setOffsetX]   = useState(0);
  const [offsetY, setOffsetY]   = useState(0);
  const [busy, setBusy]         = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const job = DEMO_JOBS[idx];
  const hasMore = idx < DEMO_JOBS.length;

  const swipe = useCallback((dir: "left" | "right") => {
    if (busy || !hasMore) return;
    setBusy(true);
    setAnimOut(dir);
    setTimeout(() => {
      setAnimOut(null);
      setOffsetX(0);
      setOffsetY(0);
      if (dir === "right") setApplied((a) => a + 1);
      else setSkipped((s) => s + 1);
      setIdx((i) => i + 1);
      setBusy(false);
    }, 380);
  }, [busy, hasMore]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (busy) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    setDragging(true);
  };
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || busy) return;
    setOffsetX(e.clientX - startX.current);
    setOffsetY(e.clientY - startY.current);
  }, [dragging, busy]);
  const onMouseUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (offsetX > 90) swipe("right");
    else if (offsetX < -90) swipe("left");
    else { setOffsetX(0); setOffsetY(0); }
  }, [dragging, offsetX, swipe]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (busy) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setDragging(true);
  };
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging || busy) return;
    setOffsetX(e.touches[0].clientX - startX.current);
    setOffsetY(e.touches[0].clientY - startY.current);
  }, [dragging, busy]);
  const onTouchEnd = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (offsetX > 90) swipe("right");
    else if (offsetX < -90) swipe("left");
    else { setOffsetX(0); setOffsetY(0); }
  }, [dragging, offsetX, swipe]);

  const rot   = Math.min(Math.max(offsetX * 0.07, -15), 15);
  const opac  = Math.max(1 - Math.abs(offsetX) / 380, 0.65);
  const skipOpac  = offsetX < -20 ? Math.min(Math.abs(offsetX) / 70, 1) : 0;
  const applyOpac = offsetX > 20  ? Math.min(offsetX / 70, 1) : 0;

  return (
    <div className="flex flex-col items-center">
      {/* Stats row */}
      <div className="flex items-center gap-6 mb-6 text-sm font-semibold">
        <span style={{ color: "#1D4ED8" }}>
          ✓ {applied} Applied
        </span>
        <span className="text-gray-300">|</span>
        <span style={{ color: "#DC2626" }}>
          ✕ {skipped} Skipped
        </span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-400">
          {Math.max(DEMO_JOBS.length - idx, 0)} left
        </span>
      </div>

      {/* Card stack */}
      <div
        className="relative w-full max-w-sm"
        style={{ height: "420px" }}
      >
        {/* Empty state */}
        {!hasMore && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 text-center p-8">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-bold text-gray-900 text-lg">You're all caught up!</p>
            <p className="text-gray-400 text-sm mt-1 mb-5">
              Sign up to see hundreds of real jobs matched to your profile.
            </p>
            <Link
              to="/signup/joinee"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#1D4ED8,#2563EB)" }}
            >
              Get Started Free →
            </Link>
          </div>
        )}

        {/* Background cards (depth effect) */}
        {hasMore && [2, 1].map((offset) => {
          const bgJob = DEMO_JOBS[idx + offset];
          if (!bgJob) return null;
          return (
            <div
              key={bgJob.id}
              className="absolute w-full"
              style={{
                top: `${offset * 10}px`,
                transform: `scale(${1 - offset * 0.04})`,
                zIndex: 10 - offset,
                opacity: 1 - offset * 0.25,
              }}
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow p-5">
                <div className="h-4 w-32 bg-gray-100 rounded-full mb-2" />
                <div className="h-3 w-24 bg-gray-50 rounded-full" />
              </div>
            </div>
          );
        })}

        {/* Active card */}
        {hasMore && job && (
          <div
            className="absolute w-full select-none"
            style={{
              zIndex: 20,
              transform: animOut
                ? animOut === "right"
                  ? "translateX(140%) rotate(18deg)"
                  : "translateX(-140%) rotate(-18deg)"
                : `translate(${offsetX}px,${offsetY * 0.25}px) rotate(${rot}deg)`,
              opacity: animOut ? 0 : opac,
              transition: dragging && !animOut
                ? "none"
                : "transform 0.38s cubic-bezier(.175,.885,.32,1.275), opacity 0.3s",
              cursor: dragging ? "grabbing" : "grab",
              touchAction: "none",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
              style={{ boxShadow: "0 12px 48px rgba(0,0,0,0.1)" }}
            >
              {/* Top gradient bar */}
              <div className="h-1.5" style={{ background: job.grad }} />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: job.grad }}
                  >
                    {job.company.slice(0, 2).toUpperCase()}
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: LOC_BADGE[job.locType].bg,
                      color: LOC_BADGE[job.locType].color,
                    }}
                  >
                    {job.locType.charAt(0).toUpperCase() + job.locType.slice(1)}
                  </span>
                </div>

                <h3 className="text-gray-900 font-bold text-xl leading-tight mb-0.5">
                  {job.title}
                </h3>
                <p className="text-gray-400 text-sm font-medium mb-1">{job.company}</p>
                <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  {job.location}
                </p>

                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {job.desc}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                      style={{ background: "#EFF6FF", color: "#1D4ED8" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid #F1F5F9" }}
                >
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Experience</p>
                    <p className="text-sm font-bold text-gray-900">{job.exp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium">Package</p>
                    <p className="text-sm font-bold text-gray-900">{job.salary}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SKIP stamp */}
            <div
              className="absolute top-5 right-5 border-2 rounded-xl px-3 py-1 font-black text-base uppercase tracking-widest pointer-events-none"
              style={{
                borderColor: "#DC2626",
                color: "#DC2626",
                transform: "rotate(12deg)",
                opacity: skipOpac,
                transition: dragging ? "none" : "opacity 0.2s",
              }}
            >
              Skip
            </div>

            {/* APPLY stamp */}
            <div
              className="absolute top-5 left-5 border-2 rounded-xl px-3 py-1 font-black text-base uppercase tracking-widest pointer-events-none"
              style={{
                borderColor: "#1D4ED8",
                color: "#1D4ED8",
                transform: "rotate(-12deg)",
                opacity: applyOpac,
                transition: dragging ? "none" : "opacity 0.2s",
              }}
            >
              Apply
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      {hasMore && (
        <div className="flex items-center justify-center gap-8 mt-6">
          <button
            onClick={() => swipe("left")}
            disabled={busy}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
            style={{
              background: "#fff",
              border: "1.5px solid #FECACA",
              boxShadow: "0 4px 16px rgba(220,38,38,0.12)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            onClick={() => swipe("right")}
            disabled={busy}
            className="w-18 h-18 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
            style={{
              width: "68px",
              height: "68px",
              background: "linear-gradient(135deg,#1D4ED8,#2563EB)",
              boxShadow: "0 6px 24px rgba(37,99,235,0.35)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3 font-medium">
        ← Skip · Drag or tap · Apply →
      </p>
    </div>
  );
}

// ─── Main Home Page ───────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div
      className="min-h-screen bg-white text-gray-900 overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="w-full mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#DC2626" }}
            >
              <TfIcon />
            </div>
            <span className="font-bold text-lg tracking-tight">TalentFace</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition">Features</a>
            <a href="#how" className="hover:text-gray-900 transition">How it Works</a>
            <a href="#try" className="hover:text-gray-900 transition">Try It Live</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition">
              Login
            </Link>
            <Link
              to="/signup/joinee"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg,#1D4ED8,#2563EB)",
                boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 px-6 lg:px-10">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle,#2563EB,transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "#EFF6FF", color: "#1D4ED8" }}
            >
              🚀 AI-Powered Recruitment Platform
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Where Talent
              <br />
              <span style={{ color: "#1D4ED8" }}>Meets Opportunity.</span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
              TalentFace connects recruiters with the right candidates using
              modern AI-driven matching, streamlined hiring, and smarter
              recruitment workflows.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/signup/joinee"
                className="px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg,#1D4ED8,#2563EB)",
                  boxShadow: "0 8px 24px rgba(37,99,235,0.25)",
                }}
              >
                Join as Candidate
              </Link>
              <Link
                to="/signup/recruiter"
                className="px-6 py-3 rounded-2xl text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 transition"
              >
                Hire Talent
              </Link>
            </div>

            <div className="flex gap-10 mt-14">
              {[["10K+", "Recruiters"], ["50K+", "Candidates"], ["95%", "Match Accuracy"]].map(([value, label]) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mock dashboard (unchanged) */}
          <div className="relative">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Recruitment Dashboard</p>
                  <p className="text-sm text-gray-500 mt-1">AI Candidate Matching</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#DCFCE7", color: "#16A34A" }}>
                  Live
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {[["124", "Applicants"], ["42", "Interviews"], ["18", "Offers"], ["91%", "Success"]].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-gray-100 p-5">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl" style={{ background: "linear-gradient(135deg,#1D4ED8,#2563EB)" }} />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">Frontend Developer</p>
                        <p className="text-xs text-gray-500">React • TypeScript • Node.js</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>
                      92% Match
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full blur-3xl opacity-20"
              style={{ background: "radial-gradient(circle,#DC2626,transparent 70%)" }}
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 lg:px-10 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#1D4ED8" }}>
              Features
            </p>
            <h2 className="text-4xl font-bold mt-3 tracking-tight">
              Everything Needed For Modern Hiring
            </h2>
            <p className="text-gray-500 mt-4">
              Built for recruiters and candidates with a clean, scalable workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { title: "AI Candidate Matching", desc: "Smart profile matching using modern recruitment intelligence." },
              { title: "Recruiter Dashboard", desc: "Manage jobs, candidates, applications, and interviews." },
              { title: "One-Click Applications", desc: "Candidates can apply faster with streamlined onboarding." },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl mb-6" style={{ background: "linear-gradient(135deg,#1D4ED8,#2563EB)" }} />
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-500 mt-3 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE SWIPE DEMO ── */}
      <section id="try" className="py-24 px-6 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#1D4ED8" }}>
                Try It Live
              </p>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6">
                Swipe Your Way
                <br />
                <span style={{ color: "#DC2626" }}>to Your Dream Job.</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                No sign-up needed to try it out. Swipe right on jobs you love,
                left on ones you don't. When both you and the recruiter swipe
                right — it's a match.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { icon: "👆", title: "Drag or tap", desc: "Swipe cards left to skip, right to apply — just like Tinder." },
                  { icon: "🤖", title: "AI ranks your deck", desc: "Jobs are sorted by your skills, experience and location match." },
                  { icon: "🎉", title: "Mutual match", desc: "When the recruiter also swipes right on you, it's a match!" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="text-2xl w-10 flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/signup/joinee"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg,#1D4ED8,#2563EB)",
                  boxShadow: "0 8px 24px rgba(37,99,235,0.25)",
                }}
              >
                Sign Up for Real Jobs →
              </Link>
            </div>

            {/* Right — live swipe demo */}
            <div
              className="rounded-3xl p-8 border border-gray-100"
              style={{ background: "#F8FAFF", boxShadow: "0 8px 40px rgba(37,99,235,0.08)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-bold text-gray-900 text-lg">Job Deck</p>
                  <p className="text-gray-400 text-sm">Demo — no login needed</p>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "#DCFCE7", color: "#16A34A" }}
                >
                  ● Live
                </div>
              </div>
              <SwipeDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 lg:px-10">
        <div
          className="max-w-6xl mx-auto rounded-[40px] p-12 lg:p-16 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(145deg,#0F172A 0%,#1E3A8A 60%,#1D4ED8 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
              Ready to Transform Hiring?
            </h2>
            <p className="mt-5 text-blue-200 text-lg max-w-2xl mx-auto">
              Join TalentFace today and discover a smarter way to connect talent with opportunity.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link to="/signup/recruiter" className="px-6 py-3 rounded-2xl text-sm font-semibold bg-white text-gray-900">
                Join as Recruiter
              </Link>
              <Link to="/signup/joinee" className="px-6 py-3 rounded-2xl text-sm font-semibold text-white border border-white/20">
                Join as Candidate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 py-8 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2025 TalentFace. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TfIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <path d="M3 6h18M3 12h12M3 18h7" />
    </svg>
  );
}