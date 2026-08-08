# CTO production reconciliation

Date: 2026-08-08

## Production project

Supabase project: `wkkxzswiomwsnqnkjpft`

The production database has 17 public application tables and RLS is enabled on all of them.

## Migration drift

Production records five applied migrations:

- `20260807232403_initial_schema_20260807193129`
- `20260807232713_nahj_ai_integrity_hardening`
- `20260807232724_nahj_ai_security_performance_hardening`
- `20260807232749_nahj_ai_quiz_public_rpc`
- `20260807233714_nahj_ai_security_cleanup`

The repository's migration directory does not currently represent this exact production history.

## Backend surface

Production exposes progression/authentication functions including:

- `apply_progression_reward`
- `bump_mission_internal`
- `complete_document`
- `complete_path_item`
- `get_quiz_questions_public`
- `grant_achievement_internal`
- `handle_new_user`
- `has_role`
- `submit_quiz`
- `update_my_profile`
- `protect_profile_authority`

Several are SECURITY DEFINER and therefore require careful review before any policy or privilege changes.

## RLS observations

RLS is enabled across the public application tables. Public read policies exist for published content such as documents, paths, quizzes, scholars, achievements, missions, and avatar items. User-owned tables generally restrict reads to the authenticated user's `auth.uid()` or an admin role.

No RLS policy changes were made during this audit.

## Data state

`pg_stat_user_tables.n_live_tup` reports zero estimated rows across the 17 application tables. The production schema is therefore present, but application content and user data are not populated.

## Safety decision

Do not run the repository seed migration or apply new DDL until the five production migrations and their function/policy definitions have been reconstructed and compared against GitHub. Production remains unchanged by this audit.
