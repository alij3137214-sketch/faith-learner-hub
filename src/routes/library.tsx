import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useDocuments, useScholars } from "@/lib/queries";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/shell/AppShell";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Knowledge Library — Nahj AI" },
      { name: "description", content: "Browse books, speeches, letters and articles from indexed scholars." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [search, setSearch] = useState("");
  const [scholarId, setScholarId] = useState<string | undefined>();
  const { data: scholars } = useScholars();
  const { data: docs, isLoading, isError, error, refetch } = useDocuments({
    ...(scholarId ? { scholarId } : {}),
    ...(search ? { search } : {}),
  });

  if (pathname !== "/library" && pathname.startsWith("/library/")) {
    return <Outlet />;
  }

  return (
    <AppShell title="Library" subtitle="Authentic, indexed sources">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search titles and summaries" className="h-12 rounded-2xl pl-10" />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <Chip active={!scholarId} onClick={() => setScholarId(undefined)}>All</Chip>
        {(scholars ?? []).map((s) => <Chip key={s.id} active={scholarId === s.id} onClick={() => setScholarId(s.id)}>{s.name}</Chip>)}
      </div>
      {isError ? (
        <div className="mt-5 rounded-3xl border border-destructive/30 bg-destructive/5 p-5">
          <p className="font-semibold">Library content could not load.</p>
          <p className="mt-1 text-xs text-muted-foreground">{error instanceof Error ? error.message : "Supabase returned an unknown error."}</p>
          <button onClick={() => void refetch()} className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><RefreshCw className="h-3.5 w-3.5" />Retry</button>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {isLoading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-3xl" />)}
          {!isLoading && docs?.length === 0 && <p className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nothing matches that search yet.</p>}
          {(docs ?? []).map((d) => (
            <Link key={d.id} to="/library/$id" params={{ id: d.id }} className="surface-glass card-lift block rounded-3xl p-4" aria-label={`Open ${d.title}`}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">{d.type}</span>
                  <p className="mt-1.5 font-display font-semibold leading-snug">{d.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{d.summary}</p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={cn("press shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground")}>{children}</button>;
}
