import { cn } from "@/lib/utils";

export function LogoMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-8 w-8", className)} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="nahj-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path
        d="M32 3 56 17v30L32 61 8 47V17L32 3Z"
        stroke="url(#nahj-g)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        className={animated ? "animate-[sheen_3.5s_ease-in-out_infinite]" : undefined}
      />
      <path d="M32 14 46 22v20L32 50 18 42V22L32 14Z" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M23 42V24l18 16V22" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark({ className, tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-7 w-7 text-gold" animated />
      <div className="leading-none">
        <div className="font-display text-lg font-semibold tracking-tight">
          Nahj<span className="text-gradient-gold"> AI</span>
        </div>
        {tagline && (
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Learn from authentic sources
          </div>
        )}
      </div>
    </div>
  );
}
