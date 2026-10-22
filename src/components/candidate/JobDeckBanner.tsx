import { useNavigate } from "react-router-dom";
import BannerCarousel from "../common/BannerCarousel";
import PromoBanner from "../common/PromoBanner";
import { DASHBOARD_LINKS } from "../../constants/candidateHome.constants";

export default function JobDeckBanner({ onEnter }: { onEnter: () => void }) {
    return (
         <div style={{
                background: "linear-gradient(120deg, #0D1B3E 0%, #1C3FA8 55%, #D62B2B 100%)",
                borderRadius: 10,
                padding: "16px 24px",
                //marginBottom: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                position: "relative",
                overflow: "hidden",
            }}>
            
                {/* Decorative circles */}
                <div style={{ position: "absolute", top: -30, right: 180, width: 120, height: 120, borderRadius: "50%", border: "24px solid rgba(255,255,255,0.07)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -40, right: 60, width: 160, height: 160, borderRadius: "50%", border: "32px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />

                {/* Left: text */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>🃏</span>
                        <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                            textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
                            background: "rgba(255,255,255,0.1)", padding: "2px 10px",
                            borderRadius: 20, border: "1px solid rgba(255,255,255,0.15)",
                        }}>
                            AI-Powered · New
                        </span>
                    </div>
                    <h2 style={{
                        fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700,
                        color: "#fff", lineHeight: 1.2, marginBottom: 6,
                    }}>
                        Your personalised Job Deck
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", maxWidth: 560, lineHeight: 1.6 }}>
                        Swipe through jobs ranked by your skills, experience and location.
                        Right swipe to apply — left swipe to skip. Matches appear when a recruiter likes you back.
                    </p>

                    {/* Mini feature pills */}
                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                        {["⚡ Ranked by AI match score", "🎯 Tailored to your profile", "🤝 Mutual matching"].map((pill) => (
                            <span key={pill} style={{
                                fontSize: 11, color: "rgba(255,255,255,0.75)",
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                padding: "3px 10px", borderRadius: 20, fontWeight: 500,
                            }}>
                                {pill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: CTA */}
                <div style={{ position: "relative", zIndex: 1, flexShrink: 0, textAlign: "center" }}>
                    <button className="deck-cta" onClick={onEnter}>
                        Open Job Deck →
                    </button>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
                        Swipe right to apply instantly
                    </p>
                </div>
            </div>
    );
}
// ── Extra slides: add a new entry here to add a new slide ──
// `label` must match the label in DASHBOARD_LINKS (it's used to find the route)
const PROMO_SLIDES = [
    {
        id: "dashboard", label: "My Dashboard",
        icon: "🏠", badge: "Overview", title: "Your dashboard at a glance",
        description: "Track your profile strength, applications and activity in one place.",
        pills: ["📊 Activity overview", "✅ Profile progress", "📌 Quick actions"],
        ctaText: "Open Dashboard →", hint: "See everything in one view",
        gradient: "linear-gradient(120deg, #0D1B3E 0%, #1C3FA8 55%, #2E8BC0 100%)",
    },
    {
        id: "resume", label: "My Resume",
        icon: "📄", badge: "Resume", title: "Keep your resume sharp",
        description: "A complete, up-to-date resume helps you rank higher and get noticed by recruiters.",
        pills: ["✏️ Easy to edit", "📈 Better matches", "👀 Get noticed"],
        ctaText: "Open My Resume →", hint: "Update anytime",
        gradient: "linear-gradient(120deg, #0D1B3E 0%, #5B2A86 55%, #D62B2B 100%)",
    },
    {
        id: "applications", label: "Applications",
        icon: "📬", badge: "Applications", title: "Track your applications",
        description: "See where each application stands and never lose track of a role you applied to.",
        pills: ["🔎 Status tracking", "🗂️ All in one list", "⏱️ Stay on top"],
        ctaText: "View Applications →", hint: "Check your latest status",
        gradient: "linear-gradient(120deg, #0D1B3E 0%, #0F766E 55%, #1C3FA8 100%)",
    },
    {
        id: "notifications", label: "Notifications",
        icon: "🔔", badge: "Notifications", title: "Never miss an update",
        description: "Get notified when a recruiter views, likes or responds to your application.",
        pills: ["🤝 Recruiter matches", "📣 Instant alerts", "💬 Responses"],
        ctaText: "Open Notifications →", hint: "Stay in the loop",
        gradient: "linear-gradient(120deg, #0D1B3E 0%, #B45309 55%, #D62B2B 100%)",
    },
];

export function HomeBanners() {
    const navigate = useNavigate();
    const goTo = (label: string) => {
        const href = DASHBOARD_LINKS.find((l) => l.label === label)?.href;
        if (href) navigate(href);
    };

    return (
        <BannerCarousel
            slides={[
                { id: "jobdeck", content: <JobDeckBanner onEnter={() => navigate("/candidate/swipe")} /> },
                ...PROMO_SLIDES.map(({ id, label, ...props }) => ({
                    id,
                    content: <PromoBanner {...props} onClick={() => goTo(label)} />,
                })),
            ]}
        />
    );
}