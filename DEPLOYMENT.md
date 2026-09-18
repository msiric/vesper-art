# Isolated portfolio deployment

Status: implementation verified locally; public deployment in progress.

| Resource | Parent | App resource |
| --- | --- | --- |
| Cloudflare Pages Free | `msiric-public-demos`, account `f8fd075624b85e729e46d15d374e59ed` | `vesper-art-demo` |
| Render Free | `msiric-public-demos`, workspace `tea-damk99ajnfac73b07010` | project `prj-damk9v8u01pc73aj9l50`, Demo environment `evm-damk9v8u01pc73aj9l5g` |
| Neon Free | `msiric-public-demos`, org `org-damp-glade-19263338` | project `morning-cherry-43523697`, database `vesper_demo`, PostgreSQL 16, Frankfurt |

## Deploy

Use `codex/restore-public-demo` and `render.yaml` in the exact new Render project above. Select **Free**, Frankfurt, auto-deploy Off, health check `/healthz`. Build `npm ci --include=dev && npm run build && npm prune --omit=dev`; start `npm start`. The startup runs explicit migrations and a repeatable catalog seed before accepting traffic. No disk, cron, managed Render database or background worker is needed.

Set `DEMO_MODE=true`, `NODE_ENV=production`, `NODE_VERSION=22.23.2`, `CLIENT_URI=https://vesper-art-demo.pages.dev`, the isolated Neon connection string, its exact hostname in `DATABASE_HOST_EXPECTED`, and independent access/refresh/proxy secrets. The database guard rejects other names/hosts and verifies TLS. The endpoint is capped at 0.25 CU and suspends when idle.

Build the frontend with `npm --prefix client ci && npm run build:client`. Set Pages secrets `API_ORIGIN` to the new Render HTTPS origin and `DEMO_PROXY_SECRET` to the same generated value as Render. Deploy from the repository root with:

```sh
CLOUDFLARE_ACCOUNT_ID=f8fd075624b85e729e46d15d374e59ed wrangler pages deploy client/build --project-name vesper-art-demo --branch main
```

Always explicitly set that account environment variable; Pages rejects `account_id` in Wrangler config. Keep any task-specific OAuth configuration separate from existing global credentials. Never put secrets in `VITE_` variables, source control or frontend code. Changing Pages secrets requires a redeployment.

Only `/api/*` invokes Functions. Proxy requests authenticate with a shared secret; writes require the exact frontend Origin. Multipart bodies are bounded even without Content-Length. Polling uses the same proxy; no WebSocket upgrade or keep-alive job is required. Health checks do not access the database. Static sample browsing does not wake Render or Neon.

## Cost and verification

Target recurring cost is $0 within free allowances. The three demos share Render's free workspace allowances; do not add a payment method, paid upgrade, keep-alive ping or paid overage. Live services may sleep or stop at quota exhaustion. The sample stays available. No DNS or existing provider resources are involved.

Local verification: API integration tests cover ownership, uploads, quotas, simulated licensing, refresh/logout including exhausted accounts, expiry cleanup and schema drift. The migration roundtrip and Pages proxy tests pass. Browser checks cover sample and live artwork, favorites, comments and simulated order creation. Production audits reported zero known vulnerabilities in backend and frontend on 18 September 2026. Authenticated polling and logout disconnection were verified against the running API.

Before advertising the live URL, verify the deployed sample/deep links, session start, comment/favorite, upload, simulated receipt, refresh/logout, polling, cookie security, CSP and direct Render API rejection. To roll back, redeploy a tested prior commit; never drop/reseed as a startup operation.
