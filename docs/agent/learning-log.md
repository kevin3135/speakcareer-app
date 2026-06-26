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

## 2026-06-26: Gamified Daily Mission Home

Built one focused improvement: the Home screen now feels more like a businesslike practice game. It shows a daily mission, level, streak, total career XP, reward, daily XP progress and a three-step career path. This moves SpeakCareer toward a more engaging Duolingo-style habit loop without becoming childish.

What went well:

- The app now has a clearer first action: Start mission.
- The gamification is professional: level, XP, streak and mission progress support career practice instead of feeling like a toy.
- The gamification logic is isolated in `src/utils/gamification.ts`.
- Added a focused test for creating the daily mission from mock progress data.

What went wrong:

- The design still uses simple local mock numbers; there is no real streak or persistent XP yet.
- Session history is still in-memory only, so progress resets when the app restarts.
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

- Continue making the app more habit-forming, but keep the tone adult and career-focused.
- Keep Expo SDK 54 compatibility until Kevin's Expo Go support changes.
- Avoid adding persistence packages until the local practice loop is clearly useful.

Next suggested task:

- Connect typed answers to more specific rule-based mock feedback and XP rewards.

## 2026-06-26: Rule-Based Feedback Rewards

Built one focused improvement: typed roleplay answers now generate local rule-based mock feedback and XP rewards. The Roleplay screen shows the reward after review, saved sessions store the dynamic feedback summary and Progress shows the XP earned for each session.

What went well:

- The feature makes the local practice loop more useful and more habit-forming without adding real AI or backend services.
- The feedback logic is isolated in `src/utils/ruleBasedFeedback.ts`, so it can later be replaced or compared against backend AI feedback.
- The UX stays professional: XP supports practice motivation, while feedback remains focused on career communication quality.
- Added tests for weak and strong typed answers.

What went wrong:

- The feedback is still simple rule-based mock logic, so it can miss nuance in grammar, pronunciation or industry-specific language.
- XP is still in-memory with saved sessions and does not persist after a restart.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

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

- Keep gamification tied to professional progress, not childish rewards.
- The next high-value step is to make progress feel persistent or make the roleplay flow richer with follow-up prompts.
- Do not add OpenAI, Supabase, payments, analytics or app store work yet.

Next suggested task:

- Add follow-up prompt variants for one roleplay so the experience feels more conversational.

## 2026-06-26: Businesslike Language-App Design Pass

Built one focused improvement: SpeakCareer now uses a more polished language-app inspired design system while staying professional. The Home screen has a status rail, daily path and XP-focused mission flow. Practice cards now show XP rewards and scan-friendly drill chips. Roleplay now includes a real 5-minute focus sprint timer with start, pause and reset controls.

Design inspiration reviewed:

- Duolingo-style path, streak, XP and bite-sized progression.
- Babbel-style adult minimal lesson cards and clear primary action.
- Busuu-style progress dashboard and learning milestones.

What went well:

- The app feels more habit-forming without adding childish characters or copying another brand.
- The 5-minute timer makes the practice loop more functional: sprint, answer, review, save.
- Added a reusable `LearningPath` component and isolated focus timer utility.
- Existing Expo SDK 54 compatibility stayed intact.

What went wrong:

- The design is still code-only with no custom brand imagery yet.
- The timer and XP are local only and do not persist after app restart.
- React lint flagged direct state reset inside an effect; the Roleplay screen now remounts by scenario key instead.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

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

- Keep using learning-app patterns: path, streak, XP, short sessions and immediate feedback.
- Do not copy Duolingo, Babbel or Busuu visuals directly; use them only as product inspiration.
- The next step should make Roleplay feel more interactive with follow-up prompts, not add backend yet.

Next suggested task:

- Add one follow-up question after feedback so each roleplay becomes a two-turn conversation.

## 2026-06-26: Two-Turn Roleplay Loop

Built one focused improvement: roleplays now continue into a second local conversation turn after the first feedback. Each scenario has follow-up prompts, the Roleplay screen shows a follow-up answer box, users can review that second answer and a ready follow-up earns a small XP bonus before saving the full session.

What went well:

- The practice loop feels more like a real professional conversation without adding real AI.
- Follow-up prompts are stored in local content, keeping the MVP simple and easy to expand.
- Saving happens after the follow-up area with the full XP reward, which makes the flow feel more like a finished lesson.
- Added content tests to ensure every roleplay has follow-up prompts.

What went wrong:

- The follow-up prompt is still static per roleplay; it does not adapt to the user's first answer yet.
- Follow-up feedback reuses the simple local answer review rather than a separate detailed feedback panel.
- Progress remains in-memory and still resets after app restart.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

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

- The next valuable improvement is to make follow-up prompts adaptive to the first answer's missing skill, still using local rules only.
- Keep the save point at the end of the practice loop so it feels like completing a lesson.
- Do not add backend AI until the local conversation flow feels strong.

Next suggested task:

- Make follow-up prompts adapt to the first answer weakness: result, structure, confidence or next step.

## 2026-06-26: Adaptive Follow-Up Prompts

Built one focused improvement: follow-up prompts now adapt to the first answer's weakest area using local rules. The Roleplay screen can ask for more detail, impact, structure, confidence or a realistic next-step follow-up, and it shows a short coaching note explaining why that prompt appears.

What went well:

- The roleplay flow feels more intelligent without connecting real OpenAI or adding backend complexity.
- The adaptive logic is isolated in `src/utils/followUpPrompt.ts`, making it easy to improve later.
- Added tests for result-focused follow-ups and strong-answer next-step follow-ups.
- The UI stays professional with a small focus label and coaching note.

What went wrong:

- The adaptive logic is still simple keyword matching and can miss nuanced answers.
- Follow-up scoring still uses the general answer-review rules instead of a dedicated second-turn evaluator.
- Progress and XP are still in-memory only.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm run typecheck` passed.
- `npm run test` passed.
- `npm run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 4
- Simplicity: 4
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep making the conversation loop feel smarter before adding real AI.
- The next useful improvement is a better lesson-complete state after saving a full session.
- Do not add persistence, auth, backend or payments yet unless explicitly approved.

Next suggested task:

- Add a polished lesson-complete state after saving a full roleplay session.

## 2026-06-26: Lesson Complete Progress Reward

Built one focused improvement: after saving a roleplay session, Progress now shows a polished lesson-complete reward card for the latest session. It highlights earned XP, word count, saved session count, total local XP and a recommended next action.

What went well:

- Saving a session now feels more rewarding and complete instead of just adding another history card.
- The reward summary logic is isolated in `src/utils/lessonComplete.ts`.
- The feature fits the Duolingo-like loop while keeping the tone professional and career-focused.
- Added a test for lesson-complete summary calculations.

What went wrong:

- The completion card appears on Progress because saving currently navigates there immediately; Roleplay does not yet have its own completion overlay.
- XP and completed sessions are still local in-memory only.
- The next action is rule-based and not personalized beyond XP and word count.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

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

- Keep strengthening the complete-practice-reward-repeat loop.
- The next useful improvement is a simple local streak/progress calculation from saved sessions, still without persistence packages.
- Do not add backend, auth, payments or app store work yet.

Next suggested task:

- Make Home and Progress use saved local sessions to calculate current-session XP and streak-like progress.

## 2026-06-26: Local Session Progress Stats

Built one focused improvement: Home and Progress now react to locally saved sessions during the current app run. Saved sessions increase visible session count, practice minutes, daily XP, career XP and streak-like progress without adding persistence, backend, auth or database work.

What went well:

- The app feels more responsive to user action: after saving a session, Home no longer looks fully static.
- Progress stat cards now align with the local session history and lesson-complete card.
- Added `src/utils/localProgress.ts` for the local session math and tests for mission/progress calculations.
- Kept everything in-memory and Expo SDK 54 compatible.

What went wrong:

- Progress still resets after app restart because no local storage has been added yet.
- `gamification.ts` duplicates a small amount of progress math so the direct Node tests can keep importing TypeScript helpers without changing TypeScript config.
- The streak is still "streak-like" local progress, not a real date-based streak.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

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

- The local practice loop now has answer, feedback, follow-up, save, reward and reactive progress.
- A good next step is a small daily target setting in Profile, still local and in-memory.
- Do not add persistence packages until Kevin explicitly wants progress to survive restart.

Next suggested task:

- Add a simple local daily practice target setting in Profile and use it for the Home daily goal.

## 2026-06-26: Local Daily Target Setting

Built one focused improvement: Profile now has a local daily practice target setting for 1, 2 or 3 roleplays per day. Home uses that target to update the daily mission title, XP goal and progress calculation during the current app run.

What went well:

- The setting gives users more control over the habit loop without adding accounts, storage or backend work.
- The Profile UI uses a simple segmented control and keeps the tone professional.
- Home now reflects both saved sessions and the chosen daily target.
- Tests cover the 2-roleplay target and XP-goal calculation.

What went wrong:

- The target is in-memory only and resets after app restart.
- Progress does not yet show the chosen target directly; Home is the main place where it is visible.
- The daily target is XP-based rather than fully session-completion based.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

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

- Profile now owns a useful local setting and passes it through the app state.
- A good next step is to make Progress show target completion clearly.
- Keep settings in-memory until persistence is explicitly approved.

Next suggested task:

- Show daily target completion in Progress, such as 1/2 roleplays completed today.

## 2026-06-26: Progress Daily Target Completion

Built one focused improvement: Progress now shows the selected daily target as a clear completion card, including completed roleplays, remaining roleplays and target completion percentage. This makes the Profile daily target visible outside Home.

What went well:

- The daily target now has a second visible payoff in Progress.
- `localProgress` now exposes target completion stats instead of forcing screens to calculate them.
- Added tests for completed, remaining and percent values for a 2-roleplay target.
- The UI stays compact and professional.

What went wrong:

- The target is still in-memory only and resets after app restart.
- The completion count is based on saved sessions in the current app run, not calendar-day storage.
- Progress now has several reward/progress cards, so future design work should keep hierarchy clean.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

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

- The app now has a complete local daily loop: set target, practice, save, see target progress.
- A useful next step is to add roleplay category/level filters in Practice to make content browsing easier.
- Keep the loop local and in-memory until persistence is explicitly approved.

Next suggested task:

- Add simple Practice filters for scenario category or level.

## 2026-06-26: Practice Level Filters

Built one focused improvement: the Practice screen now has level filters for the roleplay library. Users can choose All, B1-B2, B2 or A2-B1 and immediately see the matching scenarios.

What went well:

- The filter uses existing content data and does not require a larger content model.
- The UI is simple and familiar, using professional filter chips.
- The filtering logic is isolated in `src/utils/roleplayFilters.ts`.
- Added tests for available filters and filtered roleplay results.

What went wrong:

- Filters are only level-based for now; category filters can come next.
- Filter state is local to the Practice screen and resets when the screen remounts.
- The roleplay library is still small, so the filter is more useful as foundation than immediate necessity.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm run typecheck` passed.
- `npm run test` passed.
- `npm run lint` passed.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 4
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Practice now has the foundation for better content browsing.
- A useful next step is adding category tags/filters for Interview, Meeting, Presentation, Sales and Small Talk.
- Keep the filter system simple until the roleplay library grows.

Next suggested task:

- Add category tags and category filters to the Practice roleplay library.

## 2026-06-26: Practice Category Filters

Built one focused improvement: the Practice screen now has roleplay category tags and category filters for Interview, Meeting, Presentation, Sales and Small Talk. Users can combine the new category filter with the existing level filter to browse the English roleplay library faster.

What went well:

- The feature improves practice flow without adding any backend, storage or new screens.
- Category data lives in the local roleplay content, so the filter stays simple to extend as the library grows.
- The Practice UI now gives clearer browsing cues because each card shows its category tag.
- Added focused tests for category data and combined category-plus-level filtering.

What went wrong:

- Filter state is still local to the Practice screen and resets when the screen remounts.
- The roleplay library is still small, so the feature is more about clarity and future scale than solving a large-content problem today.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 4
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Practice now supports both level and category browsing with no new architecture.
- The next useful practice-flow improvement is better scenario density inside categories, such as adding more interview and meeting variants.
- Keep Expo Go compatibility on SDK 54 unless the learning log explicitly says Kevin's device support changed.

Next suggested task:

- Add a few more local roleplay variants inside the Interview and Meeting categories.

## 2026-06-26: Interview and Meeting Prompt Variants

Built one focused improvement: the Roleplay screen now supports repeatable practice angles for Job Interview and Meeting Practice. Interview has variants for "Tell me about yourself", "Why this role?" and "Difficult situation"; Meeting has variants for status updates, deadline clarification and politely challenging a decision. Selecting a variant changes the user's goal, coaching note and opening line.

What went well:

- The app now feels more reusable and less static without adding any backend, real AI or complex lesson system.
- The new prompt variants are local content, so they are easy to expand per category.
- The Roleplay UI keeps the interaction simple with professional chips and a coaching note.
- Added a focused test to protect the new interview and meeting variants.

What went wrong:

- Only Interview and Meeting have prompt variants for now.
- Switching a variant clears the current draft answer, which is safe but could feel abrupt if a user taps accidentally.
- The variants do not yet change suggested phrases or mock feedback wording per variant.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 4
- Simplicity: 4
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Prompt variants are a lightweight way to make each roleplay feel more like a mini-course.
- The next useful content step is adding variants for Presentation Q&A, Sales objections or Small Talk follow-ups.
- Keep the variant system local and simple until the app needs real lesson sequencing.

Next suggested task:

- Add presentation Q&A prompt variants so Presentation Practice also feels repeatable.

## 2026-06-26: Presentation Prompt Variants

Built one focused improvement: Presentation Practice now has three repeatable practice angles: Opening agenda, Smooth transition and Handle challenge. Each variant changes the opening line, user goal and coaching note through the existing Roleplay UI.

What went well:

- The improvement reused the prompt-variant system without adding new architecture.
- Presentation Practice now supports Q&A-style challenge handling, which makes it more realistic for workplace presentations.
- The content stays English-first and professional.
- Updated tests so Interview, Meeting and Presentation all have protected prompt variants.

What went wrong:

- Presentation variants still share the same suggested phrases and mock feedback.
- Sales and Small Talk do not have prompt variants yet.
- Switching variants still clears the current answer to avoid mixing prompts and drafts.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 4
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Prompt variants can now be rolled out scenario by scenario with very low risk.
- The next useful content expansion is Sales objection variants, then Small Talk follow-up variants.
- Keep content variants short enough to scan on mobile.

Next suggested task:

- Add sales objection prompt variants for Sales Call.

## 2026-06-26: Sales Objection Prompt Variants

Built one focused improvement: Sales Call now has three repeatable objection practice angles: Price concern, Timing concern and Existing tool. Each variant changes the customer's opening line, the user's goal and the coaching note through the existing Roleplay UI.

What went well:

- The sales scenario now trains realistic consultative sales moments instead of only one price objection.
- The change reused the local prompt-variant system and needed no new architecture.
- Tests now protect prompt variants for Interview, Meeting, Presentation and Sales.
- The content stays focused on professional English conversation practice.

What went wrong:

- Sales variants still share the same suggested phrases and generic mock feedback.
- Small Talk is now the only core roleplay without prompt variants.
- Switching variants still clears the current answer to prevent mixed prompt/session state.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 4
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- The prompt-variant rollout is almost complete across core scenarios.
- Small Talk should get professional follow-up variants next, then the app can shift from content breadth to feedback depth.
- Keep sales training consultative and respectful, not pushy.

Next suggested task:

- Add workplace small talk prompt variants for introductions, friendly follow-up and moving into the meeting topic.

## 2026-06-26: Workplace Small Talk Prompt Variants

Built one focused improvement: Workplace Small Talk now has three repeatable practice angles: Quick introduction, Friendly follow-up and Move to meeting. Each variant changes the colleague's opening line, the user's goal and the coaching note through the existing Roleplay UI.

What went well:

- All five core roleplays now have repeatable prompt variants, making the MVP feel more like a real practice app.
- Small Talk stays professional and workplace-safe instead of becoming casual chat.
- The change reused the existing local content model and required no new dependencies.
- Tests now protect prompt variants across Interview, Meeting, Presentation, Sales and Small Talk.

What went wrong:

- Suggested phrases and mock feedback are still shared at the scenario level instead of changing per variant.
- The app still clears drafts when switching variants, which protects state but may feel abrupt.
- Prompt variants are still local mock content, not adaptive lesson sequencing.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- The core content now has breadth; the next high-value work should improve feedback depth or first-time progress clarity.
- A good next step is a clean empty state for first-time Progress, then better variant-specific phrases.
- Keep Small Talk bounded to professional workplace moments.

Next suggested task:

- Add a clean first-time Progress empty state with a clear call to start one roleplay.

## 2026-06-26: First-Time Progress Empty State

Built one focused improvement: Progress now shows a polished first-time action card when there are no saved sessions. The card explains the three-step loop, recommends starting Job Interview and opens that roleplay directly from Progress.

What went well:

- New users now have a clear next action instead of only seeing an empty session history.
- The feature strengthens the practice-save-progress loop without adding storage, auth or backend work.
- The CTA reuses the existing roleplay navigation path.
- Added a small tested helper for the first-time Progress recommendation.

What went wrong:

- The recommended first roleplay is fixed to Job Interview rather than personalized.
- Progress is still in-memory only, so the empty state returns after app restart.
- The empty-state helper is simple and may later be replaced by real onboarding or user preference logic.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 4
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- The app now guides a first-time user from Progress into the practice loop.
- The next useful improvement is basic accessibility labels on interactive controls, because more chips and CTA buttons have been added.
- Keep first-time states action-oriented and founder-readable.

Next suggested task:

- Add accessibility labels to the main interactive controls and roleplay filter chips.

## 2026-06-26: Basic Accessibility Labels

Built one focused improvement: the main interactive controls now have clearer accessibility labels and hints. This covers bottom navigation tabs, roleplay cards, learning path actions, Practice category and level filters, Profile daily target controls, Roleplay scenario and practice-angle chips, timer controls, answer inputs and primary CTA buttons.

What went well:

- The app is more usable for screen reader users without changing the visual design.
- Existing UI components stayed simple; `AppButton` now supports optional labels and hints while keeping sensible defaults.
- The most context-heavy controls now explain what they do, such as filters, timer controls and roleplay practice angles.
- The improvement supports a more professional MVP without adding dependencies or integrations.

What went wrong:

- There are still no React Native component tests for accessibility props.
- Some labels are static English strings and may need localization later.
- Accessibility work is not complete yet; future passes should review focus order and dynamic announcements.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep adding accessibility context when new custom Pressables or chips are introduced.
- The next high-value product step is improving feedback depth with variant-specific phrases or feedback.
- Do not add a component testing stack until it is worth the setup cost.

Next suggested task:

- Add variant-specific suggested phrases for one high-value scenario, starting with Job Interview.

## 2026-06-26: Interview Variant-Specific Phrases

Built one focused improvement: Job Interview practice angles now show their own useful phrases. "Tell me about yourself", "Why this role?" and "Difficult situation" each have three tailored sentence starters, and Roleplay automatically falls back to the scenario-level phrases when a variant does not provide its own.

What went well:

- The feature makes the interview practice flow more specific without adding backend AI or a new lesson system.
- The content model stayed simple by adding optional phrases to existing prompt variants.
- The Roleplay UI now adapts useful phrases to the selected practice angle.
- Added a focused test that protects interview-specific phrases.

What went wrong:

- Only Job Interview has variant-specific phrases so far.
- The mock feedback still does not change per prompt variant.
- Phrase quality is still curated local content, not personalized to the user's answer.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Variant-specific content is a good next layer now that all roleplays have practice angles.
- Add tailored phrases scenario by scenario instead of building a larger lesson engine.
- Keep phrase lists short so the Roleplay screen stays scannable on mobile.

Next suggested task:

- Add variant-specific suggested phrases for Meeting Practice.

## 2026-06-26: Meeting Variant-Specific Phrases

Built one focused improvement: Meeting Practice practice angles now show their own useful phrases. Status update, Clarify deadline and Challenge decision each have three tailored sentence starters, reusing the existing variant-specific phrase support in Roleplay.

What went well:

- Meeting practice now gives more precise language support for three common workplace meeting moments.
- The change reused the existing optional `suggestedPhrases` field on prompt variants.
- No UI or navigation changes were needed because Roleplay already falls back cleanly.
- Added focused tests for meeting-specific phrases.

What went wrong:

- Only Interview and Meeting have variant-specific phrases so far.
- Presentation, Sales and Small Talk still use scenario-level phrases.
- Feedback is still scenario-level and does not yet react to the selected variant.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Continue adding variant-specific phrase support scenario by scenario.
- The next logical content step is Presentation Practice because presentation language depends heavily on opening, transition and challenge handling.
- Keep each phrase list to three short, reusable starters.

Next suggested task:

- Add variant-specific suggested phrases for Presentation Practice.

## 2026-06-26: Presentation Variant-Specific Phrases

Built one focused improvement: Presentation Practice practice angles now show their own useful phrases. Opening agenda, Smooth transition and Handle challenge each have three tailored sentence starters, reusing the existing variant-specific phrase support in Roleplay.

What went well:

- Presentation Practice now gives more precise language support for opening, transitions and skeptical Q&A.
- The change reused the existing optional `suggestedPhrases` field on prompt variants.
- No UI or navigation changes were needed because Roleplay already falls back cleanly.
- Added focused tests for presentation-specific phrases.

What went wrong:

- Presentation phrases are still curated local content, not personalized to the user's answer.
- Sales and Small Talk still use scenario-level phrases.
- Feedback is still scenario-level and does not yet react to the selected variant.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Variant-specific phrase support is now useful for Interview, Meeting and Presentation.
- The next logical content step is Sales Call because objection handling needs very specific language.
- Keep phrase lists short and directly usable in spoken answers.

Next suggested task:

- Add variant-specific suggested phrases for Sales Call.

## 2026-06-26: Sales Variant-Specific Phrases

Built one focused improvement: Sales Call objection angles now show their own useful phrases. Price concern, Timing concern and Existing tool each have three tailored sentence starters for calmer discovery and objection handling.

What went well:

- Sales Call now gives more precise language support for high-pressure buyer objections.
- The change reused the existing optional `suggestedPhrases` field on prompt variants.
- The Roleplay UI needed no changes because variant-specific phrases already flow through the screen.
- Added focused tests for sales-specific objection phrases.

What went wrong:

- Sales phrases are still curated local content, not personalized to the user's answer.
- Workplace Small Talk is the only remaining roleplay still using only scenario-level phrases.
- Feedback is still scenario-level and does not yet react to the selected sales objection.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Variant-specific phrase support is now useful for Interview, Meeting, Presentation and Sales.
- The next logical content step is Workplace Small Talk because it is the last scenario without variant-specific phrases.
- Keep sales language consultative: acknowledge first, ask a discovery question and avoid sounding pushy.

Next suggested task:

- Add variant-specific suggested phrases for Workplace Small Talk.

## 2026-06-26: Workplace Small Talk Variant-Specific Phrases

Built one focused improvement: Workplace Small Talk practice angles now show their own useful phrases. Quick introduction, Friendly follow-up and Move to meeting each have three tailored sentence starters for professional, natural small talk.

What went well:

- All five core MVP roleplays now have variant-specific useful phrases.
- Small Talk now supports the exact moments users struggle with: introducing themselves, following up and moving into the meeting.
- The change reused the existing optional `suggestedPhrases` field on prompt variants.
- Added focused tests for workplace small-talk phrases.

What went wrong:

- Small Talk phrases are still curated local content, not personalized to the user's answer.
- Feedback remains scenario-level and does not yet react to the selected small-talk angle.
- The content is useful but still text-first; there is no spoken or timed practice yet.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Every core roleplay now has tailored phrases per prompt variant.
- The next high-value improvement should move beyond static content, likely variant-aware feedback or a stronger practice completion loop.
- Keep the experience professional and habit-forming without making it feel childish.

Next suggested task:

- Make mock feedback adapt to the selected prompt variant.

## 2026-06-26: Interview Variant-Aware Feedback

Built one focused improvement: Job Interview mock feedback now adapts to the selected practice angle. "Tell me about yourself", "Why this role?" and "Difficult situation" each now provide their own feedback emphasis and suggested rewrite, so the review feels more specific to the prompt the user chose.

What went well:

- The feature improved feedback depth without adding any backend AI, storage or new architecture.
- The change stayed lightweight by extending existing prompt-variant content with optional feedback guidance.
- Roleplay only needed one integration change because the current screen already tracks the active practice angle.
- Added focused tests that protect both the new interview guidance content and the variant-aware feedback output.

What went wrong:

- Variant-aware feedback is only implemented for Job Interview so far; other scenarios still use scenario-level feedback.
- Score logic is still general-purpose and does not yet change per interview angle.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Variant-aware feedback works well as a thin content layer on top of the existing rule-based engine.
- Extending the same pattern scenario by scenario is lower risk than redesigning the feedback model.
- Keep feedback guidance tightly tied to the selected prompt so the review feels obviously relevant.

Next suggested task:

- Extend variant-aware mock feedback to Meeting Practice.

## 2026-06-26: Interview Variant-Aware Feedback

Built one focused improvement: Job Interview feedback now adapts to the selected practice angle. The Roleplay screen passes the active interview variant into local rule-based feedback, and each interview angle can provide its own summary hint, strength focus, improvement focus and suggested rewrite.

What went well:

- Interview feedback now feels less generic for Tell me about yourself, Why this role and Difficult situation.
- The implementation stayed local and mock-only, with no OpenAI, Supabase or secrets.
- Existing behavior without a selected variant remains supported.
- Added focused tests for variant-aware interview feedback.

What went wrong:

- The first test run caught a small regression where the default non-variant summary text changed.
- Variant-aware feedback guidance exists only for Job Interview so far.
- Other roleplays still use generic rule-based feedback even though their phrases are variant-specific.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed after fixing the summary regression.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 4
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- `RoleplayPromptVariant.feedbackGuidance` is the extension point for variant-aware feedback.
- Keep default feedback behavior unchanged when no variant is passed.
- Add guidance scenario by scenario instead of trying to personalize every roleplay at once.

Next suggested task:

- Add variant-aware feedback guidance for Meeting Practice.

## 2026-06-26: Meeting Variant-Aware Feedback

Built one focused improvement: Meeting Practice feedback now adapts to the selected practice angle. Status update, Clarify deadline and Challenge decision each provide their own feedback emphasis and suggested rewrite.

What went well:

- Meeting feedback now feels more relevant to the actual workplace moment the user picked.
- The change reused the existing `RoleplayPromptVariant.feedbackGuidance` extension point.
- The Roleplay UI needed no new changes because active variants already flow into rule-based feedback.
- Added focused tests for meeting-specific feedback guidance and variant-aware feedback output.

What went wrong:

- Variant-aware feedback guidance now exists for Interview and Meeting only.
- Presentation, Sales and Small Talk still use generic rule-based feedback even though their phrases are variant-specific.
- Score logic remains general-purpose and does not yet change per meeting angle.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 4
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Meeting feedback guidance should stay short and action-oriented: progress, blocker, deadline, risk and next step.
- Keep adding `feedbackGuidance` scenario by scenario so the content stays easy to review.
- Preserve the default non-variant feedback path when extending variant-specific coaching.

Next suggested task:

- Add variant-aware feedback guidance for Presentation Practice.

## 2026-06-26: Presentation Variant-Aware Feedback

Built one focused improvement: Presentation Practice feedback now adapts to the selected practice angle. Opening agenda, Smooth transition and Handle challenge each provide their own feedback emphasis and suggested rewrite.

What went well:

- Presentation feedback now supports opening structure, transitions and skeptical Q&A more directly.
- The change reused the existing `RoleplayPromptVariant.feedbackGuidance` field.
- The Roleplay UI needed no new code because active variants already pass into rule-based feedback.
- Added focused tests for presentation-specific feedback guidance and variant-aware feedback output.

What went wrong:

- Variant-aware feedback guidance now exists for Interview, Meeting and Presentation only.
- Sales and Small Talk still use generic rule-based feedback even though their phrases are variant-specific.
- Score logic remains general-purpose and does not yet change per presentation angle.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 4
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Presentation guidance should focus on structure, signposting, evidence and a clear next decision.
- Keep adding feedback guidance scenario by scenario until all five core roleplays have variant-aware coaching.
- Do not change the default non-variant feedback path while expanding this content layer.

Next suggested task:

- Add variant-aware feedback guidance for Sales Call.
