import { useState } from "react";
import { Toaster } from 'sonner';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
//import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import DashboardPage from "./pages/DashboardPage";
import CandidatesPage from "./pages/CandidatesPage";
import JobsPage from "./pages/JobsPage";

import Login from "./pages/auth/Login";
import RecruiterSignup from "./pages/auth/RecruiterSignup";
import CandidateSignup from "./pages/auth/CandidateSignup";


import AdminDashboard from "./pages/admin/AdminDashboard";
import Home from "./pages/Home";
import BrowseJobs    from "./pages/candidate/BrowseJobs";   //
import CandidateHomepage from "./components/candidate/Candidatehomepage";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import JobSwipe from "./pages/candidate/JobSwipe";
import CandidateSwipe from "./pages/recruiter/CandidateSwipe";

import ChatWidget from "./components/ChatWidget/ChatWidget";
import SavedJobs from "./components/candidate/SavedJob";

import Setting from "./pages/candidate/Setting";
import CandidateApplications from "./pages/candidate/candidateApplications";

// ── NEW: Import Recruiter Profile Pages ────────────────────────────────────
import Profile from "./pages/recruiter/Profile";
import Settings from "./pages/recruiter/Settings";
import ChangePassword from "./pages/recruiter/Changepassword";
import CandidateDetailPage from "./pages/recruiter/CandidateDetailPage";

// ───────────────── Dashboard Layout ─────────────────

function Dashboard({ role }: { role: string }) {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage setActivePage={setActivePage} />;

      case "candidates":
        return <CandidatesPage />;

      case "jobs":
        return <JobsPage onReviewCandidates={() => setActivePage("swipe")} />;

      case "swipe":
        return <CandidateSwipe />;

      default:
        return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        role={role}
      />

      <div className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <Header activePage={activePage} />

        <main className="mt-16 p-6 pb-24">
          {renderPage()}
        </main>

        <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
          TalentFace Recruiter Portal
        </footer>
        
      </div>
      <ChatWidget />   {/* ← add this */}
    </div>
  );
}

// ───────────────── Candidate Layout wrapper ─────────────────────────────────────
// Wraps all candidate pages so ChatWidget appears on every candidate route
// without touching CandidateHomepage / CandidateDashboard / JobSwipe individually.
 
function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatWidget />   {/* ← candidate sees the widget */}
    </>
  );
}


// ───────────────── 403 Page ─────────────────

function Unauthorized() {
  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center"
      style={{ fontFamily: "'Inter', sans-serif" }}
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

export default function App() {
  return (
    // <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/signup/recruiter"
            element={<RecruiterSignup />}
          />

          <Route
            path="/signup/candidate"
            element={<CandidateSignup />}
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
  {/* ── NEW: Profile Pages ────────────────────────────────────── */}
  <Route
    path="/recruiter/profile"
    element={<Profile />}
  />
  <Route
    path="/recruiter/settings"
    element={<Settings />}
  />
  <Route
    path="/recruiter/change-password"
    element={<ChangePassword />}
  />
  <Route
    path="/recruiter/candidate/:uniqueId"
    element={<CandidateDetailPage />}
  />
</Route>

          {/* Candidate Routes */}
          <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
            <Route path="/candidate/home"      element={<CandidateLayout><CandidateHomepage /></CandidateLayout>} />
            <Route path="/candidate/dashboard" element={<CandidateLayout><CandidateDashboard /></CandidateLayout>} />
            <Route path="/candidate/browse"    element={<BrowseJobs />} />
            <Route path="/candidate/swipe"     element={<CandidateLayout><JobSwipe /></CandidateLayout>} />
            <Route path="/candidate/saved" element={<SavedJobs />} />
            <Route path="/candidate/setting" element={<Setting />} /> 
            <Route path="/candidate/applications" element={<CandidateLayout><CandidateApplications /></CandidateLayout>} />
          </Route>




          {/* Catch-all */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
   </AuthProvider>
   
  );
}

