# All Phase Electric Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-capable, reusable customer estimate intake and lead follow-up application for All Phase Electric that runs standalone now and can later plug into an existing website without rewriting core features.

**Architecture:** Use Next.js App Router with TypeScript and Tailwind CSS. Keep business-specific branding and service choices in configuration, public intake logic in an isolated feature module, lead administration in a separate feature module, and Supabase plus notifications behind narrow adapters. Public estimate submission persists validated lead data first; notification delivery happens after persistence so email failure never loses a request.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, React Testing Library, Playwright, Zod, Supabase/PostgreSQL, Supabase Storage, provider-neutral email notification adapter, optional future SMS adapter.

**Spec:** `docs/superpowers/specs/2026-09-02-all-phase-electric-design.md`

## Global Constraints

- Public estimate requests require no customer account.
- Job types are Residential, Commercial, and Industrial.
- Email notification is enabled by default; SMS remains optional and unimplemented in the starter build.
- Submission persistence must succeed independently of notification delivery.
- Admin data and attachments require authenticated authorization.
- Uploaded files use private storage and short-lived signed URLs.
- All Phase-specific branding, service choices, contact copy, and notification destinations live in configuration rather than generic feature logic.
- Customer preferred appointment windows are requests, not guaranteed bookings.
- No production secrets may be committed to this public repository.
- Starter scope excludes payments, invoicing, employee dispatch, full field-service management, customer accounts, and marketing-site replacement.
- Target current Safari/iPhone, Chrome/Android, Chrome/Edge desktop, and Firefox desktop.
- Accessibility implementation is WCAG 2.2 AA-oriented.

---

## File Structure

- `package.json` — project scripts and dependencies.
- `next.config.ts` — framework configuration.
- `tsconfig.json` — strict TypeScript configuration.
- `vitest.config.ts` — unit/component test configuration.
- `playwright.config.ts` — browser smoke/E2E configuration.
- `.env.example` — documented environment contract without secrets.
- `.github/workflows/ci.yml` — lint, typecheck, tests, build, E2E smoke workflow.
- `src/app/layout.tsx` — global layout and metadata.
- `src/app/page.tsx` — lightweight product landing/entry page.
- `src/app/estimate/page.tsx` — public estimate wizard route.
- `src/app/estimate/confirmation/page.tsx` — successful submission confirmation route.
- `src/app/admin/page.tsx` — authenticated lead dashboard route.
- `src/app/admin/leads/[id]/page.tsx` — authenticated lead detail route.
- `src/app/api/intake/route.ts` — public validated intake submission endpoint.
- `src/app/api/admin/leads/[id]/status/route.ts` — authenticated status transition endpoint.
- `src/app/api/admin/leads/[id]/notes/route.ts` — authenticated note creation endpoint.
- `src/app/manifest.ts` — installable PWA metadata.
- `src/config/company.ts` — All Phase tenant/company configuration.
- `src/features/intake/schema.ts` — Zod intake schema and normalized types.
- `src/features/intake/reference.ts` — human-readable reference generation.
- `src/features/intake/draft.ts` — local non-file draft persistence helpers.
- `src/features/intake/intake-wizard.tsx` — multi-step customer flow shell.
- `src/features/intake/steps/*.tsx` — focused wizard steps.
- `src/features/intake/submission.ts` — browser submission client and idempotency key creation.
- `src/features/leads/types.ts` — lead/status domain types.
- `src/features/leads/repository.ts` — persistence interface.
- `src/features/leads/supabase-repository.ts` — Supabase lead implementation.
- `src/features/leads/status.ts` — allowed status transitions.
- `src/features/leads/admin-dashboard.tsx` — dashboard presentation.
- `src/features/leads/lead-detail.tsx` — lead detail presentation/actions.
- `src/features/notifications/types.ts` — provider-neutral notification contracts.
- `src/features/notifications/email.ts` — email adapter implementation.
- `src/features/notifications/service.ts` — orchestration and failure recording.
- `src/lib/supabase/browser.ts` — browser client factory.
- `src/lib/supabase/server.ts` — server client factory.
- `src/lib/auth/require-admin.ts` — server-side admin authorization helper.
- `src/lib/uploads/policy.ts` — MIME, count, and file-size validation policy.
- `src/lib/uploads/storage.ts` — private upload and signed-download helpers.
- `supabase/migrations/001_initial_schema.sql` — lead, attachment, notes, notification tables and RLS.
- `tests/unit/*` — pure domain/schema tests.
- `tests/components/*` — wizard/dashboard interaction tests.
- `tests/integration/*` — intake persistence and notification isolation tests.
- `tests/e2e/*` — Playwright public intake/admin smoke flows.

---

### Task 1: Bootstrap the application and test harness

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/smoke.test.ts`

**Interfaces:**
- Consumes: none.
- Produces: a strict Next.js/TypeScript project with `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e` scripts.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

describe('project test harness', () => {
  it('runs TypeScript unit tests', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test before dependencies/config exist**

Run: `npm test`

Expected: FAIL because the project and Vitest scripts are not configured yet.

- [ ] **Step 3: Add the minimal Next.js + testing project configuration**

Create scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Use strict TypeScript, App Router, Tailwind CSS, Vitest with `jsdom`, React Testing Library, Playwright, and ESLint-compatible Next.js defaults.

- [ ] **Step 4: Run project checks**

Run: `npm test && npm run typecheck && npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.mjs src tests vitest.config.ts playwright.config.ts
git commit -m "chore: bootstrap All Phase intake app"
```

---

### Task 2: Add reusable company configuration and domain types

**Files:**
- Create: `src/config/company.ts`
- Create: `src/features/leads/types.ts`
- Create: `tests/unit/company-config.test.ts`

**Interfaces:**
- Consumes: project TypeScript setup from Task 1.
- Produces: `companyConfig`, `JobType`, `LeadStatus`, `PreferredContact`, and configured service choices for all feature modules.

- [ ] **Step 1: Write failing configuration tests**

Test that `companyConfig` exposes display name, service categories, default notification channel, and job types without feature modules containing All Phase literals.

```ts
expect(companyConfig.displayName).toBe('All Phase Electric & Maintenance, Inc.');
expect(companyConfig.jobTypes).toEqual(['residential', 'commercial', 'industrial']);
expect(companyConfig.notifications.email.enabledByDefault).toBe(true);
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm test -- tests/unit/company-config.test.ts`

Expected: FAIL because config/types do not exist.

- [ ] **Step 3: Implement configuration and types**

Define narrow readonly config values and unions. Keep recipient address sourced from a server environment variable key, not a literal email in client-facing config.

- [ ] **Step 4: Run tests and typecheck**

Run: `npm test -- tests/unit/company-config.test.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/config/company.ts src/features/leads/types.ts tests/unit/company-config.test.ts
git commit -m "feat: add portable company configuration"
```

---

### Task 3: Define intake validation and reference generation

**Files:**
- Create: `src/features/intake/schema.ts`
- Create: `src/features/intake/reference.ts`
- Create: `tests/unit/intake-schema.test.ts`
- Create: `tests/unit/reference.test.ts`

**Interfaces:**
- Consumes: `JobType` and contact/status domain types.
- Produces: `intakeSchema`, `IntakeInput`, `NormalizedIntake`, and `createLeadReference(now, random)`.

- [ ] **Step 1: Write failing schema tests**

Cover valid residential submission, invalid email/phone, missing description, unsupported job type, empty preferred windows, and trimmed normalized text.

- [ ] **Step 2: Write failing reference tests**

Require a readable stable shape such as `APE-20260902-7K4M` while injecting time/random sources for deterministic testing.

- [ ] **Step 3: Run targeted tests**

Run: `npm test -- tests/unit/intake-schema.test.ts tests/unit/reference.test.ts`

Expected: FAIL because schema/reference modules do not exist.

- [ ] **Step 4: Implement minimal schema and reference generator**

Use Zod as server-authoritative validation. Do not accept status, internal notes, or notification recipient fields from the public request.

- [ ] **Step 5: Run targeted tests and typecheck**

Run: `npm test -- tests/unit/intake-schema.test.ts tests/unit/reference.test.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/intake tests/unit/intake-schema.test.ts tests/unit/reference.test.ts
git commit -m "feat: validate estimate intake data"
```

---

### Task 4: Add upload policy and local draft persistence

**Files:**
- Create: `src/lib/uploads/policy.ts`
- Create: `src/features/intake/draft.ts`
- Create: `tests/unit/upload-policy.test.ts`
- Create: `tests/unit/intake-draft.test.ts`

**Interfaces:**
- Consumes: `IntakeInput`.
- Produces: `validateUploadMetadata`, `MAX_UPLOAD_BYTES`, `MAX_UPLOAD_COUNT`, `saveIntakeDraft`, `loadIntakeDraft`, `clearIntakeDraft`.

- [ ] **Step 1: Write failing upload policy tests**

Allow common image/PDF formats only, reject executables/archives, reject oversized files, and reject excessive file count.

- [ ] **Step 2: Write failing local draft tests**

Verify draft serialization intentionally excludes binary `File` objects and survives invalid/corrupt local storage values by returning no draft.

- [ ] **Step 3: Run tests and verify failure**

Run: `npm test -- tests/unit/upload-policy.test.ts tests/unit/intake-draft.test.ts`

Expected: FAIL.

- [ ] **Step 4: Implement policy and draft helpers**

Keep browser storage access behind guards so server rendering does not crash.

- [ ] **Step 5: Run tests**

Run: `npm test -- tests/unit/upload-policy.test.ts tests/unit/intake-draft.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/uploads/policy.ts src/features/intake/draft.ts tests/unit
git commit -m "feat: add safe uploads and intake draft recovery"
```

---

### Task 5: Build the mobile-first estimate wizard shell

**Files:**
- Create: `src/features/intake/intake-wizard.tsx`
- Create: `src/features/intake/steps/job-type-step.tsx`
- Create: `src/features/intake/steps/project-step.tsx`
- Create: `src/features/intake/steps/contact-step.tsx`
- Create: `src/features/intake/steps/schedule-step.tsx`
- Create: `src/features/intake/steps/upload-step.tsx`
- Create: `src/features/intake/steps/review-step.tsx`
- Create: `src/app/estimate/page.tsx`
- Create: `tests/components/intake-wizard.test.tsx`

**Interfaces:**
- Consumes: `companyConfig`, `intakeSchema`, upload policy, draft helpers.
- Produces: accessible multi-step `IntakeWizard` and normalized public intake payload.

- [ ] **Step 1: Write failing component tests**

Test keyboard/touch navigation, required-field blocking, back navigation preserving values, progress semantics, job-type choices from config, and review screen contents.

- [ ] **Step 2: Run component test**

Run: `npm test -- tests/components/intake-wizard.test.tsx`

Expected: FAIL because wizard components do not exist.

- [ ] **Step 3: Implement minimal functional wizard**

Use semantic form controls, visible labels, inline errors plus an error summary, large touch targets, and no motion required to understand state. Persist non-file draft values after valid field changes.

- [ ] **Step 4: Run component tests and typecheck**

Run: `npm test -- tests/components/intake-wizard.test.tsx && npm run typecheck`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/intake src/app/estimate tests/components/intake-wizard.test.tsx
git commit -m "feat: add customer estimate wizard"
```

---

### Task 6: Add Supabase schema, private storage, and repository interface

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `src/features/leads/repository.ts`
- Create: `src/features/leads/supabase-repository.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/browser.ts`
- Create: `src/lib/uploads/storage.ts`
- Create: `tests/unit/status.test.ts`
- Create: `src/features/leads/status.ts`

**Interfaces:**
- Consumes: normalized intake/domain types.
- Produces: `LeadRepository` with `createLead`, `getLead`, `listLeads`, `updateStatus`, `addNote`; private attachment storage helpers; RLS-protected schema.

- [ ] **Step 1: Write failing status transition tests**

Allow `new -> contacted -> scheduled -> won|lost`, allow sensible direct exits such as `contacted -> lost`, and reject impossible/unknown states.

- [ ] **Step 2: Run unit test**

Run: `npm test -- tests/unit/status.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement status rules**

Use an explicit map so UI/API enforce the same transitions.

- [ ] **Step 4: Create database migration**

Create `leads`, `lead_attachments`, `lead_notes`, `notification_preferences`, and `notification_attempts`. Add timestamps, indexes for status/date/job_type, constraints for known enum-like values, and row-level security policies that prevent anonymous reads. Public writes must occur through server code rather than broad anonymous table insert privileges.

- [ ] **Step 5: Implement repository/storage interfaces**

Make the Supabase implementation server-only where privileged access is needed. Use a private bucket and signed URLs for authorized admin attachment reads.

- [ ] **Step 6: Run tests and typecheck**

Run: `npm test -- tests/unit/status.test.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add supabase src/features/leads src/lib/supabase src/lib/uploads/storage.ts tests/unit/status.test.ts
git commit -m "feat: add lead persistence and private storage"
```

---

### Task 7: Implement persistence-first intake API with idempotency

**Files:**
- Create: `src/app/api/intake/route.ts`
- Create: `src/features/intake/submission.ts`
- Create: `tests/integration/intake-route.test.ts`

**Interfaces:**
- Consumes: `intakeSchema`, `LeadRepository`, upload storage helper, reference generator.
- Produces: `POST /api/intake`, browser `submitIntake`, idempotency-key handling, response `{ leadId, referenceNumber }`.

- [ ] **Step 1: Write failing integration tests**

Cover valid creation, invalid body -> 400, duplicate idempotency key -> same lead/result rather than duplicate record, attachment-policy failure, and repository failure -> 500 without false confirmation.

- [ ] **Step 2: Run integration tests**

Run: `npm test -- tests/integration/intake-route.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement route and browser client**

Generate idempotency key client-side per submission attempt and persist it until a definitive response. Validate server-side, create the lead, then process permitted uploads. Never accept an admin status from client input.

- [ ] **Step 4: Run integration tests**

Run: `npm test -- tests/integration/intake-route.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/intake src/features/intake/submission.ts tests/integration/intake-route.test.ts
git commit -m "feat: persist estimate requests safely"
```

---

### Task 8: Add provider-neutral email notifications with failure isolation

**Files:**
- Create: `src/features/notifications/types.ts`
- Create: `src/features/notifications/email.ts`
- Create: `src/features/notifications/service.ts`
- Create: `tests/unit/notification-mapping.test.ts`
- Create: `tests/integration/notification-isolation.test.ts`

**Interfaces:**
- Consumes: newly persisted lead/reference and notification preference config.
- Produces: `NotificationProvider`, `NotificationService.notifyNewLead(lead)`, email adapter, recorded notification attempt/failure.

- [ ] **Step 1: Write failing mapping tests**

Verify email subject/body contains reference, customer name, job type, service summary, preferred timing, and secure admin link but does not embed attachment binaries.

- [ ] **Step 2: Write failing failure-isolation integration test**

Mock provider failure after repository success and assert the intake result remains successful while a failed notification attempt is recorded.

- [ ] **Step 3: Run tests**

Run: `npm test -- tests/unit/notification-mapping.test.ts tests/integration/notification-isolation.test.ts`

Expected: FAIL.

- [ ] **Step 4: Implement notification contracts and email adapter**

Read the recipient from server environment configuration. Keep `SmsNotificationProvider` as a documented interface capability only; do not configure a vendor yet.

- [ ] **Step 5: Wire notification orchestration into intake after persistence**

Call notification service only after lead creation succeeds. Catch provider errors, record them, and return normal lead confirmation.

- [ ] **Step 6: Run tests**

Run: `npm test -- tests/unit/notification-mapping.test.ts tests/integration/notification-isolation.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/notifications src/app/api/intake/route.ts tests
git commit -m "feat: notify All Phase of new leads by email"
```

---

### Task 9: Add confirmation UX and submission recovery states

**Files:**
- Create: `src/app/estimate/confirmation/page.tsx`
- Modify: `src/features/intake/intake-wizard.tsx`
- Modify: `src/features/intake/submission.ts`
- Create: `tests/components/intake-submission.test.tsx`

**Interfaces:**
- Consumes: `submitIntake` response.
- Produces: reference-number confirmation, retryable network state, duplicate-click prevention, local draft cleanup after success.

- [ ] **Step 1: Write failing component tests**

Assert one active submission at a time, retry preserves form values after a network error, success clears draft state, and confirmation states that All Phase received the request but has not guaranteed an appointment.

- [ ] **Step 2: Run test**

Run: `npm test -- tests/components/intake-submission.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Implement submission and confirmation states**

Disable only the submit action while pending; keep accessible status announcements. Use confirmation route query/state containing only non-sensitive reference data.

- [ ] **Step 4: Run tests**

Run: `npm test -- tests/components/intake-submission.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/estimate src/features/intake tests/components/intake-submission.test.tsx
git commit -m "feat: add resilient intake confirmation flow"
```

---

### Task 10: Implement authenticated admin authorization

**Files:**
- Create: `src/lib/auth/require-admin.ts`
- Create: `src/app/admin/layout.tsx`
- Create: `tests/integration/admin-auth.test.ts`

**Interfaces:**
- Consumes: Supabase server auth client.
- Produces: `requireAdmin()` that either returns an authorized admin identity or redirects/rejects access.

- [ ] **Step 1: Write failing auth tests**

Cover anonymous denial, authenticated non-admin denial, and configured admin success.

- [ ] **Step 2: Run test**

Run: `npm test -- tests/integration/admin-auth.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement authorization helper and route guard**

Use server-side role/allowlist data rather than trusting client claims. Do not expose service-role credentials to browser code.

- [ ] **Step 4: Run tests and typecheck**

Run: `npm test -- tests/integration/admin-auth.test.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth src/app/admin tests/integration/admin-auth.test.ts
git commit -m "feat: protect admin lead management"
```

---

### Task 11: Build the admin dashboard and lead-detail workflow

**Files:**
- Create: `src/features/leads/admin-dashboard.tsx`
- Create: `src/features/leads/lead-detail.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/leads/[id]/page.tsx`
- Create: `src/app/api/admin/leads/[id]/status/route.ts`
- Create: `src/app/api/admin/leads/[id]/notes/route.ts`
- Create: `tests/components/admin-dashboard.test.tsx`
- Create: `tests/integration/admin-lead-actions.test.ts`

**Interfaces:**
- Consumes: `LeadRepository`, `requireAdmin`, status transition rules, signed attachment URLs.
- Produces: searchable/filterable dashboard, lead detail, status mutation, internal note creation.

- [ ] **Step 1: Write failing dashboard component tests**

Verify visible New count, filters by job type/status, customer search, clear empty state, and link/open action to lead detail.

- [ ] **Step 2: Write failing lead-action integration tests**

Verify authorized valid status change succeeds, invalid transition is rejected, unauthenticated request fails, and note creation records author identity.

- [ ] **Step 3: Run tests**

Run: `npm test -- tests/components/admin-dashboard.test.tsx tests/integration/admin-lead-actions.test.ts`

Expected: FAIL.

- [ ] **Step 4: Implement dashboard and lead detail**

Prioritize mobile/tablet admin usability but optimize lead table/card density for desktop. Provide quick call/email links using submitted customer contact data.

- [ ] **Step 5: Implement authenticated API mutations**

Server validates all status and note payloads; note body is length-limited and rendered as text, not unsafe HTML.

- [ ] **Step 6: Run tests and typecheck**

Run: `npm test -- tests/components/admin-dashboard.test.tsx tests/integration/admin-lead-actions.test.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/leads src/app/admin src/app/api/admin tests
git commit -m "feat: add private lead management dashboard"
```

---

### Task 12: Add notification settings UI with email enabled by default

**Files:**
- Create: `src/app/admin/settings/page.tsx`
- Create: `src/features/notifications/settings-form.tsx`
- Create: `src/app/api/admin/notification-preferences/route.ts`
- Create: `tests/components/notification-settings.test.tsx`

**Interfaces:**
- Consumes: notification preferences repository/config.
- Produces: authenticated preference editor with email default `true`; SMS control disabled/clearly marked until a provider is configured.

- [ ] **Step 1: Write failing settings tests**

Assert email starts enabled for a new tenant, can be toggled by an authorized admin, and SMS cannot be enabled when no SMS provider is configured.

- [ ] **Step 2: Run test**

Run: `npm test -- tests/components/notification-settings.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Implement settings route/UI**

Do not expose destination secrets. Display channel state and delivery configuration status only.

- [ ] **Step 4: Run tests**

Run: `npm test -- tests/components/notification-settings.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/settings src/app/api/admin/notification-preferences src/features/notifications/settings-form.tsx tests/components/notification-settings.test.tsx
git commit -m "feat: add configurable lead notifications"
```

---

### Task 13: Add PWA metadata, responsive polish, and accessibility checks

**Files:**
- Create: `src/app/manifest.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/components/accessibility.test.tsx`
- Create: `tests/e2e/responsive-smoke.spec.ts`

**Interfaces:**
- Consumes: complete public/admin UI.
- Produces: install metadata, reduced-motion/focus behavior, accessible page shells, responsive browser smoke coverage.

- [ ] **Step 1: Write failing accessibility/component checks**

Render core public wizard/admin views and assert no automated high-impact accessibility violations; explicitly test focus movement to validation summary and visible focus styles.

- [ ] **Step 2: Write responsive smoke test**

Run public intake at representative iPhone, Android-sized, tablet, and desktop viewports and assert no horizontal overflow and reachable primary actions.

- [ ] **Step 3: Run tests**

Run: `npm test -- tests/components/accessibility.test.tsx && npm run test:e2e -- tests/e2e/responsive-smoke.spec.ts`

Expected: FAIL before polish/config exists.

- [ ] **Step 4: Implement accessibility and responsive fixes**

Use CSS media queries for reduced motion, responsive spacing/type, and focus-visible states. Ensure sticky/mobile actions do not cover inputs or browser safe areas.

- [ ] **Step 5: Run tests**

Run: `npm test -- tests/components/accessibility.test.tsx && npm run test:e2e -- tests/e2e/responsive-smoke.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app tests/components/accessibility.test.tsx tests/e2e/responsive-smoke.spec.ts
git commit -m "feat: polish responsive accessible PWA experience"
```

---

### Task 14: Add end-to-end intake/admin smoke flows

**Files:**
- Create: `tests/e2e/intake.spec.ts`
- Create: `tests/e2e/admin.spec.ts`
- Create: `tests/e2e/fixtures.ts`

**Interfaces:**
- Consumes: deployed/local Supabase test configuration and complete app.
- Produces: browser-level proof that a request can be submitted and then reviewed by an authorized admin.

- [ ] **Step 1: Write failing customer E2E flow**

Fill all wizard steps, attach a permitted small fixture, submit, and assert a reference confirmation appears.

- [ ] **Step 2: Write failing admin E2E flow**

Authenticate as a test admin, find the new lead, inspect attachment metadata, add a note, and change `new -> contacted`.

- [ ] **Step 3: Run E2E tests**

Run: `npm run test:e2e -- tests/e2e/intake.spec.ts tests/e2e/admin.spec.ts`

Expected: FAIL until fixture/auth wiring is complete.

- [ ] **Step 4: Add deterministic test fixtures and complete E2E wiring**

Use test-only environment credentials and isolated records. Never hard-code production credentials.

- [ ] **Step 5: Run E2E tests**

Run: `npm run test:e2e -- tests/e2e/intake.spec.ts tests/e2e/admin.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/e2e
git commit -m "test: cover intake and admin browser flows"
```

---

### Task 15: Document environment setup and one-command local bootstrap

**Files:**
- Create: `.env.example`
- Create: `docs/setup.md`
- Create: `scripts/bootstrap.sh`
- Modify: `README.md`
- Create: `tests/unit/env-contract.test.ts`

**Interfaces:**
- Consumes: full application environment needs.
- Produces: explicit environment contract and idempotent setup script suitable for cloning into `/storage/Projects/All-phase-electric` or another chosen project path.

- [ ] **Step 1: Write failing environment contract test**

Parse `.env.example` and assert every environment variable referenced by application source is represented while no value looks like a real secret.

- [ ] **Step 2: Run test**

Run: `npm test -- tests/unit/env-contract.test.ts`

Expected: FAIL because env documentation does not exist.

- [ ] **Step 3: Add `.env.example` and setup documentation**

Document public Supabase URL/anon key, server-only Supabase service key if required, admin bootstrap strategy, notification provider key, notification sender, recipient env var, app base URL, and test credentials separately.

- [ ] **Step 4: Add idempotent bootstrap script**

`scripts/bootstrap.sh` must verify Node/npm, install dependencies only when needed, copy `.env.example` to `.env.local` only if absent, and print the exact next setup commands without overwriting secrets.

- [ ] **Step 5: Run test and shell syntax validation**

Run: `npm test -- tests/unit/env-contract.test.ts && sh -n scripts/bootstrap.sh`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add .env.example docs/setup.md scripts/bootstrap.sh README.md tests/unit/env-contract.test.ts
git commit -m "docs: add safe project bootstrap and environment setup"
```

---

### Task 16: Add CI and production verification gate

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `package.json`

**Interfaces:**
- Consumes: all test/build scripts.
- Produces: repeatable CI gate for pull requests and pushes to main.

- [ ] **Step 1: Define CI commands locally first**

Ensure a single sequence succeeds locally:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

- [ ] **Step 2: Add GitHub Actions workflow**

Use a supported Node LTS version, dependency caching, Playwright browser install, and only test-scoped secrets for integration/E2E jobs. Keep secret-dependent tests skippable with an explicit CI message when test environment secrets are intentionally absent during early bootstrap.

- [ ] **Step 3: Run workflow syntax/basic local checks**

Run: `npm run typecheck && npm test && npm run build`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml package.json
git commit -m "ci: verify All Phase application"
```

---

### Task 17: Final verification and launch-readiness review

**Files:**
- Modify only files required by verified failures.
- Update: `README.md` with final run/test/deploy instructions.

**Interfaces:**
- Consumes: complete application.
- Produces: evidence-backed release candidate.

- [ ] **Step 1: Run the complete verification suite**

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Expected: all commands PASS.

- [ ] **Step 2: Manually verify responsive public intake**

Check current Safari/iPhone, Chrome/Android, Chrome/Edge desktop, and Firefox desktop or representative browser automation where physical devices are not available. Verify keyboard-only completion on desktop.

- [ ] **Step 3: Verify security assumptions**

Confirm anonymous users cannot list/read leads, private attachment URLs expire, service credentials are absent from browser bundles/repository history, and invalid/oversized upload attempts are rejected.

- [ ] **Step 4: Verify failure behavior**

Force notification provider failure and confirm a lead is still stored and visible in admin with notification failure recorded. Force a network failure during customer submit and confirm retry does not duplicate the lead.

- [ ] **Step 5: Final documentation update**

Record tested browsers/viewports, deployment prerequisites, environment variables, Supabase migration command, and known starter-scope exclusions.

- [ ] **Step 6: Commit**

```bash
git add README.md .
git commit -m "chore: verify All Phase launch readiness"
```

## Self-Review

- Spec coverage: customer no-login intake, job routing, uploads, preferred windows, confirmation, persistence-first notification handling, email default, future SMS adapter, admin auth/dashboard/status/notes, private signed attachments, PWA behavior, portability, responsive/accessibility testing, CI, and starter-scope boundaries are all mapped to tasks.
- Placeholder scan: no TBD/TODO/fill-later implementation steps are used. Optional SMS is explicitly out of starter implementation scope by approved design rather than left as an implementation placeholder.
- Type consistency: `JobType`, `LeadStatus`, `PreferredContact`, `IntakeInput`, `NormalizedIntake`, `LeadRepository`, `NotificationProvider`, and `requireAdmin` are introduced before downstream usage.
