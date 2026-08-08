-- Avatar catalog expansion
insert into public.avatar_items (slot,code,name,value,rarity,unlock_type,unlock_value,coin_cost,sort_order,active) values
('skin','skin_warm','Warm',' #d9a577','common','free',0,0,1,true),
('skin','skin_light','Light','#f1c7a2','common','coins',0,25,2,true),
('skin','skin_deep','Deep','#8d5b3f','common','coins',0,25,3,true),
('hair','hair_short','Short hair','short','common','free',0,0,1,true),
('hair','hair_wavy','Wavy hair','wavy','common','coins',0,25,2,true),
('hair','hair_long','Long hair','long','common','coins',0,25,3,true),
('beard','beard_none','Clean','none','common','free',0,0,1,true),
('beard','beard_stubble','Stubble','stubble','common','coins',0,25,2,true),
('beard','beard_full','Full beard','full','common','coins',0,40,3,true),
('headwear','headwear_none','None','none','common','free',0,0,1,true),
('headwear','headwear_cap','Cap','cap:#2b2f2d','common','coins',0,40,2,true),
('headwear','headwear_turban','White turban','turban:#f6f3ea','rare','coins',0,75,3,true),
('headwear','headwear_hijab','Hijab','hijab:#f6f3ea','rare','coins',0,75,4,true),
('outfit','outfit_emerald','Emerald','#0f7a5a','common','free',0,0,1,true),
('outfit','outfit_navy','Navy','#233d63','common','coins',0,35,2,true),
('outfit','outfit_plum','Plum','#643d63','common','coins',0,35,3,true),
('background','bg_emerald','Emerald','emerald','common','free',0,0,1,true),
('background','bg_dawn','Dawn','dawn','common','coins',0,25,2,true),
('background','bg_night','Night','night','common','coins',0,35,3,true),
('background','bg_gold','Gold','gold','rare','coins',0,60,4,true),
('frame','frame_thin','Thin','thin','common','free',0,0,1,true),
('frame','frame_gold','Gold','gold','rare','coins',0,60,2,true),
('frame','frame_geometric','Geometric','geometric','rare','coins',0,60,3,true)
on conflict (slot,code) do update set name=excluded.name,value=excluded.value,rarity=excluded.rarity,unlock_type=excluded.unlock_type,coin_cost=excluded.coin_cost,sort_order=excluded.sort_order,active=true;

create table if not exists public.duels (
  id uuid primary key default gen_random_uuid(),
  challenger_id uuid not null references auth.users(id) on delete cascade,
  opponent_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete restrict,
  invite_code text not null unique,
  status text not null default 'pending' check (status in ('pending','active','completed','declined','cancelled')),
  challenger_score integer not null default 0,
  opponent_score integer not null default 0,
  winner_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  check (challenger_id <> opponent_id)
);

create table if not exists public.duel_questions (
  id uuid primary key default gen_random_uuid(),
  duel_id uuid not null references public.duels(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete restrict,
  position integer not null,
  unique (duel_id, question_id),
  unique (duel_id, position)
);

create table if not exists public.duel_answers (
  id uuid primary key default gen_random_uuid(),
  duel_id uuid not null references public.duels(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete restrict,
  answer text not null,
  correct boolean not null default false,
  response_ms integer,
  created_at timestamptz not null default now(),
  unique (duel_id, user_id, question_id)
);

alter table public.duels enable row level security;
alter table public.duel_questions enable row level security;
alter table public.duel_answers enable row level security;

create policy "duel participants can read duel" on public.duels for select to authenticated using (auth.uid() = challenger_id or auth.uid() = opponent_id);
create policy "users can create duels" on public.duels for insert to authenticated with check (auth.uid() = challenger_id and challenger_id <> opponent_id);
create policy "duel participants can read questions" on public.duel_questions for select to authenticated using (exists (select 1 from public.duels d where d.id = duel_id and (d.challenger_id = auth.uid() or d.opponent_id = auth.uid())));
create policy "duel participants can read answers" on public.duel_answers for select to authenticated using (exists (select 1 from public.duels d where d.id = duel_id and (d.challenger_id = auth.uid() or d.opponent_id = auth.uid())));

create or replace function public.create_friendly_duel(p_opponent_id uuid, p_quiz_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_id uuid; v_code text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_opponent_id = auth.uid() then raise exception 'You cannot duel yourself'; end if;
  if not exists(select 1 from public.profiles where user_id=p_opponent_id and suspended=false) then raise exception 'Opponent not found'; end if;
  if not exists(select 1 from public.quizzes where id=p_quiz_id and published=true) then raise exception 'Quiz not found'; end if;
  v_code := upper(substr(encode(gen_random_bytes(8),'hex'),1,8));
  insert into public.duels(challenger_id,opponent_id,quiz_id,invite_code) values(auth.uid(),p_opponent_id,p_quiz_id,v_code) returning id into v_id;
  insert into public.duel_questions(duel_id,question_id,position)
    select v_id,id,row_number() over(order by position,id) from public.quiz_questions where quiz_id=p_quiz_id order by position,id limit 5;
  return jsonb_build_object('id',v_id,'invite_code',v_code);
end; $$;

create or replace function public.accept_friendly_duel(p_duel_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v jsonb;
begin
  update public.duels set status='active', started_at=coalesce(started_at,now()) where id=p_duel_id and opponent_id=auth.uid() and status='pending';
  if not found then raise exception 'Duel unavailable'; end if;
  select jsonb_build_object('id',id,'status',status,'quiz_id',quiz_id,'invite_code',invite_code) into v from public.duels where id=p_duel_id;
  return v;
end; $$;

create or replace function public.get_friendly_duel_questions(p_duel_id uuid)
returns table(id uuid, position integer, prompt text, options text[])
language sql security definer set search_path=public as $$
  select dq.id,dq.position,qq.prompt,qq.options
  from public.duel_questions dq join public.quiz_questions qq on qq.id=dq.question_id
  join public.duels d on d.id=dq.duel_id
  where dq.duel_id=p_duel_id and (d.challenger_id=auth.uid() or d.opponent_id=auth.uid())
  order by dq.position;
$$;

create or replace function public.submit_friendly_duel_answer(p_duel_id uuid,p_question_id uuid,p_answer text,p_response_ms integer default null)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_correct boolean; v_user uuid:=auth.uid(); v_challenger uuid; v_opponent uuid; v_count integer; v_total integer; v_ch_score integer; v_op_score integer; v_winner uuid;
begin
  select challenger_id,opponent_id into v_challenger,v_opponent from public.duels where id=p_duel_id and status in ('active','pending') and (challenger_id=v_user or opponent_id=v_user);
  if v_challenger is null then raise exception 'Duel unavailable'; end if;
  select qq.answer = p_answer into v_correct from public.quiz_questions qq join public.duel_questions dq on dq.question_id=qq.id where dq.duel_id=p_duel_id and qq.id=p_question_id;
  if v_correct is null then raise exception 'Question not in duel'; end if;
  insert into public.duel_answers(duel_id,user_id,question_id,answer,correct,response_ms) values(p_duel_id,v_user,p_question_id,p_answer,v_correct,p_response_ms) on conflict (duel_id,user_id,question_id) do nothing;
  update public.duels set status='active', started_at=coalesce(started_at,now()) where id=p_duel_id and status='pending';
  select count(*) filter(where correct) into v_count from public.duel_answers where duel_id=p_duel_id and user_id=v_user;
  select count(*) into v_total from public.duel_questions where duel_id=p_duel_id;
  select count(*) filter(where user_id=v_challenger and correct), count(*) filter(where user_id=v_opponent and correct) into v_ch_score,v_op_score from public.duel_answers where duel_id=p_duel_id;
  v_winner := case when v_ch_score > v_op_score then v_challenger when v_op_score > v_ch_score then v_opponent else null end;
  if (select count(*) from public.duel_answers where duel_id=p_duel_id) >= v_total*2 then
    update public.duels set status='completed',completed_at=now(),challenger_score=v_ch_score,opponent_score=v_op_score,winner_id=v_winner where id=p_duel_id;
    if v_winner is not null then
      insert into public.progression_events(user_id,event_key,event_type,xp_awarded,coins_awarded) values(v_winner,'duel:'||p_duel_id::text||':win','duel_win',50,10) on conflict do nothing;
      update public.profiles set xp=xp+50,coins=coins+10,updated_at=now() where user_id=v_winner;
    end if;
  else
    update public.duels set challenger_score=v_ch_score,opponent_score=v_op_score where id=p_duel_id;
  end if;
  return jsonb_build_object('correct',v_correct,'my_score',v_count,'total',v_total,'challenger_score',v_ch_score,'opponent_score',v_op_score,'status',(select status from public.duels where id=p_duel_id));
end; $$;

grant execute on function public.create_friendly_duel(uuid,uuid) to authenticated;
grant execute on function public.accept_friendly_duel(uuid) to authenticated;
grant execute on function public.get_friendly_duel_questions(uuid) to authenticated;
grant execute on function public.submit_friendly_duel_answer(uuid,uuid,text,integer) to authenticated;
