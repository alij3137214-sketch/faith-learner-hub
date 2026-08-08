import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider, useAuth } from "@/lib/auth";
import { SplashScreen } from "@/components/shell/SplashScreen";
import { DisclaimerGate } from "@/components/shell/DisclaimerGate";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-semibold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist or has been moved.</p>
        <div className="mt-6"><Link to="/" className="press inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Go home</Link></div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again, or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="press rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Try again</button>
          <a href="/" className="rounded-2xl border border-input px-5 py-2.5 text-sm font-medium">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0f3d31" },
      { title: "Nahj AI — Learn from Authentic Sources" },
      { name: "description", content: "Nahj AI turns authentic Islamic scholarship into guided learning paths, quizzes and a source-cited knowledge assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>;
}

function Gates({ children }: { children: ReactNode }) {
  const { profile, user, loading, isGuest, refreshProfile } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [splashDone, setSplashDone] = useState(false);
  const [localAccepted, setLocalAccepted] = useState(true);

  useEffect(() => {
    setSplashDone(sessionStorage.getItem("nahj.splash") === "1");
    setLocalAccepted(localStorage.getItem("nahj.disclaimer") === "1");
  }, []);

  useEffect(() => {
    if (!loading && !user && !isGuest && pathname !== "/auth") {
      window.location.replace(`/auth?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, isGuest, pathname]);

  if (!loading && !user && !isGuest && pathname !== "/auth") {
    return <main className="flex min-h-screen items-center justify-center">Redirecting to sign in…</main>;
  }

  const needsDisclaimer = (user ? !profile?.disclaimer_accepted : isGuest) && !localAccepted;
  const acceptDisclaimer = async () => {
    localStorage.setItem("nahj.disclaimer", "1");
    setLocalAccepted(true);
    if (user) {
      await supabase.from("profiles").update({ disclaimer_accepted: true }).eq("user_id", user.id);
      await refreshProfile();
    }
  };

  return <>{!splashDone && <SplashScreen onDone={() => { sessionStorage.setItem("nahj.splash", "1"); setSplashDone(true); }} />}{splashDone && needsDisclaimer && <DisclaimerGate onAccept={() => void acceptDisclaimer()} />}{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return <QueryClientProvider client={queryClient}><AuthProvider><Gates><Outlet /></Gates><Toaster position="top-center" /></AuthProvider></QueryClientProvider>;
}
