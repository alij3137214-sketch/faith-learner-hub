# Nahj AI — Live CTO Status

Last updated: 2026-08-07

## Current state

- Repository: `alij3137214-sketch/faith-learner-hub`
- Production branch: `main`
- Development branch: `agent/integrity-hardening`
- Draft PR: #1 — Integrity hardening
- PR URL: https://github.com/alij3137214-sketch/faith-learner-hub/pull/1
- PR is intentionally not merged.

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
10. Added GitHub Actions CI for `npm ci`, `npm run lint`, and `npm run build`.
11. Removed the tracked `.env` file from this development branch and added `.env`/`.env.*` to `.gitignore`.

## Important verification status

- GitHub writes are working through the connected GitHub tool: commits were created on `agent/integrity-hardening`.
- Draft PR #1 exists and tracks the branch.
- GitHub Actions currently has no visible workflow run from the connector; repository Actions permissions could not be inspected because the integration returned HTTP 403. Do not claim CI passed.
- The Supabase migration has been written but has NOT been applied to the live Supabase project from this tool. Do not claim the production database is hardened yet.
- No production deployment has been claimed.

## Next required work

1. Verify the SQL migration against the actual Supabase project/schema.
2. Apply migrations to the Supabase project through an authorized deployment path.
3. Run lint/build/tests in CI or another executable environment.
4. Exercise auth, document completion, path completion, mission progression, quiz grading, duplicate submission, and unauthorized-write cases.
5. Fix any failures.
6. Re-review the PR.
7. Only then merge to `main` and deploy.
8. Perform production smoke tests.

## CTO rule

Never tell the owner that the product is production-ready until database migration, build/test, deployment, and smoke-test evidence exists. Continue from this status instead of restarting the project in a new chat.
