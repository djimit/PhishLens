<div align="center">
# PhishLens
PhishLens is a lightweight Gemini powered web app for phishing analysis and triage, built as a Google AI Studio app template.

Repository status: this repo currently looks like an AI Studio starter scaffold (Vite, React, TypeScript) with `components/` and `services/` folders, and a minimal “run locally” template README. The sections below turn it into a wiki style README without inventing product claims that are not visible in the repo UI.

## Why PhishLens exists
Phishing is not just “a bad URL”, it is a bundle of signals, brand mimicry, copy patterns, domain tricks, and behavioral intent. Most tooling either blocks, or alerts, but does not help a human understand why. PhishLens is positioned as a pragmatic analyst companion, quick input, structured output, and an explainable narrative you can act on.

## What you can do with it (intended outcomes)
- Triage suspicious links faster, reduce analyst time per ticket.
- Produce a short, consistent rationale that can be shared with users and stakeholders.
- Create a repeatable workflow for “is this phish” decisions, including uncertainty.

## Non goals
- This is not a full mail gateway, not a SOC platform, not a replacement for safe browsing, sandboxing, or threat intel feeds.
- This should not be your only control, it is decision support.

## Architecture (current, from the repo structure)
- Frontend: TypeScript + React, running via Vite.
- App shape: AI Studio app template.
- Separation: `components/` for UI, `services/` for API calls and app services (folder names present in the repo).
- Model access: Gemini API via `GEMINI_API_KEY` environment variable.

## Quickstart
Prerequisite: Node.js.

1) Install dependencies
```bash
npm install

	2.	Create .env.local and set your Gemini key

# .env.local
GEMINI_API_KEY=your_key_here

	3.	Run the app

npm run dev

These steps match the repository instructions.
(Repo README template: install, set GEMINI_API_KEY in .env.local, run npm run dev.)  ￼

Configuration

Environment variables:
	•	GEMINI_API_KEY, required, Gemini API key used by the app at runtime.  ￼

Recommended additions (strongly advised for production hardening):
	•	APP_ENV=local|staging|production
	•	LOG_LEVEL=info|debug
	•	API_BASE_URL if you introduce a backend proxy (recommended, see Security).

Security, operational reality (read this before you ship)

If this app calls Gemini directly from the browser, your API key can be exposed to end users. Treat that as unacceptable for production.

Minimum secure-by-design posture:
	•	Put Gemini calls behind a backend, never ship long lived keys to the browser.
	•	Use short lived tokens or a server side secrets manager.
	•	Enforce rate limiting, request size limits, and origin checks at the backend.
	•	Add abuse controls, input validation, and output filtering, especially if you later introduce URL fetching, HTML parsing, or screenshotting.

Threat model highlights (practical):
	•	Prompt injection: attacker controlled content tries to steer the model, mitigate with strict system instructions, tool output isolation, and schema constrained outputs.
	•	Data leakage: do not paste credentials, session tokens, internal URLs, or PII into the app, treat user input as sensitive.
	•	Supply chain: lock dependency versions, enable Dependabot, add SCA and secret scanning in CI.

Suggested workflow (analyst friendly)
	1.	Paste the suspicious URL or text snippet.
	2.	Ask for a structured verdict:
	•	Verdict: likely phish, suspicious, likely benign, unknown
	•	Top signals and why they matter
	•	What to do next, block, report, isolate, user education
	•	Confidence and what evidence would raise or lower it
	3.	Export the rationale into your ticket or incident record.

Development

Recommended scripts (typical for Vite + TS):

npm run dev
npm run build
npm run preview

Roadmap (high value, low hype)

Near term:
	•	Add a backend proxy for Gemini, remove all client side secret exposure.
	•	Define a strict response schema, enforce it end to end.
	•	Add a “shareable report” view for SOC tickets.

Next:
	•	Add a policy pack, org specific rules, wording, and escalation guidance.
	•	Add observability, structured logs, correlation IDs, error budgets.

Later:
	•	Integrations, for example webhook to ticketing, or export to JSON for SIEM enrichment.

Contributing
	•	Keep UI components pure, services side effectful.
	•	Prefer typed schemas for model outputs.
	•	Include tests for parsing and any security sensitive logic.

License

Add your license choice in LICENSE (none is visible in the repo listing at the moment).

Reference

The repo is generated from the Google AI Studio repository template and includes an AI Studio app link.  ￼

If you want, I can tighten this even further by aligning the README to the actual UI and service calls. To do that without guessing, paste the contents of `App.tsx` plus the `services/` folder entrypoints (or add raw file links in the repo), and I will rewrite the README so every feature and claim is directly grounded in code.
