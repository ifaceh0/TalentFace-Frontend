import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { DASHBOARD_LINKS } from "../../constants/candidateHome.constants";
import type { CandidateProfile } from "../../types/candidate.types";
import { resetUnreadCount } from "../../hooks/useUnreadNotifications";

interface Props {
    profile: CandidateProfile | null;
    completion: number;
    appliedCount: number;
    savedCount: number;
}

export default function ProfileMenu({ profile, completion, appliedCount, savedCount }: Props) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click and on Esc (only listens while open)
    useEffect(() => {
        if (!open) return;
        const onMouseDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const handleLogout = async () => {
       
        await logout();
        navigate("/login", { replace: true });
        resetUnreadCount();
    };

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={open}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F5FF", border: "1.5px solid #C7D2F8", borderRadius: 40, padding: "4px 14px 4px 4px", cursor: "pointer" }}
            >
                <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, overflow: "hidden" }}>
                    {profile?.profilePhoto
                        ? <img src={profile.profilePhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : (profile?.initials ?? "?")}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                    {profile?.name?.split(" ")[0] ?? "…"}
                </span>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>

            {open && (
                <div
                    role="menu"
                    style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 256, background: "#FFFFFF", border: "1.5px solid #E5E7EB", borderRadius: 16, padding: 6, zIndex: 100, boxShadow: "0 24px 60px rgba(13,27,62,0.14)" }}
                >
                    {/* Header */}
                    <div style={{ padding: "12px 14px", borderBottom: "1px solid #E5E7EB", marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                            <div className="avatar" style={{ width: 40, height: 40, fontSize: 13, overflow: "hidden" }}>
                                {profile?.profilePhoto
                                    ? <img src={profile.profilePhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : (profile?.initials ?? "?")}
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{profile?.name ?? "Loading…"}</div>
                                <div style={{ fontSize: 11, color: "#6B7280" }}>{profile?.title ?? ""}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 5 }}>
                            Profile {completion}% complete
                        </div>
                        <div style={{ height: 4, background: "#F8FAFC", borderRadius: 99 }}>
                            <div style={{ height: "100%", width: `${completion}%`, background: "linear-gradient(90deg,#D62B2B,#1C3FA8)", borderRadius: 99 }} />
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "4px 6px", borderBottom: "1px solid #E5E7EB", marginBottom: 4 }}>
                        <div style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 8, padding: 8, textAlign: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#D62B2B" }}>{appliedCount}</div>
                            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>Applications</div>
                        </div>
                        <div style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 8, padding: 8, textAlign: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#1C3FA8" }}>{savedCount}</div>
                            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>Saved Jobs</div>
                        </div>
                    </div>

                    {/* Dashboard links */}
                    {DASHBOARD_LINKS.map(({ icon, label, href }) => (
                        <button
                            key={label}
                            role="menuitem"
                            className="menu-item"
                            onClick={() => { setOpen(false); navigate(href); }}
                            style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "7px 10px", borderRadius: 8, color: "#0D1B3E", fontSize: 12, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.15s" }}
                        >
                            <span style={{ fontSize: 14 }}>{icon}</span>
                            <span style={{ flex: 1 }}>{label}</span>
                        </button>
                    ))}

                    <div style={{ borderTop: "1px solid #F0F4FF", marginTop: 3, paddingTop: 3 }}>
                        <button role="menuitem" className="logout-btn" onClick={handleLogout}>
                            <span style={{ fontSize: 14 }}>🚪</span> Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}