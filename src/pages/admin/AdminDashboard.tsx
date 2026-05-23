import { useState } from "react";
import { useAdminData } from "./useAdminData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const MONTHS = ["J","F","M","A","M","J","J","A","S","O","N","D"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    stats, users, totalUsers: totalCount, currentPage, totalPages,
    loading, statsLoading, error,
    searchQuery, roleFilter,
    setSearchQuery, setRoleFilter, setCurrentPage,
    toggleStatus, removeUser,
  } = useAdminData();

  // Build stat cards from live data
  const STATS = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, delta: stats?.activeUsersChange ?? 0, accent: "#E53E3E", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
    { label: "Recruiters", value: stats?.totalRecruiters ?? 0, delta: 0, accent: "#1D4ED8", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg> },
    { label: "Joinees", value: stats?.totalJoinees ?? 0, delta: 0, accent: "#E53E3E", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
    { label: "Active Users", value: stats?.activeUsers ?? 0, delta: 0, accent: "#1D4ED8", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
  ];

  const monthlyData = stats?.monthlyGrowth ?? Array(12).fill(0);
  const maxMonthly = Math.max(...monthlyData, 1);

  const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <IconHome /> },
    { id: "users", label: "Manage Users", icon: <IconUsers /> },
    { id: "jobs", label: "Manage Jobs", icon: <IconBriefcase /> },
    { id: "analytics", label: "Analytics", icon: <IconChart /> },
    { id: "settings", label: "Settings", icon: <IconSettings /> },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FF] font-['Rajdhani',sans-serif] overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className="flex flex-col transition-all duration-300 relative z-20 flex-shrink-0"
        style={{
          width: sidebarOpen ? "240px" : "72px",
          background: "linear-gradient(180deg, #0A0A1A 0%, #0D1B4B 50%, #1a0008 100%)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Spider web top decoration */}
        <div className="absolute top-0 left-0 w-full h-32 overflow-hidden opacity-10 pointer-events-none">
          <svg viewBox="0 0 240 120" className="w-full">
            <g stroke="#E53E3E" strokeWidth="0.6" fill="none">
              {[20,40,60,80,100].map((r,i) => <circle key={i} cx="120" cy="0" r={r} />)}
              {[0,30,60,90,120,150,180].map((deg,i) => {
                const rad = (deg*Math.PI)/180;
                return <line key={i} x1="120" y1="0" x2={120+Math.cos(rad)*120} y2={Math.sin(rad)*120} />;
              })}
            </g>
          </svg>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 relative z-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#E53E3E,#1D4ED8)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C9.8 2 8 3.8 8 6s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-1 9v2l-4 2-3-1-1 1 3.5 1.5L12 13l5.5 3.5L21 15l-1-1-3 1-4-2v-2h-1zm1 5l-5 3H5l-1 1h3l5-3 5 3h3l-1-1h-2l-5-3z"/>
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-black text-base tracking-wider uppercase leading-none">WebPortal</p>
              <p className="text-red-400 text-[9px] tracking-widest uppercase font-bold">Admin Control</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 relative group"
                style={{
                  color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                  background: isActive ? "rgba(229,62,62,0.15)" : "transparent",
                }}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-red-500" />
                )}
                <span className="flex-shrink-0" style={{ color: isActive ? "#E53E3E" : "rgba(255,255,255,0.4)" }}>
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span className="font-bold text-sm tracking-wider uppercase whitespace-nowrap">{item.label}</span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 font-bold tracking-wider uppercase">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin profile */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
              style={{ background: "linear-gradient(135deg,#E53E3E,#1D4ED8)" }}
            >
              AD
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-white text-sm font-bold leading-none truncate">Admin User</p>
                <p className="text-gray-500 text-xs mt-0.5">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background: "#fff",
            borderBottom: "1px solid #E8EAF6",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <IconMenu />
            </button>
            <div>
              <h1 className="text-gray-900 font-black text-xl uppercase tracking-wide leading-none">
                Admin <span className="text-red-500">Dashboard</span>
              </h1>
              <p className="text-gray-400 text-xs tracking-wider uppercase mt-0.5">
                Welcome back — your city needs you
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border text-sm outline-none transition-all bg-gray-50 font-medium"
                style={{ borderColor: searchQuery ? "#E53E3E" : "#E5E7EB", width: "200px", fontFamily: "Rajdhani, sans-serif" }}
                onFocus={(e) => { e.target.style.borderColor = "#E53E3E"; e.target.style.boxShadow = "0 0 0 3px rgba(229,62,62,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = searchQuery ? "#E53E3E" : "#E5E7EB"; e.target.style.boxShadow = "none"; }}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch />
              </span>
            </div>

            {/* Notif bell */}
            <button className="relative p-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-red-300 transition-colors">
              <IconBell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white cursor-pointer"
              style={{ background: "linear-gradient(135deg,#E53E3E,#1D4ED8)" }}
            >
              AD
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── Error Banner ── */}
          {error && (
            <div className="rounded-xl p-4 bg-red-50 border border-red-200 flex items-center gap-3">
              <span className="text-red-500 font-bold text-sm">⚠ {error}</span>
            </div>
          )}

          {/* ── Stat Cards ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 relative overflow-hidden group cursor-default"
                style={{
                  background: "#fff",
                  border: "1px solid #E8EAF6",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${stat.accent}20`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${stat.accent}50`;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#E8EAF6";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-5" style={{ background: stat.accent }} />

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${stat.accent}15`, color: stat.accent }}
                >
                  {stat.icon}
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                {statsLoading ? (
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <p className="text-gray-900 text-2xl font-black">{stat.value.toLocaleString()}</p>
                )}
                <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${stat.delta >= 0 ? "text-green-500" : "text-red-400"}`}>
                  <span>{stat.delta >= 0 ? "▲" : "▼"}</span>
                  {Math.abs(stat.delta)}% this month
                </p>
              </div>
            ))}
          </div>

          {/* ── Chart + Activity ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Bar chart */}
            <div
              className="lg:col-span-2 rounded-2xl p-6"
              style={{ background: "#fff", border: "1px solid #E8EAF6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-gray-900 font-black text-base uppercase tracking-wider">User Growth</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Monthly registrations — 2025</p>
                </div>
                <div className="flex gap-2">
                  {["recruiter","joinee"].map((r) => (
                    <span key={r} className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{ background: r === "recruiter" ? "#1D4ED810" : "#E53E3E10", color: r === "recruiter" ? "#1D4ED8" : "#E53E3E" }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-end gap-2 h-36">
                {monthlyData.map((val, i) => {
                  const pct = (val / maxMonthly) * 100;
                  const isRed = i % 2 === 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="relative w-full flex justify-center">
                        <div
                          className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80 cursor-pointer relative"
                          style={{
                            height: `${(pct / 100) * 120}px`,
                            background: isRed
                              ? "linear-gradient(180deg,#E53E3E,#FC8181)"
                              : "linear-gradient(180deg,#1D4ED8,#60A5FA)",
                            minHeight: "4px",
                          }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {val}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold">{MONTHS[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick stats / donut feel */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: "linear-gradient(160deg,#0A0A1A,#0D1B4B)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              }}
            >
              <div>
                <h2 className="text-white font-black text-base uppercase tracking-wider">Platform Health</h2>
                <p className="text-gray-500 text-xs mt-0.5">Live system metrics</p>
              </div>

              {[
                { label: "Recruiter Verification", pct: 78, color: "#1D4ED8" },
                { label: "Profile Completion", pct: 64, color: "#E53E3E" },
                { label: "Job Fill Rate", pct: 52, color: "#fff" },
                { label: "Active Sessions", pct: 91, color: "#1D4ED8" },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{m.label}</span>
                    <span className="font-black text-sm" style={{ color: m.color }}>{m.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${m.pct}%`, background: m.color, transition: "width 0.8s ease" }}
                    />
                  </div>
                </div>
              ))}

              {/* Spider web decoration */}
              <div className="mt-auto pt-2 opacity-20">
                <svg viewBox="0 0 200 60" className="w-full">
                  <g stroke="#E53E3E" strokeWidth="0.5" fill="none">
                    {[15,30,45,60].map((r,i) => <circle key={i} cx="100" cy="60" r={r} />)}
                    {[-60,-30,0,30,60].map((deg,i) => {
                      const rad = ((90+deg)*Math.PI)/180;
                      return <line key={i} x1="100" y1="60" x2={100+Math.cos(rad)*70} y2={60+Math.sin(rad)*70}/>;
                    })}
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* ── Users Table ─────────────────────────────────────────── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#fff", border: "1px solid #E8EAF6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            {/* Table header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-gray-900 font-black text-base uppercase tracking-wider">Recent Users</h2>
                <p className="text-gray-400 text-xs mt-0.5">{totalCount} users found</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Role filter */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200">
                  {(["all", "recruiter", "joinee"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className="px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all"
                      style={{
                        background: roleFilter === r
                          ? r === "recruiter" ? "#1D4ED8" : r === "joinee" ? "#E53E3E" : "#111"
                          : "transparent",
                        color: roleFilter === r ? "#fff" : "#9CA3AF",
                        fontFamily: "Rajdhani, sans-serif",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#F8F9FF", borderBottom: "1px solid #E8EAF6" }}>
                    {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-black uppercase tracking-widest text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">Loading users...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-wider text-sm">
                        No users found
                      </td>
                    </tr>
                  ) : users.map((user) => {
                    const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                    const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                    <tr
                      key={user._id}
                      className="border-b border-gray-50 hover:bg-red-50/30 transition-colors"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                            style={{
                              background: user.role === "recruiter"
                                ? "linear-gradient(135deg,#1D4ED8,#60A5FA)"
                                : "linear-gradient(135deg,#E53E3E,#FC8181)",
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="text-gray-900 font-bold text-sm">{user.name}</p>
                            <p className="text-gray-400 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider"
                          style={{
                            background: user.role === "recruiter" ? "#1D4ED810" : "#E53E3E10",
                            color: user.role === "recruiter" ? "#1D4ED8" : "#E53E3E",
                          }}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: user.isActive ? "#22C55E" : "#9CA3AF" }}
                          />
                          <span
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: user.isActive ? "#22C55E" : "#9CA3AF" }}
                          >
                            {user.isActive ? "active" : "inactive"}
                          </span>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4">
                        <span className="text-gray-500 text-xs font-bold">{joinedDate}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStatus(user._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border transition-all hover:opacity-80"
                            style={{
                              borderColor: user.isActive ? "#FCA5A5" : "#86EFAC",
                              color: user.isActive ? "#E53E3E" : "#22C55E",
                              background: user.isActive ? "#FEF2F2" : "#F0FDF4",
                              fontFamily: "Rajdhani, sans-serif",
                            }}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </button>
                          {deleteConfirm === user._id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={async () => { await removeUser(user._id); setDeleteConfirm(null); }}
                                className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-red-500 text-white hover:bg-red-600 transition-all"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 rounded-lg text-[10px] font-black uppercase border border-gray-300 text-gray-500 hover:bg-gray-100 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(user._id)}
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer — real pagination */}
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-bold">
                Page {currentPage} of {totalPages} · {totalCount} total
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="w-7 h-7 rounded-lg text-xs font-black border border-gray-200 transition-all disabled:opacity-30"
                  style={{ fontFamily: "Rajdhani, sans-serif", color: "#6B7280" }}
                >
                  ←
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) { pageNum = i + 1; }
                  else if (currentPage <= 3) { pageNum = i + 1; }
                  else if (currentPage >= totalPages - 2) { pageNum = totalPages - 4 + i; }
                  else { pageNum = currentPage - 2 + i; }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-7 h-7 rounded-lg text-xs font-black border transition-all"
                      style={{
                        borderColor: currentPage === pageNum ? "#E53E3E" : "#E5E7EB",
                        background: currentPage === pageNum ? "#E53E3E" : "transparent",
                        color: currentPage === pageNum ? "#fff" : "#6B7280",
                        fontFamily: "Rajdhani, sans-serif",
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="w-7 h-7 rounded-lg text-xs font-black border border-gray-200 transition-all disabled:opacity-30"
                  style={{ fontFamily: "Rajdhani, sans-serif", color: "#6B7280" }}
                >
                  →
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconHome() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function IconUsers() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
}
function IconBriefcase() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
}
function IconChart() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function IconSettings() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
}
function IconMenu() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
}
function IconSearch() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function IconBell() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
}
function IconTrash() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
}