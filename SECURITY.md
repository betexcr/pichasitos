# Security

## Threat model (runtime)

PICHASITOS is a static browser game. There is no traditional server-side game logic.

| Surface | Risk | Mitigations |
|---------|------|-------------|
| Firebase RTDB scores/presence | Spam or fake high scores | Anonymous Auth required; presence writes only to `auth.uid`; schema clamps; client score cooldown (60s); optional App Check via `appCheckSiteKey` |
| Error beacon (`clientErrors`) | PII / abuse | Off by default (`errorBeacon: false`); create-only + auth + length caps |
| `test.html` / TestMode | Invincible + one-hit KO | Excluded from Firebase Hosting |
| `preview.html` | Asset browser | Excluded from Hosting |
| CDN supply chain | Tampered SDK | Self-hosted `vendor/firebase/` (10.14.1) |
| Clickjacking / MIME sniff | Hosting abuse | CSP, `X-Frame-Options`, `nosniff`, Referrer-Policy, Permissions-Policy |
| localStorage high scores | Tamper / corrupt JSON | Safe parse + sanitization |
| Service Worker cache | Device storage bloat | Poses are network-first; only ui_bg/enemies/portraits/map_nodes are cache-first |

Client Firebase config (`apiKey`, etc.) is **public by design**. Protect data with Security Rules + Auth/App Check, not by hiding keys.

## Firebase projects

| Role | Project ID | Notes |
|------|------------|-------|
| Hosting | `pichasitos` | `.firebaserc` → `hosting` / `default` |
| Realtime Database | `pichasitos-arcade` | `.firebaserc` → `database`; `js/firebase-config.js` |

Always pass `--project` explicitly when deploying.

## Deploy checklist

1. Enable **Anonymous Authentication** in Console on `pichasitos-arcade`.
2. Deploy rules: `firebase deploy --only database --project pichasitos-arcade`
3. Deploy hosting: `firebase deploy --only hosting --project pichasitos`
4. Confirm `https://<host>/test.html` and `/preview.html` return **404**
5. Confirm `/health.html` returns `ok`
6. Confirm CSP / `nosniff` on `index.html`
7. Optional: set `appCheckSiteKey` and enforce App Check in Console for RTDB
8. Optional: set `errorBeacon: true` for loop-error mirroring

Or use GitHub Actions `workflow_dispatch` deploy (requires `FIREBASE_TOKEN` secret).

## Rollback

1. **Hosting:** Firebase Console → Hosting → Release history → roll back to the previous release, **or** `git checkout <prior-sha>` and redeploy hosting.
2. After a hosting rollback, bump [`js/cache-version.js`](js/cache-version.js) `PICHASITOS_CACHE_VERSION` if browsers keep a stale shell via the service worker.
3. **Database rules:** redeploy the prior `database.rules.json` from git with `--project pichasitos-arcade`. Never roll hosting without compatible rules if Auth requirements changed.

## Surge mirror (non-primary)

[`surge.json`](surge.json) is a secondary mirror and does **not** duplicate the full Firebase CSP. Prefer Firebase Hosting for production. If Surge must stay public, align security headers manually.

## Monitoring checklist

- Uptime: ping `https://<host>/health.html` (external checker such as UptimeRobot).
- Enable **budget alerts** for Hosting + RTDB in Google Cloud / Firebase Console.
- Watch RTDB usage if presence concurrency grows (whole-tree `presence` reads).
- Client loop errors: enable `errorBeacon` only after App Check / Auth are healthy.

## Operator mode

Hold **Enter + Space** (~3 seconds) to open operator mode (local stats).

## Continue controls

**TEJA (Enter)** inserts a credit and continues; **START (Space)** continues when credits remain.

## Reporting

If you find a security issue, open a private report with the project maintainer (placeholder — update with a preferred inbox).

## Follow-ups (not in this release)

- Cloud Functions for score validation / prune non–top-N
- Sentry / Crashlytics / Performance Monitoring SDKs
