# All Phase Electric Service Intake + Lead Follow-up Design

## Purpose
Build a production-capable, portable customer estimate intake and lead follow-up module for All Phase Electric & Maintenance, Inc. The first deployment complements the company's existing website rather than replacing it. The module must also be reusable for other service businesses without rewriting core functionality.

## Success criteria
- Works well on current iPhone/Safari, Android/Chrome, tablets, and modern desktop browsers.
- Customer can submit an estimate request without creating an account.
- Customer can choose residential, commercial, or industrial work and provide relevant details.
- Customer can upload job photos/documents and provide preferred appointment windows.
- Submission is persisted before notifications are attempted.
- Email notification is enabled by default for All Phase Electric.
- Scott can privately review and manage leads from an authenticated admin dashboard.
- Notification architecture permits optional SMS later without changing intake code.
- Branding, services, fields, and notification destinations are configuration rather than hard-coded business logic.
- Module can run standalone, on a subdomain, or behind an existing site's /estimate route.

## Scope
### Customer experience
A mobile-first multi-step estimate wizard with clear progress, large touch targets, keyboard accessibility, inline validation, autosafe local draft state, back/forward navigation, and a final review step. No customer account is required.

Default flow:
1. Select job type: Residential, Commercial, Industrial.
2. Select/request service and describe the problem or project.
3. Enter service address and timing/urgency.
4. Enter contact information and preferred contact method.
5. Choose preferred estimate/appointment windows.
6. Add optional photos/documents.
7. Review consent and request details.
8. Submit and receive a clear confirmation/reference number.

The form must avoid claiming an appointment is booked; preferences are requests until All Phase confirms them.

### Admin experience
Authenticated dashboard containing:
- New lead count and simple status overview.
- Search/filter by status, job type, date, and customer.
- Lead detail with submitted fields and attachments.
- Status values: New, Contacted, Scheduled, Won, Lost.
- Internal notes.
- Notification preferences with email on by default.
- Audit timestamps for creation and status updates.

### Notifications
Intake persistence and notification delivery are separate operations. A successfully stored lead remains successful even if notification delivery temporarily fails. Email is the default channel. The notification interface supports additional providers such as SMS later.

The initial email contains a concise lead summary and a secure admin link. Attachments should not be embedded directly in notification email; authorized admins access them through the application.

## Architecture
Use Next.js with TypeScript and the App Router. UI uses Tailwind CSS plus accessible reusable primitives. Supabase supplies PostgreSQL, authentication for admins, and private object storage for uploads.

Core boundaries:
- `src/config/` — tenant/company branding, services, field choices, notification defaults.
- `src/features/intake/` — customer wizard, validation schema, local draft state, submission client.
- `src/features/leads/` — lead domain types, queries, status transitions, admin UI.
- `src/features/notifications/` — provider-neutral notification interface and email adapter.
- `src/lib/supabase/` — browser/server Supabase clients only.
- `src/app/` — routes and composition; business logic remains in feature modules.

All Phase-specific copy and recipient settings are configuration so the feature modules remain portable.

## Data model
### leads
- id: UUID primary key
- reference_number: human-readable unique reference
- job_type: residential | commercial | industrial
- service_type: text/configured service key
- description: text
- service_address fields
- urgency: normal | soon | urgent
- customer_name
- customer_email
- customer_phone
- preferred_contact: email | phone | text
- preferred_windows: structured JSON
- status: new | contacted | scheduled | won | lost
- created_at / updated_at

### lead_attachments
- id UUID
- lead_id FK
- storage_path
- original_filename
- mime_type
- byte_size
- created_at

### lead_notes
- id UUID
- lead_id FK
- author_user_id
- body
- created_at

### notification_preferences
Per admin/tenant settings. Email enabled by default; SMS disabled until a provider is configured.

## Security and privacy
- Public users may create estimate requests only through validated server-side submission logic.
- Admin lead data requires authenticated authorization.
- Storage bucket is private; files are served through short-lived signed URLs to authorized admins.
- Allow-list upload MIME types and enforce a conservative size/count limit.
- Sanitize filenames and never trust client-provided MIME metadata alone.
- Add rate limiting/anti-abuse protection at the public submission boundary.
- Secrets remain server-side environment variables and are never committed.
- Do not expose Scott's notification email in browser bundles if it can remain server-side.

## Reliability and error handling
- Validate client-side for immediate UX and server-side as authority.
- Persist the lead transactionally before notification dispatch.
- If upload fails before submission, identify the affected file and allow retry/removal without clearing other form fields.
- If email fails after lead creation, record notification failure for retry/admin visibility while returning successful intake confirmation.
- Prevent accidental duplicate submissions with submission state/idempotency handling.
- Preserve unfinished customer form state locally, excluding file binary contents.

## UX direction
Professional electrical-service aesthetic: clean, trustworthy, high contrast, restrained motion, clear hierarchy, and no novelty UI that slows customers down. Mobile is the primary layout; desktop expands rather than redesigns the flow.

Accessibility target is WCAG 2.2 AA-oriented implementation: semantic controls, visible focus, keyboard support, labels/instructions, error summaries, sufficient contrast, reduced-motion support, and screen-reader announcements for step/submission state.

## PWA behavior
Provide manifest/install metadata and appropriate icons. The app shell may be installable, but estimate submission requires network connectivity; the UI must state this clearly rather than pretending an offline request was submitted.

## Portability
No All Phase business rules inside generic feature components. A tenant/company config supplies company display name, brand tokens, service choices, job-type availability, notification defaults, and contact copy. Notification and persistence access occurs behind narrow interfaces so the module can later be moved or embedded without replacing UI logic.

## Explicitly out of starter scope
- Payment processing
- Invoicing/accounting
- Employee dispatch
- Full field-service management
- Guaranteed appointment booking
- Customer accounts
- SMS implementation (interface only until enabled)
- Rebuilding All Phase Electric's existing marketing website

## Testing
- Unit tests for schemas, reference generation, status transitions, and notification mapping.
- Component tests for wizard navigation, validation, error recovery, and admin status controls.
- Integration tests for intake persistence + notification failure isolation.
- End-to-end tests for a complete estimate submission and authenticated admin review.
- Automated accessibility checks plus keyboard/manual responsive verification.
- CI runs typecheck, lint, unit/component tests, production build, and E2E smoke tests.

## Deployment
Keep deployment provider-neutral at the application layer. Initial hosting can use Vercel with Supabase, but the repository remains a standard Next.js application. Environment configuration documents every required secret and public variable. No production secret is committed to this public repository.
