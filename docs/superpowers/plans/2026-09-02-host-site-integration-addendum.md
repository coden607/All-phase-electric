# Host-Site Integration Addendum

> **For agentic workers:** This addendum is mandatory alongside `docs/superpowers/plans/2026-09-02-all-phase-electric-implementation.md`.

**Goal:** Guarantee that the All Phase estimate workflow can be attached to the current Squarespace 7.0/Bedford site and remain portable to other host-site languages/frameworks.

**Audit:** `docs/integration/2026-09-02-current-site-technology-audit.md`

## Global integration constraints

- The application must never require access to Squarespace server-side code.
- The public workflow must work standalone without a parent page.
- The app must expose a dedicated embed presentation that does not render duplicate marketing navigation.
- The host adapter must use browser-standard HTML/JavaScript only and must not depend on React, Next.js, Squarespace globals, jQuery, WordPress, PHP, or another CMS runtime.
- Parent-site CSS must not be able to break the embedded intake UI.
- Public intake must not depend on third-party cookies.
- Any `postMessage` integration must validate exact allowed origins.
- Frame embedding policy must explicitly allow only configured trusted hosts rather than `*` in production.
- Standalone and embedded flows must receive automated browser coverage.

---

### Integration Task A: Add host-agnostic embed presentation

**Files:**
- Create: `src/app/estimate/embed/page.tsx`
- Create: `src/features/integration/embed-shell.tsx`
- Create: `src/features/integration/messages.ts`
- Test: `tests/unit/integration-messages.test.ts`
- Test: `tests/components/embed-shell.test.tsx`

**Interfaces:**
- Produces: `EmbedShell`, `createResizeMessage(height)`, `isAllowedParentOrigin(origin, allowedOrigins)`.

- [ ] Write tests that reject wildcard/untrusted origins and accept configured All Phase/demo origins.
- [ ] Implement the embed shell without the standalone site header/footer.
- [ ] Emit a namespaced resize event such as `{ type: 'allphase:resize', height: number }` only when embedded.
- [ ] Verify keyboard focus and form navigation remain inside normal browser semantics without focus trapping.
- [ ] Run unit/component tests and typecheck.

---

### Integration Task B: Add framework-neutral host adapters

**Files:**
- Create: `integration/README.md`
- Create: `integration/squarespace-iframe.html`
- Create: `integration/generic-iframe.html`
- Create: `integration/launcher.js`
- Create: `integration/launcher-example.html`
- Test: `tests/unit/launcher-source.test.ts`

**Requirements:**
- iframe examples use `width:100%`, `border:0`, a usable fallback height, descriptive `title`, and lazy loading only where it does not harm first interaction.
- resize listener validates message source and exact origin before changing iframe height.
- launcher is plain ES browser JavaScript and creates a normal accessible link/button fallback before enhancement.
- no bundled React or Squarespace dependency is required by the host page.
- README includes Squarespace Code Block steps and generic CMS/static HTML steps.

- [ ] Write source-level tests for required origin checks and accessible iframe attributes.
- [ ] Implement the minimal adapters.
- [ ] Test snippets in a static HTML fixture independent of Next.js host rendering.

---

### Integration Task C: Configure security headers for standalone and embed modes

**Files:**
- Modify: `next.config.ts`
- Create: `src/config/integration.ts`
- Test: `tests/unit/integration-config.test.ts`

**Requirements:**
- configured parent origins come from environment/config rather than hard-coded wildcard production rules.
- document `Content-Security-Policy frame-ancestors` behavior for the deployed platform.
- do not use legacy `X-Frame-Options: SAMEORIGIN` on the dedicated embed route if it would block the approved host; use the CSP integration policy deliberately.
- API CORS is closed by default; the iframe should normally submit same-origin to its own app origin, avoiding unnecessary cross-origin API access.

---

### Integration Task D: Browser verification matrix

**Files:**
- Create: `tests/e2e/host-integration.spec.ts`
- Create: `tests/fixtures/host-page.html` or equivalent local host fixture.

**Required checks:**
- standalone estimate flow in Chromium, WebKit, and Firefox.
- iframe flow at representative iPhone, Android, tablet, and desktop viewports.
- no horizontal overflow.
- height resize messages are honored only from the correct iframe/origin.
- parent CSS cannot alter form internals.
- customer can complete and submit the intake inside an iframe.
- opening the standalone route directly produces the same functional intake.

## Installation preference for All Phase

1. Deploy standalone workflow first.
2. Demo via direct hosted URL.
3. If Scott wants minimal risk, change the current Squarespace `Request an estimate` button to the hosted route.
4. If Scott wants an in-page experience, paste the tested iframe adapter into a Squarespace Code Block.
5. Keep the admin dashboard as a separate authenticated app route; never iframe admin into the public marketing site.
