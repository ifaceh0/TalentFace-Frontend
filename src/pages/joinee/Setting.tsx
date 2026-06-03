import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  User,
  Bell,
  Shield,
  Briefcase,
  Zap,
  Lock,
  Palette,
  HelpCircle,
  ChevronRight,
  LogOut,
  Trash2,
  Monitor,
  Smartphone,
  Globe,
  Eye,
  EyeOff,
  Mail,
  Key,
  AlertTriangle,
  CheckCircle,
  X,
  Sun,
  Moon,
  Laptop,
  MessageSquare,
  Bug,
  FileText,
  Info,
  RotateCcw,
  Shuffle,
  Sliders,
  MapPin,
  Building2,
  Wifi,
  ToggleLeft,
  ToggleRight,
  Volume2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Section = 
  | "account" | "notifications" | "privacy" | "job-preferences"
  | "match-preferences" | "security" | "appearance" | "support";

interface NotificationToggles {
  newJobRecommendations: boolean;
  newMatchNotifications: boolean;
  recruiterMessages: boolean;
  interviewInvitations: boolean;
  applicationStatusUpdates: boolean;
  weeklyJobAlerts: boolean;
  emailNotifications: boolean;
}

interface PrivacySettings {
  profileVisibility: "public" | "recruiters" | "hidden";
  resumeVisible: boolean;
  showContactInfo: boolean;
  allowRecruiterContact: boolean;
}

interface JobPreferences {
  workMode: "remote" | "hybrid" | "onsite";
  salaryMin: number;
  salaryMax: number;
  showVerifiedOnly: boolean;
  enableJobAlerts: boolean;
}

interface MatchPreferences {
  minMatchScore: number;
  hideRejectedJobs: boolean;
}

// ─── Helper Components ────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
        checked ? "bg-red-600" : "bg-gray-200"
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionCard({ title, description, children }: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function DangerButton({ label, icon: Icon, onClick }: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-150"
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

function ConfirmDialog({ title, message, onConfirm, onCancel }: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
      type === "success"
        ? "bg-white border-green-200 text-green-700"
        : "bg-white border-red-200 text-red-700"
    }`}>
      {type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "account",          label: "Account",          icon: User        },
  { id: "notifications",    label: "Notifications",    icon: Bell        },
  { id: "privacy",          label: "Privacy",          icon: Shield      },
  { id: "job-preferences",  label: "Job Preferences",  icon: Briefcase   },
  { id: "match-preferences",label: "Match Preferences",icon: Zap         },
  { id: "security",         label: "Security",         icon: Lock        },
  { id: "appearance",       label: "Appearance",       icon: Palette     },
  { id: "support",          label: "Support",          icon: HelpCircle  },
];

// ─── Mock Sessions ────────────────────────────────────────────────────────────

const MOCK_SESSIONS = [
  { id: "1", device: "Chrome on Windows", icon: Monitor,    lastActive: "Active now",      current: true  },
  { id: "2", device: "Edge on Windows",   icon: Globe,      lastActive: "2 hours ago",     current: false },
  { id: "3", device: "Android Device",    icon: Smartphone, lastActive: "Yesterday, 9:41 PM", current: false },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Settings() {
  const [activeSection, setActiveSection] = useState<Section>("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Confirm dialog
  const [confirm, setConfirm] = useState<{
    title: string; message: string; onConfirm: () => void;
  } | null>(null);

  // Account
  const [email] = useState("priya.sharma@example.com");

  // Notifications
  const [notifications, setNotifications] = useState<NotificationToggles>({
    newJobRecommendations: true,
    newMatchNotifications: true,
    recruiterMessages: false,
    interviewInvitations: true,
    applicationStatusUpdates: true,
    weeklyJobAlerts: false,
    emailNotifications: true,
  });
  const toggleNotification = (key: keyof NotificationToggles) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  // Privacy
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "recruiters",
    resumeVisible: true,
    showContactInfo: false,
    allowRecruiterContact: true,
  });

  // Job Preferences
  const [jobPrefs, setJobPrefs] = useState<JobPreferences>({
    workMode: "hybrid",
    salaryMin: 8,
    salaryMax: 25,
    showVerifiedOnly: true,
    enableJobAlerts: true,
  });

  // Match Preferences
  const [matchPrefs, setMatchPrefs] = useState<MatchPreferences>({
    minMatchScore: 65,
    hideRejectedJobs: true,
  });

  // Sessions
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  // Appearance
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  const navigate = useNavigate();
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  navigate('/login', { replace: true });
};

  // ── Render sections ─────────────────────────────────────────────────────────

  const renderAccount = () => (
    <div className="space-y-4">
      <SectionCard title="Email Address" description="Your login email address">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Mail size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{email}</p>
              <p className="text-xs text-gray-400">Verified</p>
            </div>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Change
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Password" description="Update your account password">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
              <Key size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Password</p>
              <p className="text-xs text-gray-400">Last changed 3 months ago</p>
            </div>
          </div>
          <button
            onClick={() => showToast("Password reset email sent!")}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Change Password
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Sessions" description="Manage your active sessions">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Log out from all devices except this one.
          </p>
          <button
            onClick={() =>
              setConfirm({
                title: "Logout from all devices?",
                message: "You'll be signed out from all other active sessions. This action cannot be undone.",
                onConfirm: async () => { setConfirm(null); await logout(); navigate('/login', { replace: true }); },
              })
            }
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 whitespace-nowrap transition-all"
          >
            <span className="flex items-center gap-2"><LogOut size={14} /> Logout All</span>
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Danger Zone" description="Irreversible account actions">
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
          <div>
            <p className="text-sm font-medium text-gray-800">Delete Account</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Permanently delete your TalentFace account and all data.
            </p>
          </div>
          <DangerButton
            label="Delete Account"
            icon={Trash2}
            onClick={() =>
              setConfirm({
                title: "Delete your account?",
                message: "This will permanently delete your TalentFace account, profile, matches, and all associated data. This cannot be undone.",
                onConfirm: () => { setConfirm(null); showToast("Account deletion requested", "error"); },
              })
            }
          />
        </div>
      </SectionCard>
    </div>
  );

  const renderNotifications = () => {
    const items: { key: keyof NotificationToggles; label: string; desc: string; icon: React.ElementType }[] = [
      { key: "newJobRecommendations",   label: "New Job Recommendations",   desc: "Get notified when new jobs match your profile",      icon: Briefcase    },
      { key: "newMatchNotifications",   label: "New Match Notifications",   desc: "Alerts when you get a new job match",               icon: Zap          },
      { key: "recruiterMessages",       label: "Recruiter Messages",        desc: "Messages from recruiters and hiring managers",      icon: MessageSquare},
      { key: "interviewInvitations",    label: "Interview Invitations",     desc: "When a company invites you for an interview",       icon: Volume2      },
      { key: "applicationStatusUpdates",label: "Application Status Updates",desc: "Track the progress of your job applications",       icon: CheckCircle  },
      { key: "weeklyJobAlerts",         label: "Weekly Job Alerts",         desc: "A weekly digest of new relevant opportunities",     icon: Bell         },
      { key: "emailNotifications",      label: "Email Notifications",       desc: "Receive all notifications via email as well",       icon: Mail         },
    ];
    return (
      <SectionCard title="Notification Preferences" description="Choose what you want to be notified about">
        <div className="divide-y divide-gray-50">
          {items.map(({ key, label, desc, icon: Icon }) => (
            <div key={key} className="py-4 first:pt-0 last:pb-0">
              <SettingRow label={label} description={desc}>
                <Toggle checked={notifications[key]} onChange={() => toggleNotification(key)} />
              </SettingRow>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  };

  const renderPrivacy = () => (
    <div className="space-y-4">
      <SectionCard title="Profile Visibility" description="Control who can see your profile">
        <div className="space-y-3">
          {(["public", "recruiters", "hidden"] as const).map(option => {
            const config = {
              public:     { label: "Public",          desc: "Anyone can view your profile",              icon: Globe   },
              recruiters: { label: "Recruiters Only", desc: "Only verified recruiters can view",         icon: Eye     },
              hidden:     { label: "Hidden",           desc: "Profile not visible in searches",           icon: EyeOff  },
            }[option];
            const isSelected = privacy.profileVisibility === option;
            return (
              <label
                key={option}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-red-500 bg-red-50"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={isSelected}
                  onChange={() => setPrivacy(p => ({ ...p, profileVisibility: option }))}
                  className="sr-only"
                />
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? "bg-red-100" : "bg-gray-100"}`}>
                  <config.icon size={16} className={isSelected ? "text-red-600" : "text-gray-500"} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isSelected ? "text-red-700" : "text-gray-800"}`}>{config.label}</p>
                  <p className="text-xs text-gray-400">{config.desc}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-red-500" : "border-gray-300"}`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-red-500" />}
                </div>
              </label>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Data Sharing" description="Control how your information is shared">
        <div className="divide-y divide-gray-50">
          {([
            { key: "resumeVisible",        label: "Resume Visible to Recruiters", desc: "Allow recruiters to download your resume"         },
            { key: "showContactInfo",       label: "Show Contact Information",     desc: "Display email and phone to verified recruiters"   },
            { key: "allowRecruiterContact", label: "Allow Recruiters to Contact Me",desc: "Let recruiters reach out directly via platform"  },
          ] as { key: keyof PrivacySettings; label: string; desc: string }[]).map(({ key, label, desc }) => (
            <div key={key} className="py-4 first:pt-0 last:pb-0">
              <SettingRow label={label} description={desc}>
                <Toggle
                  checked={privacy[key] as boolean}
                  onChange={() => setPrivacy(p => ({ ...p, [key]: !p[key] }))}
                />
              </SettingRow>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderJobPreferences = () => (
    <div className="space-y-4">
      <SectionCard title="Work Mode" description="Your preferred work arrangement">
        <div className="grid grid-cols-3 gap-3">
          {(["remote", "hybrid", "onsite"] as const).map(mode => {
            const config = {
              remote: { label: "Remote",  icon: Wifi     },
              hybrid: { label: "Hybrid",  icon: Shuffle  },
              onsite: { label: "Onsite",  icon: Building2 },
            }[mode];
            const isSelected = jobPrefs.workMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setJobPrefs(p => ({ ...p, workMode: mode }))}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-red-500 bg-red-50"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-red-100" : "bg-gray-100"}`}>
                  <config.icon size={18} className={isSelected ? "text-red-600" : "text-gray-500"} />
                </div>
                <span className={`text-sm font-medium ${isSelected ? "text-red-700" : "text-gray-700"}`}>{config.label}</span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Salary Preference" description="Set your expected annual compensation range">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">₹{jobPrefs.salaryMin}</div>
              <div className="text-xs text-gray-400 mt-0.5">Minimum</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="relative">
                <div className="h-1.5 bg-gray-100 rounded-full" />
                <div
                  className="absolute top-0 h-1.5 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all"
                  style={{
                    left: `${(jobPrefs.salaryMin / 50) * 100}%`,
                    right: `${100 - (jobPrefs.salaryMax / 50) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">₹{jobPrefs.salaryMax}</div>
              <div className="text-xs text-gray-400 mt-0.5">Maximum LPA</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Minimum: ₹{jobPrefs.salaryMin} LPA</label>
              <input
                type="range" min={0} max={50} value={jobPrefs.salaryMin}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val < jobPrefs.salaryMax) setJobPrefs(p => ({ ...p, salaryMin: val }));
                }}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-red-600"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Maximum: ₹{jobPrefs.salaryMax} LPA</label>
              <input
                type="range" min={0} max={50} value={jobPrefs.salaryMax}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val > jobPrefs.salaryMin) setJobPrefs(p => ({ ...p, salaryMax: val }));
                }}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-red-600"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Job Filters">
        <div className="divide-y divide-gray-50">
          {([
            { key: "showVerifiedOnly", label: "Show Only Verified Companies",   desc: "Filter out unverified employers"                  },
            { key: "enableJobAlerts",  label: "Enable Job Alerts",              desc: "Get instant alerts for matching new jobs"         },
          ] as { key: keyof JobPreferences; label: string; desc: string }[]).map(({ key, label, desc }) => (
            <div key={key} className="py-4 first:pt-0 last:pb-0">
              <SettingRow label={label} description={desc}>
                <Toggle
                  checked={jobPrefs[key] as boolean}
                  onChange={() => setJobPrefs(p => ({ ...p, [key]: !p[key] }))}
                />
              </SettingRow>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderMatchPreferences = () => (
    <div className="space-y-4">
      <SectionCard title="Minimum Match Score" description="Only show jobs that meet this compatibility threshold">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range" min={0} max={100} value={matchPrefs.minMatchScore}
                onChange={e => setMatchPrefs(p => ({ ...p, minMatchScore: Number(e.target.value) }))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-red-600"
              />
            </div>
            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold text-lg flex-shrink-0 ${
              matchPrefs.minMatchScore >= 80 ? "bg-green-500" :
              matchPrefs.minMatchScore >= 60 ? "bg-blue-500" :
              matchPrefs.minMatchScore >= 40 ? "bg-amber-500" : "bg-red-500"
            }`}>
              {matchPrefs.minMatchScore}
              <span className="text-xs font-normal opacity-80">%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>0% — Show all</span>
            <span>100% — Perfect only</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Feed Settings">
        <SettingRow label="Hide Rejected Jobs" description="Remove jobs you've previously rejected from your feed">
          <Toggle
            checked={matchPrefs.hideRejectedJobs}
            onChange={() => setMatchPrefs(p => ({ ...p, hideRejectedJobs: !p.hideRejectedJobs }))}
          />
        </SettingRow>
      </SectionCard>

      <SectionCard title="Reset" description="Clear your personalized data">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              label: "Reset Recommendations",
              desc: "Recalibrate your job feed from scratch",
              icon: Sliders,
              action: () => setConfirm({
                title: "Reset recommendations?",
                message: "Your personalized job recommendations will be cleared and rebuilt based on your current profile. This may take up to 24 hours.",
                onConfirm: () => { setConfirm(null); showToast("Recommendations reset successfully"); },
              }),
            },
            {
              label: "Reset Swipe History",
              desc: "Clear all your job swipe decisions",
              icon: RotateCcw,
              action: () => setConfirm({
                title: "Reset swipe history?",
                message: "All your swiped jobs (liked and rejected) will be cleared. Jobs you rejected will reappear in your feed.",
                onConfirm: () => { setConfirm(null); showToast("Swipe history cleared"); },
              }),
            },
          ].map(({ label, desc, icon: Icon, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0">
                <Icon size={16} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-4">
      <SectionCard title="Active Sessions" description="Devices currently signed in to your account">
        <div className="space-y-3">
          {sessions.map(session => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  session.current ? "border-green-200 bg-green-50" : "border-gray-100"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  session.current ? "bg-green-100" : "bg-gray-100"
                }`}>
                  <Icon size={18} className={session.current ? "text-green-600" : "text-gray-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{session.device}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {session.current ? (
                      <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        {session.lastActive}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">{session.lastActive}</span>
                    )}
                  </div>
                </div>
                {!session.current && (
                  <button
                    onClick={() =>
                      setConfirm({
                        title: "Remove session?",
                        message: `This will sign out "${session.device}" from your account immediately.`,
                        onConfirm: () => {
                          setSessions(s => s.filter(x => x.id !== session.id));
                          setConfirm(null);
                          showToast("Session removed");
                        },
                      })
                    }
                    className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Authenticator App</p>
            <p className="text-xs text-gray-400 mt-0.5">Use an app like Google Authenticator for 2FA</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              Coming Soon
            </span>
            <button
              disabled
              className="px-4 py-2 text-sm font-medium text-gray-400 border border-gray-200 rounded-xl cursor-not-allowed opacity-60"
            >
              Enable 2FA
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const renderAppearance = () => (
    <SectionCard title="Theme" description="Choose how TalentFace looks to you">
      <div className="grid grid-cols-3 gap-3">
        {(["light", "dark", "system"] as const).map(t => {
          const config = {
            light:  { label: "Light",  icon: Sun,    preview: "bg-white border-gray-200"                         },
            dark:   { label: "Dark",   icon: Moon,   preview: "bg-gray-900 border-gray-700"                      },
            system: { label: "System", icon: Laptop, preview: "bg-gradient-to-br from-white to-gray-900 border-gray-300" },
          }[t];
          const isSelected = theme === t;
          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-all ${
                isSelected ? "border-red-500 bg-red-50" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className={`w-full aspect-video rounded-lg border-2 ${config.preview}`} />
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${isSelected ? "text-red-700" : "text-gray-700"}`}>
                  {config.label}
                </span>
                <config.icon size={14} className={isSelected ? "text-red-500" : "text-gray-400"} />
              </div>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );

  const renderSupport = () => (
    <div className="space-y-3">
      {[
        { icon: MessageSquare, label: "Contact Support",    desc: "Get help from our support team",          color: "blue",   href: "#" },
        { icon: Bug,           label: "Report a Bug",       desc: "Help us improve by reporting issues",     color: "amber",  href: "#" },
        { icon: FileText,      label: "Privacy Policy",     desc: "Read our privacy and data practices",     color: "gray",   href: "#" },
        { icon: FileText,      label: "Terms & Conditions", desc: "Review our terms of service",             color: "gray",   href: "#" },
        { icon: Info,          label: "About TalentFace",   desc: "Version 2.4.1 · Build #20260603",         color: "red",    href: "#" },
      ].map(({ icon: Icon, label, desc, color, href }) => (
        <a
          key={label}
          href={href}
          className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            color === "blue"  ? "bg-blue-50"  :
            color === "amber" ? "bg-amber-50" :
            color === "red"   ? "bg-red-50"   : "bg-gray-50"
          }`}>
            <Icon size={18} className={
              color === "blue"  ? "text-blue-600"  :
              color === "amber" ? "text-amber-600" :
              color === "red"   ? "text-red-600"   : "text-gray-500"
            } />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </a>
      ))}
    </div>
  );

  const SECTION_CONTENT: Record<Section, () => React.ReactNode> = {
    "account":           renderAccount,
    "notifications":     renderNotifications,
    "privacy":           renderPrivacy,
    "job-preferences":   renderJobPreferences,
    "match-preferences": renderMatchPreferences,
    "security":          renderSecurity,
    "appearance":        renderAppearance,
    "support":           renderSupport,
  };

  const currentNav = NAV_ITEMS.find(n => n.id === activeSection)!;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <div className="w-5 space-y-1">
                <div className="h-0.5 bg-gray-600 rounded" />
                <div className="h-0.5 bg-gray-600 rounded w-3" />
                <div className="h-0.5 bg-gray-600 rounded" />
              </div>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <span className="text-white text-xs font-bold">TF</span>
              </div>
              <span className="font-bold text-gray-900 text-sm hidden sm:block">TalentFace</span>
              <span className="text-gray-300 hidden sm:block">/</span>
              <span className="text-sm text-gray-600 hidden sm:block">Settings</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">PS</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 relative">

          {/* Sidebar overlay (mobile) */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed lg:static top-14 left-0 z-20 h-[calc(100vh-3.5rem)] lg:h-auto
            w-64 lg:w-56 xl:w-60 flex-shrink-0
            bg-white lg:bg-transparent border-r lg:border-0 border-gray-100
            overflow-y-auto transition-transform duration-200 ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            <div className="p-4 lg:p-0 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3 hidden lg:block">Settings</p>
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? "bg-red-50 text-red-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-red-600" : "text-gray-400"} />
                    {label}
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Section header */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                  <currentNav.icon size={18} className="text-red-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{currentNav.label}</h1>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {{
                      account:           "Manage your account credentials and data",
                      notifications:     "Control how and when you receive alerts",
                      privacy:           "Manage your profile visibility and data sharing",
                      "job-preferences": "Set your ideal job criteria and filters",
                      "match-preferences":"Configure your job matching algorithm",
                      security:          "Monitor sessions and authentication settings",
                      appearance:        "Customize the look and feel of TalentFace",
                      support:           "Get help or learn more about TalentFace",
                    }[activeSection]}
                  </p>
                </div>
              </div>
            </div>

            {/* Section content */}
            <div>{SECTION_CONTENT[activeSection]()}</div>
          </main>
        </div>
      </div>

      {/* Confirm Dialog */}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}