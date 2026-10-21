export default function JobDeckBanner({ onEnter }: { onEnter: () => void }) {
    return (
         <div style={{
                background: "linear-gradient(120deg, #0D1B3E 0%, #1C3FA8 55%, #D62B2B 100%)",
                borderRadius: 10,
                padding: "16px 24px",
                marginBottom: 20,
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