import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { AmbientBackdrop } from "@/components/visual/AmbientBackdrop";
import { useAuth } from "@/lib/auth";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { Flame, Coins, LogOut } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

export function AppShell({ children, title, subtitle, showHeader = true, className }: { children: ReactNode; title?: string; subtitle?: string; showHeader?: boolean; className?: string }) {
  const { profile, signOut } = useAuth();
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 overflow-hidden"><AmbientBackdrop density={10} /></div>
      <div className="relative mx-auto max-w-lg px-4 pb-32 pt-5">
        {showHeader && <header className="mb-5 flex items-center justify-between gap-3">
          <div className="min-w-0">{title ? <><h1 className="truncate font-display text-2xl font-semibold">{title}</h1>{subtitle && <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>}</> : <Link to="/" className="flex items-center gap-2"><LogoMark className="h-8 w-8 text-primary" /><span className="font-display text-xl font-semibold">Nahj AI</span></Link>}</div>
          <div className="flex shrink-0 items-center gap-2">
            {profile && <><span className="surface-glass flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold"><Flame className="h-3.5 w-3.5 text-gold" />{profile.streak}</span><span className="surface-glass flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold"><Coins className="h-3.5 w-3.5 text-gold" />{profile.coins}</span></>}
            <Link to="/profile" className="press"><AvatarCanvas config={profile?.avatar_config ?? null} size={40} className="rounded-full ring-2 ring-gold/40" /></Link>
            <button aria-label="Log out" title="Log out" onClick={() => void signOut()} className="press rounded-full border border-border bg-card p-2 text-muted-foreground hover:text-foreground"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>}
        <main className={cn("animate-rise", className)}>{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
