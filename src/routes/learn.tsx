import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { usePaths } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/learn")({ head: () => ({ meta: [{ title: "Learning Paths — Nahj AI" }, { name: "description", content: "Guided, level-by-level learning paths built from authentic sources." }] }), component: LearnPage });
function LearnPage() {
  const { data: paths, isLoading, isError, error, refetch } = usePaths();
  return <AppShell title="Learn" subtitle="Structured paths, one lesson at a time">
    {isError && <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-5"><p className="font-semibold">Learning content could not load.</p><p className="mt-1 text-xs text-muted-foreground">{error instanceof Error ? error.message : "Supabase returned an unknown error."}</p><button onClick={() => void refetch()} className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><RefreshCw className="h-3.5 w-3.5" />Retry</button></div>}
    {!isError && <div className="space-y-3">{isLoading && [0,1,2].map(i => <Skeleton key={i} className="h-24 rounded-3xl" />)}{!isLoading && (paths ?? []).length === 0 && <p className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No published learning paths are available.</p>}{(paths ?? []).map(p => <Link key={p.id} to="/learn/$slug" params={{ slug:p.slug }} className="surface-glass card-lift block rounded-3xl p-4"><div className="flex items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-emerald text-xl">📗</span><div className="min-w-0 flex-1"><p className="truncate font-display font-semibold">{p.title}</p><p className="line-clamp-1 text-xs text-muted-foreground">{p.description}</p><p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-primary">{p.path_items?.length ?? 0} lessons · {p.difficulty}</p></div><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /></div></Link>)}</div>}
  </AppShell>;
}
