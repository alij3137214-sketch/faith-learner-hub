import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { Button } from "@/components/ui/button";
import { useDocuments, useScholars } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, BookOpen, CheckCircle2, Eye, LibraryBig } from "lucide-react";

export const Route = createFileRoute("/admin/content")({ component: AdminContentPage });

function AdminContentPage() {
  const { isAdmin } = useAuth();
  const { data: documents = [], isLoading } = useDocuments();
  const { data: scholars = [] } = useScholars();

  if (!isAdmin) {
    return <main className="flex min-h-screen items-center justify-center p-6"><div className="text-center"><h1 className="font-display text-2xl font-semibold">Admin access required</h1><p className="mt-2 text-sm text-muted-foreground">This area is restricted to the application owner/admin role.</p><Button asChild className="mt-5 rounded-2xl"><Link to="/">Return to app</Link></Button></div></main>;
  }

  const published = documents.filter((document) => document.published).length;
  const drafts = documents.length - published;

  return <AppShell title="Content management" subtitle="Owner-only source library control">
    <div className="mb-5 flex items-center justify-between gap-3">
      <Button asChild variant="outline" className="rounded-2xl"><Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Admin</Link></Button>
      <Link to="/library" className="text-sm font-semibold text-primary">Open learner library →</Link>
    </div>

    <section className="grid gap-3 sm:grid-cols-3">
      <Stat icon={<LibraryBig className="h-4 w-4" />} label="Documents" value={documents.length} />
      <Stat icon={<CheckCircle2 className="h-4 w-4" />} label="Published" value={published} />
      <Stat icon={<BookOpen className="h-4 w-4" />} label="Drafts" value={drafts} />
    </section>

    <section className="mt-6 surface-glass rounded-3xl p-5">
      <h2 className="font-display text-xl font-semibold">Source inventory</h2>
      <p className="mt-1 text-sm text-muted-foreground">Review attribution, publication state, and the learner-facing source before adding write controls.</p>
      {isLoading ? <p className="mt-5 text-sm text-muted-foreground">Loading content…</p> : <div className="mt-5 space-y-2">{documents.map((document) => <div key={document.id} className="rounded-2xl border border-border/70 p-4"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{document.title}</h3><span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold uppercase">{document.type}</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${document.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{document.published ? "Published" : "Draft"}</span></div><p className="mt-1 text-xs text-muted-foreground">{document.summary ?? "No summary"}</p><p className="mt-2 text-xs">Attribution: <span className="font-medium">{document.source ?? "Educational synthesis"}</span></p><p className="text-xs text-muted-foreground">Scholar: {document.scholars?.name ?? "Unattributed"}</p></div><Link to="/library/$id" params={{ id: document.id }} className="shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-muted"><Eye className="mr-1 inline h-3.5 w-3.5" />View</Link></div></div>)}</div>}
    </section>

    <section className="mt-6 surface-glass rounded-3xl p-5">
      <h2 className="font-display text-xl font-semibold">Scholars & attribution</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">{scholars.map((scholar) => <div key={scholar.id} className="rounded-2xl border border-border/70 p-4"><p className="font-semibold">{scholar.name}</p><p className="text-xs text-muted-foreground">{scholar.title ?? "Scholar"} · {scholar.published ? "Published" : "Draft"}</p></div>)}</div>
    </section>
  </AppShell>;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="surface-glass rounded-2xl p-4"><div className="flex items-center gap-2 text-primary">{icon}<span className="text-xs font-semibold">{label}</span></div><p className="mt-2 font-display text-2xl font-semibold">{value}</p></div>;
}
