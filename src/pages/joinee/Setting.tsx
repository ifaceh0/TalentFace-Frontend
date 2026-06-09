import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getProfile, generate2FASecret, verify2FAToken, disable2FA } from '../../services/joinee.service';
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
  Building2,
  Wifi,
  Volume2,
  MapPin,
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
  workMode: "onsite" | "remote" | "remote-or-onsite" | "hybrid";
  salaryExpectation: number;
  salaryOpenToMore: boolean;
  currency: string;
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
  { id: "account",           label: "Account",           icon: User        },
  { id: "notifications",     label: "Notifications",     icon: Bell        },
  { id: "privacy",           label: "Privacy",           icon: Shield      },
  { id: "job-preferences",   label: "Job Preferences",   icon: Briefcase   },
  { id: "match-preferences", label: "Match Preferences", icon: Zap         },
  { id: "security",          label: "Security",          icon: Lock        },
  { id: "appearance",        label: "Appearance",        icon: Palette     },
  { id: "support",           label: "Support",           icon: HelpCircle  },
];

// ─── Mock Sessions ────────────────────────────────────────────────────────────

const MOCK_SESSIONS = [
  { id: "1", device: "Chrome on Windows", icon: Monitor,    lastActive: "Active now",         current: true  },
  { id: "2", device: "Edge on Windows",   icon: Globe,      lastActive: "2 hours ago",        current: false },
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
  const [email, setEmail] = useState("");

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
    workMode: "onsite",
    salaryExpectation: 0,
    salaryOpenToMore: false,
    currency: "INR",
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

const [twoFAEnabled, setTwoFAEnabled] = useState(false);
const [twoFAStep, setTwoFAStep] = useState<0 | 1 | 2 | 3>(0);
const [twoFACode, setTwoFACode] = useState("");
const [twoFAError, setTwoFAError] = useState("");
const [twoFALoading, setTwoFALoading] = useState(false);
const [twoFASecret, setTwoFASecret] = useState("");
const [twoFAQr, setTwoFAQr] = useState("");
const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
  getProfile().then(p => {
    setEmail(p.email ?? "");
    setTwoFAEnabled(p.twoFAEnabled ?? false);
  }).catch(() => {});
}, []);

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
                onConfirm: handleLogout,
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
      { key: "newJobRecommendations",    label: "New Job Recommendations",    desc: "Get notified when new jobs match your profile",     icon: Briefcase     },
      { key: "newMatchNotifications",    label: "New Match Notifications",    desc: "Alerts when you get a new job match",               icon: Zap           },
      { key: "recruiterMessages",        label: "Recruiter Messages",         desc: "Messages from recruiters and hiring managers",      icon: MessageSquare },
      { key: "interviewInvitations",     label: "Interview Invitations",      desc: "When a company invites you for an interview",       icon: Volume2       },
      { key: "applicationStatusUpdates", label: "Application Status Updates", desc: "Track the progress of your job applications",      icon: CheckCircle   },
      { key: "weeklyJobAlerts",          label: "Weekly Job Alerts",          desc: "A weekly digest of new relevant opportunities",    icon: Bell          },
      { key: "emailNotifications",       label: "Email Notifications",        desc: "Receive all notifications via email as well",      icon: Mail          },
    ];
    return (
      <SectionCard title="Notification Preferences" description="Choose what you want to be notified about">
        <div className="divide-y divide-gray-50">
          {items.map(({ key, label, desc }) => (
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
              public:     { label: "Public",           desc: "Anyone can view your profile",             icon: Globe  },
              recruiters: { label: "Recruiters Only",  desc: "Only verified recruiters can view",        icon: Eye    },
              hidden:     { label: "Hidden",           desc: "Profile not visible in searches",          icon: EyeOff },
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
            { key: "resumeVisible",        label: "Resume Visible to Recruiters",  desc: "Allow recruiters to download your resume"        },
            { key: "showContactInfo",       label: "Show Contact Information",      desc: "Display email and phone to verified recruiters"  },
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


 const renderJobPreferences = () => {
  const symbols: Record<string, string> = {
    INR: "₹", USD: "$", EUR: "€", GBP: "£",
    AED: "د.إ", SGD: "S$", AUD: "A$", CAD: "C$",
  };
  const sym = symbols[jobPrefs.currency] ?? "₹";
  const isINR = jobPrefs.currency === "INR";
  const sliderMax = isINR ? 999 : 500;
  const formatVal = (v: number) => {
    if (isINR) {
      if (v === 0) return "0 LPA";
      if (v <= 99) return `${v} LPA`;
      const cr = v / 100;
      if (Number.isInteger(cr)) return `${cr} Cr`;
      return `${cr.toFixed(1)} Cr`;
    }
    if (v === 0) return "0";
    return `${v}K/yr`;
  };
  const currentVal = jobPrefs.salaryExpectation;
  const displayLabel = jobPrefs.salaryOpenToMore
    ? `${sym}${formatVal(currentVal)} & above`
    : `${sym}${formatVal(currentVal)}`;

  return (
      <div className="space-y-4">
        {/* Work Mode */}
        <SectionCard title="Work Mode" description="Your preferred work arrangement">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["onsite", "remote", "remote-or-onsite", "hybrid"] as const).map(mode => {
              const config = {
                onsite:             { label: "Onsite",           icon: Building2 },
                remote:             { label: "Remote",           icon: Wifi      },
                "remote-or-onsite": { label: "Remote or Onsite", icon: MapPin    },
                hybrid:             { label: "Hybrid",           icon: Shuffle   },
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

        {/* Salary Preference */}
        <SectionCard title="Salary Preference" description="Set your expected annual compensation">
          <div className="space-y-5">
            {/* Currency Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-500 w-20 shrink-0">Currency</label>
              <select
                value={jobPrefs.currency}
                onChange={e => setJobPrefs(p => ({ ...p, currency: e.target.value }))}
                className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
              >
                <option value="INR">🇮🇳 INR — Indian Rupee</option>
                <option value="USD">🇺🇸 USD — US Dollar</option>
                <option value="EUR">🇪🇺 EUR — Euro</option>
                <option value="GBP">🇬🇧 GBP — British Pound</option>
                <option value="AED">🇦🇪 AED — UAE Dirham</option>
                <option value="SGD">🇸🇬 SGD — Singapore Dollar</option>
                <option value="AUD">🇦🇺 AUD — Australian Dollar</option>
                <option value="CAD">🇨🇦 CAD — Canadian Dollar</option>
              </select>
            </div>

            {/* Big value display */}
            <div className="flex flex-col items-center gap-1 py-3">
              <div className="text-3xl font-bold text-gray-900">{displayLabel}</div>
              {jobPrefs.salaryOpenToMore && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  Open to higher offers ✓
                </span>
              )}
            </div>

            <div className="flex justify-between text-xs text-gray-400">
              <span>0</span>
              <span>{isINR ? "50 LPA" : `${sym}125K`}</span>
              <span>{isINR ? "99 LPA" : `${sym}250K`}</span>
              <span>{isINR ? "5 Cr" : `${sym}375K`}</span>
              <span>{isINR ? "10 Cr+" : `${sym}500K+`}</span>
            </div>
            <input
              type="range"
              min={0}
              max={sliderMax}
              step={1}
              value={currentVal}
              onChange={e => setJobPrefs(p => ({ ...p, salaryExpectation: Number(e.target.value) }))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-red-600"
            />

            {/* Stepper buttons */}
            <div className="flex items-center justify-center">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setJobPrefs(p => ({ ...p, salaryExpectation: Math.max(0, p.salaryExpectation - 1) }))}
                  className="w-11 h-11 text-gray-600 hover:bg-red-50 hover:text-red-600 font-bold text-xl transition-all border-r border-gray-200"
                >−</button>
                <span className="px-6 text-sm font-semibold text-gray-800 min-w-[120px] text-center">
                  {displayLabel}
                </span>
                <button
                  onClick={() => setJobPrefs(p => ({ ...p, salaryExpectation: Math.min(sliderMax, p.salaryExpectation + 1) }))}
                  className="w-11 h-11 text-gray-600 hover:bg-red-50 hover:text-red-600 font-bold text-xl transition-all border-l border-gray-200"
                >+</button>
              </div>
            </div>

            {/* Open to more toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">Open to higher offers</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Show recruiters you're open to offers above {sym}{formatVal(currentVal)}
                </p>
              </div>
              <Toggle
                checked={jobPrefs.salaryOpenToMore}
                onChange={() => setJobPrefs(p => ({ ...p, salaryOpenToMore: !p.salaryOpenToMore }))}
              />
            </div>

            {/* Save button */}
            <button
              onClick={() => showToast("Salary preference saved!")}
              className="w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Save Salary Preference
            </button>
          </div>
         </SectionCard>

        {/* Other Job Settings */}
        <SectionCard title="Other Job Settings" description="Additional job feed controls">
          <div className="divide-y divide-gray-50">
            <div className="py-4 first:pt-0">
              <SettingRow label="Show Verified Companies Only" description="Only display jobs from companies verified by TalentFace">
                <Toggle
                  checked={jobPrefs.showVerifiedOnly}
                  onChange={() => setJobPrefs(p => ({ ...p, showVerifiedOnly: !p.showVerifiedOnly }))}
                />
              </SettingRow>
            </div>
            <div className="py-4 last:pb-0">
              <SettingRow label="Enable Job Alerts" description="Get notified when new matching jobs are posted">
                <Toggle
                  checked={jobPrefs.enableJobAlerts}
                  onChange={() => setJobPrefs(p => ({ ...p, enableJobAlerts: !p.enableJobAlerts }))}
                />
              </SettingRow>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  };

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
      {twoFAEnabled ? (
        <>
          <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <CheckCircle size={11} /> Enabled
          </span>
          <button
            onClick={() =>
              setConfirm({
                title: "Disable 2FA?",
                message: "Removing two-factor authentication will make your account less secure. Are you sure?",
                onConfirm: async () => {
                  try {
                    await disable2FA();
                    setTwoFAEnabled(false);
                    setTwoFASecret("");
                    setTwoFAQr("");
                    setBackupCodes([]);
                    setConfirm(null);
                    showToast("2FA disabled", "error");
                  } catch {
                    setConfirm(null);
                    showToast("Could not disable 2FA. Try again.", "error");
                  }
                },
              })
            }
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            Disable
          </button>
        </>
      ) : (
        <button
          disabled={twoFALoading}
          onClick={async () => {
            try {
              setTwoFALoading(true);
              const { secret, otpauthUrl } = await generate2FASecret();
              setTwoFASecret(secret);
              setTwoFAQr(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(otpauthUrl)}`);
              setTwoFAStep(1);
            } catch {
              showToast("Could not start 2FA setup. Try again.", "error");
            } finally {
              setTwoFALoading(false);
            }
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          {twoFALoading ? "Loading..." : "Enable 2FA"}
        </button>
      )}
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
            light:  { label: "Light",  icon: Sun,    preview: "bg-white border-gray-200"                              },
            dark:   { label: "Dark",   icon: Moon,   preview: "bg-gray-900 border-gray-700"                           },
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
        { icon: MessageSquare, label: "Contact Support",    desc: "Get help from our support team",         color: "blue",  href: "#" },
        { icon: Bug,           label: "Report a Bug",       desc: "Help us improve by reporting issues",    color: "amber", href: "#" },
        { icon: FileText,      label: "Privacy Policy",     desc: "Read our privacy and data practices",    color: "gray",  href: "#" },
        { icon: FileText,      label: "Terms & Conditions", desc: "Review our terms of service",            color: "gray",  href: "#" },
        { icon: Info,          label: "About TalentFace",   desc: "Version 2.4.1 · Build #20260603",        color: "red",   href: "#" },
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
const renderTwoFAModal = () => {
  if (twoFAStep === 0) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full border border-gray-100">

        {/* Step 1 — Scan QR */}
        {twoFAStep === 1 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Set up Authenticator</h3>
              <button onClick={() => { setTwoFAStep(0); setTwoFACode(""); setTwoFAError(""); }}>
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Scan this QR code with <span className="font-medium text-gray-700">Google Authenticator</span> or any TOTP app.
            </p>
            <div className="flex justify-center mb-4">
              <img src={twoFAQr} alt="2FA QR Code" className="w-44 h-44 rounded-xl border border-gray-100 p-2" />
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 text-center">
              <p className="text-xs text-gray-400 mb-1">Can't scan? Enter this key manually</p>
              <p className="text-sm font-mono font-bold text-gray-800 tracking-widest">{twoFASecret}</p>
            </div>
            <button
              onClick={() => setTwoFAStep(2)}
              className="w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Next — Enter Code
            </button>
          </>
        )}

        {/* Step 2 — Enter OTP */}
        {twoFAStep === 2 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Verify Your Code</h3>
              <button onClick={() => { setTwoFAStep(0); setTwoFACode(""); setTwoFAError(""); }}>
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Enter the <span className="font-medium text-gray-700">6-digit code</span> currently shown in your authenticator app.
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={twoFACode}
              onChange={e => { setTwoFACode(e.target.value.replace(/\D/g, "")); setTwoFAError(""); }}
              placeholder="000000"
              className={`w-full text-center text-2xl font-mono font-bold tracking-[0.5em] border-2 rounded-xl px-4 py-3 mb-1 focus:outline-none transition-colors ${
                twoFAError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-red-400"
              }`}
            />
            {twoFAError && <p className="text-xs text-red-500 text-center mb-3">{twoFAError}</p>}
            {!twoFAError && <div className="mb-3" />}
            <div className="flex gap-3">
              <button
                onClick={() => setTwoFAStep(1)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={async () => {
                  if (twoFACode.length !== 6) { setTwoFAError("Please enter a 6-digit code."); return; }
                  try {
                    setTwoFALoading(true);
                    const { verified, backupCodes: codes } = await verify2FAToken(twoFACode);
                    if (verified) {
                      setTwoFAEnabled(true);
                      setBackupCodes(codes ?? []);
                      setTwoFAStep(3);
                      setTwoFAError("");
                    } else {
                      setTwoFAError("Incorrect code. Please try again.");
                    }
                  } catch {
                    setTwoFAError("Verification failed. Please try again.");
                  } finally {
                    setTwoFALoading(false);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                {twoFALoading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </>
        )}

        {/* Step 3 — Success */}
        {twoFAStep === 3 && (
          <>
            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-1">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">2FA Enabled!</h3>
              <p className="text-sm text-gray-500">
                Your account is now protected. Save these backup codes somewhere safe — each can be used once if you lose your phone.
              </p>
              {backupCodes.length > 0 && (
                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1">
                  <p className="text-xs font-semibold text-gray-500 mb-2 text-left">Backup Codes</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {backupCodes.map(code => (
                      <span key={code} className="font-mono text-xs text-gray-700 bg-white border border-gray-200 rounded-lg px-2 py-1 text-center tracking-widest">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => { setTwoFAStep(0); setTwoFACode(""); showToast("Two-factor authentication enabled!"); }}
                className="mt-3 w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
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
                      account:            "Manage your account credentials and data",
                      notifications:      "Control how and when you receive alerts",
                      privacy:            "Manage your profile visibility and data sharing",
                      "job-preferences":  "Set your ideal job criteria and filters",
                      "match-preferences":"Configure your job matching algorithm",
                      security:           "Monitor sessions and authentication settings",
                      appearance:         "Customize the look and feel of TalentFace",
                      support:            "Get help or learn more about TalentFace",
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
      {renderTwoFAModal()}
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