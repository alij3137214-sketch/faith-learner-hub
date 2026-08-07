import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { usePaths } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learning Paths — Nahj AI" },
      { name: "description", content: "Guided, level-by-level learning paths built from authentic sources." },
      { property: "og:title", content: "Learning Paths — Nahj AI" },
      { property: "og:description", content: "Guided, level-by-level learning paths built from authentic sources." },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { data: paths, isLoading } = usePaths();

  return (
    <AppShell title="Learn" subtitle="Structured paths, one lesson at a time">
      <div className="space-y-3">
        {isLoading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-3xl" />)}
        {(paths ?? []).map((p) => (
          <Link
            key={p.id}
            to="/learn/$slug"
            params={{ slug: p.slug }}
            className="surface-glass card-lift block rounded-3xl p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-emerald text-xl">
                📗
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold">{p.title}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  {p.path_items?.length ?? 0} lessons · {p.difficulty}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
