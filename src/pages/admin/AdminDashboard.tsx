import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ReactNode;
  accent: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "recruiter" | "joinee";
  status: "active" | "inactive";
  joined: string;
  avatar: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const STATS: StatCard[] = [
  {
    label: "Total Users",
    value: "2,847",
    delta: "+12.4%",
    positive: true,
    accent: "#E53E3E",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Recruiters",
    value: "384",
    delta: "+5.2%",
    positive: true,
    accent: "#1D4ED8",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    label: "Joinees",
    value: "2,463",
    delta: "+18.7%",
    positive: true,
    accent: "#E53E3E",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Active Jobs",
    value: "1,204",
    delta: "-3.1%",
    positive: false,
    accent: "#1D4ED8",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

const USERS: User[] = [
  { id: "1", name: "Peter Parker", email: "peter@dailybugle.com", role: "recruiter", status: "active", joined: "Jan 12, 2025", avatar: "PP" },
  { id: "2", name: "Miles Morales", email: "miles@brooklyn.edu", role: "joinee", status: "active", joined: "Feb 3, 2025", avatar: "MM" },
  { id: "3", name: "Mary Jane Watson", email: "mj@vogue.com", role: "recruiter", status: "inactive", joined: "Mar 18, 2025", avatar: "MJ" },
  { id: "4", name: "Gwen Stacy", email: "gwen@science.edu", role: "joinee", status: "active", joined: "Apr 5, 2025", avatar: "GS" },
  { id: "5", name: "Harry Osborn", email: "harry@oscorp.com", role: "recruiter", status: "active", joined: "Apr 22, 2025", avatar: "HO" },
  { id: "6", name: "Ned Leeds", email: "ned@midtown.edu", role: "joinee", status: "inactive", joined: "May 1, 2025", avatar: "NL" },
];

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <IconHome /> },
  { id: "users", label: "Manage Users", icon: <IconUsers /> },
  { id: "jobs", label: "Manage Jobs", icon: <IconBriefcase /> },
  { id: "analytics", label: "Analytics", icon: <IconChart /> },
  { id: "settings", label: "Settings", icon: <IconSettings /> },
];

const MONTHLY = [42, 58, 45, 72, 88, 65, 94, 78, 110, 96, 128, 142];
const MONTHS = ["J","F","M","A","M","J","J","A","S","O","N","D"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "recruiter" | "joinee">("all");
  const [users, setUsers] = useState<User[]>(USERS);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u
      )
    );
  };

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
                <p className="text-gray-900 text-2xl font-black">{stat.value}</p>
                <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${stat.positive ? "text-green-500" : "text-red-400"}`}>
                  <span>{stat.positive ? "▲" : "▼"}</span>
                  {stat.delta} this month
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
                {MONTHLY.map((val, i) => {
                  const pct = (val / 142) * 100;
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
                <p className="text-gray-400 text-xs mt-0.5">{filteredUsers.length} users found</p>
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
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-wider text-sm">
                        No users found
                      </td>
                    </tr>
                  ) : filteredUsers.map((user) => (
                    <tr
                      key={user.id}
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
                            {user.avatar}
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
                            style={{ background: user.status === "active" ? "#22C55E" : "#9CA3AF" }}
                          />
                          <span
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: user.status === "active" ? "#22C55E" : "#9CA3AF" }}
                          >
                            {user.status}
                          </span>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4">
                        <span className="text-gray-500 text-xs font-bold">{user.joined}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStatus(user.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border transition-all hover:opacity-80"
                            style={{
                              borderColor: user.status === "active" ? "#FCA5A5" : "#86EFAC",
                              color: user.status === "active" ? "#E53E3E" : "#22C55E",
                              background: user.status === "active" ? "#FEF2F2" : "#F0FDF4",
                              fontFamily: "Rajdhani, sans-serif",
                            }}
                          >
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-bold">Showing {filteredUsers.length} of {users.length} users</span>
              <div className="flex gap-2">
                {["←", "1", "2", "3", "→"].map((p, i) => (
                  <button
                    key={i}
                    className="w-7 h-7 rounded-lg text-xs font-black border transition-all"
                    style={{
                      borderColor: p === "1" ? "#E53E3E" : "#E5E7EB",
                      background: p === "1" ? "#E53E3E" : "transparent",
                      color: p === "1" ? "#fff" : "#6B7280",
                      fontFamily: "Rajdhani, sans-serif",
                    }}
                  >
                    {p}
                  </button>
                ))}
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