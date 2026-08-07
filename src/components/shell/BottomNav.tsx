import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Library, Route as RouteIcon, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/library", label: "Library", icon: Library },
  { to: "/learn", label: "Learn", icon: RouteIcon },
  { to: "/ask", label: "Ask", icon: Sparkles },
  { to: "/profile", label: "You", icon: User },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-lg px-3 pb-3">
        <div className="surface-glass flex items-center justify-between rounded-3xl px-2 py-1.5">
          {ITEMS.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "press relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute inset-0 rounded-2xl bg-primary/10 animate-[pop_0.3s_ease-out]" aria-hidden="true" />
                )}
                <Icon className={cn("relative h-5 w-5 transition-transform", active && "scale-110")} />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
