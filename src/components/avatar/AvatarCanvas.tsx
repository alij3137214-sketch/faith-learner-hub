import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type AvatarSlot =
  | "skin"
  | "hair"
  | "hairColor"
  | "beard"
  | "brows"
  | "headwear"
  | "outfit"
  | "background"
  | "frame";

export type AvatarConfig = { [K in AvatarSlot]?: string };

export const DEFAULT_AVATAR: Required<AvatarConfig> = {
  skin: "#d9a577",
  hair: "short",
  hairColor: "#1c1a17",
  beard: "none",
  brows: "soft",
  headwear: "none",
  outfit: "#0f7a5a",
  background: "emerald",
  frame: "thin",
};

const BG = {
  dawn: ["#fdeccf", "#f6c99a"],
  emerald: ["#c9ece0", "#7fc8ad"],
  night: ["#1f2b2a", "#33504a"],
  gold: ["#f6e3b0", "#dfbb63"],
} satisfies Record<string, [string, string]>;


type Mood = "idle" | "wave" | "celebrate" | "levelup";

export function AvatarCanvas({
  config,
  size = 140,
  mood = "idle",
  className,
}: {
  config?: AvatarConfig | null;
  size?: number;
  mood?: Mood;
  className?: string;
}) {
  const c = { ...DEFAULT_AVATAR, ...(config ?? {}) };
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        schedule();
      }, 2600 + Math.random() * 3400);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const [bgA, bgB] = (BG as Record<string, [string, string]>)[c.background] ?? BG.emerald;
  const headwear = c.headwear ?? "none";
  const [hwKind, hwColor] = headwear.split(":");
  const uid = `av-${c.background}-${c.outfit}`.replace(/[^a-z0-9-]/gi, "");

  return (
    <div
      className={cn(
        "relative select-none",
        mood === "celebrate" && "animate-[pop_0.5s_cubic-bezier(0.34,1.56,0.64,1)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-full",
          c.frame === "gold" && "ring-4 ring-gold shadow-gold",
          c.frame === "geometric" && "ring-2 ring-emerald ring-offset-2 ring-offset-background",
          c.frame === "thin" && "ring-2 ring-border",
        )}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stopColor={bgA} />
              <stop offset="100%" stopColor={bgB} />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill={`url(#${uid}-bg)`} />
          <g opacity="0.22" stroke="#ffffff" strokeWidth="0.7" fill="none">
            <path d="M50 6 74 20v28L50 62 26 48V20L50 6Z" />
            <circle cx="50" cy="34" r="18" />
          </g>

          <g className={mood === "idle" ? "animate-breathe" : undefined} style={{ transformOrigin: "50px 60px" }}>
            {/* body / outfit */}
            <path d="M20 100c0-17 13-27 30-27s30 10 30 27H20Z" fill={c.outfit} />
            <path d="M50 73c6 6 6 14 4 27h-8c-2-13-2-21 4-27Z" fill="#ffffff" opacity="0.18" />
            {/* neck */}
            <rect x="43" y="58" width="14" height="14" rx="6" fill={c.skin} />
            {/* head */}
            <ellipse cx="50" cy="42" rx="19" ry="21" fill={c.skin} />
            {/* hair */}
            {c.hair === "short" && <path d="M31 40c0-13 8-20 19-20s19 7 19 20c-3-8-9-11-19-11s-16 3-19 11Z" fill={c.hairColor} />}
            {c.hair === "wavy" && (
              <path d="M30 42c-2-15 8-23 20-23s22 8 20 23c-2-6-5-9-8-7-3 2-5-3-9-3s-7 5-11 4-9 1-12 6Z" fill={c.hairColor} />
            )}
            {c.hair === "long" && (
              <path d="M30 44c-3-16 8-25 20-25s23 9 20 25c1 10 0 16-3 20-1-12-3-19-6-22-6 3-16 3-22 0-3 3-5 10-6 22-3-4-4-10-3-20Z" fill={c.hairColor} />
            )}
            {/* brows */}
            <g fill={c.hairColor}>
              {c.brows === "strong" ? (
                <>
                  <rect x="39" y="36" width="9" height="2.6" rx="1.3" />
                  <rect x="52" y="36" width="9" height="2.6" rx="1.3" />
                </>
              ) : (
                <>
                  <rect x="40" y="36.5" width="8" height="1.7" rx="0.9" />
                  <rect x="52" y="36.5" width="8" height="1.7" rx="0.9" />
                </>
              )}
            </g>
            {/* eyes */}
            <g fill="#2a2723">
              {blink ? (
                <>
                  <rect x="41" y="43" width="7" height="1.6" rx="0.8" />
                  <rect x="52" y="43" width="7" height="1.6" rx="0.8" />
                </>
              ) : (
                <>
                  <circle cx="44.5" cy="43.5" r="2.4" />
                  <circle cx="55.5" cy="43.5" r="2.4" />
                </>
              )}
            </g>
            {/* mouth */}
            {mood === "celebrate" || mood === "levelup" ? (
              <path d="M44 51c2 4 10 4 12 0-2 5-10 5-12 0Z" fill="#7a3a34" />
            ) : (
              <path d="M45 51.5c2 2 8 2 10 0" stroke="#7a3a34" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            )}
            {/* beard */}
            {c.beard === "stubble" && <path d="M32 44c1 13 8 20 18 20s17-7 18-20c1 14-6 24-18 24s-19-10-18-24Z" fill={c.hairColor} opacity="0.35" />}
            {c.beard === "full" && <path d="M32 43c0 15 7 23 18 23s18-8 18-23c2 17-5 27-18 27S30 60 32 43Z" fill={c.hairColor} opacity="0.9" />}
            {c.beard === "long" && <path d="M32 43c0 18 6 34 18 34s18-16 18-34c2 22-5 40-18 40S30 65 32 43Z" fill={c.hairColor} />}
            {/* headwear */}
            {hwKind === "cap" && <path d="M29 34c0-11 9-17 21-17s21 6 21 17H29Z" fill="#2b2f2d" />}
            {hwKind === "service" && (
              <>
                <path d="M28 32c0-12 10-18 22-18s22 6 22 18H28Z" fill="#38443c" />
                <rect x="26" y="31" width="48" height="5" rx="2.5" fill="#202723" />
                <circle cx="50" cy="23" r="3.4" fill="#c9a227" />
              </>
            )}
            {hwKind === "turban" && (
              <>
                <path d="M27 36c0-15 10-23 23-23s23 8 23 23c-6-6-14-9-23-9s-17 3-23 9Z" fill={hwColor ?? "#f6f3ea"} />
                <path d="M28 33c8-6 36-6 44 0" stroke="#00000022" strokeWidth="2" fill="none" />
              </>
            )}
            {hwKind === "hijab" && (
              <path
                d="M26 46c0-19 10-30 24-30s24 11 24 30c0 12-4 20-9 24 3-10 3-24-1-31-5-8-23-8-28 0-4 7-4 21-1 31-5-4-9-12-9-24Z"
                fill={hwColor ?? "#f6f3ea"}
              />
            )}
          </g>

          {/* waving arm */}
          {mood === "wave" && (
            <g style={{ transformOrigin: "76px 84px" }} className="animate-[float_1.1s_ease-in-out_infinite]">
              <rect x="72" y="72" width="8" height="20" rx="4" fill={c.skin} transform="rotate(-28 76 82)" />
            </g>
          )}
        </svg>
      </div>

      {(mood === "celebrate" || mood === "levelup") && (
        <div className="pointer-events-none absolute -inset-3 rounded-full border-2 border-gold/70 animate-[pop_0.6s_ease-out]" />
      )}
    </div>
  );
}
