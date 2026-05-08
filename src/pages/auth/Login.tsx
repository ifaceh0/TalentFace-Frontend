import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../../services/auth.service";
import { useAuth } from "../../context/useAuth";

type Role = "admin" | "recruiter" | "joinee";

const ROLE_CONFIG: Record<Role, { label: string; placeholder: string; color: string; bg: string }> = {
  admin:     { label: "Admin",     placeholder: "admin@company.com",     color: "#1D4ED8", bg: "#EFF6FF" },
  recruiter: { label: "Recruiter", placeholder: "recruiter@company.com", color: "#1D4ED8", bg: "#EFF6FF" },
  joinee:    { label: "Joinee",    placeholder: "you@email.com",         color: "#DC2626", bg: "#FEF2F2" },
};

export default function Login() {
  const [role, setRole]               = useState<Role>("joinee");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const navigate    = useNavigate();
  const { setAuth } = useAuth();
  const { color }   = ROLE_CONFIG[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const { token, user } = await apiLogin(email, password);
      setAuth(token, user);
      const map: Record<string, string> = {
        admin: "/admin/dashboard",
        recruiter: "/recruiter/dashboard",
        joinee: "/joinee/dashboard",
      };
      navigate(map[user.role] ?? "/login", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-14 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0F172A 0%, #1E3A8A 60%, #1D4ED8 100%)" }}
      >
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {/* Red accent circle */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #DC2626, transparent 70%)" }} />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#DC2626" }}>
              <TfIcon />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">TalentFace</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
            Where Talent<br />
            <span style={{ color: "#93C5FD" }}>Meets</span><br />
            Opportunity.
          </h1>
          <p className="mt-6 text-blue-200 text-lg leading-relaxed font-light">
            Recruiters find their next star.<br />
            Candidates land their dream role.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-10">
          {[["10K+", "Recruiters"], ["50K+", "Candidates"], ["95%", "Match Rate"]].map(([val, label]) => (
            <div key={label}>
              <p className="text-white text-2xl font-bold">{val}</p>
              <p className="text-blue-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#DC2626" }}>
              <TfIcon />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">TalentFace</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sign in</h2>
          <p className="text-gray-500 mt-1 mb-8">Choose your role and continue.</p>

          {/* Role switcher */}
          <div className="flex gap-2 mb-8 p-1 rounded-xl bg-gray-100">
            {(Object.keys(ROLE_CONFIG) as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                style={role === r
                  ? { background: "#fff", color: ROLE_CONFIG[r].color, boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }
                  : { background: "transparent", color: "#6B7280" }
                }
              >
                {ROLE_CONFIG[r].label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ROLE_CONFIG[role].placeholder}
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 border border-gray-200 outline-none transition-all"
                style={{ background: "#fff" }}
                onFocus={(e) => { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 3px ${color}18`; }}
                onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color }}>Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-gray-900 placeholder-gray-400 border border-gray-200 outline-none transition-all"
                  style={{ background: "#fff" }}
                  onFocus={(e) => { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 3px ${color}18`; }}
                  onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 mt-2"
              style={{
                background: loading ? "#9CA3AF" : `linear-gradient(135deg, ${color}, ${color}DD)`,
                boxShadow: loading ? "none" : `0 4px 14px ${color}40`,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in"}
            </button>
          </form>

          {/* Signup link */}
          {role !== "admin" && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <a href={`/signup/${role}`} className="font-semibold hover:underline" style={{ color }}>
                Create one as {ROLE_CONFIG[role].label}
              </a>
            </p>
          )}

          <p className="text-center text-xs text-gray-400 mt-10">
            © 2025 TalentFace. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function TfIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <path d="M3 6h18M3 12h12M3 18h7" />
    </svg>
  );
}

function Eye() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}