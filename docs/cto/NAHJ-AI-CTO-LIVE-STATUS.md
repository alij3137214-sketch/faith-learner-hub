# Nahj AI — Live CTO Status

Last updated: 2026-08-07

## Current state

- Repository: `alij3137214-sketch/faith-learner-hub`
- Production branch: `main`
- Development branch: `agent/integrity-hardening`
- PR #1 — Integrity hardening
- PR URL: https://github.com/alij3137214-sketch/faith-learner-hub/pull/1
- PR is intentionally not merged until deployment verification is complete.

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

## Verification status

- GitHub writes are confirmed working through the connected GitHub tool; commits have been created on `agent/integrity-hardening`.
- PR #1 exists and tracks the branch.
- CI was corrected from stale npm-lock installation to the repository's synced Bun lockfile.
- CI run #17 completed successfully: dependency installation, lint, and production build all passed.
- A subsequent CI run is currently verifying the latest security migration.
- Supabase migrations have been written but have NOT been applied to the live Supabase project from this tool. Do not claim production database hardening yet.
- No production deployment has been claimed.

## Next required work

1. Confirm the latest CI run is green.
2. Verify all migrations against the actual Supabase project/schema.
3. Apply migrations through an authorized Supabase deployment path.
4. Exercise auth, document completion, path completion, mission progression, quiz grading, duplicate submission, answer-key isolation, admin publishing, and unauthorized-write cases.
5. Fix any failures.
6. Re-review PR #1.
7. Only then merge to `main` and deploy.
8. Perform production smoke tests and record evidence.

## CTO rule

Never tell the owner that the product is production-ready until database migration, build/test, deployment, and smoke-test evidence exists. Continue from this status instead of restarting the project in a new chat.
