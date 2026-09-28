# Repair OS

Private, single-operator PWA + financial engine for an on-demand mobile electronics repair business.
Stack: Node 18+ / Express / PostgreSQL 13+, vanilla-JS installable PWA (no build step).

## Unit economics
`net_profit = client_price − (part_cost + driver_fee + consumables)` is a **stored generated column**.
Monthly/daily **net margin = Σ job net_profit − Σ operating expenses** (views `v_daily_pnl`, `v_monthly_pnl`).

## Database logic (db/schema.sql)
- Ticket codes `TFX-YYYY-NNN` auto-generated (race-safe yearly counter).
- A ticket cannot be completed until the post-repair verification is ticked.
- On completion (exactly once): customer lifetime spend, driver wallet accrual, supplier debt (credit purchases) are posted.
- Economics are locked once a ticket is completed; warranty expiry is set from completion date.
- Driver payouts and supplier settlements/RMA credits keep balances in sync via triggers.

## Run
```
cp .env.example .env      # set OWNER_PASSWORD, SESSION_SECRET, DATABASE_URL
createdb repairos && npm install
set -a; . ./.env; set +a
npm run db:init && npm start
```
Open http://localhost:3000 on your phone and "Add to Home Screen". Serve behind HTTPS in production (`NODE_ENV=production` sets Secure cookies).

## Privacy
Every `/api` route except login requires the signed owner session cookie; login is rate-limited; `robots.txt` and `X-Robots-Tag` block indexing; the service worker never caches API data.
