
// import { useState } from 'react';
// import Sidebar from './components/layout/Sidebar';
// import Header from './components/layout/Header';
// import DashboardPage from './pages/DashboardPage';
// import CandidatesPage from './pages/CandidatesPage';
// import JobsPage from './pages/JobsPage';

// import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import { useAuth } from "./context/useAuth";
// import ProtectedRoute from "./components/common/ProtectedRoute";
// import Login from "./pages/auth/Login";
// import RecruiterSignup from "./pages/auth/RecruiterSignup";
// import JoineeSignup from "./pages/auth/JoineeSignup";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import Home from "./pages/Home";


// export default function App() {
//   const [activePage, setActivePage] = useState('dashboard');

//   const renderPage = () => {
//     switch (activePage) {
//       case 'dashboard': return <DashboardPage />;
//       case 'candidates': return <CandidatesPage />;
//       case 'jobs': return <JobsPage />;
//       default: return <DashboardPage />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <Sidebar activePage={activePage} setActivePage={setActivePage} />
//       <div className="flex-1 ml-64">
//         <Header activePage={activePage} />
//         <main className="mt-16 p-6">
//           {renderPage()}
//         </main>
//         <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
//           TalentFace Recruiter Portal · Version 1.0 · Built by Priyansu
//         </footer>
//       </div>
//     </div>
//   );

// }

// }

// // ── 403 page ──────────────────────────────────────────────────────────────────

// function Unauthorized() {
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
//       <div className="text-center">
//         <p className="text-8xl font-black" style={{ color: "#DC2626" }}>403</p>
//         <h1 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h1>
//         <p className="mt-2 text-gray-500">You don't have permission to view this page.</p>
//         <a href="/login" className="inline-block mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
//           style={{ background: "#1D4ED8" }}>Back to Login</a>
//       </div>
//     </div>
//   );
// }

// // ── App ────────────────────────────────────────────────────────────────────────

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Public */}
//           <Route path="/"                element={<Home />} />
//           <Route path="/login"            element={<Login />} />
//           <Route path="/signup/recruiter" element={<RecruiterSignup />} />
//           <Route path="/signup/joinee"    element={<JoineeSignup />} />
//           <Route path="/unauthorized"     element={<Unauthorized />} />

//           {/* Protected: Admin */}
//           <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
//             <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           </Route>

//           {/* Protected: Recruiter */}
//           <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
//             <Route path="/recruiter/dashboard" element={<Dashboard role="recruiter" />} />
//           </Route>

//           {/* Protected: Joinee */}
//           <Route element={<ProtectedRoute allowedRoles={["joinee"]} />}>
//             <Route path="/joinee/dashboard" element={<Dashboard role="joinee" />} />
//           </Route>

//           {/* Catch-all */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }


import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import DashboardPage from "./pages/DashboardPage";
import CandidatesPage from "./pages/CandidatesPage";
import JobsPage from "./pages/JobsPage";
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import ChangePassword from './pages/auth/ChangePassword';

import Login from "./pages/auth/Login";
import RecruiterSignup from "./pages/auth/RecruiterSignup";
import JoineeSignup from "./pages/auth/JoineeSignup";
import JoineeDashboard from "./pages/joinee/JoineeDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Home from "./pages/Home";
import { restoreAppState, saveAppState } from "./store/useStore";
import { applyFontSize, loadUserSettings } from './utils/settings';


// ───────────────── Dashboard Layout ─────────────────

const DASHBOARD_VIEW_KEY = 'tf_dashboard_active_page';

function Dashboard({ role }: { role: string }) {
  const [activePage, setActivePage] = useState<string>(() => {
    if (typeof window === 'undefined') return 'dashboard';
    const saved = localStorage.getItem(DASHBOARD_VIEW_KEY);
    return saved === 'candidates' || saved === 'jobs' ? saved : 'dashboard';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DASHBOARD_VIEW_KEY, activePage);
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;

      case "candidates":
        return <CandidatesPage />;

      case "jobs":
        return <JobsPage />;

      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        role={role}
      />

      <div className="flex-1 min-w-0 pl-64">
        <Header activePage={activePage} />

        <main className="mt-16 p-6 min-w-0">
          {renderPage()}
        </main>

        <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
          TalentFace Recruiter Portal · Version 1.0 · Built by Priyansu
        </footer>
      </div>
    </div>
  );
}


// ───────────────── 403 Page ─────────────────

function Unauthorized() {
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="text-center">
        <p className="text-8xl font-black text-red-600">403</p>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Access Denied
        </h1>

        <p className="mt-2 text-gray-500">
          You don't have permission to view this page.
        </p>

        <a
          href="/login"
          className="inline-block mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-700"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}


// ───────────────── Main App ─────────────────

function AppRoutes() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      restoreAppState(user._id);
      const settings = loadUserSettings(user._id);
      applyFontSize(settings.fontSize);
    }
  }, [loading, user]);

  useEffect(() => {
    const interval = window.setInterval(() => saveAppState(user?._id), 30000);
    return () => window.clearInterval(interval);
  }, [user]);

  return (
    <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/signup/recruiter"
            element={<RecruiterSignup />}
          />

          <Route
            path="/signup/joinee"
            element={<JoineeSignup />}
          />

          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />



          {/* Admin Routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["admin"]} />}
          >
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
          </Route>

          {/* Recruiter Routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["recruiter"]} />}
          >
            <Route
              path="/recruiter/dashboard"
              element={<Dashboard role="recruiter" />}
            />
            <Route path="/recruiter/profile" element={<ProfilePage />} />
            <Route path="/recruiter/settings" element={<SettingsPage />} />
            <Route path="/recruiter/change-password" element={<ChangePassword />} />
          </Route>

          {/* Joinee Routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["joinee"]} />}
          >
            <Route
              path="/joinee/dashboard"
              element={<JoineeDashboard />}
            />
          </Route>



          {/* Catch-all */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}