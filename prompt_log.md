# Spendwise — Prompt Log

## Tools and models used
I used Codex inside of VS Code to build my project. I used it because I already have ChatGPT Plus so Codex just made sense in terms of usage benefits. I also just use OpenAI the most in general so I'm the most comfortable wiht it and it has memory from my previous projects so it understands how I work. I used it to build out my backend and frontend,help me work through any technical issues, and figure out how to add a database to my backend. 

### Entry 1 — Initial prompt to build the backend
now
**My exact prompt:**

" I am building a portfolio-ready personal finance web app for a CMU class project. The goal is to create a polished but manageable app in about 8 hours of focused work. I need to understand and be able to explain all of the code, so please avoid overengineering and keep the architecture simple and modular.
PROJECT IDEA
Build a “Personal Finance Behavior Dashboard” that helps users understand spending patterns, not just view totals.
The user should be able to:
1. Connect a simulated bank account using Plaid Sandbox
2. Import fake transaction data from Plaid
3. Manually add transactions, especially for cash purchases
4. View a dashboard with charts and spending summaries
5. See behavioral insights calculated from transaction data
6. Use the app on desktop and mobile
IMPORTANT:
For this class project, I am using Plaid Sandbox only, not real bank accounts.
CORE CONCEPT
Plaid acts as a middleman between banks and my app.
Flow:
Bank / fake Sandbox institution
        ↓
      Plaid
        ↓
My backend
        ↓
My frontend/dashboard
PLAID CREDENTIALS
Plaid gives me:
- PLAID_CLIENT_ID
- PLAID_SECRET
The client ID identifies my app.
The secret authenticates my app.
These should NOT be hardcoded into frontend JavaScript or committed to GitHub.
Locally, use a .env file:
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox
Make sure .env is in .gitignore.
When deployed, the backend will likely be hosted on Render and the same values will be stored as Render environment variables.
FIRST TASK
Start with the backend only.
Keep the backend minimal and explain each file before writing it.
Important:
- Never hardcode PLAID_CLIENT_ID or PLAID_SECRET.
- Read them using process.env.
- .env must be ignored by Git.
- .env.example should contain placeholder names only, not real credentials.
- Use Plaid Sandbox only.
- Keep the access token in memory for now rather than adding a database.
- Do not add authentication, user accounts, or persistence yet.
Before writing code:
1. explain what each endpoint does
2. explain how the Plaid token flow works
3. tell me which npm packages are required
4. then create the files one at a time
After the backend is running locally, help me test each endpoint before moving on to the frontend." 
```

**Result / what I understood:**

I understood at a high level how the app was using Plaid API to fetch the transaction data and using Flask as a way to communiate with the API, reutrning it as a JSON to the frontend.

### Entry 2 — Testing the backend locally

**My exact prompt:**

```how do i test my backend locally before deploying to render?
```

**What AI proposed or changed:**

Gave me a list of steps and commands to run in my termainl. 

**Result / what I understood:**

I understood how all the general steps worked for running a backend locally but needed help with anything that was specific to Plaid.

### Entry 3 — Technical Issues

***My exact prompts:**
1. {"error":"PLAID_UNAVAILABLE","message":"Could not reach Plaid. Try again shortly."}?

2. Address already in use
Port 3001 is in use by another program. Either identify and stop that program, or start the server with a different port.

3. It seems like everything is working. Can you double check before i deploy it onto render?

4. Will render auto update if i change my code?

### Entry 4 - Adding a Database

***My exact prompts:** 
1. "add a database now i'm in my backend repository"

2. "That needs your Render database and DATABASE_URL configured. - what does this mean?"

3. "wait but since its in the same repository i think it auto updated in my current render project already? you want me to make a new one?"

4. "what to do now?" - inserted a screenshot of New Postgres entry.

5. now how do i connect the database ot my existing backend web service?

6. "why does it say "not found" at the base URL?"

7. Is the data saved only for each person's brower? like if i went onto someone else's computer and tried to run this through github pages, i would have to reconnect?

## Entry 4 - Initial frontend development 

***My exact prompts:** 
1. "help me create the frontend now on this new repository. use html, css, javascript. ask any questions you may have before starting"

2. "ok so now do i just commit changes to github and go to the url? or do i need to do something to connect frontend and backend before testing it out?"

3. "so change my frontend origin cuz i already have that as an environment varialbe?"

### Entry 5 - UI Updates:

4. i like it but maybe try to mimic this UI a bit? where there's buttons on the side. one for home with high level overviews, then expenses, bank accounts, etc. feel free to get creative with this put just make the layout more interesting with several different pages for poeople to click to. - inserted a screenshot of a dashboard/web app layout i really liked from another personal finance tracking app.

5. some info is repeated on several pages like for expenses just include transaciotns and not the stuff above you alr include elsewhere you know hwat i mean? and for insights its just the same as homepage. maybe go more in depth with the insights or make homepage more high level up to you


## Code I wrote or meaningfully changed myself

1. Edited explanatory text in index.html to make the dashboard clearer.
2. Adjusted a layout rule in layout.css and check desktop/mobile behavior.
3. Added the proposed transaction-count endpoint to the backend.

## One place AI got it wrong
One place AI got it wrong was when it gave me the list of steps for what to input to run my backend locally. For all the stpes, it told me to paste a certain command but it wasn't working because the port it told me to use was already taken and aparently Codex was running it elsewhere already. I had to tell Codex to stop running that port so it wasn't occupied anymore and I could use it to test my backend. Codex ddin't catch this problem initially until I brought it up.

## Final testing and limitations

[Describe checks you personally performed on the deployed app, such as bank
connection, cash-entry persistence after refresh, filters, navigation, and phone
layout. Identify tests reported by AI separately from your own tests.]

[Explain known limitations you understand: shared fictional data, no user
accounts, and the Plaid connection resetting on backend restarts.]

## Sources and links

- [Live app](https://irishaoru.github.io/personal-finance-tracker/)
- [Frontend repository](https://github.com/irishaoru/personal-finance-tracker)
- [Backend repository](https://github.com/irishaoru/personal-finance-tracker-backend)
- [Relevant documentation, tools, or commits actually used]
