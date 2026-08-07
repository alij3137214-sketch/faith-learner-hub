import { useMemo } from "react";
import { cn } from "@/lib/utils";

/** Ambient floating particles + animated aurora gradient backdrop. */
export function AmbientBackdrop({ className, density = 14 }: { className?: string; density?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        left: `${(i * 37 + 11) % 100}%`,
        top: `${(i * 61 + 23) % 100}%`,
        size: 3 + ((i * 7) % 9),
        delay: `${(i % 7) * 0.8}s`,
        duration: `${6 + (i % 5) * 1.6}s`,
        gold: i % 3 === 0,
      })),
    [density],
  );

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="absolute inset-0 gradient-aurora animate-drift" />
      {dots.map((d, i) => (
        <span
          key={i}
          className={cn(
            "absolute rounded-full blur-[1px]",
            d.gold ? "bg-gold/35" : "bg-emerald/25",
          )}
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animation: `float ${d.duration} ease-in-out ${d.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
