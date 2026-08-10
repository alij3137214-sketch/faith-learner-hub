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
        const Icon = item.kind === "quiz" ? HelpCircle : item.kind === "reward" ? Sparkles : BookOpen;
        const content = <><span className="absolute -left-[30px] top-5 flex h-6 w-6 items-center justify-center rounded-full gradient-emerald text-[11px] font-bold text-primary-foreground">{i + 1}</span><div className="flex items-start gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.kind} · +{item.xp_reward} XP</p>{item.content && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.content}</p>}</div><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /></div></>;
        if (item.kind === "document" && item.document_id) {
          return <li key={item.id} className="relative"><Link to="/library/$id" params={{ id: item.document_id }} className="surface-glass card-lift block rounded-2xl p-4">{content}</Link></li>;
        }
        if (item.kind === "quiz" && item.quiz_id) {
          return <li key={item.id} className="relative"><Link to="/quiz/$id" params={{ id: item.quiz_id }} className="surface-glass card-lift block rounded-2xl p-4">{content}</Link></li>;
        }
        return <li key={item.id} className="relative"><div className="surface-glass rounded-2xl p-4">{content}</div></li>;
      })}
    </ol>
  </AppShell>;
}
