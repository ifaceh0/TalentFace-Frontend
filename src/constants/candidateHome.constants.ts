export const NAV_LINKS = [
    { label: "Browse Jobs", href: "/candidate/browse" },
    { label: "Saved",       href: "/candidate/saved" },
];

export const DASHBOARD_LINKS = [
    { icon: "🏠", label: "My Dashboard",  href: "/candidate/dashboard" },
    { icon: "📄", label: "My Resume",     href: "/candidate/dashboard?section=resume" },
    { icon: "📬", label: "Applied Jobs",  href: "/candidate/applications" },
    { icon: "🔔", label: "Notifications", href: "/candidate/notifications" },
    { icon: "⚙️", label: "Settings",      href: "/candidate/setting" },
];

export const TYPE_OPTIONS = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
];

export const WORK_MODE_OPTIONS = [
    { value: "onsite", label: "On-site" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
];

export const EXPERIENCE_OPTIONS = [
    { value: "Entry", label: "Entry" },
    { value: "Mid", label: "Mid" },
    { value: "Senior", label: "Senior" },
    { value: "Lead", label: "Lead" },
];

export const SALARY_CURRENCIES = ["INR", "USD", "EUR", "GBP"];

// Full ANNUAL amounts
export const SALARY_PRESETS: Record<string, number[]> = {
    INR: [500000, 1000000, 2000000, 4000000],
    USD: [50000, 100000, 150000, 200000],
    EUR: [40000, 80000, 120000, 160000],
    GBP: [40000, 80000, 120000, 160000],
};