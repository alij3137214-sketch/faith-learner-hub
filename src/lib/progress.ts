import { supabase } from "@/integrations/supabase/client";
import { levelFromXp, periodKey } from "./gamification";

export type RewardResult = { xp: number; coins: number; levelUp: boolean; newLevel: number };

/** Award XP + coins to the current user, recompute level, and keep the streak alive. */
export async function awardXp(userId: string, xp: number, coins = 0): Promise<RewardResult | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, coins, level, streak, last_active_date")
    .eq("user_id", userId)
    .maybeSingle();
  if (!profile) return null;

  const newXp = profile.xp + xp;
  const newLevel = levelFromXp(newXp);
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let streak = profile.streak;
  if (profile.last_active_date !== today) {
    streak = profile.last_active_date === yesterday ? profile.streak + 1 : 1;
  }

  await supabase
    .from("profiles")
    .update({ xp: newXp, coins: profile.coins + coins, level: newLevel, streak, last_active_date: today })
    .eq("user_id", userId);

  return { xp, coins, levelUp: newLevel > profile.level, newLevel };
}

/** Idempotently grant an achievement by code. Returns true when newly earned. */
export async function grantAchievement(userId: string, code: string) {
  const { data: ach } = await supabase
    .from("achievements")
    .select("id, xp_reward, coin_reward")
    .eq("code", code)
    .maybeSingle();
  if (!ach) return false;

  const { data: existing } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", ach.id)
    .maybeSingle();
  if (existing) return false;

  await supabase.from("user_achievements").insert({ user_id: userId, achievement_id: ach.id });
  await awardXp(userId, ach.xp_reward, ach.coin_reward);
  return true;
}

/** Increment progress on a mission for the current period. */
export async function bumpMission(userId: string, code: string, amount = 1) {
  const { data: mission } = await supabase
    .from("missions")
    .select("id, target, cadence, xp_reward, coin_reward")
    .eq("code", code)
    .maybeSingle();
  if (!mission) return;

  const key = periodKey(mission.cadence);
  const { data: row } = await supabase
    .from("user_missions")
    .select("id, progress, completed")
    .eq("user_id", userId)
    .eq("mission_id", mission.id)
    .eq("period_key", key)
    .maybeSingle();

  const progress = Math.min(mission.target, (row?.progress ?? 0) + amount);
  const completed = progress >= mission.target;

  if (row) {
    if (row.completed) return;
    await supabase.from("user_missions").update({ progress, completed }).eq("id", row.id);
  } else {
    await supabase
      .from("user_missions")
      .insert({ user_id: userId, mission_id: mission.id, progress, completed, period_key: key });
  }

  if (completed && !row?.completed) await awardXp(userId, mission.xp_reward, mission.coin_reward);
}

/** Mark a document as read, award its XP once, and progress the reading mission. */
export async function completeDocument(userId: string, documentId: string, xpReward: number) {
  const { data: existing } = await supabase
    .from("user_progress")
    .select("id, completed")
    .eq("user_id", userId)
    .eq("document_id", documentId)
    .maybeSingle();

  if (existing?.completed) return null;

  if (existing) {
    await supabase.from("user_progress").update({ completed: true, percent: 100, last_read_at: new Date().toISOString() }).eq("id", existing.id);
  } else {
    await supabase.from("user_progress").insert({ user_id: userId, document_id: documentId, completed: true, percent: 100 });
  }

  const reward = await awardXp(userId, xpReward, Math.round(xpReward / 4));
  await bumpMission(userId, "daily_read");
  await grantAchievement(userId, "first_read");

  const { count } = await supabase
    .from("user_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true);
  if ((count ?? 0) >= 5) await grantAchievement(userId, "five_reads");

  return reward;
}

export async function completePathItem(userId: string, pathItemId: string, xpReward: number) {
  const { data: existing } = await supabase
    .from("user_progress")
    .select("id, completed")
    .eq("user_id", userId)
    .eq("path_item_id", pathItemId)
    .maybeSingle();
  if (existing?.completed) return null;

  if (existing) {
    await supabase.from("user_progress").update({ completed: true, percent: 100 }).eq("id", existing.id);
  } else {
    await supabase.from("user_progress").insert({ user_id: userId, path_item_id: pathItemId, completed: true, percent: 100 });
  }

  const reward = await awardXp(userId, xpReward, Math.round(xpReward / 4));
  await bumpMission(userId, "daily_lesson");
  return reward;
}
