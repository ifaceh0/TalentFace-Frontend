import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import {
  Briefcase,
  MapPin,
  Calendar,
  ChevronRight,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  ArrowLeft,
  Building2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description?: string;
    requirements?: string[];
    tags?: string[];
    isRemote?: boolean;
  } | null;
  status: "applied" | "under_review" | "shortlisted" | "rejected" | "hired";
  createdAt: string;
  coverLetter?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  applied:      { label: "Applied",       icon: Clock,        bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700"   },
  under_review: { label: "Under Review",  icon: Eye,          bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700"  },
  shortlisted:  { label: "Shortlisted",   icon: CheckCircle,  bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700"  },
  rejected:     { label: "Rejected",      icon: XCircle,      bg: "bg-red-50",    border: "border-red-200",    text: "text-red-600"    },
  hired:        { label: "Hired 🎉",      icon: CheckCircle,  bg: "bg-emerald-50",border: "border-emerald-300",text: "text-emerald-700"},
};

function StatusBadge({ status }: { status: Application["status"] }) {
 const { label, icon: Icon, bg, border, text } = STATUS_CONFIG[status] ?? STATUS_CONFIG.applied;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${bg} ${border} ${text}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function ApplicationDetailModal({
  application,
  index,
  onClose,
}: {
  application: Application;
  index: number;
  onClose: () => void;
}) {
  const job = application.job;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.18s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-slate-900 to-blue-900">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {(job?.company ?? "?")[0].toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-white/50 tracking-widest uppercase">
                  #{String(index).padStart(2, "0")}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {job?.title ?? "Job no longer available"}
              </h2>
              <p className="text-sm text-white/70 mt-0.5">{job?.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors flex-shrink-0 mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Status + meta row */}
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={application.status} />
            {job?.type && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                {job.type}
              </span>
            )}
            {job?.isRemote && (
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                Remote
              </span>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Building2, label: "Company",      value: job?.company   },
              { icon: MapPin,    label: "Location",      value: job?.location  },
              { icon: Briefcase, label: "Salary",        value: job?.salary    },
              { icon: Calendar,  label: "Applied on",    value: formatDateTime(application.createdAt) },
            ].filter(r => r.value).map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Status timeline */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Application Status
            </p>
            <div className="flex items-center gap-1">
              {(["applied", "under_review", "shortlisted", "hired"] as const).map((s, i, arr) => {
                const statuses = ["applied", "under_review", "shortlisted", "rejected", "hired"];
                const currentIdx = statuses.indexOf(application.status);
                const stepIdx = statuses.indexOf(s);
                const isRejected = application.status === "rejected";
                const isPast = isRejected ? stepIdx <= currentIdx : stepIdx <= currentIdx;
                const isCurrent = s === application.status;
                const cfg2 = STATUS_CONFIG[s];
                return (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`flex flex-col items-center flex-1 ${i === 0 ? "" : ""}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? "bg-blue-600 border-blue-600"
                          : isPast && !isRejected
                          ? "bg-green-500 border-green-500"
                          : "bg-white border-gray-200"
                      }`}>
                        {isPast && !isCurrent && !isRejected
                          ? <CheckCircle size={14} className="text-white" />
                          : isCurrent
                          ? <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          : <div className="w-2 h-2 rounded-full bg-gray-300" />
                        }
                      </div>
                      <span className={`text-xs mt-1 font-medium text-center leading-tight ${
                        isCurrent ? "text-blue-600" : isPast && !isRejected ? "text-green-600" : "text-gray-400"
                      }`}>
                        {cfg2.label.replace(" 🎉", "")}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 rounded-full mb-4 ${
                        stepIdx < currentIdx && !isRejected ? "bg-green-400" : "bg-gray-200"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            {application.status === "rejected" && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <XCircle size={13} /> Application was not shortlisted for this role.
              </div>
            )}
          </div>

          {/* Tags */}
          {job?.tags && job.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {job?.description && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Job Description</p>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {job?.requirements && job.requirements.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Requirements</p>
              <ul className="space-y-1.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Applied {formatDateTime(application.createdAt)}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JoineeApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [selected, setSelected]         = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    api.get("/applications/my")
      .then((res) => {
        setApplications(res.data.data.applications ?? []);
      })
      .catch(() => setError("Failed to load applications. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterStatus === "all"
    ? applications
    : applications.filter((a) => a.status === filterStatus);

  const counts = {
    all:          applications.length,
    applied:      applications.filter(a => a.status === "applied").length,
    under_review: applications.filter(a => a.status === "under_review").length,
    shortlisted:  applications.filter(a => a.status === "shortlisted").length,
    rejected:     applications.filter(a => a.status === "rejected").length,
    hired:        applications.filter(a => a.status === "hired").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans">

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/joinee/home")}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <span className="text-white text-xs font-bold">TF</span>
              </div>
              <span className="font-bold text-gray-900 text-sm hidden sm:block">TalentFace</span>
              <span className="text-gray-300 hidden sm:block">/</span>
              <span className="text-sm text-gray-600 hidden sm:block">My Applications</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
            {applications.length} total
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">My Applications</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Track every job you've applied to</p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {[
            { key: "all",          label: "All"          },
            { key: "applied",      label: "Applied"      },
            { key: "under_review", label: "Under Review" },
            { key: "shortlisted",  label: "Shortlisted"  },
            { key: "rejected",     label: "Rejected"     },
            { key: "hired",        label: "Hired"        },
          ].map(({ key, label }) => {
            const isActive = filterStatus === key;
            const count = counts[key as keyof typeof counts];
            if (count === 0 && key !== "all") return null;
            return (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 border-gray-900"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded-md text-xs font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (<div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0">
                <div className="w-8 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded animate-pulse w-1/3" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4" />
                </div>
                <div className="h-6 w-20 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} className="text-gray-400" />
            </div>
            <p className="text-base font-semibold text-gray-800 dark:text-slate-200 mb-1">
              {filterStatus === "all" ? "No applications yet" : `No ${filterStatus.replace("_", " ")} applications`}
            </p>
            <p className="text-sm text-gray-400 dark:text-slate-400 mb-5">
              {filterStatus === "all"
                ? "Jobs you apply to will appear here."
                : "Try a different filter above."}
            </p>
            {filterStatus === "all" && (
              <button
                onClick={() => navigate("/joinee/home")}
                className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                Browse Jobs →
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-[40px_1fr_160px_140px_100px_44px] gap-3 px-5 py-3 bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-600">
              {["#", "Job", "Company · Location", "Date Applied", "Status", ""].map((h) => (
                <span key={h} className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((app, idx) => {
              const job = app.job;
              return (
                <div
                  key={app._id}
                  onClick={() => setSelected(app)}
                  className="grid grid-cols-[40px_1fr_160px_140px_100px_44px] gap-3 items-center px-5 py-4 border-b border-gray-50 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors group"
                >
                  {/* Serial */}
                  <span className="text-xs font-bold text-gray-400 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Job title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      {(job?.company ?? "?")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-200 truncate group-hover:text-red-600 transition-colors">
                        {job?.title ?? "Unavailable"}
                      </p>
                      {job?.type && (
                        <span className="text-xs text-gray-400">{job.type}</span>
                      )}
                    </div>
                  </div>

                  {/* Company · Location */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300 truncate">{job?.company ?? "—"}</p>
                    {job?.location && (
                      <p className="text-xs text-gray-400 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin size={10} /> {job.location}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-sm text-gray-700 dark:text-slate-300">{formatDate(app.createdAt)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(app.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <StatusBadge status={app.status} />
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-end">
                    <ChevronRight size={15} className="text-gray-300 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer note */}
       {!loading && filtered.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-slate-500 text-center mt-4">
            Showing {filtered.length} of {applications.length} application{applications.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <ApplicationDetailModal
          application={selected}
          index={filtered.indexOf(selected) + 1}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}