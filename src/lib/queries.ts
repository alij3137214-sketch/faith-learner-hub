import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { periodKey } from "./gamification";

export function useScholars() {
  return useQuery({
    queryKey: ["scholars"],
    queryFn: async () => {
      const { data, error } = await supabase.from("scholars").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useDocuments(filters?: { scholarId?: string; type?: string; search?: string; category?: string }) {
  return useQuery({
    queryKey: ["documents", filters],
    queryFn: async () => {
      let q = supabase.from("documents").select("*, scholars(name, slug)").order("created_at", { ascending: false });
      if (filters?.scholarId) q = q.eq("scholar_id", filters.scholarId);
      if (filters?.type) q = q.eq("type", filters.type as never);
      if (filters?.category) q = q.eq("category", filters.category);
      if (filters?.search) q = q.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*, scholars(name, slug, title)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function usePaths() {
  return useQuery({
    queryKey: ["paths"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_paths")
        .select("*, path_items(id)")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function usePath(slug: string) {
  return useQuery({
    queryKey: ["path", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_paths")
        .select("*, path_items(*)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (data?.path_items) data.path_items.sort((a, b) => a.position - b.position);
      return data;
    },
  });
}

export function useQuiz(id: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["quiz", id],
    queryFn: async () => {
      const { data: quiz, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      if (!quiz) return null;

      const { data: questions, error: questionError } = await supabase.rpc("get_quiz_questions_public", {
        p_quiz_id: id!,
      });
      if (questionError) throw questionError;

      return { ...quiz, quiz_questions: questions ?? [] };
    },
  });
}

export function useMyProgress(userId?: string) {
  return useQuery({
    enabled: Boolean(userId),
    queryKey: ["progress", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", userId!);
      if (error) throw error;
      return data;
    },
  });
}

export function useMissions(userId?: string) {
  return useQuery({
    queryKey: ["missions", userId],
    queryFn: async () => {
      const { data: missions, error } = await supabase.from("missions").select("*").eq("active", true);
      if (error) throw error;
      if (!userId) return missions.map((m) => ({ ...m, progress: 0, completed: false }));

      const currentPeriods = new Map(missions.map((m) => [m.id, periodKey(m.cadence)]));
      const { data: mine, error: mineError } = await supabase
        .from("user_missions")
        .select("*")
        .eq("user_id", userId);
      if (mineError) throw mineError;

      return missions.map((m) => {
        const row = mine?.find((x) => x.mission_id === m.id && x.period_key === currentPeriods.get(m.id));
        return { ...m, progress: row?.progress ?? 0, completed: row?.completed ?? false };
      });
    },
  });
}

export function useAchievements(userId?: string) {
  return useQuery({
    queryKey: ["achievements", userId],
    queryFn: async () => {
      const { data: all, error } = await supabase.from("achievements").select("*").order("xp_reward");
      if (error) throw error;
      if (!userId) return all.map((a) => ({ ...a, earned: false }));
      const { data: mine, error: mineError } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", userId);
      if (mineError) throw mineError;
      return all.map((a) => ({ ...a, earned: Boolean(mine?.some((m) => m.achievement_id === a.id)) }));
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, xp, level, streak, avatar_config, scholar_title")
        .order("xp", { ascending: false })
        .limit(25);
      if (error) throw error;
      return data;
    },
  });
}

export function useAvatarItems() {
  return useQuery({
    queryKey: ["avatar-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("avatar_items")
        .select("*")
        .eq("active", true)
        .order("slot")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}
