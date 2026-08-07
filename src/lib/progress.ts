import { supabase } from "@/integrations/supabase/client";

export type RewardResult = {
  xp: number;
  coins: number;
  levelUp: boolean;
  newLevel: number;
};

type RpcReward = {
  rewarded?: boolean;
  xp?: number;
  coins?: number;
  level?: number;
  levelUp?: boolean;
  streak?: number;
};

function toRewardResult(data: RpcReward | null): RewardResult | null {
  if (!data || data.rewarded === false) return null;
  return {
    xp: data.xp ?? 0,
    coins: data.coins ?? 0,
    levelUp: Boolean(data.levelUp),
    newLevel: data.level ?? 1,
  };
}

/**
 * Progression is database-authoritative. Arbitrary client-supplied XP is no
 * longer accepted; callers must use a domain action such as completeDocument,
 * completePathItem, or submitQuiz so the database chooses the reward.
 */
export async function awardXp(_userId: string, _xp: number, _coins = 0): Promise<RewardResult | null> {
  throw new Error("Direct XP awards are disabled; use a server-authoritative progression action.");
}

/** Server-authoritative document completion and reward. */
export async function completeDocument(userId: string, documentId: string, _xpReward?: number) {
  const { data, error } = await supabase.rpc("complete_document", { p_document_id: documentId });
  if (error) throw error;
  if (userId !== (await supabase.auth.getUser()).data.user?.id) return null;
  return toRewardResult(data as RpcReward | null);
}

/** Server-authoritative learning-path item completion and reward. */
export async function completePathItem(userId: string, pathItemId: string, _xpReward?: number) {
  const { data, error } = await supabase.rpc("complete_path_item", { p_path_item_id: pathItemId });
  if (error) throw error;
  if (userId !== (await supabase.auth.getUser()).data.user?.id) return null;
  return toRewardResult(data as RpcReward | null);
}

/** Server-authoritative mission progress. Reward values never come from the browser. */
export async function bumpMission(userId: string, code: string, amount = 1) {
  if (userId !== (await supabase.auth.getUser()).data.user?.id) return null;
  const { data, error } = await supabase.rpc("bump_mission_internal", {
    p_user_id: userId,
    p_code: code,
    p_amount: amount,
  });
  if (error) throw error;
  return data;
}

/**
 * Achievement grants are intentionally no longer directly callable from the
 * learner client. The database grants them as a consequence of trusted actions.
 */
export async function grantAchievement(_userId: string, _code: string) {
  throw new Error("Direct achievement grants are disabled; achievements are server-managed.");
}

export type QuizSubmission = {
  question_id: string;
  answer: string;
};

export type QuizResult = {
  alreadyPassed: boolean;
  correct: number;
  total: number;
  scorePercent: number;
  passed: boolean;
  xp: number;
  coins: number;
};

/** Grade a quiz inside Postgres; the answer key never reaches the browser. */
export async function submitQuiz(quizId: string, answers: QuizSubmission[]): Promise<QuizResult> {
  const { data, error } = await supabase.rpc("submit_quiz", {
    p_quiz_id: quizId,
    p_answers: answers,
  });
  if (error) throw error;
  return data as QuizResult;
}
