import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { AvatarCanvas, DEFAULT_AVATAR, type AvatarConfig, type AvatarSlot } from "@/components/avatar/AvatarCanvas";
import { Button } from "@/components/ui/button";
import { useAvatarItems } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/avatar")({ component: AvatarPage });

const slots: AvatarSlot[] = ["skin", "hair", "beard", "headwear", "outfit", "background", "frame"];

function AvatarPage() {
  const { profile, refreshProfile } = useAuth();
  const { data: items = [], isLoading } = useAvatarItems();
  const [config, setConfig] = useState<AvatarConfig>({ ...DEFAULT_AVATAR, ...(profile?.avatar_config ?? {}) });
  const [busy, setBusy] = useState<string | null>(null);

  const owned = useMemo(() => new Set<string>(), []);
  const grouped = useMemo(() => Object.fromEntries(slots.map(s => [s, items.filter(i => i.slot === s)])), [items]);

  async function choose(item: (typeof items)[number]) {
    setBusy(item.id);
    try {
      if (item.unlock_type === "coins" && item.coin_cost > 0 && !owned.has(item.id)) {
        const { data, error } = await supabase.rpc("purchase_avatar_item", { p_item_id: item.id });
        if (error) throw error;
        owned.add(item.id);
        toast.success(`Unlocked for ${item.coin_cost} coins`);
      }
      const next = { ...config, [item.slot]: item.value };
      setConfig(next);
      const { error } = await supabase.rpc("equip_avatar_config", { p_config: next });
      if (error) throw error;
      await refreshProfile();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update avatar");
    } finally { setBusy(null); }
  }

  return <AppShell title="Your Avatar" subtitle="Customize your learner"><div className="flex flex-col items-center"><AvatarCanvas config={config} size={180} mood="celebrate"/><p className="mt-3 text-center text-sm text-muted-foreground">Make your learner feel like yours. Free items are always available; cosmetic upgrades use coins.</p><Button asChild variant="outline" className="mt-4 rounded-2xl"><Link to="/profile">Back to profile</Link></Button></div>{isLoading ? <p className="mt-8 text-sm text-muted-foreground">Loading cosmetics…</p> : <div className="mt-8 space-y-6">{slots.map(slot => <section key={slot}><h2 className="mb-2 text-sm font-semibold capitalize">{slot}</h2><div className="grid grid-cols-2 gap-2">{(grouped[slot] ?? []).map(item => <button key={item.id} disabled={busy===item.id} onClick={()=>void choose(item)} className={`surface-glass rounded-2xl p-3 text-left transition ${config[slot]===item.value?"ring-2 ring-primary":""}`}><div className="flex items-center justify-between gap-2"><span className="font-medium">{item.name}</span>{item.unlock_type==="coins"&&<span className="text-xs text-gold">{item.coin_cost} coins</span>}</div><span className="text-xs text-muted-foreground">{config[slot]===item.value?"Equipped":"Choose"}</span></button>)}</div></section>)}</div>}</AppShell>;
}
