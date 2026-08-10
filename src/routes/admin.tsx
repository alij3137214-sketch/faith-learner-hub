import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <main className="flex min-h-screen items-center justify-center p-6"><div className="text-center"><h1 className="font-display text-2xl font-semibold">Admin access required</h1><p className="mt-2 text-sm text-muted-foreground">This area is restricted to the application owner/admin role.</p><Button asChild className="mt-5 rounded-2xl"><Link to="/">Return to app</Link></Button></div></main>;
  const cards = [
    { title: "Content", text: "Review sources, attribution, publication state, and learner-facing material.", href: "/admin/content" },
    { title: "Quizzes", text: "Open published quizzes and verify questions and progression.", href: "/learn" },
    { title: "Missions", text: "Review learner objectives and rewards.", href: "/profile" },
    { title: "Users", text: "Review learner accounts and role-protected profile controls.", href: "/leaderboard" },
  ] as const;
  return <AppShell title="Admin" subtitle="Owner controls"><section className="space-y-4"><div className="surface-glass rounded-3xl p-5"><h2 className="font-display text-xl font-semibold">Owner dashboard</h2><p className="mt-2 text-sm text-muted-foreground">Owner-only shortcuts. Every card below is a real navigation action.</p></div><div className="grid gap-3 sm:grid-cols-2">{cards.map(c=><Link key={c.title} to={c.href} className="surface-glass card-lift block rounded-2xl p-4"><p className="font-semibold">{c.title}</p><p className="mt-1 text-xs text-muted-foreground">{c.text}</p><p className="mt-3 text-xs font-bold text-primary">Open →</p></Link>)}</div><Link to="/ask" className="surface-glass card-lift mt-3 block rounded-2xl p-4"><p className="font-semibold">AI source assistant</p><p className="mt-1 text-xs text-muted-foreground">Test the grounded assistant and its citations.</p><p className="mt-3 text-xs font-bold text-primary">Open Ask →</p></Link></section></AppShell>;
}
