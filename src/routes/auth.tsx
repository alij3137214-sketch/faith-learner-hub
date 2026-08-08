import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <main className="flex min-h-screen items-center justify-center">Loading…</main>;
  if (user) {
    void navigate({ to: "/", replace: true });
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) setMessage(error.message);
        else await navigate({ to: "/", replace: true });
      } else {
        if (password.length < 8) {
          setMessage("Password must be at least 8 characters.");
          return;
        }
        const result = await signUp(email, password, displayName);
        if (result.error) setMessage(result.error.message);
        else if (result.needsConfirmation) setMessage("Account created. Check your email to confirm your account, then sign in.");
        else await navigate({ to: "/", replace: true });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="surface-glass w-full max-w-md rounded-3xl p-6 shadow-lift">
        <Link to="/auth" className="text-sm text-primary">Nahj AI</Link>
        <h1 className="mt-8 font-display text-3xl font-semibold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Email and password are required to enter the app and save progress.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && <label className="block text-sm font-medium">Display name<Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" autoComplete="name" /></label>}
          <label className="block text-sm font-medium">Email<Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
          <label className="block text-sm font-medium">Password<Input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={mode === "signin" ? "current-password" : "new-password"} /></label>
          {message && <p className="rounded-xl border border-border bg-muted/50 p-3 text-sm">{message}</p>}
          <Button disabled={busy} className="w-full rounded-2xl" type="submit">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}</Button>
        </form>
        <button className="mt-5 w-full text-sm text-primary underline-offset-4 hover:underline" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }}>
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}
