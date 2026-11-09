interface Props {
    icon: string;
    badge: string;
    title: string;
    description: string;
    pills: string[];
    ctaText: string;
    hint: string;
    gradient: string; // e.g. "linear-gradient(120deg, #0D1B3E 0%, #1C3FA8 55%, #D62B2B 100%)"
    onClick: () => void;
}

export default function PromoBanner({ icon, badge, title, description, pills, ctaText, hint, gradient, onClick }: Props) {
    return (
        <div onClick={onClick} style={{
            background: gradient, padding: "16px 24px 22px", display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: 16, position: "relative", overflow: "hidden",
        }}>
            <div style={{ position: "absolute", top: -30, right: 180, width: 120, height: 120, borderRadius: "50%", border: "24px solid rgba(255,255,255,0.07)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -40, right: 60, width: 160, height: 160, borderRadius: "50%", border: "32px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                        color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.1)",
                        padding: "2px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.15)",
                    }}>{badge}</span>
                </div>
                <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 6 }}>{title}</h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", maxWidth: 560, lineHeight: 1.6 }}>{description}</p>
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    {pills.map((pill) => (
                        <span key={pill} style={{
                            fontSize: 11, color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: 20, fontWeight: 500,
                        }}>{pill}</span>
                    ))}
                </div>
            </div>

            <div style={{ position: "relative", zIndex: 1, flexShrink: 0, textAlign: "center" }}>
                <button className="deck-cta">{ctaText}</button>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>{hint}</p>
            </div>
        </div>
    );
}