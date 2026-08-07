import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/shell/AppShell";
import { askKnowledgeBase, type AskResult } from "@/lib/ai.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen } from "lucide-react";
import { DISCLAIMER } from "@/lib/gamification";
import { toast } from "sonner";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Knowledge Assistant — Nahj AI" },
      { name: "description", content: "Ask questions and get answers cited only from the indexed source library." },
      { property: "og:title", content: "Knowledge Assistant — Nahj AI" },
      { property: "og:description", content: "Answers cited only from the indexed source library." },
    ],
  }),
  component: AskPage,
});

function AskPage() {
  const ask = useServerFn(askKnowledgeBase);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AskResult | null>(null);

  const submit = async () => {
    if (question.trim().length < 3) return;
    setBusy(true);
    setResult(null);
    try {
      setResult(await ask({ data: { question: question.trim() } }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell title="Ask" subtitle="Grounded in the library only">
      <p className="rounded-2xl border border-gold/30 bg-gold/8 p-3 text-xs leading-relaxed text-muted-foreground">
        {DISCLAIMER}
      </p>

      <div className="mt-4 flex gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void submit()}
          placeholder="Ask about an indexed source…"
          className="h-12 rounded-2xl"
        />
        <Button onClick={() => void submit()} disabled={busy} className="press h-12 rounded-2xl px-4">
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>

      {busy && <p className="mt-6 text-sm text-muted-foreground">Searching the library…</p>}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="surface-glass rounded-3xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {result.answer}
          </div>
          {result.citations.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border p-3.5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-primary" />
                {c.title}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                {c.type} · {c.scholar}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{c.excerpt}…</p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
