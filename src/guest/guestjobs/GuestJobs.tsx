import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Job = {
  _id: string;
  title: string;
  company: string;
  location?: string;
  type?: string;
  workMode?: string;
  salary?: string;
  tags?: string[];
  experienceLevel?: string;
  description?: unknown; // plain string or Tiptap JSON
};

// Descriptions can be Tiptap JSON (see createJob), so flatten to text
const toText = (n: any): string => {
  if (!n) return "";
  if (typeof n === "string") return n;
  if (n.type === "text") return n.text || "";
  if (Array.isArray(n.content)) {
    const end = ["paragraph", "heading", "listItem"].includes(n.type) ? "\n" : "";
    return n.content.map(toText).join("") + end;
  }
  return "";
};

const BLUE = "linear-gradient(135deg,#1D4ED8,#2563EB)";

export default function GuestJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Job | null>(null);

  useEffect(() => {
    // Swap for your existing jobs service function if you have one
   fetch(`${import.meta.env.VITE_API_URL ?? ""}/api/jobs/public?limit=20`)
      .then((r) => r.json())
      .then((res) => setJobs(res.data?.jobs ?? []))
      .catch(() => setError("Could not load jobs. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // Not logged in → login page (remember where to come back to)
  const goApply = (job: Job) =>
    navigate("/login", { state: { from: `/jobs?job=${job._id}` } });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg tracking-tight">TalentFace</Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-700">Login</Link>
            <Link
              to="/signup/candidate"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: BLUE }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-black tracking-tight">Top Jobs</h1>
        <p className="text-gray-500 mt-1 mb-6">Browse open roles. Sign in to apply.</p>

        {loading && <p className="text-gray-400">Loading jobs…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && jobs.length === 0 && (
          <p className="text-gray-400">No open jobs right now.</p>
        )}

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Job list */}
          <div className="lg:col-span-2 space-y-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => setSelected(job)}
                className={`bg-white rounded-2xl border p-5 cursor-pointer transition hover:shadow-md ${
                  selected?._id === job._id ? "border-blue-600" : "border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {[job.location, job.workMode, job.type].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); goApply(job); }}
                    className="shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                    style={{ background: BLUE }}
                  >
                    Apply
                  </button>
                </div>
                {job.salary && <p className="text-sm font-semibold mt-3">{job.salary}</p>}
              </div>
            ))}
          </div>

          {/* Detail panel: sheet on mobile, side panel on desktop */}
          <div
            className={
              selected
                ? "fixed inset-0 z-50 bg-white overflow-y-auto lg:static lg:inset-auto lg:z-auto lg:col-span-3 lg:rounded-3xl lg:border lg:border-gray-100 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]"
                : "hidden lg:flex lg:col-span-3 lg:rounded-3xl lg:border lg:border-dashed lg:border-gray-200 lg:h-64 items-center justify-center text-gray-400 text-sm"
            }
          >
            {selected ? (
              <div className="p-6">
                <button
                  onClick={() => setSelected(null)}
                  className="lg:hidden mb-4 text-sm font-semibold text-gray-500"
                >
                  ← Back to jobs
                </button>

                <h2 className="text-2xl font-black">{selected.title}</h2>
                <p className="text-gray-500 mt-1">{selected.company}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {[selected.location, selected.workMode, selected.type, selected.experienceLevel]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {selected.salary && <p className="font-semibold mt-3">{selected.salary}</p>}

                <button
                  onClick={() => goApply(selected)}
                  className="mt-5 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: BLUE }}
                >
                  Apply
                </button>

                {!!selected.tags?.length && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {selected.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                        style={{ background: "#EFF6FF", color: "#1D4ED8" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="font-bold mt-6 mb-2">About the job</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {toText(selected.description) || "No description provided."}
                </p>
              </div>
            ) : (
              "Select a job to see the details"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}