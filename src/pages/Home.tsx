import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-white text-gray-900 overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ───────────────── NAVBAR ───────────────── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="w-full mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#DC2626" }}
            >
              <TfIcon />
            </div>

            <span className="font-bold text-lg tracking-tight">
              TalentFace
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition">
              Features
            </a>

            <a href="#how" className="hover:text-gray-900 transition">
              How it Works
            </a>

            <a href="#ai" className="hover:text-gray-900 transition">
              AI Matching
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition"
            >
              Login
            </Link>

            <Link
              to="/signup/joinee"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background:
                  "linear-gradient(135deg, #1D4ED8, #2563EB)",
                boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative pt-36 pb-24 px-6 lg:px-10">
        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, #2563EB, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                background: "#EFF6FF",
                color: "#1D4ED8",
              }}
            >
              🚀 AI-Powered Recruitment Platform
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Where Talent
              <br />
              <span style={{ color: "#1D4ED8" }}>
                Meets Opportunity.
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
              TalentFace connects recruiters with the right candidates
              using modern AI-driven matching, streamlined hiring,
              and smarter recruitment workflows.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/signup/joinee"
                className="px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #1D4ED8, #2563EB)",
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

            {/* Stats */}
            <div className="flex gap-10 mt-14">
              {[
                ["10K+", "Recruiters"],
                ["50K+", "Candidates"],
                ["95%", "Match Accuracy"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-gray-900">
                    {value}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right mock dashboard */}
          <div className="relative">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    Recruitment Dashboard
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    AI Candidate Matching
                  </p>
                </div>

                <div
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "#DCFCE7",
                    color: "#16A34A",
                  }}
                >
                  Live
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  ["124", "Applicants"],
                  ["42", "Interviews"],
                  ["18", "Offers"],
                  ["91%", "Success"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-gray-100 p-5"
                  >
                    <p className="text-2xl font-bold text-gray-900">
                      {value}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Candidate cards */}
              <div className="mt-6 space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl"
                        style={{
                          background:
                            "linear-gradient(135deg, #1D4ED8, #2563EB)",
                        }}
                      />

                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          Frontend Developer
                        </p>

                        <p className="text-xs text-gray-500">
                          React • TypeScript • Node.js
                        </p>
                      </div>
                    </div>

                    <div
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: "#EFF6FF",
                        color: "#1D4ED8",
                      }}
                    >
                      92% Match
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating glow */}
            <div
              className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full blur-3xl opacity-20"
              style={{
                background:
                  "radial-gradient(circle, #DC2626, transparent 70%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ───────────────── FEATURES ───────────────── */}
      <section
        id="features"
        className="py-24 px-6 lg:px-10 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#1D4ED8" }}
            >
              Features
            </p>

            <h2 className="text-4xl font-bold mt-3 tracking-tight">
              Everything Needed For Modern Hiring
            </h2>

            <p className="text-gray-500 mt-4">
              Built for recruiters and candidates with a clean,
              scalable workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              {
                title: "AI Candidate Matching",
                desc: "Smart profile matching using modern recruitment intelligence.",
              },
              {
                title: "Recruiter Dashboard",
                desc: "Manage jobs, candidates, applications, and interviews.",
              },
              {
                title: "One-Click Applications",
                desc: "Candidates can apply faster with streamlined onboarding.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl mb-6"
                  style={{
                    background:
                      "linear-gradient(135deg, #1D4ED8, #2563EB)",
                  }}
                />

                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="py-24 px-6 lg:px-10">
        <div
          className="max-w-6xl mx-auto rounded-[40px] p-12 lg:p-16 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, #0F172A 0%, #1E3A8A 60%, #1D4ED8 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
              Ready to Transform Hiring?
            </h2>

            <p className="mt-5 text-blue-200 text-lg max-w-2xl mx-auto">
              Join TalentFace today and discover a smarter way to
              connect talent with opportunity.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                to="/signup/recruiter"
                className="px-6 py-3 rounded-2xl text-sm font-semibold bg-white text-gray-900"
              >
                Join as Recruiter
              </Link>

              <Link
                to="/signup/joinee"
                className="px-6 py-3 rounded-2xl text-sm font-semibold text-white border border-white/20"
              >
                Join as Candidate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="border-t border-gray-100 py-8 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 TalentFace. All rights reserved.
          </p>

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
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M3 6h18M3 12h12M3 18h7" />
    </svg>
  );
}