import { DISCLAIMER } from "@/lib/gamification";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { AmbientBackdrop } from "@/components/visual/AmbientBackdrop";

export function DisclaimerGate({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-0 z-90 flex items-end justify-center bg-charcoal/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-4xl border border-border bg-card p-6 shadow-lift animate-rise">
        <AmbientBackdrop density={8} className="opacity-60" />
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-deep text-gold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold">Before you begin</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              Answers are drawn only from documents uploaded to this library.
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              Every response shows its source so you can verify it yourself.
            </li>
          </ul>
          <Button className="press mt-6 h-12 w-full rounded-2xl text-base" onClick={onAccept}>
            I understand — continue
          </Button>
        </div>
      </div>
    </div>
  );
}
