import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  activePage: string;
}

export default function Header({ activePage }: HeaderProps) {
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
          Welcome back, Priyansu 👋 · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">
          PR
        </div>
      </div>
    </header>
  );
}