import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { useQuiz } from "@/lib/queries";
import { submitQuiz } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export const Route = createFileRoute("/quiz/$id")({
  head: () => ({ meta: [{ title: "Quiz — Nahj AI" }] }),
  component: QuizPage,
});

function QuizPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: quiz, isLoading } = useQuiz(id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitQuiz>> | null>(null);

  if (isLoading) return <AppShell title="Loading"><Skeleton className="h-64 rounded-3xl" /></AppShell>;
  if (!quiz) return <AppShell title="Not found"><p className="text-sm text-muted-foreground">This quiz is unavailable.</p></AppShell>;

  const questions = [...(quiz.quiz_questions ?? [])].sort((a, b) => a.position - b.position);
  const submit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error("Answer every question before submitting.");
      return;
    }
    setBusy(true);
    try {
      const next = await submitQuiz(id, questions.map((q) => ({ question_id: q.id, answer: answers[q.id]! })));
      setResult(next);
      if (next.passed) toast.success(`Quiz passed — ${next.xp} XP earned.`);
      else toast.message(`Score: ${next.scorePercent}%. You need 70% to pass.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Quiz submission failed.");
    } finally { setBusy(false); }
  };

  return (
    <AppShell title={quiz.title} subtitle={quiz.description ?? "Answer every question, then submit."}>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <section key={q.id} className="surface-glass rounded-3xl p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Question {index + 1}</p>
            <h2 className="mt-2 font-display text-lg font-semibold">{q.prompt}</h2>
            <div className="mt-4 grid gap-2">
              {(q.options ?? []).map((option) => (
                <button key={option} type="button" onClick={() => setAnswers((a) => ({ ...a, [q.id]: option }))} className={`rounded-2xl border p-3 text-left text-sm transition ${answers[q.id] === option ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
                  {option}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Button disabled={busy || Boolean(result?.passed)} onClick={() => void submit()} className="mt-5 w-full rounded-2xl">{busy ? "Submitting…" : result?.passed ? "Passed" : "Submit quiz"}</Button>
      {result && <section className="mt-5 rounded-3xl border border-border p-5"><p className="font-display text-xl font-semibold">{result.passed ? "Well done" : "Keep learning"}</p><p className="mt-2 text-sm text-muted-foreground">{result.correct}/{result.total} correct · {result.scorePercent}%</p>{result.passed && <Link to="/learn" className="mt-4 inline-block text-sm font-semibold text-primary">Continue learning →</Link>}</section>}
      <button className="mt-4 w-full text-sm text-muted-foreground underline" onClick={() => void navigate({ to: "/learn" })}>Back to learning paths</button>
    </AppShell>
  );
}
