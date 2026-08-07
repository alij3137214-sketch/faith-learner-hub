import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { useDocument } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/library/$id")({
  head: () => ({
    meta: [
      { title: "Reading — Nahj AI Library" },
      { name: "description", content: "Read an indexed source from the Nahj AI knowledge library." },
      { property: "og:title", content: "Reading — Nahj AI Library" },
      { property: "og:description", content: "Read an indexed source from the Nahj AI knowledge library." },
    ],
  }),
  component: DocumentPage,
});

function DocumentPage() {
  const { id } = Route.useParams();
  const { data: doc, isLoading } = useDocument(id);

  if (isLoading) {
    return (
      <AppShell title="Loading">
        <Skeleton className="h-64 rounded-3xl" />
      </AppShell>
    );
  }

  if (!doc) {
    return (
      <AppShell title="Not found">
        <p className="text-sm text-muted-foreground">This document is no longer available.</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={doc.title} subtitle={doc.summary ?? ""}>
      <article className="surface-glass rounded-3xl p-5">
        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
          {doc.type}
        </span>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/90">
          {String(doc.body ?? "")
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </div>
      </article>
    </AppShell>
  );
}
