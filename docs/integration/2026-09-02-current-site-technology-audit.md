# All Phase Electric Current Website Technology Audit

Date: 2026-09-02
Site: https://www.allphaseelec.com/

## Conclusion
The current All Phase Electric website is a Squarespace site, with strong evidence that it is using the Squarespace 7.0 Bedford template family.

Confidence:
- Squarespace platform: Very high
- Squarespace 7.0: High
- Bedford family: High

## Evidence

1. Public page assets resolve through Squarespace infrastructure, including `images.squarespace-cdn.com`.
2. The live site exposes `/home-alt-bedford` with the same Bedford demo content and wording found on Squarespace's official Bedford demo site, including the Page Slideshow demonstration copy.
3. Squarespace's current documentation identifies Bedford as a Version 7.0 template family.
4. The site's current structure and page behavior are consistent with Squarespace layout/index pages rather than a hand-built PHP, WordPress, Laravel, Rails, Django, or custom Node application.

## What code/languages this means

### Browser/front-end layer
The delivered website uses the normal browser stack:
- HTML
- CSS
- JavaScript

Squarespace generates and serves most of that markup and client behavior. The site owner does not need access to Squarespace's internal server implementation to integrate our app.

### Template layer
For Squarespace 7.0 sites with Developer Mode, Squarespace's developer platform uses:
- Squarespace template files such as `.region`, `.block`, `.list`, and `.item`
- JSON configuration (`template.conf`)
- CSS / LESS
- JavaScript

Developer Mode is NOT required for our preferred integration.

### Server-side layer
Squarespace does not support arbitrary customer server-side PHP, Ruby, Rails, SQL, or similar backend code inside the Squarespace site. Therefore our estimate application should keep its server functionality outside Squarespace.

That is beneficial for portability: our Next.js/Supabase application remains independent and Squarespace only needs to link to or embed the customer-facing surface.

## Integration contract

The All Phase application MUST NOT depend on the host website's programming language, framework, CMS, or template internals.

The customer intake module will expose these integration modes:

### Mode A — Hosted route/link (safest default)
Squarespace button or navigation item points to the hosted intake application, for example `estimate.<domain>` or another approved URL.

Advantages:
- Works on virtually any website/CMS.
- No Squarespace JavaScript dependency.
- No iframe sizing/cookie issues.
- Easiest deployment and rollback.

### Mode B — Responsive iframe embed
A Squarespace Code Block embeds a hosted `/estimate/embed` route in an iframe.

The embed route will:
- have no duplicate site header/footer;
- be responsive at phone/tablet/desktop widths;
- avoid third-party cookie dependence for the public form;
- support a fixed safe fallback height;
- optionally publish height changes via `postMessage` to a tiny host-side script;
- use a strict documented message origin check;
- keep all app CSS scoped inside the iframe, preventing Squarespace CSS conflicts.

This mode is language/framework independent and works anywhere iframe embedding is permitted.

### Mode C — JavaScript launcher/button
A tiny dependency-free JavaScript snippet creates an All Phase estimate button or modal launcher and loads the hosted app.

The integration snippet will be plain browser JavaScript, not React-specific. It can be inserted through Squarespace Code Injection or an HTML Code Block on plans that permit scripts.

This same adapter can be reused on WordPress, Wix, Webflow, static HTML, PHP, ASP.NET, Rails, Django, or another CMS because its public API is browser-native HTML/JavaScript.

## Recommended production strategy for the current Squarespace site

1. Build and deploy the application independently.
2. Keep the admin dashboard completely outside Squarespace.
3. Make the public intake route work standalone first.
4. Add a dedicated `/estimate/embed` presentation mode with no duplicate navigation.
5. Provide a one-line iframe embed and a plain-JavaScript launcher as optional integration adapters.
6. For the first All Phase installation, prefer a normal Squarespace button/link to the hosted estimate flow unless Scott specifically wants the form visually inside the existing page.
7. If an in-page experience is preferred, use a Squarespace Code Block containing the iframe adapter.

## Squarespace-specific constraints we will design around

- Squarespace Code Blocks support HTML/CSS on all plans, while JavaScript and iframe use depends on the site's plan.
- Squarespace Code Injection can add HTML/scripts on supported plans.
- Squarespace itself does not host our backend/server code.
- Squarespace custom code can interact poorly with theme styles or Ajax page loading; iframe isolation avoids most of these conflicts.
- The current site is responsive, so our embed wrapper must use `width: 100%`, no horizontal overflow, and tested mobile heights.

## Required app changes before implementation

The application architecture must include:
- standalone `/estimate` route;
- embed-safe `/estimate/embed` route;
- no required dependency on Squarespace globals;
- no assumption about parent-site CSS;
- no server dependency on the host CMS;
- CORS/origin configuration documented for any cross-origin API calls;
- iframe/content security policy explicitly configured for the approved All Phase domain and demo domains;
- optional `postMessage` resize protocol with strict origin validation;
- host integration snippets kept in `integration/` as framework-neutral HTML/JS;
- Playwright tests for standalone and iframe-embedded modes;
- integration documentation for Squarespace plus generic CMS/static HTML.

## Bottom line
We do not need to rewrite the All Phase website and we do not need its source repository. The current site is Squarespace/Bedford-era 7.0, and the cleanest architecture is to keep our Next.js/Supabase workflow as an independent web application with a browser-level integration boundary. That makes the same build usable from Squarespace now and from almost any other website technology later.

## Public references
- https://www.allphaseelec.com/
- https://www.allphaseelec.com/home-alt-bedford
- https://bedford-demo.squarespace.com/home-alt-bedford
- https://support.squarespace.com/hc/en-us/articles/206796007-Templates-and-design-in-version-7-0
- https://support.squarespace.com/hc/en-us/articles/205825968-Bedford-template-family
- https://support.squarespace.com/hc/en-us/articles/205815928-Add-custom-code-to-your-site
- https://support.squarespace.com/hc/en-us/articles/206543167-Code-blocks
- https://support.squarespace.com/hc/en-us/articles/205815908-Using-code-injection
