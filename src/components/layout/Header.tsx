import { useState } from 'react';
import { Bell, LogOut, Settings, User, Lock } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  activePage: string;
}

export default function Header({ activePage }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const firstName = user?.name.split(' ')[0] || 'User';
  const initials = user?.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };
  
  const pageTitle: Record<string, string> = {
    dashboard: 'Dashboard',
    candidates: 'Candidates',
    jobs: 'Job Management',
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-10">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-semibold text-blue-900">
          {pageTitle[activePage] || 'Dashboard'}
        </h2>
        <p className="text-xs text-gray-400">
          Welcome back, {firstName} 👋 · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell size={20} className="text-blue-900" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar & Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold hover:bg-red-600 transition cursor-pointer"
          >
            {initials}
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-blue-100 z-50 overflow-hidden ring-1 ring-black/5">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-red-600 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-900 text-lg font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-blue-100">{user?.email || 'email@example.com'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2 bg-slate-50">
                  <button
                    onClick={() => {
                      navigate('/recruiter/profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-800 hover:bg-blue-50 transition"
                  >
                    <User size={16} className="text-blue-600" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/recruiter/settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-800 hover:bg-blue-50 transition"
                  >
                    <Settings size={16} className="text-blue-600" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/recruiter/change-password');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-800 hover:bg-blue-50 transition"
                  >
                    <Lock size={16} className="text-blue-600" />
                    <span>Change Password</span>
                  </button>

                  <div className="h-px bg-blue-100 my-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition font-medium"
                  >
                    <LogOut size={16} className="text-red-600" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}