import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <main className="flex min-h-screen items-center justify-center p-6"><div className="text-center"><h1 className="font-display text-2xl font-semibold">Admin access required</h1><p className="mt-2 text-sm text-muted-foreground">This area is restricted to the application owner/admin role.</p><Button asChild className="mt-5 rounded-2xl"><Link to="/">Return to app</Link></Button></div></main>;
  return <AppShell title="Admin" subtitle="Owner controls"><section className="space-y-4"><div className="surface-glass rounded-3xl p-5"><h2 className="font-display text-xl font-semibold">Owner dashboard</h2><p className="mt-2 text-sm text-muted-foreground">Manage published learning content, quizzes, missions and application settings here. Access is restricted by the admin role.</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="surface-glass rounded-2xl p-4"><p className="font-semibold">Content</p><p className="mt-1 text-xs text-muted-foreground">Review and publish learning material.</p></div><div className="surface-glass rounded-2xl p-4"><p className="font-semibold">Quizzes</p><p className="mt-1 text-xs text-muted-foreground">Manage questions and passing criteria.</p></div><div className="surface-glass rounded-2xl p-4"><p className="font-semibold">Missions</p><p className="mt-1 text-xs text-muted-foreground">Configure learner objectives and rewards.</p></div><div className="surface-glass rounded-2xl p-4"><p className="font-semibold">Users</p><p className="mt-1 text-xs text-muted-foreground">Review application accounts and roles.</p></div></div></section></AppShell>;
}
