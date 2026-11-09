import { useEffect, useState, type ReactNode } from "react";

export type BannerSlide = {
    id: string;
    content: ReactNode;
    onClick?: () => void; // optional: makes the whole slide clickable
};

export default function BannerCarousel({ slides, interval = 5000 }: { slides: BannerSlide[]; interval?: number }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const count = slides.length;

    useEffect(() => {
        if (paused || count < 2) return;
        const t = setInterval(() => setIndex((i) => (i + 1) % count), interval);
        return () => clearInterval(t);
    }, [paused, count, interval]);

    const go = (i: number) => setIndex((i + count) % count);

    const arrow = (side: "left" | "right", label: string, to: number) => (
        <button
            onClick={() => go(to)}
            aria-label={label}
            style={{
                position: "absolute", top: "50%", [side]: 8, transform: "translateY(-50%)", zIndex: 2,
                width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer",
                background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 14,
            }}
        >
            {side === "left" ? "‹" : "›"}
        </button>
    );

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ position: "relative", overflow: "hidden", borderRadius: 10, marginBottom: 20 }}
        >
            <div style={{ display: "flex", transition: "transform 0.5s ease", transform: `translateX(-${index * 100}%)` }}>
                {slides.map((s) => (
                    <div
                        key={s.id}
                        onClick={s.onClick}
                        style={{ minWidth: "100%", cursor: s.onClick ? "pointer" : "default" }}
                    >
                        {s.content}
                    </div>
                ))}
            </div>

            {count > 1 && (
                <>
                    {arrow("left", "Previous", index - 1)}
                    {arrow("right", "Next", index + 1)}
                    <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 2 }}>
                        {slides.map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => go(i)}
                                aria-label={`Slide ${i + 1}`}
                                style={{
                                    width: i === index ? 18 : 6, height: 6, borderRadius: 3, border: "none", padding: 0, cursor: "pointer",
                                    background: i === index ? "#fff" : "rgba(255,255,255,0.4)", transition: "all 0.3s",
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}