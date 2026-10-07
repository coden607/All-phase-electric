# All Phase Electric

Portable customer estimate intake and lead follow-up application for All Phase Electric & Maintenance, Inc.

## Goals

- Frictionless, no-login estimate requests
- Mobile-first customer experience across iPhone, Android, tablet, and desktop
- Photo/document uploads and job-type routing
- Email notifications enabled by default
- Private admin dashboard for lead review and follow-up
- Reusable configuration and adapters so the module can be embedded into an existing site or rebranded for another service business

## Planned stack

Next.js, TypeScript, Tailwind CSS, accessible UI primitives, Supabase/Postgres, Supabase Storage, and pluggable notification adapters.

---

## ⚠️ Repository Status: SPEC / SKELETON (updated by factory wave2, 2026-10-08)

**This repository currently contains planning and specification documents only. There is no application code, no package.json, and nothing deployable.**

What exists:
- Product goals and planned stack (this README)
- Design spec: `docs/superpowers/specs/2026-09-02-all-phase-electric-design.md`
- Implementation plan (all tasks unchecked): `docs/superpowers/plans/`
- Current-site technology audit: `docs/integration/2026-09-02-current-site-technology-audit.md`

What is promised but NOT yet implemented:
- Next.js estimate-intake app (public form, photo upload, job-type routing)
- Supabase/Postgres persistence + Storage for attachments
- Private admin dashboard for lead review/follow-up
- Email notification adapter

**Status:** SKELETON — implementation has not started. Do not attempt to deploy; there is nothing to build or serve yet.
