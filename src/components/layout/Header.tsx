import { useState } from 'react';
import { Bell, Search, LogOut, Settings, User, HelpCircle, Lock } from 'lucide-react';
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
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none text-gray-700 w-40"
          />
        </div>

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
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-red-600 text-lg font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold">{user?.name || 'User'}</p>
                      <p className="text-xs text-red-100">{user?.email || 'email@example.com'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {/* View Profile */}
                  <button
                    onClick={() => {
                      navigate('/recruiter/profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <User size={16} className="text-gray-400" />
                    <span>View Profile</span>
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => {
                      navigate('/recruiter/settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Settings size={16} className="text-gray-400" />
                    <span>Settings</span>
                  </button>

                  {/* Change Password */}
                  <button
                    onClick={() => {
                      navigate('/recruiter/change-password');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Lock size={16} className="text-gray-400" />
                    <span>Change Password</span>
                  </button>

                  {/* Help */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <HelpCircle size={16} className="text-gray-400" />
                    <span>Help & Support</span>
                  </button>

                  {/* Divider */}
                  <div className="h-px bg-gray-200 my-2" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    <LogOut size={16} />
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