import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/auth/Login";
import RecruiterSignup from "./pages/auth/RecruiterSignup";
import JoineeSignup from "./pages/auth/JoineeSignup";

// ── Dashboard placeholder ─────────────────────────────────────────────────────

const ROLE_META = {
  admin:     { color: "#1D4ED8", bg: "#EFF6FF", label: "Admin",     emoji: "👑" },
  recruiter: { color: "#1D4ED8", bg: "#EFF6FF", label: "Recruiter", emoji: "🏢" },
  joinee:    { color: "#DC2626", bg: "#FEF2F2", label: "Candidate", emoji: "🚀" },
};

function Dashboard({ role }: { role: "admin" | "recruiter" | "joinee" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const meta = ROLE_META[role];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#DC2626" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 6h18M3 12h12M3 18h7" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">TalentFace</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <div className="w-px h-4 bg-gray-200" />
          <button onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Sign out
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-4xl mb-8"
          style={{ background: meta.bg }}>
          {meta.emoji}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Welcome back, <span style={{ color: meta.color }}>{user?.name}</span>
        </h1>
        <p className="mt-3 text-gray-500 text-lg">
          You're logged in as <span className="font-medium">{meta.label}</span>. Your dashboard is coming soon.
        </p>

        {/* Role badge */}
        <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full text-sm font-medium"
          style={{ background: meta.bg, color: meta.color }}>
          <div className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
          {meta.label} account
        </div>

        {/* Placeholder cards */}
        <div className="grid grid-cols-3 gap-4 mt-16">
          {[
            ["0", role === "joinee" ? "Applications" : "Postings"],
            ["0", "Messages"],
            ["0", "Notifications"],
          ].map(([val, label]) => (
            <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-3xl font-bold text-gray-900">{val}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 403 page ──────────────────────────────────────────────────────────────────

function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="text-center">
        <p className="text-8xl font-black" style={{ color: "#DC2626" }}>403</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-gray-500">You don't have permission to view this page.</p>
        <a href="/login" className="inline-block mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#1D4ED8" }}>Back to Login</a>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"            element={<Login />} />
          <Route path="/signup/recruiter" element={<RecruiterSignup />} />
          <Route path="/signup/joinee"    element={<JoineeSignup />} />
          <Route path="/unauthorized"     element={<Unauthorized />} />

          {/* Protected: Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard role="admin" />} />
          </Route>

          {/* Protected: Recruiter */}
          <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
            <Route path="/recruiter/dashboard" element={<Dashboard role="recruiter" />} />
          </Route>

          {/* Protected: Joinee */}
          <Route element={<ProtectedRoute allowedRoles={["joinee"]} />}>
            <Route path="/joinee/dashboard" element={<Dashboard role="joinee" />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
