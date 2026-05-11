import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import CandidatesPage from './pages/CandidatesPage';
import JobsPage from './pages/JobsPage';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'candidates': return <CandidatesPage />;
      case 'jobs': return <JobsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 ml-64">
        <Header activePage={activePage} />
        <main className="mt-16 p-6">
          {renderPage()}
        </main>
        <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
          TalentFace Recruiter Portal · Version 1.0 · Built by Priyansu
        </footer>
      </div>
    </div>
  );
}