import { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  disabled?: boolean;
}

export type SwipeDirection = "left" | "right" | null;

// ─── Constants ────────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 100;  // px before registering a swipe
const ROTATION_FACTOR = 0.08; // how much card rotates per px dragged
const MAX_ROTATION    = 18;   // degrees cap

// ─── Hook: drag logic ─────────────────────────────────────────────────────────

export function useSwipeDrag(onLeft: () => void, onRight: () => void, disabled = false) {
  const [dragging, setDragging]     = useState(false);
  const [offsetX, setOffsetX]       = useState(0);
  const [offsetY, setOffsetY]       = useState(0);
  const [direction, setDirection]   = useState<SwipeDirection>(null);
  const startX = useRef(0);
  const startY = useRef(0);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (disabled) return;
    startX.current = clientX;
    startY.current = clientY;
    setDragging(true);
  }, [disabled]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragging || disabled) return;
    const dx = clientX - startX.current;
    const dy = clientY - startY.current;
    setOffsetX(dx);
    setOffsetY(dy);
    setDirection(dx > 20 ? "right" : dx < -20 ? "left" : null);
  }, [dragging, disabled]);

  const handleEnd = useCallback(() => {
    if (!dragging || disabled) return;
    setDragging(false);

    if (offsetX > SWIPE_THRESHOLD) {
      onRight();
    } else if (offsetX < -SWIPE_THRESHOLD) {
      onLeft();
    } else {
      // snap back
      setOffsetX(0);
      setOffsetY(0);
      setDirection(null);
    }
  }, [dragging, offsetX, onLeft, onRight, disabled]);

  const reset = useCallback(() => {
    setOffsetX(0);
    setOffsetY(0);
    setDirection(null);
    setDragging(false);
  }, []);

  const rotation = Math.min(Math.max(offsetX * ROTATION_FACTOR, -MAX_ROTATION), MAX_ROTATION);
  const opacity  = Math.max(1 - Math.abs(offsetX) / 400, 0.6);

  return {
    dragging, offsetX, offsetY, rotation, opacity, direction, reset,
    handlers: {
      onMouseDown: (e: React.MouseEvent) => handleStart(e.clientX, e.clientY),
      onMouseMove: (e: React.MouseEvent) => handleMove(e.clientX, e.clientY),
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,
      onTouchStart: (e: React.TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY),
      onTouchMove: (e: React.TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY),
      onTouchEnd: handleEnd,
    },
  };
}

// ─── SwipeCard ────────────────────────────────────────────────────────────────

export default function SwipeCard({ children, onSwipeLeft, onSwipeRight, disabled = false }: SwipeCardProps) {
  const { dragging, offsetX, offsetY, rotation, opacity, direction, handlers } =
    useSwipeDrag(onSwipeLeft, onSwipeRight, disabled);

  return (
    <div
      {...handlers}
      className="relative w-full select-none"
      style={{
        transform: `translate(${offsetX}px, ${offsetY * 0.3}px) rotate(${rotation}deg)`,
        opacity,
        transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s",
        cursor: disabled ? "default" : dragging ? "grabbing" : "grab",
        touchAction: "none",
        zIndex: 10,
      }}
    >
      {children}

      {/* LEFT stamp */}
      <div
        className="absolute top-6 right-6 border-4 rounded-xl px-4 py-2 font-black text-2xl uppercase tracking-widest pointer-events-none transition-opacity duration-150"
        style={{
          borderColor: "#E53E3E",
          color: "#E53E3E",
          opacity: direction === "left" ? Math.min(Math.abs(offsetX) / 80, 1) : 0,
          transform: "rotate(12deg)",
        }}
      >
        SKIP
      </div>

      {/* RIGHT stamp */}
      <div
        className="absolute top-6 left-6 border-4 rounded-xl px-4 py-2 font-black text-2xl uppercase tracking-widest pointer-events-none transition-opacity duration-150"
        style={{
          borderColor: "#1D4ED8",
          color: "#1D4ED8",
          opacity: direction === "right" ? Math.min(offsetX / 80, 1) : 0,
          transform: "rotate(-12deg)",
        }}
      >
        APPLY
      </div>
    </div>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

interface SwipeButtonsProps {
  onLeft: () => void;
  onRight: () => void;
  disabled?: boolean;
}

export function SwipeButtons({ onLeft, onRight, disabled = false }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-8 mt-6">
      {/* Skip */}
      <button
        onClick={onLeft}
        disabled={disabled}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-40"
        style={{
          background: "#fff",
          border: "2px solid #FECACA",
          boxShadow: "0 4px 20px rgba(229,62,62,0.15)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(229,62,62,0.3)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fff";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(229,62,62,0.15)";
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Apply / Interested */}
      <button
        onClick={onRight}
        disabled={disabled}
        className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-40"
        style={{
          background: "linear-gradient(135deg,#1D4ED8,#3B82F6)",
          boxShadow: "0 6px 28px rgba(29,78,216,0.4)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(29,78,216,0.6)";
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(29,78,216,0.4)";
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>
    </div>
  );
}

// ─── Score Badge (shown after right swipe) ────────────────────────────────────

interface ScoreBadgeProps {
  score: number;
  breakdown: { skills: number; experience: number; location: number };
}

export function ScoreBadge({ score, breakdown }: ScoreBadgeProps) {
  const label =
    score >= 85 ? "Excellent" :
    score >= 65 ? "Good" :
    score >= 45 ? "Fair" : "Low";

  const color =
    score >= 85 ? "#1D4ED8" :
    score >= 65 ? "#059669" :
    score >= 45 ? "#D97706" : "#E53E3E";

  return (
    <div
      className="rounded-2xl p-4 border"
      style={{ background: `${color}08`, borderColor: `${color}25` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black uppercase tracking-widest text-gray-500">Match Score</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black" style={{ color }}>{score.toFixed(0)}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
            {label}
          </span>
        </div>
      </div>
      {[
        { label: "Skills", value: breakdown.skills },
        { label: "Experience", value: breakdown.experience },
        { label: "Location", value: breakdown.location },
      ].map((d) => (
        <div key={d.label} className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-bold uppercase tracking-wider">{d.label}</span>
            <span className="font-black text-gray-700">{d.value.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${d.value}%`, background: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

export function SwipeDeckEmpty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "#F8F9FF", border: "2px dashed #E8EAF6" }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#CBD5E0" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>
      <p className="text-gray-900 font-black text-lg uppercase tracking-wider mb-1">All Caught Up</p>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}