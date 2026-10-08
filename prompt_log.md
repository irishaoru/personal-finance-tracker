# Spendwise — Prompt Log

> AI-generated layout. Fill in the bracketed sections with your own account of
> the work, then remove the placeholders and instructions before submitting.
> Copy important prompts verbatim. Never include credentials or access tokens.

## Tools and models used

| Tool / model | What I used it for | Why I chose it |
|---|---|---|
| Codex / [model name if known; otherwise say unknown] | [Actual tasks] | [Your reason] |
| [Other AI tool actually used, or remove this row] | [Task] | [Reason] |

## Development timeline

Record actual sessions and honest time estimates, including reading code,
testing, deployment, and personal edits. Do not invent hours or dates.

| Date / session | Work completed | Time spent (label estimates) | Prompt entry / commit |
|---|---|---|---|
| [Date] | [Task] | [Duration] | [Reference] |
| [Date] | [Task] | [Duration] | [Reference] |

Total time: [Actual total or clearly labeled estimate]

## Important prompts and development process

Duplicate this entry for each important prompt, in chronological order. Paste
your original messages exactly. The assignment's 15–40 prompts is an example,
not a quota. You do not need to reproduce every short clarification.

### Entry 1 — [Task or problem]

- Date / session: [When]
- Tool / model: [What you used]
- Context: [What was missing or broken]

**My exact prompt:**

```text
[Paste your original prompt verbatim.]
```

**What AI proposed or changed:**

[Summarize the response and affected files. No need to paste the full response.]

**What I did and checked:**

[Your actions: reading code, testing, deploying, editing, or following up.
Distinguish your direct code edits from changes you asked AI to make.]

**Result / what I understood:**

[Outcome, explanation in your words, and a real test result or commit if available.]

### Entry 2 — [Next task or problem]

- Date / session: [When]
- Tool / model: [What you used]
- Context: [Starting point]

**My exact prompt:**

```text
[Paste your original prompt verbatim.]
```

**What AI proposed or changed:**

[Your summary]

**What I did and checked:**

[Your actual actions]

**Result / what I understood:**

[Outcome]

Potential topics from this project's conversation: the initial backend request,
switching to Flask, debugging HTTPS certificates, adding a database, configuring
Render, building the frontend, adding sidebar navigation, and separating the
pages' content. Use your actual prompts rather than these topic summaries.

## Code I wrote or meaningfully changed myself

List direct edits you actually made. Asking AI to make an edit is different from
making it yourself. If personal code edits are pending, complete them first.

| File / feature | What I directly changed | Why | How I checked it |
|---|---|---|---|
| [File] | [Before / after] | [Reason] | [Result] |
| [File] | [Actual edit] | [Reason] | [Result] |

[Explain one change in your own words and link to its commit if available.]

## One place AI got it wrong

[Write one short paragraph: what AI got wrong, how it became apparent, what
you did about it, who made the correction, and what you learned.]

One real example you may discuss: the first duplicate-import check assumed the
transaction count would stay unchanged while Plaid was still preparing history.
The assistant corrected the check to reimport a fixed snapshot. Explain your
own involvement honestly; do not claim you discovered or fixed it if you did not.

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
