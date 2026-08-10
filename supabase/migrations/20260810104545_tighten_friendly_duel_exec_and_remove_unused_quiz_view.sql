-- Reassert the friendly-duel RPC execution contract and remove an unused
-- security-definer view. The application reads quiz questions through the
-- authenticated RPC get_quiz_questions_public instead of this view.
revoke execute on function public.create_friendly_duel(uuid, uuid) from anon, public;
revoke execute on function public.accept_friendly_duel(uuid) from anon, public;
revoke execute on function public.get_friendly_duel_questions(uuid) from anon, public;
revoke execute on function public.submit_friendly_duel_answer(uuid, uuid, text, integer) from anon, public;

grant execute on function public.create_friendly_duel(uuid, uuid) to authenticated;
grant execute on function public.accept_friendly_duel(uuid) to authenticated;
grant execute on function public.get_friendly_duel_questions(uuid) to authenticated;
grant execute on function public.submit_friendly_duel_answer(uuid, uuid, text, integer) to authenticated;

drop view if exists public.quiz_questions_public;
