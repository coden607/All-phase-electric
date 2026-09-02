# Squarespace installation

The intake app remains isolated from host CSS by loading the dedicated `/estimate/embed` route in an iframe.

1. Deploy this repository and note its HTTPS origin.
2. Add a Squarespace Code Block where the estimate intake should appear: `<div data-all-phase-estimate></div>`.
3. Load the launcher from the deployment: `<script src="https://YOUR-DEPLOYMENT/estimate-launcher.js" data-base="https://YOUR-DEPLOYMENT"></script>`.
4. Keep the existing Squarespace estimate link until the new workflow has been tested end-to-end, then point it to the embedded section or directly to `/estimate`.

No customer login is required. Admin users authenticate through `/admin/login`. The database service-role key and email-provider key are server-only environment variables and must never be placed in Squarespace.
