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

## 2026-06-25: Typed Roleplay Answer

Built one focused improvement: the Roleplay screen now has a typed answer box, a local readiness review and a clearer path into mock feedback. Users can write a first response, tap Review answer and see whether the answer has enough detail before reading the existing mock AI feedback.

What went well:

- The improvement directly supports the English MVP practice loop without adding backend, auth or real AI.
- The review logic is isolated in `src/utils/answerReview.ts`, making it easy to expand later.
- Added a focused test for the local answer-review rules.

What went wrong:

- The repo had existing `package.json` and `package-lock.json` changes before this run that downgraded Expo/React Native compared with the original foundation.
- Older React Native types did not accept `gap` styles or `DimensionValue`, so the app needed a small compatibility pass before typecheck could pass.
- `expo lint` was not supported by the current installed Expo CLI, so the lint script now runs ESLint directly.
- Node prints a warning when the test imports the TypeScript helper directly, but the tests pass.

Checks run:

- `npm run typecheck` passed.
- `npm run test` passed.
- `npm run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 4
- Simplicity: 4
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Work from `C:\Dev\speakcareer-app`, not the Google Drive copy.
- Check package/version drift before assuming the Expo foundation is unchanged.
- Keep the next feature small and continue improving the local practice loop before adding any real integrations.

Next suggested task:

- Save completed mock roleplay sessions locally and show them in Progress.

## 2026-06-26: Local Mock Session History

Built one focused improvement: users can save a reviewed roleplay answer as a local mock practice session, and Progress now shows a simple session history. The session history is in app memory only; it does not use device storage, Supabase or any backend.

What went well:

- The feature closes the first useful practice loop: answer, review, save, then inspect progress.
- The session creation logic is isolated in `src/utils/sessionHistory.ts`.
- Added a focused test for creating local practice sessions.
- Expo Go is working on Kevin's phone with SDK 54.

What went wrong:

- The phone's Expo Go reports SDK 54 support, so SDK 56 caused an update prompt even though the phone app appeared current.
- The app had to be aligned to Expo SDK 54 locally: `expo@54.0.35`, `react@19.1.0`, `react-native@0.81.5`.
- Tests still print a harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm run typecheck` passed.
- `npm run test` passed.
- `npm run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 4
- Simplicity: 4
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep the app on Expo SDK 54 while Kevin's Expo Go shows SDK 54 support.
- Continue improving the local practice loop before adding real auth, AI, analytics or payments.
- Session history is currently in-memory only; persistent local storage can come later if explicitly useful.

Next suggested task:

- Connect the typed answer to more specific rule-based mock feedback.
