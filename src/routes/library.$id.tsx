import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { useDocument } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { completeDocument } from "@/lib/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/library/$id")({ head: () => ({ meta: [{ title: "Reading — Nahj AI Library" }] }), component: DocumentPage });

function DocumentPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { data: doc, isLoading } = useDocument(id);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  if (isLoading) return <AppShell title="Loading"><Skeleton className="h-64 rounded-3xl" /></AppShell>;
  if (!doc) return <AppShell title="Not found"><p className="text-sm text-muted-foreground">This document is no longer available.</p></AppShell>;
  const markComplete = async () => {
    if (!user) return;
    setBusy(true);
    try { const reward = await completeDocument(user.id, id, doc.xp_reward); setDone(true); if (reward) toast.success(`Completed · +${reward.xp} XP`); else toast.message("Already completed."); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not save progress."); }
    finally { setBusy(false); }
  };
  return <AppShell title={doc.title} subtitle={doc.summary ?? ""}>
    <article className="surface-glass rounded-3xl p-5">
      <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">{doc.type}</span>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/90">{String(doc.body ?? "").split(/\n{2,}/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>
    </article>
    {user && <Button disabled={busy || done} onClick={() => void markComplete()} className="mt-5 w-full rounded-2xl">{busy ? "Saving…" : done ? "Completed ✓" : `Mark as complete · +${doc.xp_reward} XP`}</Button>}
  </AppShell>;
}
