# Spendwise — Personal Finance Behavior Dashboard

[Open the live app](https://irishaoru.github.io/personal-finance-tracker/)

## What the app does

The app is a personal finance tracker that brings the demo's spending into one place so users can see spending totals, where the money is going, and spending trends over time. The app allows the user to connect a simulated bank account and import its transactions. These are saved in a database, so users don't need to manually reconnect every time they refresh the page. The app is a shared demo using simulated Sandbox accounts, and all visitors can see the same saved data. Saved transactions persist, but a backend restart requires reconnecting before importing more.

## How to use it

In the Bank accounts tab, click **Connect Sandbox bank** to connect to a fake account on Plaid. Once the account is connected, transactions are automatically imported and available in Expenses. Use **Import transactions** to fetch them again later. You can also use **Load sample data** to skip the simulated login, or add a fictional cash purchase from Expenses.

## Features I'm most proud of

1. Implementing a database into the web app via my Render service so that the data is saved whenever users refresh the app.
2. The ability to use Plaid as a way to get data for transactions and get the app running and working to mitigate the concern of security and privacy of using an actual bank account with sensitive information.

## How to run it locally

Requires Python 3.10 or newer. These instructions run both the frontend and backend on your computer, using SQLite for local storage.

### Backend

1. Open a terminal in `personal-finance-tracker-backend`.
2. Run these commands to create an isolated Python environment, activate it, and install the backend's packages:

   ```sh
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. If `.env` does not exist, create a copy of `.env.example` and rename it to `.env`:

   ```sh
   cp .env.example .env
   ```

   If `.env` already exists, edit it instead of overwriting it.

4. Inside `.env`, enter your Plaid client ID and Sandbox secret, and set the local database and frontend address:

   ```dotenv
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_sandbox_secret
   PLAID_ENV=sandbox
   PORT=3001
   DATABASE_URL=sqlite:///finance.db
   FRONTEND_ORIGIN=http://localhost:5173
   ```

   Replace the two credential placeholders with your own values. `DATABASE_URL` tells Flask to save transactions in a local file named `finance.db`. `FRONTEND_ORIGIN` allows the locally running frontend to call Flask. These are local settings; leave the deployed Render settings unchanged.

5. Start Flask:

   ```sh
   python app.py
   ```

6. Flask runs at http://localhost:3001 and creates the local `finance.db` database automatically. Leave this terminal running.

### Frontend

1. Open a second terminal in `personal-finance-tracker`.
2. In `api.js`, temporarily change `API_BASE` to:

   ```javascript
   export const API_BASE = 'http://localhost:3001';
   ```

   This tells the frontend to call your local Flask server instead of Render.

3. Run:

   ```sh
   python3 -m http.server 5173 --bind localhost
   ```

4. Open http://localhost:5173 in your browser. Both terminals must stay running. Press **Ctrl+C** in each to stop them.
5. Before publishing frontend changes, restore `API_BASE` to the deployed backend URL:

   ```javascript
   export const API_BASE = 'https://personal-finance-tracker-backend-pak4.onrender.com';
   ```

## How secrets are protected

Secrets are stored as environment variables in my Render backend. This includes my Plaid client ID, Plaid secret, and database URL. The local `.env` file is ignored by Git and credentials never go into frontend code.

## How I used AI

I used AI to create my initial backend code, walk me through the steps on how to run the backend locally in my terminal, and help me test the backend once I got it deployed on Render to make sure it was working. AI also helped me figure out how to set up the database in Render and connect that using the database URL to my backend. It helped me test that in the browser as well. I also used AI to create and iterate the frontend UI to make it more like a dashboard and less like one long page. I used Codex and it produced a substantial portion of the code.

Relevant tools and sources:

- [OpenAI Codex](https://openai.com/codex/) — the AI coding tool I used.
- [Plaid Quickstart](https://plaid.com/docs/quickstart/) and [Sandbox documentation](https://plaid.com/docs/sandbox/) — references used for the simulated bank integration.

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

Four hash-linked views: **Home** (high-level totals and recent activity),
**Expenses** (only transaction search, filters, and cash entries), **Bank accounts**
(connection controls and imported account IDs), and **Insights** (full category
breakdown, weekday chart, median/largest purchase, purchase-size bands, and repeated
transaction names).
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

This setup and code guide was generated with Codex. The project explanation above
was written by the author and edited with AI assistance for grammar, formatting,
and setup accuracy. Development prompts and personal code changes belong in the
separate prompt log.

Purchase analysis uses positive posted records in the selected period and currency.
Median is the middle amount (or the mean of the two middle amounts). Size bands
are under 20, 20 to under 100, and 100 or more currency units. Merchant names
are grouped after trimming and lowercasing; repetition does not establish a
subscription. Imported sample connections may share names and amounts.
