import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Bell, Briefcase, CheckCheck, MapPin, Sparkles } from "lucide-react";
import {
  getNotifications, markNotificationRead, markAllNotificationsRead, getSuggestedJobs,
} from "../../services/candidate.service";
import {
  adjustUnreadCount, setUnreadCount, refreshUnreadCount,
} from "../../hooks/useUnreadNotifications";
import type { AppNotification, SuggestedJob } from "../../types/candidate.types";

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days < 30
    ? `${days}d ago`
    : new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function CandidateNotifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedJob[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNotifications(1)
      .then(({ notifications, hasMore }) => { setItems(notifications); setHasMore(hasMore); })
      .catch(() => setError("Failed to load notifications. Please try again."))
      .finally(() => setLoading(false));
    getSuggestedJobs().then(setSuggestions).catch(() => {});
  }, []);

  const unread = items.filter((i) => !i.isRead).length;

  const handleOpen = (n: AppNotification) => {
    if (!n.isRead) {
      setItems((prev) => prev.map((i) => (i._id === n._id ? { ...i, isRead: true } : i)));
      adjustUnreadCount(-1);
      markNotificationRead(n._id).catch(() => {});
    }
    if (n.link) navigate(n.link);
  };

  const handleMarkAll = async () => {
    setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      refreshUnreadCount(true); // resync badge with the server if it failed
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const res = await getNotifications(next);
      setItems((prev) => [...prev, ...res.notifications]);
      setHasMore(res.hasMore);
      setPage(next);
    } catch {
      setError("Failed to load more notifications.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/candidate/home")}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">Notifications</span>
          </div>
          {unread > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:text-red-600 transition-colors"
            >
              <CheckCheck size={14} /> Mark all as read
            </button>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ── Notifications ── */}
        <section>
          {loading && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded animate-pulse w-1/3" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle size={16} className="flex-shrink-0" /> {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-14 text-center">
              <div className="w-14 h-14 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Bell size={24} className="text-gray-400" />
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-slate-200">You're all caught up</p>
              <p className="text-sm text-gray-400 mt-1">Application updates and job matches will show up here.</p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
              {items.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleOpen(n)}
                  className={`w-full text-left flex items-start gap-3 px-5 py-4 border-b border-gray-50 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                    n.isRead ? "" : "bg-red-50/40 dark:bg-slate-700/40"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    n.type === "job_match" ? "bg-indigo-50 text-indigo-600" : "bg-blue-50 text-blue-600"
                  }`}>
                    {n.type === "job_match" ? <Sparkles size={16} /> : <Briefcase size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.isRead
                      ? "font-medium text-gray-700 dark:text-slate-300"
                      : "font-semibold text-gray-900 dark:text-slate-100"}`}>
                      {n.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </section>

        {/* ── Suggested jobs ── */}
        {suggestions.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Sparkles size={15} className="text-indigo-600" /> Jobs you might like
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
              {suggestions.map((job) => (
                <button
                  key={job._id}
                  onClick={() => navigate("/candidate/browse")}
                  className="w-full text-left flex items-center gap-3 px-5 py-4 border-b border-gray-50 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                    style={{ background: job.color || "#202A44" }}
                  >
                    {job.logo || job.company?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{job.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                      {job.company}
                      {job.location && <> · <MapPin size={10} className="inline -mt-0.5" /> {job.location}</>}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg flex-shrink-0">
                    {job.matchScore}% match
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}