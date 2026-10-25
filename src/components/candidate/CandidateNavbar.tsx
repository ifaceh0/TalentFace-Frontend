import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { NAV_LINKS } from "../../constants/candidateHome.constants";
import type { CandidateProfile } from "../../types/candidate.types";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications"

interface Props {
    profile: CandidateProfile | null;
    completion: number;
    appliedCount: number;
    savedCount: number;
     
}

export default function CandidateNavbar({ profile, completion, appliedCount, savedCount }: Props) {
    const navigate = useNavigate();
    const unreadCount = useUnreadNotifications();

    return (
        <nav style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 32px", height: 62, borderBottom: "2px solid #E5E7EB",
            background: "#ffffff", position: "sticky", top: 0, zIndex: 50,
            boxShadow: "0 2px 12px rgba(13,27,62,0.06)",
        }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#D62B2B,#1C3FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>CAN</div>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px", color: "#111827" }}>Candidate</span>
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {NAV_LINKS.map(({ label, href }) => (
                    <button
                        key={label}
                        onClick={() => navigate(href)}
                        className="nav-link"
                        style={{
                            color: "#4A5568", fontSize: 13, fontWeight: 500,
                            padding: "6px 14px", borderRadius: 7, cursor: "pointer",
                            transition: "color 0.15s", background: "none",
                            border: "none", fontFamily: "inherit",
                        }}
                    >
                        {label}
                    </button>
                ))}
                <button
                    onClick={() => navigate("/candidate/swipe")}
                    className="nav-link"
                    style={{
                        color: "#D62B2B", fontSize: 13, fontWeight: 600,
                        padding: "6px 14px", borderRadius: 7, cursor: "pointer",
                        background: "#FFF5F5", border: "1px solid #FECDD3",
                        fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
                    }}
                >
                    🃏 Job Deck
                </button>
            </div>

            <div className="tf-nav-actions">
                <button
                    className="tf-bell"
                    onClick={() => navigate("/candidate/notifications")}
                    aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                    title="Notifications"
                >
                    🔔
                    {unreadCount > 0 && (
                        <span className="tf-bell-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
                    )}
                </button>

                <ProfileMenu
                    profile={profile}
                    completion={completion}
                    appliedCount={appliedCount}
                    savedCount={savedCount}
                />
            </div>
        </nav>
    );
}