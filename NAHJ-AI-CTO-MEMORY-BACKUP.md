# NAHJ AI — CTO MEMORY BACKUP / HANDOFF
Version: 1.0
Date: 2026-08-07

## PURPOSE
Persistent handoff for Nahj AI. If a new ChatGPT/Codex conversation starts because credits run out or memory resets, read this file first. The repository is the implementation source of truth.

## PROJECT
Name: Nahj AI
Repository: alij3137214-sketch/faith-learner-hub
Production branch: main
Development branch: agent/integrity-hardening
Backend foundation: Supabase Auth, Database, Storage/RLS
Frontend: React/TypeScript

## ROLES
Owner: product owner; should not need to perform technical implementation except account/platform actions.
CTO/engineering agent: architecture, implementation, testing, security, documentation, safe delivery.

## CURRENT MILESTONE
NAHJ-001 — Integrity Hardening
Status: IN PROGRESS / NOT VERIFIED COMPLETE

Priority: SECURITY AND DATA INTEGRITY BEFORE NEW FEATURE EXPANSION.

## HISTORICAL DEVELOPMENT PACKAGES
- Nahj-AI-CTO-Step1.zip
- Nahj-AI-CTO-Step2-Admin-Foundation.zip
- Nahj-AI-CTO-Step3-Knowledge-Manager.zip
- Nahj-AI-CTO-Step4-Avatar-Economy.zip
- Nahj-AI-CTO-Step5-Secure-Progression.zip
- Nahj-AI-CTO-Step6-Community-Duels-Foundation.zip
- Nahj-AI-CTO-Step7-Knowledge-Duel-Engine.zip
- Nahj-AI-CTO-Step8-Stability-Duel-Rewards.zip
- Nahj-AI-CTO-Step9-Knowledge-Grounding.zip
- Nahj-AI-CTO-Step10-Admin-Publishing-Workflow.zip
Additional materials: faith-learner-hub-main.zip, home.png, home (1).png, image.png, Pasted code(1).ts, Pasted code.ts, Pasted text.txt.
Historical packages are development history; live GitHub is source of truth.

## CRITICAL SECURITY FINDINGS
1. Client-side reward/progression logic exists. XP, coins, level and streak must not be client-authoritative.
2. quiz_questions contains an answer field and learner-facing queries have requested quiz_questions(*), potentially exposing answer keys.
3. RLS/profile policies must prevent learners directly changing authoritative progression.
4. Rewards must be atomic and idempotent.
5. Achievement, mission, document, lesson and path completion must be validated server/database-side.
6. Seeded Khamenei-related material uses generic provenance labels; do not treat unverified material as authoritative RAG content.
7. .env was observed in repository context. Do not commit secrets. Publishable Supabase client keys are not service-role secrets, but environment hygiene still matters.
8. No production readiness claim without real tests/validation.

## TARGET PROGRESSION ARCHITECTURE
Client requests action
-> trusted database/server function
-> authenticate user
-> validate action/entity/publication/access
-> check idempotency
-> calculate reward server-side
-> atomically update progression
-> record event if appropriate
-> return resulting state

Never accept arbitrary client-supplied XP/coin values as authoritative.

Authoritative operations:
- XP
- coins
- level
- streak
- achievements
- missions
- document/lesson completion
- learning-path completion
- quiz grading/rewards
- duel rewards

Preserve the existing XP/level mathematics during integrity hardening.

## QUIZ SECURITY
Learner receives question/prompt/options only.
Correct answer remains server/database-side.
Learner submits selected answer.
Trusted grading determines correctness and reward.
Prevent answer-key reads, arbitrary scores, reward replay, and submissions for another user.

## IDEMPOTENCY
Rewardable events must not reward twice:
- completions
- quizzes
- missions
- achievements
- paths
- duels
Use secure unique event keys/ledger or equivalent.

## SOURCE / AI INTEGRITY
Knowledge lifecycle:
Draft -> Review -> Verified -> Published -> Archived

Authoritative RAG should use only Verified + Published material.
Store provenance where possible:
- original URL/reference
- source/publication
- date when known
- language
- document type
- verification status
- verifier
- verification timestamp

Do not invent quotations or present unverified content as verified.

## CI/CD TARGET
Repository audit found no GitHub Actions workflow at the time of review.
Target:
PR -> typecheck/lint/build -> tests -> security checks -> migration validation -> review -> merge -> deployment -> smoke tests -> monitoring.

## BRANCH STRATEGY
main = production
agent/integrity-hardening = current security development branch
Use isolated branches for feature work.
Do not make security-sensitive changes directly on main.

## GITHUB / TOOLING HISTORY
The standard ChatGPT GitHub connector repeatedly returned:
403 — Resource not accessible by integration
when attempting write operations such as branch creation.

ChatGPT GitHub permission mode was changed to Full Access, but the write endpoint remained 403.

The repository has a Lovable/GPT-Engineer GitHub App with read/write access to administration, code and workflows. Its repository access was restricted to faith-learner-hub. This did not make the standard ChatGPT GitHub connector writable.

Do not transfer repository ownership to an AI.
Do not paste passwords, tokens, SSH private keys, or recovery codes into chat.
Preferred write-capable execution: Codex, or GitHub Codespaces/local development.

## CURRENT EXECUTION PLAN
1. Work on agent/integrity-hardening.
2. Inspect actual source and migrations.
3. Implement NAHJ-001.
4. Run lint/typecheck/build/tests.
5. Fix errors.
6. Review security.
7. Commit and push only when a write-capable tool confirms it.
8. Open draft PR against main.
9. Review.
10. Merge only after verification.

Never claim a commit, push, PR, test, or deployment unless actually confirmed.

## HISTORICAL ROADMAP
[✓] Step 1 Foundation
[✓] Step 2 Admin Foundation
[✓] Step 3 Knowledge Manager
[✓] Step 4 Avatar Economy
[✓] Step 5 Secure Progression (historical package; final security verification still required)
[✓] Step 6 Community Duels Foundation
[✓] Step 7 Knowledge Duel Engine
[✓] Step 8 Stability / Duel Rewards
[✓] Step 9 Knowledge Grounding
[✓] Step 10 Admin Publishing Workflow

Current:
[>] Integrity Hardening

Then:
[ ] Security verification
[ ] Automated tests
[ ] CI/CD
[ ] Admin publishing verification
[ ] RAG/source verification
[ ] Duel QA
[ ] Full production QA
[ ] Production deployment
[ ] Post-deployment monitoring

## CTO PRINCIPLES
1. Security > speed.
2. Correctness > feature count.
3. Do not build fake/mock production functionality.
4. Do not casually delete working functionality.
5. Do not expose quiz answers.
6. Do not trust browser-supplied rewards.
7. Do not present unverified sources as authoritative.
8. Preserve architecture unless a justified change is documented.
9. Test before declaring completion.
10. Verify claims against the actual repository.

## DEFINITION OF DONE
A task is not complete merely because code was written.
Required:
- implementation exists
- relevant tests run
- errors resolved or documented
- security implications reviewed
- migrations validated where applicable
- project state updated
- handoff updated
- commit/branch status verified
- deployment status verified if applicable

## NEW-CHAT RECOVERY
Tell the new AI:
"This is the persistent CTO handoff. Read it before doing anything. Treat the repository as the implementation source of truth. Continue from the documented current milestone; do not restart the project. Verify important claims against the actual repository."

Recommended first actions:
1. Read this file.
2. Inspect git branch/status.
3. Read the CTO docs if present.
4. Inspect actual source.
5. Continue from NAHJ-001.
6. Update the handoff when work changes.

## IMMEDIATE NEXT TASK
Implement server/database-authoritative progression and secure quiz grading on agent/integrity-hardening.
Do not merge to main yet.

## FINAL INSTRUCTION TO FUTURE AI
You are taking over an existing project. Do not restart it. Do not depend on conversational memory. Read this document, inspect the repository, verify the current state, and continue the work. Protect the project and tell the truth about what was actually done.
