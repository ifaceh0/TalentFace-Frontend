import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupJoinee as apiSignupJoinee } from "../../services/auth.service";
import { useAuth } from "../../context/useAuth";

const RED = "#DC2626";

interface JoineeForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export default function JoineeSignup() {
  const [form, setForm]             = useState<JoineeForm>({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [showPw, setShowPw]         = useState(false);
  const [showCpw, setShowCpw]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState<Partial<JoineeForm>>({});
  const [apiError, setApiError]     = useState("");
  const navigate                    = useNavigate();
  const { setAuth }                 = useAuth();

  const set = (f: keyof JoineeForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [f]: e.target.value }));
    setErrors((prev) => ({ ...prev, [f]: undefined }));
  };

  const validate = () => {
    const errs: Partial<JoineeForm> = {};
    if (!form.name.trim())             errs.name = "Name is required";
    if (!form.email.trim())            errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.password)                errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters";
    if (!form.confirmPassword)         errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError(""); setLoading(true);
    try {
      const { token, user } = await apiSignupJoinee({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone || undefined,
      });
      setAuth(token, user);
      navigate("/joinee/dashboard", { replace: true });
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = Math.min(
    [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(form.password)).length, 4
  );
  const strengthColor = ["", RED, "#F59E0B", "#16A34A", "#1D4ED8"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] p-14 relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #1E0A0A 0%, #7F1D1D 50%, #DC2626 100%)" }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #1D4ED8, transparent 70%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#fff" }}>
              <TfIconDark />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">TalentFace</span>
          </div>
          <p className="text-red-300 text-sm font-medium uppercase tracking-widest mb-4">For Candidates</p>
          <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Land Your<br />
            <span style={{ color: "#FCA5A5" }}>Dream Role.</span>
          </h1>
          <p className="mt-5 text-red-200 text-base leading-relaxed font-light">
            Browse curated opportunities, apply in seconds, and get discovered by top companies.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="relative z-10 space-y-4">
          {[
            ["✦", "Smart job matching based on your skills"],
            ["✦", "Direct messaging with recruiters"],
            ["✦", "Track all your applications"],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-3">
              <span className="text-red-300 text-xs">{icon}</span>
              <span className="text-sm text-red-100">{text}</span>
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

          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create account</h2>
          <p className="text-gray-500 mt-1 mb-8">Join thousands of candidates finding their next role.</p>

          {/* API error */}
          {apiError && (
            <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Full Name" error={errors.name}>
              <Input id="j-name" type="text" value={form.name} onChange={set("name")} placeholder="Alex Johnson" color={RED} hasError={!!errors.name} />
            </Field>

            <Field label="Email address" error={errors.email}>
              <Input id="j-email" type="email" value={form.email} onChange={set("email")} placeholder="alex@email.com" color={RED} hasError={!!errors.email} />
            </Field>

            <Field label="Phone Number (optional)">
              <Input id="j-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" color={RED} hasError={false} />
            </Field>

            <Field label="Password" error={errors.password}>
              <PasswordInput id="j-password" value={form.password} onChange={set("password")} show={showPw} toggle={() => setShowPw(!showPw)} color={RED} hasError={!!errors.password} placeholder="Min. 8 characters" />
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColor : "#E5E7EB" }} />
                    ))}
                  </div>
                  {strength > 0 && <p className="text-xs mt-1 font-medium" style={{ color: strengthColor }}>{strengthLabel}</p>}
                </div>
              )}
            </Field>

            <Field label="Confirm Password" error={errors.confirmPassword}>
              <PasswordInput id="j-confirm" value={form.confirmPassword} onChange={set("confirmPassword")} show={showCpw} toggle={() => setShowCpw(!showCpw)} color={RED} hasError={!!errors.confirmPassword} placeholder="Re-enter password" />
            </Field>

            <p className="text-xs text-gray-400 leading-relaxed">
              By creating an account you agree to our{" "}
              <a href="#" className="font-medium hover:underline" style={{ color: RED }}>Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="font-medium hover:underline" style={{ color: RED }}>Privacy Policy</a>.
            </p>

            <button id="joinee-submit" type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ background: loading ? "#9CA3AF" : `linear-gradient(135deg, ${RED}, ${RED}CC)`, boxShadow: loading ? "none" : `0 4px 14px ${RED}40` }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="font-semibold hover:underline" style={{ color: RED }}>Sign in</a>
          </p>
          <p className="text-center text-xs text-gray-400 mt-8">© 2025 TalentFace. All rights reserved.</p>
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

function TfIconDark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
      <path d="M3 6h18M3 12h12M3 18h7" />
    </svg>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: error ? "#DC2626" : "#374151" }}>{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium" style={{ color: "#DC2626" }}>{error}</p>}
    </div>
  );
}

function Input({ id, type, value, onChange, placeholder, color, hasError }: {
  id: string; type: string; value: string; onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string; color: string; hasError: boolean;
}) {
  return (
    <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 border outline-none transition-all"
      style={{ borderColor: hasError ? "#FECACA" : "#E5E7EB", background: hasError ? "#FEF2F2" : "#fff" }}
      onFocus={(e) => { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 3px ${color}18`; }}
      onBlur={(e) => { e.target.style.borderColor = hasError ? "#FECACA" : "#E5E7EB"; e.target.style.boxShadow = "none"; }}
    />
  );
}

function PasswordInput({ id, value, onChange, show, toggle, color, hasError, placeholder }: {
  id: string; value: string; onChange: React.ChangeEventHandler<HTMLInputElement>;
  show: boolean; toggle: () => void; color: string; hasError: boolean; placeholder: string;
}) {
  return (
    <div className="relative">
      <input id={id} type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-gray-900 placeholder-gray-400 border outline-none transition-all"
        style={{ borderColor: hasError ? "#FECACA" : "#E5E7EB", background: hasError ? "#FEF2F2" : "#fff" }}
        onFocus={(e) => { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 3px ${color}18`; }}
        onBlur={(e) => { e.target.style.borderColor = hasError ? "#FECACA" : "#E5E7EB"; e.target.style.boxShadow = "none"; }}
      />
      <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
        {show
          ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        }
      </button>
    </div>
  );
}