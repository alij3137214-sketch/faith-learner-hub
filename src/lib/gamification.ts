export const SCHOLAR_RANKS = [
  { min: 1, name: "Seeker", short: "Seeker" },
  { min: 3, name: "Student of Knowledge", short: "Student" },
  { min: 6, name: "Reader of Texts", short: "Reader" },
  { min: 10, name: "Reflective Thinker", short: "Thinker" },
  { min: 15, name: "Companion of Books", short: "Companion" },
  { min: 22, name: "Teacher of Peers", short: "Teacher" },
  { min: 30, name: "Grand Scholar", short: "Grand Scholar" },
] as const;

export function levelFromXp(xp: number) {
  // Smooth curve: level n requires 100 * n^1.35 cumulative XP
  let level = 1;
  while (xpForLevel(level + 1) <= xp && level < 99) level += 1;
  return level;
}

export function xpForLevel(level: number) {
  if (level <= 1) return 0;
  return Math.round(100 * Math.pow(level - 1, 1.35));
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const current = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = Math.max(1, next - current);
  return {
    level,
    current,
    next,
    into: xp - current,
    needed: next - xp,
    percent: Math.min(100, Math.round(((xp - current) / span) * 100)),
  };
}

export function rankForLevel(level: number) {
  let rank: { min: number; name: string; short: string } = SCHOLAR_RANKS[0];
  for (const r of SCHOLAR_RANKS) if (level >= r.min) rank = r;
  return rank;
}

export function periodKey(cadence: string, date = new Date()) {
  if (cadence === "weekly") {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
  }
  return date.toISOString().slice(0, 10);
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return "Peace be with you";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export const DISCLAIMER =
  "AI-generated explanations summarize uploaded source material and are not direct quotations. Always consult the cited source for complete context.";
