import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { useAuth } from "@/lib/auth";
import { greeting, levelProgress, rankForLevel } from "@/lib/gamification";
import { useMissions, usePaths, useDocuments } from "@/lib/queries";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { Flame, Sparkles, BookOpen, ChevronRight, Target, Trophy, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nahj AI — Learn from Authentic Sources" },
      {
        name: "description",
        content:
          "Daily missions, streaks and guided paths built on authentic Islamic scholarship. Learn a little every day with Nahj AI.",
      },
      { property: "og:title", content: "Nahj AI — Learn from Authentic Sources" },
      {
        property: "og:description",
        content: "Daily missions, streaks and guided paths built on authentic Islamic scholarship.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { profile, isGuest, loading } = useAuth();
  const { data: missions } = useMissions(profile?.user_id);
  const { data: paths, isLoading: pathsLoading } = usePaths();
  const { data: docs } = useDocuments();

  const xp = profile?.xp ?? 0;
  const prog = levelProgress(xp);
  const rank = rankForLevel(prog.level);
  const daily = (missions ?? []).filter((m) => m.cadence === "daily").slice(0, 3);

  return (
    <AppShell showHeader={false}>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-4xl gradient-deep p-5 text-deep-foreground shadow-lift">
        <div className="absolute inset-0 geo-pattern opacity-20" aria-hidden="true" />
        <div className="relative flex items-start gap-4">
          <div className="relative">
            <AvatarCanvas
              config={profile?.avatar_config ?? null}
              size={72}
              mood="wave"
              className="rounded-3xl ring-2 ring-gold/50"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full gradient-gold px-2 py-0.5 text-[10px] font-bold text-charcoal">
              LVL {prog.level}
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-xs uppercase tracking-widest text-deep-foreground/60">{greeting()}</p>
            <h1 className="truncate font-display text-2xl font-semibold">
              {loading ? "…" : (profile?.display_name ?? "Seeker of knowledge")}
            </h1>
            <p className="mt-0.5 text-xs text-gold">{rank.name}</p>
          </div>
        </div>

        <div className="relative mt-5">
          <div className="mb-1.5 flex items-center justify-between text-xs text-deep-foreground/70">
            <span>{prog.into} XP</span>
            <span>{prog.needed} XP to level {prog.level + 1}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-deep-foreground/15">
            <div
              className="h-full rounded-full gradient-gold transition-all duration-1000 ease-out"
              style={{ width: `${prog.percent}%` }}
            />
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2">
          <Stat icon={<Flame className="h-4 w-4" />} label="Streak" value={`${profile?.streak ?? 0}d`} />
          <Stat icon={<Sparkles className="h-4 w-4" />} label="XP" value={xp.toLocaleString()} />
          <Stat icon={<BookOpen className="h-4 w-4" />} label="Library" value={`${docs?.length ?? 0}`} />
        </div>

        {isGuest && (
          <div className="relative mt-5 rounded-2xl border border-gold/30 bg-deep-foreground/5 p-3">
            <p className="text-xs text-deep-foreground/80">
              You're exploring as a guest — progress isn't saved.
            </p>
            <Button asChild size="sm" className="press mt-2.5 w-full rounded-xl gradient-gold text-charcoal">
              <Link to="/auth">Create a free account</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Daily missions */}
      <section className="mt-7">
        <SectionHead icon={<Target className="h-4 w-4" />} title="Today's missions" to="/profile" cta="All" />
        <div className="mt-3 space-y-2.5">
          {daily.length === 0 && <Skeleton className="h-16 rounded-2xl" />}
          {daily.map((m) => {
            const pct = Math.min(100, Math.round(((m.progress ?? 0) / m.target) * 100));
            return (
              <div key={m.id} className="surface-glass card-lift rounded-2xl p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{m.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.description}</p>
                  </div>
                  {m.completed ? (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-gold/15 px-2 py-1 text-[11px] font-bold text-gold-foreground">
                      +{m.xp_reward} XP
                    </span>
                  )}
                </div>
                <Progress value={pct} className="mt-2.5 h-1.5" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Learning paths */}
      <section className="mt-7">
        <SectionHead icon={<Trophy className="h-4 w-4" />} title="Continue learning" to="/learn" cta="All paths" />
        <div className="mt-3 space-y-3">
          {pathsLoading && <Skeleton className="h-24 rounded-3xl" />}
          {(paths ?? []).slice(0, 3).map((p) => (
            <Link
              key={p.id}
              to="/learn/$slug"
              params={{ slug: p.slug }}
              className="surface-glass card-lift block rounded-3xl p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl gradient-emerald text-xl">
                  📗
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.path_items?.length ?? 0} lessons · {p.difficulty}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ask CTA */}
      <Link
        to="/ask"
        className="press mt-7 flex items-center gap-3 overflow-hidden rounded-3xl border border-gold/30 bg-gold/8 p-4"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl gradient-gold text-charcoal">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">Ask the Knowledge Assistant</span>
          <span className="block text-xs text-muted-foreground">Answers cited from the library only</span>
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-deep-foreground/8 p-2.5 text-center">
      <span className="mx-auto flex items-center justify-center text-gold">{icon}</span>
      <p className="mt-1 font-display text-lg font-semibold leading-none">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-deep-foreground/60">{label}</p>
    </div>
  );
}

function SectionHead({
  icon,
  title,
  to,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  to: string;
  cta: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      <Link to={to} className="text-xs font-semibold text-primary">
        {cta}
      </Link>
    </div>
  );
}
