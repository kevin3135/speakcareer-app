# Agent Learning Log

## 2026-06-25

Built the initial SpeakCareer Expo TypeScript foundation.

What changed:

- Created a simple English MVP app structure.
- Added onboarding, home, practice, roleplay, progress and profile screens.
- Added local mock roleplays, AI feedback and progress mistake-bank data.
- Added product docs, eval docs, `.env.example`, README and development plan.

Assumptions:

- English-only is the correct first build.
- Mock AI feedback is enough for the first product foundation.
- A custom lightweight navigator is acceptable before the app needs deep linking or complex stacks.

Checks run:

- `npm run typecheck` passed in a clean temp install.
- `npm run test` passed locally and in a clean temp install.
- `npm run lint` passed in a clean temp install.

Environment note:

- Installing dependencies directly inside the Google Drive workspace hung and left an incomplete `node_modules`; a clean temp install worked. `node_modules` was removed from the repo workspace and remains ignored.
- GitHub publishing is locally prepared on `codex/app-foundation`, but remote write access is blocked until GitHub auth is connected. The GitHub connector returned `403 Resource not accessible by integration`, HTTPS push waited for credentials and SSH had no public key.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 4
- Simplicity: 4
- Feedback quality: 4
- Safety and privacy: 5

Next suggested task:

- Add a typed answer box to Roleplay and save a local mock session.
