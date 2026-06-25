# SpeakCareer

SpeakCareer is an AI language practice app for professional conversations.

Positioning: "Practice job interviews, meetings and professional conversations with AI."

The first MVP is English-only and uses local mock data. Supabase, OpenAI, RevenueCat, PostHog and Sentry are planned later but are not connected yet.

## What is Included

- Expo React Native app with TypeScript.
- Simple local navigation between Onboarding, Home, Practice, Roleplay, Progress and Profile.
- Five English roleplay examples:
  - Job Interview
  - Meeting Practice
  - Presentation Practice
  - Sales Call
  - Workplace Small Talk
- Mock AI feedback UI.
- Local progress and mistake bank UI.
- Product, roadmap, agent and eval documentation.

## Run Locally

```bash
npm install
npm run start
```

On Windows PowerShell, if scripts are blocked, use:

```bash
npm.cmd install
npm.cmd run start
```

Then open the app with Expo Go, an emulator or the Expo web option.

## Checks

```bash
npm run typecheck
npm run test
npm run lint
```

If dependencies are not installed yet, run `npm install` first.

## Current Assumptions

- English is the only built language for the MVP.
- AI feedback is mocked until a backend exists.
- No user accounts, payments, analytics or error tracking are connected in this foundation.
- Professional practice quality matters more than broad feature count.
