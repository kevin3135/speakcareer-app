# SpeakCareer Agent Instructions

SpeakCareer is an Expo React Native TypeScript app for practicing professional conversations with AI.

## Product Direction

- Main positioning: "Practice job interviews, meetings and professional conversations with AI."
- First target language: English.
- Future target languages: Spanish, French and Mandarin Chinese.
- Build one strong English MVP before expanding languages.
- Keep the product professional, calm and useful. Do not make it childish or game-like.

## Technical Direction

- Use Expo React Native and TypeScript.
- Prefer simple working code over complex architecture.
- Do not add real API keys, secrets, payment logic or app store setup.
- Supabase, OpenAI, RevenueCat, PostHog and Sentry are planned later.
- OpenAI must go through a backend only when implemented later.
- Keep mock data local until the backend exists.

## Autonomous Build Loop

When continuing development:

1. Read `docs/product/roadmap.md`, `docs/product/mvp.md` and `DEVELOPMENT_PLAN.md`.
2. Pick the smallest useful next feature.
3. Build it with focused changes.
4. Run `npm run typecheck`, `npm run test` and `npm run lint` when dependencies are installed.
5. Evaluate the result with `docs/evals/product-rubric.md`.
6. Update `docs/agent/learning-log.md` with what changed, checks run and what was learned.
7. Suggest the next small task.

## Guardrails

- Do not overbuild architecture.
- Do not add auth, database, subscriptions, analytics or error tracking until a task explicitly asks for that integration.
- Do not store private user data in the repo.
- Keep documentation plain and founder-readable.
- If something is uncertain, make a sensible assumption and document it.
