# Spendwise — Personal Finance Behavior Dashboard

## AI-generated setup and code guide

A plain HTML, CSS, and JavaScript dashboard connected to a Flask backend with
PostgreSQL storage. Uses Plaid Sandbox only. This is a shared public demo; use
fictional transactions. All visitors can see the same saved records.

### Run locally

From this repository:

```sh
python3 -m http.server 5173 --bind localhost
```

Open **http://localhost:5173** (use localhost, not 127.0.0.1, to match CORS).
No npm packages or build step are needed. Serve over HTTP, rather than opening
index.html as a file, because JavaScript modules require a server.

### Features

Four hash-linked views: **Home** (overview and recent activity), **Expenses**
(transaction search, filters, and cash entries), **Bank accounts** (connection
controls and imported account IDs), and **Insights** (behavioral patterns).
Links such as `#expenses` work on GitHub Pages and support browser back/forward.
Accounts are derived from saved transaction records; the API does not supply
account names or balances, so these are not invented.

- Connect a simulated institution through Plaid Link; standard Sandbox test
  credentials are `user_good` / `pass_good`.
- Load sample data directly for a quick demo without the Link interface.
- Import fake bank transactions and save manual cash purchases in PostgreSQL.
- Filter by period and currency; search and paginate the transaction list.
- Category and weekday charts built with HTML/CSS, with readable values.
- Explainable behavioral observations, calculated from posted transactions.
- Responsive layout, keyboard navigation, accessible dialog, and error states.

The backend is public at:
https://personal-finance-tracker-backend-pak4.onrender.com

### Files to understand

- `index.html`: page structure, controls, table, and cash entry dialog.
- `styles.css`: base components, charts, and forms.
- `layout.css`: sidebar, workspace theme, account cards, and mobile layouts.
- `api.js`: backend URL, fetch wrapper, and retries while Plaid prepares data.
- `insights.js`: pure filtering and summary functions.
- `app.js`: state, DOM updates, events, and Plaid Link flow.

### How data moves

Browser → Flask API → PostgreSQL → JSON → dashboard.
Plaid access tokens and credentials stay on the backend. `api.js` contains only
the public backend URL. Transactions are not stored in browser localStorage.
The backend's Plaid connection is shared and resets after redeploys, but saved
transactions remain. Creating another sample connection adds different fake
transaction IDs; importing the same connection updates existing IDs.

Positive Plaid amounts are outflows; negative amounts are inflows, including
refunds. Transfers and loan payments can count as outflows, so these are not
precise consumption or income measurements. Pending records are excluded from
charts and summaries. Each currency is calculated separately. The date window
is inclusive, uses local calendar dates, and excludes future records unless
All saved history is selected. Small purchases are amounts below 20 currency
units. These rules are displayed in the dashboard and are not financial advice.

### Deploy the frontend

Use GitHub Pages or a Render **Static Site**. There is no build process: on
Render leave the build command empty if allowed (otherwise use `echo Ready`)
and set the publish directory to `.`. The backend remains a separate web service.
Before using the deployed frontend, update the backend's `FRONTEND_ORIGIN`
environment variable to the exact frontend origin, without a trailing slash
or path. For GitHub Pages that is `https://irishaoru.github.io`, even when the
app is published beneath `/personal-finance-tracker/`. Save and redeploy the
backend. Local browser access will need `http://localhost:5173` configured again.

### Manual verification

1. Load the dashboard; check that saved data appears or an empty message shows.
2. Click Load sample data; verify totals, charts, and transactions appear.
3. Import again; existing IDs should not duplicate (additional bank history may arrive).
4. Add a fictional cash purchase, refresh, and verify it remains saved.
5. Try search, source, currency, period filters, and pagination.
6. Use keyboard navigation and a narrow mobile viewport.
7. Test an offline network and confirm a helpful retry message appears.
8. Test the Plaid Link flow with a simulated institution.

This code and guide were generated with Codex. Write your own project overview,
learning notes, and feature reflections for the class README; keep a separate
prompt log with your actual prompts and personal modifications.
