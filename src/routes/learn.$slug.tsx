import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { usePath } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, BookOpen, HelpCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/learn/$slug")({
  head: () => ({ meta: [{ title: "Learning Path — Nahj AI" }] }),
  component: PathPage,
});

function PathPage() {
  const { slug } = Route.useParams();
  const { data: path, isLoading } = usePath(slug);
  if (isLoading) return <AppShell title="Loading"><Skeleton className="h-64 rounded-3xl" /></AppShell>;
  if (!path) return <AppShell title="Not found"><p className="text-sm text-muted-foreground">This path is unavailable.</p></AppShell>;

  return <AppShell title={path.title} subtitle={path.description ?? ""}>
    <ol className="relative space-y-3 border-l border-dashed border-border pl-5">
      {(path.path_items ?? []).map((item, i) => {
        const destination = item.kind === "document" && item.document_id ? "/library/$id" : item.kind === "quiz" && item.quiz_id ? "/quiz/$id" : null;
        const params = item.kind === "document" && item.document_id ? { id: item.document_id } : item.kind === "quiz" && item.quiz_id ? { id: item.quiz_id } : undefined;
        const Icon = item.kind === "quiz" ? HelpCircle : item.kind === "reward" ? Sparkles : BookOpen;
        const content = <><span className="absolute -left-[30px] top-5 flex h-6 w-6 items-center justify-center rounded-full gradient-emerald text-[11px] font-bold text-primary-foreground">{i + 1}</span><div className="flex items-start gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.kind} · +{item.xp_reward} XP</p>{item.content && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.content}</p>}</div>{destination && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}</div></>;
        return <li key={item.id} className="relative">{destination ? <Link to={destination as any} params={params as any} className="surface-glass card-lift block rounded-2xl p-4">{content}</Link> : <div className="surface-glass rounded-2xl p-4">{content}</div>}</li>;
      })}
    </ol>
  </AppShell>;
}
