import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/shell/AppShell";
import { useDocument, useMyProgress } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { completeDocument } from "@/lib/progress";
import { askKnowledgeBase } from "@/lib/ai.functions";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/library/$id")({ head: () => ({ meta: [{ title: "Reading — Nahj AI Library" }] }), component: DocumentPage });

function DocumentPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { data: doc, isLoading } = useDocument(id);
  const { data: progress } = useMyProgress(user?.id);
  const summarize = useServerFn(askKnowledgeBase);
  const [busy, setBusy] = useState(false);
  const [localDone, setLocalDone] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  if (isLoading) return <AppShell title="Loading"><Skeleton className="h-64 rounded-3xl" /></AppShell>;
  if (!doc) return <AppShell title="Not found"><p className="text-sm text-muted-foreground">This document is no longer available.</p></AppShell>;

  const persistedDone = Boolean(progress?.some((p) => p.document_id === id && p.completed));
  const done = persistedDone || localDone;

  const markComplete = async () => {
    if (!user || done) return;
    setBusy(true);
    try {
      const reward = await completeDocument(user.id, id, doc.xp_reward);
      setLocalDone(true);
      if (reward) toast.success(`Completed · +${reward.xp} XP`);
      else toast.message("Already completed.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save progress.");
    } finally { setBusy(false); }
  };

  const makeSummary = async () => {
    setBusy(true);
    try {
      const r = await summarize({ data: { question: `Summarize this reading material in 5 concise bullet points. Focus only on this exact title: ${doc.title}. Use only the source content.` } });
      setSummary(r.answer);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not generate summary.");
    } finally { setBusy(false); }
  };

  return <AppShell title={doc.title} subtitle={doc.summary ?? ""}>
    <div className="mb-4 flex gap-2"><Button variant="outline" onClick={() => void makeSummary()} disabled={busy} className="rounded-2xl"><Sparkles className="mr-2 h-4 w-4" />AI Summary</Button></div>
    {summary && <section className="surface-glass mb-5 rounded-3xl p-5"><h2 className="font-display font-semibold">AI Summary</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{summary}</p></section>}
    <article className="surface-glass rounded-3xl p-5"><span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">{doc.type}</span><div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/90">{String(doc.body ?? "").split(/\n{2,}/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div></article>
    {user && <Button disabled={busy || done} onClick={() => void markComplete()} className="mt-5 w-full rounded-2xl">{busy ? "Saving…" : done ? "Completed ✓" : `Mark as complete · +${doc.xp_reward} XP`}</Button>}
  </AppShell>;
}
