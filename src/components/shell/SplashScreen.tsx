import { useEffect, useState } from "react";
import { AmbientBackdrop } from "@/components/visual/AmbientBackdrop";
import { LogoMark } from "@/components/brand/Logo";

/** Cinematic one-time splash with an animated logo reveal. */
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 380);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(onDone, 2150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center gradient-deep transition-opacity duration-600"
      style={{ opacity: phase === 2 ? 0 : 1 }}
    >
      <AmbientBackdrop density={18} />
      <div className="absolute inset-0 geo-pattern opacity-15" aria-hidden="true" />
      <div className="relative flex flex-col items-center">
        <div
          className="transition-all duration-1000 ease-out"
          style={{
            transform: phase >= 1 ? "scale(1) rotate(0deg)" : "scale(0.55) rotate(-25deg)",
            opacity: phase >= 1 ? 1 : 0,
          }}
        >
          <LogoMark className="h-24 w-24 text-gold" animated />
        </div>
        <div
          className="mt-7 text-center transition-all duration-700 delay-300 ease-out"
          style={{ transform: phase >= 1 ? "translateY(0)" : "translateY(16px)", opacity: phase >= 1 ? 1 : 0 }}
        >
          <h1 className="font-display text-4xl font-semibold text-deep-foreground">
            Nahj<span className="text-gradient-gold"> AI</span>
          </h1>
          <p className="mt-3 max-w-xs text-sm text-deep-foreground/70">
            Learn from Authentic Sources. Grow Through Knowledge.
          </p>
        </div>
        <div className="mt-10 h-0.5 w-40 overflow-hidden rounded-full bg-deep-foreground/15">
          <div
            className="h-full gradient-gold transition-all duration-1400 ease-out"
            style={{ width: phase >= 1 ? "100%" : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
