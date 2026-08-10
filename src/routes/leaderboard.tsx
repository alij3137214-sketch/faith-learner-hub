import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { useLeaderboard } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Trophy, Flame, Sparkles } from "lucide-react";

export const Route=createFileRoute("/leaderboard")({component:LeaderboardPage});
function LeaderboardPage(){
 const {user}=useAuth(); const {data=[],isLoading,error}=useLeaderboard();
 const mine=data.find(p=>p.user_id===user?.id); const myRank=mine?data.findIndex(p=>p.user_id===mine.user_id)+1:null;
 return <AppShell title="Leaderboard" subtitle="Learn, progress, and climb">
  <section className="surface-glass mb-5 rounded-3xl p-5">
   <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-emerald text-primary-foreground"><Trophy className="h-5 w-5"/></div><div><p className="font-display text-lg font-semibold">Your standing</p><p className="text-sm text-muted-foreground">{mine?`#${myRank} · ${mine.xp.toLocaleString()} XP`:"Complete lessons and quizzes to enter the rankings."}</p></div></div>
  </section>
  {isLoading?<div className="space-y-2">{Array.from({length:8}).map((_,i)=><Skeleton key={i} className="h-16 rounded-2xl"/>)}</div>:error?<p className="surface-glass rounded-2xl p-5 text-sm text-destructive">Could not load the leaderboard. Please try again.</p>:!data.length?<p className="surface-glass rounded-2xl p-5 text-sm text-muted-foreground">No learners yet.</p>:<div className="space-y-2">{data.map((p,i)=><Link to="/profile" key={p.user_id} className={`surface-glass card-lift flex items-center gap-3 rounded-2xl p-3 ${p.user_id===user?.id?"ring-1 ring-primary/40":""}`}><span className="w-8 text-center font-display font-bold">#{i+1}</span><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">{(p.display_name??"?").slice(0,1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate font-semibold">{p.display_name}</p><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Sparkles className="h-3 w-3"/>Level {p.level}</span><span className="inline-flex items-center gap-1"><Flame className="h-3 w-3"/>{p.streak} day streak</span>{p.scholar_title&&<span>{p.scholar_title}</span>}</div></div><span className="text-sm font-bold text-primary">{p.xp.toLocaleString()} XP</span></Link>)}</div>}
 </AppShell>
}
