import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Nahj AI" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { loading, user, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) void navigate({ to: "/", replace: true });
  }, [loading, user, isAdmin, navigate]);

  if (loading || !user || !isAdmin) {
    return <main className="flex min-h-screen items-center justify-center">Checking admin access…</main>;
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Nahj AI</p>
            <h1 className="mt-1 font-display text-3xl font-semibold">Admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">Only accounts with the database admin role can enter this area.</p>
          </div>
          <Button asChild variant="outline"><Link to="/">Back to app</Link></Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Content", "Review and publish lessons and documents."],
            ["Learning paths", "Manage guided-learning structure."],
            ["Quizzes", "Manage questions and publishing."],
            ["Missions", "Manage daily and weekly goals."],
            ["Achievements", "Manage rewards and milestones."],
            ["Users", "Review application users and roles."],
          ].map(([title, description]) => (
            <article key={title} className="surface-glass rounded-3xl p-5">
              <h2 className="font-display text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              <p className="mt-4 text-xs font-medium text-primary">Admin module</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
