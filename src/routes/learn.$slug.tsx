import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { usePath } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/learn/$slug")({
  head: () => ({
    meta: [
      { title: "Learning Path — Nahj AI" },
      { name: "description", content: "Work through lessons and quizzes in this Nahj AI learning path." },
      { property: "og:title", content: "Learning Path — Nahj AI" },
      { property: "og:description", content: "Work through lessons and quizzes in this Nahj AI learning path." },
    ],
  }),
  component: PathPage,
});

function PathPage() {
  const { slug } = Route.useParams();
  const { data: path, isLoading } = usePath(slug);

  if (isLoading) {
    return (
      <AppShell title="Loading">
        <Skeleton className="h-64 rounded-3xl" />
      </AppShell>
    );
  }
  if (!path) {
    return (
      <AppShell title="Not found">
        <p className="text-sm text-muted-foreground">This path is unavailable.</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={path.title} subtitle={path.description ?? ""}>
      <ol className="relative space-y-3 border-l border-dashed border-border pl-5">
        {(path.path_items ?? []).map((item, i) => (
          <li key={item.id} className="surface-glass card-lift relative rounded-2xl p-4">
            <span className="absolute -left-[30px] top-5 flex h-6 w-6 items-center justify-center rounded-full gradient-emerald text-[11px] font-bold text-primary-foreground">
              {i + 1}
            </span>
            <p className="font-semibold">{item.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.kind} · +{item.xp_reward} XP
            </p>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
