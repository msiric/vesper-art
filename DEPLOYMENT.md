# Isolated portfolio deployment

Shared references: [portfolio operations](https://github.com/msiric/feasible-route-mapping/blob/master/docs/PORTFOLIO_HOSTING.md), [future-project playbook](https://github.com/msiric/feasible-route-mapping/blob/master/docs/FREE_DEMO_HOSTING.md), [deployment record template](https://github.com/msiric/feasible-route-mapping/blob/master/docs/PROJECT_HOSTING_TEMPLATE.md).

Live demo: **https://vesper-art-demo.pages.dev** (verified 18 September 2026).

Public HTTPS verification passed for distinct temporary accounts, ownership, favorites, comments, simulated receipts, collection, JPEG upload/download, authenticated polling, secure cookies, refresh, logout revocation and direct API rejection. The sample-to-live gallery race has a regression test and the deployed gallery contains unique artworks.

| Resource | Parent | App resource |
| --- | --- | --- |
| Cloudflare Pages Free | `msiric-public-demos`, account `f8fd075624b85e729e46d15d374e59ed` | `vesper-art-demo` |
| Render Free | `msiric-public-demos`, workspace `tea-damk99ajnfac73b07010` | project `prj-damk9v8u01pc73aj9l50`, Demo environment `evm-damk9v8u01pc73aj9l5g`; service `srv-damnjj7f3r2c73al738g` |
| Neon Free | `msiric-public-demos`, org `org-damp-glade-19263338` | project `morning-cherry-43523697`, database `vesper_demo`, PostgreSQL 16, Frankfurt |

## Deploy

Use `master` and `render.yaml` in the exact new Render project above. Select **Free**, Frankfurt, auto-deploy Off, health check `/healthz`. Build `npm ci --include=dev && npm run build && npm prune --omit=dev`; start `npm start`. The startup runs explicit migrations and a repeatable catalog seed before accepting traffic. No disk, cron, managed Render database or background worker is needed.

Set `DEMO_MODE=true`, `NODE_ENV=production`, `NODE_VERSION=22.23.2`, `CLIENT_URI=https://vesper-art-demo.pages.dev`, the isolated Neon connection string, its exact hostname in `DATABASE_HOST_EXPECTED`, and independent access/refresh/proxy secrets. The database guard rejects other names/hosts and verifies TLS. The endpoint is capped at 0.25 CU and suspends when idle.

Build the frontend with **both root and client dependencies installed**: `npm ci && npm --prefix client ci && npm run build:client`. Shared `common/` modules import root packages such as `currency.js`; a client-only install is insufficient on a clean checkout. Set Pages secrets `API_ORIGIN` to the new Render HTTPS origin and `DEMO_PROXY_SECRET` to the same generated value as Render. Deploy from the repository root with:

```sh
export CLOUDFLARE_ACCOUNT_ID=f8fd075624b85e729e46d15d374e59ed
export XDG_CONFIG_HOME='<absolute-path-to-isolated-demo-cli-profile>'
wrangler pages deploy client/build --project-name vesper-art-demo --branch main
```

Replace the profile placeholder with the existing private demo CLI directory, authenticate there, and verify the account before publishing. Always explicitly set both environment variables; Pages rejects `account_id` in Wrangler config. Keep any task-specific OAuth configuration separate from existing global credentials. Never put secrets in `VITE_` variables, source control or frontend code. Changing Pages secrets requires a redeployment.

Only `/api/*` invokes Functions. Proxy requests authenticate with a shared secret; writes require the exact frontend Origin. Multipart bodies are bounded even without Content-Length. Polling uses the same proxy; no WebSocket upgrade or keep-alive job is required. Health checks do not access the database. Static sample browsing does not wake Render or Neon.

## Cost and verification

Target recurring cost is $0 within free allowances. The three demos share Render's free workspace allowances; do not add a payment method, paid upgrade, keep-alive ping or paid overage. Live services may sleep or stop at quota exhaustion. The sample stays available. No DNS or existing provider resources are involved.

Local verification: API integration tests cover ownership, uploads, quotas, simulated licensing, refresh/logout including exhausted accounts, expiry cleanup and schema drift. The migration roundtrip and Pages proxy tests pass. Browser checks cover sample and live artwork, favorites, comments and simulated order creation. Production audits reported zero known vulnerabilities in backend and frontend on 18 September 2026. Authenticated polling and logout disconnection were verified against the running API.

After changing the deployment, recheck the sample/deep links, session start, comment/favorite, upload, simulated receipt, refresh/logout, polling, cookie security, CSP and direct Render API rejection. To roll back, redeploy a tested prior commit; never drop/reseed as a startup operation.

CI uses an isolated disposable PostgreSQL service on a public standard GitHub runner, with no production secrets or cloud deployment permissions. The obsolete Railway staging/tag deployment workflows were removed so repository updates cannot redeploy the retired infrastructure. Hosting deployment remains manual.

## Source and release branches

The restoration is merged into GitHub `master`. The existing Render service and `render.yaml` now both select `master`; auto-deploy and PR previews remain Off. Manually deploy a tested commit from this branch. Merging source alone does not deploy it. The old restoration branch is retained for history, and no duplicate service is needed. The branch alignment changed the source selector, not the currently running API version.

Pages uses Direct Upload and its production label is **`main`**, independently of the source checkout. Another `--branch` can create only a preview. Verify the root public URL and its asset names after upload. Markdown-only updates require no hosting deployment.

Verified production on 18 September 2026: Pages `21f3d413`, API commit `494132e6af53546bd029c39b5aa359e2746aa1f7`. Later source commits include the gallery fix, tests and documentation; the corrected gallery is included in that Pages production build.
