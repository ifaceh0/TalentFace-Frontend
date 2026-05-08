import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupRecruiter as apiSignupRecruiter } from "../../services/auth.service";
import { useAuth } from "../../context/useAuth";

const BLUE = "#1D4ED8";

interface RecruiterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyWebsite: string;
  designation: string;
  phone: string;
}

export default function RecruiterSignup() {
  const [form, setForm] = useState<RecruiterForm>({
    name: "", email: "", password: "", confirmPassword: "",
    companyName: "", companyWebsite: "", designation: "", phone: "",
  });
  const [showPw, setShowPw]       = useState(false);
  const [showCpw, setShowCpw]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState<Partial<RecruiterForm>>({});
  const [apiError, setApiError]   = useState("");
  const [step, setStep]           = useState<1 | 2>(1);
  const navigate                  = useNavigate();
  const { setAuth }               = useAuth();

  const set = (f: keyof RecruiterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [f]: e.target.value }));
    setErrors((prev) => ({ ...prev, [f]: undefined }));
  };

  const validateStep1 = () => {
    const errs: Partial<RecruiterForm> = {};
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

  const validateStep2 = () => {
    const errs: Partial<RecruiterForm> = {};
    if (!form.companyName.trim()) errs.companyName = "Company name is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setApiError(""); setLoading(true);
    try {
      const { token, user } = await apiSignupRecruiter({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        companyName: form.companyName,
        companyWebsite: form.companyWebsite || undefined,
        designation: form.designation || undefined,
        phone: form.phone || undefined,
      });
      setAuth(token, user);
      navigate("/recruiter/dashboard", { replace: true });
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = Math.min(
    [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(form.password)).length, 4
  );
  const strengthColor = ["", "#DC2626", "#F59E0B", "#16A34A", BLUE][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] p-14 relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #0F172A 0%, #1E3A8A 55%, #1D4ED8 100%)" }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #DC2626, transparent 70%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#DC2626" }}>
              <TfIcon />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">TalentFace</span>
          </div>
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-4">For Recruiters</p>
          <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Build Your<br />
            <span style={{ color: "#93C5FD" }}>Dream Team.</span>
          </h1>
          <p className="mt-5 text-blue-200 text-base leading-relaxed font-light">
            Post roles, screen candidates, and make offers — all in one place.
          </p>
        </div>

        {/* Steps legend */}
        <div className="relative z-10 space-y-3">
          {["Create your account", "Add company details", "Start hiring"].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: i + 1 <= step ? "#fff" : "rgba(255,255,255,0.2)", color: i + 1 <= step ? BLUE : "#94A3B8" }}>
                {i + 1}
              </div>
              <span className="text-sm" style={{ color: i + 1 <= step ? "#fff" : "#64748B" }}>{s}</span>
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

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={{ background: step >= s ? BLUE : "#E5E7EB", color: step >= s ? "#fff" : "#9CA3AF" }}>
                  {s}
                </div>
                {s < 2 && <div className="w-12 h-0.5 transition-all duration-300" style={{ background: step > 1 ? BLUE : "#E5E7EB" }} />}
              </div>
            ))}
            <span className="ml-1 text-sm text-gray-500">
              {step === 1 ? "Account Info" : "Company Info"}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {step === 1 ? "Create account" : "Your company"}
          </h2>
          <p className="text-gray-500 mt-1 mb-8">
            {step === 1 ? "Start hiring the best talent." : "Tell us about where you work."}
          </p>

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

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); if (validateStep1()) setStep(2); } : handleSubmit}
            className="space-y-5">

            {step === 1 && (
              <>
                <Field label="Full Name" error={errors.name} color={BLUE}>
                  <Input id="r-name" type="text" value={form.name} onChange={set("name")} placeholder="Jane Smith" color={BLUE} hasError={!!errors.name} />
                </Field>
                <Field label="Email address" error={errors.email} color={BLUE}>
                  <Input id="r-email" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" color={BLUE} hasError={!!errors.email} />
                </Field>
                <Field label="Password" error={errors.password} color={BLUE}>
                  <PasswordInput id="r-password" value={form.password} onChange={set("password")} show={showPw} toggle={() => setShowPw(!showPw)} color={BLUE} hasError={!!errors.password} placeholder="Min. 8 characters" />
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
                <Field label="Confirm Password" error={errors.confirmPassword} color={BLUE}>
                  <PasswordInput id="r-confirm" value={form.confirmPassword} onChange={set("confirmPassword")} show={showCpw} toggle={() => setShowCpw(!showCpw)} color={BLUE} hasError={!!errors.confirmPassword} placeholder="Re-enter password" />
                </Field>
                <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-2 transition-all duration-200"
                  style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE}CC)`, boxShadow: `0 4px 14px ${BLUE}40` }}>
                  Continue →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <Field label="Company Name *" error={errors.companyName} color={BLUE}>
                  <Input id="r-company" type="text" value={form.companyName} onChange={set("companyName")} placeholder="Acme Corp" color={BLUE} hasError={!!errors.companyName} />
                </Field>
                <Field label="Company Website" color={BLUE}>
                  <Input id="r-website" type="url" value={form.companyWebsite} onChange={set("companyWebsite")} placeholder="https://acme.com" color={BLUE} hasError={false} />
                </Field>
                <Field label="Your Designation" color={BLUE}>
                  <Input id="r-designation" type="text" value={form.designation} onChange={set("designation")} placeholder="HR Manager" color={BLUE} hasError={false} />
                </Field>
                <Field label="Phone Number" color={BLUE}>
                  <Input id="r-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" color={BLUE} hasError={false} />
                </Field>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all duration-200"
                    style={{ borderColor: "#E5E7EB", color: "#374151", background: "#fff" }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                    style={{ background: loading ? "#9CA3AF" : `linear-gradient(135deg, ${BLUE}, ${BLUE}CC)`, boxShadow: loading ? "none" : `0 4px 14px ${BLUE}40` }}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Creating...
                      </span>
                    ) : "Create Account"}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="font-semibold hover:underline" style={{ color: BLUE }}>Sign in</a>
          </p>
          <p className="text-center text-xs text-gray-400 mt-8">© 2025 TalentFace. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function TfIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <path d="M3 6h18M3 12h12M3 18h7" />
    </svg>
  );
}

function Field({ label, error, color, children }: { label: string; error?: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5" style={{ color: error ? "#DC2626" : "#374151" }}>{label}</label>
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