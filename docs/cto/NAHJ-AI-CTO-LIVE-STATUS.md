# Nahj AI — Live CTO Status

Last updated: 2026-08-07

## Current state

- Repository: `alij3137214-sketch/faith-learner-hub`
- Production branch: `main`
- Development branch: `agent/integrity-hardening`
- PR #1 — Integrity hardening
- PR URL: https://github.com/alij3137214-sketch/faith-learner-hub/pull/1
- PR is intentionally not merged until application-level verification and deployment review are complete.

## Work completed on this branch

1. Added database-authoritative progression migration.
2. Added idempotent `progression_events` reward ledger.
3. Added database-side quiz attempts and grading.
4. Added `quiz_questions_public` projection that excludes answer keys.
5. Revoked direct learner writes to progression, mission, achievement, avatar-ownership, and quiz-attempt tables.
6. Added protected profile-authority trigger for XP/coins/level/streak/activity/suspension fields.
7. Added authenticated RPCs for document completion, path-item completion, quiz submission, profile preferences, and mission progress.
8. Updated `src/lib/progress.ts` to use trusted RPCs rather than client-side reward calculations.
9. Updated `src/lib/queries.ts` to read quiz questions through the safe projection and to scope missions to the current period.
10. Added GitHub Actions CI using the repository's synced Bun lockfile (`bun install --frozen-lockfile`, lint, build).
11. Removed the tracked `.env` file from this development branch and added `.env`/`.env.*` to `.gitignore`.
12. Added persistent CTO handoff documentation.
13. Locked the learner-facing `bump_mission` RPC so authenticated learners cannot directly manufacture mission progress.
14. Restored quiz publishing/admin management safely: only admins can read or mutate the source `quiz_questions` table; learners continue using `quiz_questions_public`.
15. Applied Supabase security cleanup: removed the legacy public SELECT policy from `quiz_questions`, added a `quiz_attempts(quiz_id)` index, and optimized profile RLS auth checks.
16. Synchronized that security cleanup as migration `20260807234000_nahj_ai_security_cleanup.sql` on the development branch.

## Verification status

- GitHub writes are confirmed working through the connected GitHub tool; commit `fc3c38d4926d89168b618cd42f6af6c4e9e946c1` created the latest migration on `agent/integrity-hardening`.
- PR #1 exists and tracks the branch.
- The latest confirmed CI run before the security-cleanup commit was successful: dependency installation, lint, and production build passed.
- Supabase project `wkkxzswiomwsnqnkjpft` is ACTIVE_HEALTHY.
- Supabase migration history contains the initial schema plus the integrity/security/quiz migrations, and the new security cleanup was successfully applied to the connected project.
- Security advisor no longer reports the public quiz-question policy or the profile auth RLS init-plan findings. Remaining warnings concern SECURITY DEFINER RPC exposure that is intentional for authenticated domain actions and should be reviewed before production.
- No production deployment or merge to `main` has been claimed.

## Next required work

1. Push/verify CI for the latest security-cleanup commit.
2. Exercise auth, document completion, path completion, mission progression, quiz grading, duplicate submission, answer-key isolation, admin publishing, and unauthorized-write cases.
3. Review SECURITY DEFINER RPC exposure and ensure each callable function has a deliberate authenticated contract.
4. Review RAG/source provenance and duel behavior.
5. Re-review PR #1.
6. Only then merge to `main` and deploy.
7. Perform production smoke tests and record evidence.

## CTO rule

Never tell the owner that the product is production-ready until database migration, build/test, deployment, and smoke-test evidence exists. Continue from this status instead of restarting the project in a new chat.
