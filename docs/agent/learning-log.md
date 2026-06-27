# Agent Learning Log

## 2026-06-27: Short First Rewrite

Built one focused first-run feedback improvement: the first Job Interview feedback now uses one short fixed rewrite that matches the taught `I + action + result` pattern, instead of showing the longer scenario-level mock rewrite.

What went well:

- The first feedback rewrite is now short enough to keep the save path closer on mobile.
- The rewrite matches the foundation lesson structure and is easier for a beginner to copy.
- Updated the first-quest feedback test to enforce a short rewrite length.
- No new services, secrets or integrations were added.

What went wrong:

- Browser preview kept using an existing saved-session state, so it showed the richer roleplay instead of the first-run route.
- The rewrite is still a fixed local example rather than adapting to the exact user answer.
- A later pass should add a simple reset/debug path for testing first-run flows without clearing browser data manually.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 52 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 4
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- First-run rewrites should be short enough that the next action stays visible.
- Prefer beginner-copyable examples over comprehensive coaching in the first session.
- Avoid forcing browser data resets during heartbeat runs; rely on helper tests when local state blocks first-run preview.

Next suggested task:

- After the first save, show a very simple success screen with one unlocked next step instead of dropping into the full app immediately.

## 2026-06-27: One-Card First Feedback

Built one focused simplification: after `Check answer` in the first Job Interview flow, the user now sees one simple feedback card with a short confirmation, one `Better English` rewrite and the XP label. The same button then becomes `Save answer`.

What went well:

- The post-check state now stays as simple as the first prompt screen.
- Added a small `createFirstQuestFeedbackState` helper so the first feedback card stays predictable.
- The app still uses the existing rule-based mock feedback, but hides the full feedback panel for first-run users.
- Mobile preview confirmed the screen shows one feedback card and one save path.

What went wrong:

- The suggested rewrite is still the scenario-level mock rewrite, not a true rewrite of the user's typed answer.
- The first feedback card sits inside `RoleplayScreen`; extraction can wait until the flow settles.
- The screenshot showed the card can extend below the fold with a longer rewrite, so later copy may need shorter first-run rewrites.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 52 tests.
- `npm.cmd run lint` passed.
- Mobile browser preview passed for first-run check-answer feedback.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 4
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- First-run feedback should be one correction, one rewrite and one save button.
- Avoid bringing back the full feedback panel until after the first saved session.
- Next useful improvement is shortening the first-run rewrite so the save button stays visible.

Next suggested task:

- Create a shorter first-run rewrite for the first Job Interview answer so the entire feedback and save path fit on one phone screen.

## 2026-06-27: One-Button First Interview

Built one focused first-run simplification: the first Job Interview roleplay now has a special simple mode before any session is saved. New users see only one interview question, the `I + action + result` structure, one answer box and one primary button that changes from `Check answer` to `Save answer`.

What went well:

- The first career practice screen now matches the simplified Home and Step 1 principle.
- Scenario switching, angle picking, timers, writing support and follow-up panels are hidden for brand-new users.
- The full roleplay screen still exists after the first saved session, so later practice can stay richer.
- Mobile preview confirmed the first interview step has no bottom nav and only one main action.

What went wrong:

- The simple first interview mode is currently embedded in `RoleplayScreen`, so later it may deserve a small component extraction.
- The first answer still uses the full review/save logic underneath, so the code path is simple for the user but not fully minimal internally.
- No new component test was added because the current test stack only covers data/helpers, not React Native rendering.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 51 tests.
- `npm.cmd run lint` passed.
- Mobile browser preview passed for the simplified first interview step.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 4
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- For first-run users, hide all advanced roleplay controls until after the first saved answer.
- Keep the first practice screen to one prompt, one input and one action.
- Next simplification should make the post-check feedback equally simple before saving.

Next suggested task:

- Simplify the first-run feedback state so after `Check answer` the user sees one short correction and one `Save answer` button.

## 2026-06-27: Dumb-Simple First Steps

Built one focused simplification pass: Home now has one visible path, one lesson card and one button. The bottom navigation is hidden until the user saves the first practice session, so new users cannot wander into Practice, Progress or Profile before the app teaches the first structure.

What went well:

- Home now reads like a guided instruction screen instead of a dashboard.
- The first lesson now says exactly what to do: read this, then tap Continue.
- Mobile preview confirmed there is no bottom navigation before the first saved session.
- The first two steps now each have only one primary button.

What went wrong:

- The Roleplay screen is still denser than the new Home and Lesson 1 screens.
- The first lesson is still read-only; the user does not yet tap or type inside the structure itself.
- The app still has older Home helper utilities and tests that are not used by the simplified Home screen.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 51 tests.
- `npm.cmd run lint` passed.
- Mobile browser preview passed for the simplified Home and Step 1 flow.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 4
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep first-run screens almost impossible to misunderstand: one screen, one job, one button.
- Hide global navigation until the first saved answer so the app stays in charge.
- Next simplification should target the Roleplay screen before adding more content.

Next suggested task:

- Strip the first Job Interview roleplay down to one prompt, one answer box and one save path for brand-new users.

## 2026-06-27: Language Foundation First Start

Built one focused usability improvement: the app now starts with a dark, Duolingo-inspired level assessment before opening the product. Home was simplified into one app-led foundation lesson, and Lesson 1 teaches the basic `I + action + result` English structure before sending the user into the Job Interview roleplay.

What went well:

- The start now has far fewer choices and less text.
- The onboarding design now uses progress, a coach prompt, selectable level cards and a disabled Continue button until the user chooses a level.
- Home now takes charge with one next action instead of showing a dashboard.
- The first learning step now teaches basic English structure before career practice.

What went wrong:

- The selected level is not stored yet; it only guides the immediate onboarding experience.
- The bottom navigation still exists during the foundation lesson, so the user can technically leave the guided path.
- Browser preview could verify Home and Lesson 1, but not the first-run onboarding screen without clearing local onboarding storage.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 51 tests.
- `npm.cmd run lint` passed.
- Mobile browser preview passed for Home and Lesson 1 on `http://127.0.0.1:8091/`.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 4
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- The app should lead the user through the system instead of asking them to browse.
- Start with language fundamentals, then apply them to career scenarios.
- Kevin likes the dark onboarding choice-card design, adapted in a more businesslike way.

Next suggested task:

- Store the selected starting level locally and use it to adjust the first few lesson examples.

## 2026-06-27: Executive Career Map Theme

Built one focused design improvement: the Practice screen now uses an Executive Emerald career-map theme with a compact streak/XP/path status row, a clear Unit 1 banner and large active/done/locked map nodes. The first Job Interview roleplay also now shows a first-quest banner so the onboarding handoff feels intentional.

What went well:

- The Practice tab now has a stronger Duolingo-like unlock loop without using childish mascots or playful clutter.
- The first viewport is simpler: status, unit context, next recommended step and the active start node are clear.
- The new `createPracticeMapStats` helper keeps streak, XP and path labels predictable and tested.
- Mobile browser preview confirmed the map is readable at phone width.

What went wrong:

- The scenario library is still visible below the map, so a later pass may collapse it until the first quest is saved.
- The map is static for now; it does not yet animate node unlocks or celebrate saves.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 51 tests.
- `npm.cmd run lint` passed.
- Mobile browser preview passed on `http://127.0.0.1:8091/`.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 4
- Simplicity: 4
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Kevin wants more game-like motivation, but the product rule is still professional before playful.
- Use Executive Emerald, ink and gold as the current app theme direction.
- Prefer one guided path first; keep browsing/library features secondary until the first save.

Next suggested task:

- Collapse or soften the Scenario library for first-time users so the Practice tab feels even less overwhelming.

## 2026-06-27: Onboarding First Quest Handoff

Built one focused onboarding improvement: the first-run CTA now uses "Start first quest" language and completing onboarding opens the Job Interview roleplay directly instead of dropping the user on Home first.

What went well:

- The handoff now matches Kevin's request for a more guided, game-like flow.
- Reused the existing `guidedStart` roleplay id so there is no new routing complexity.
- Updated Home to trust the guided-start CTA directly instead of rewriting labels in the screen.
- Tests verify the new quest CTA and first guided Job Interview copy.

What went wrong:

- This run did not add a visual transition animation; it only improves the route and copy.
- This run only changed first-run language; later practice copy still uses "sprint" for short repeat sessions.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 49 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- First-run users should land in the first practice action, not an overview screen.
- Use "quest" language for the habit loop, while keeping the content professional.
- The next useful improvement is visual polish on the first Roleplay screen so the direct handoff feels intentional.

Next suggested task:

- Add a small first-quest banner to the Roleplay screen when the selected roleplay is the first Job Interview quest.

## 2026-06-27: Single First-Save Progress CTA

Built one focused Progress simplification: first-time users now get only one primary "save your first answer" action at the top of Progress. The Session history section no longer repeats the same quest with another button and step list; it now shows a quieter locked preview of what appears after the first save.

What went well:

- Reduced first-time Progress duplication without changing the unlocked flow for returning users.
- Kept the implementation small by updating one helper, one screen section and one existing unit test.
- The new Session history state still explains the unlock value by previewing saved feedback, XP and target progress.
- Checks stayed fast and clean, with all existing tests passing.

What went wrong:

- The first-time Progress screen still has two "0/1 saved" references because the locked mistake-bank preview below also uses the same unlock progress language.
- This run did not change the top guide copy, so first-time Progress still depends on that hero card to explain the first action clearly.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 49 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- First-time Progress should have one primary CTA, with lower sections explaining unlocks instead of repeating the same action.
- Locked previews work better when they show the value of saving without introducing a second path.
- If first-time Progress still feels busy later, reduce repeated `0/1 saved` language before adding new progress mechanics.

Next suggested task:

- Improve onboarding handoff by giving first-time users one even more direct path from onboarding into the first Job Interview sprint.

## 2026-06-27: Locked First-Time Mistake Bank Preview

Built one focused Progress simplification: first-time users no longer see the full mistake drill and mistake list before saving a session. Progress now shows one locked preview card with `0/1 saved`, the first correction waiting, and how many patterns unlock after the first save.

What went well:

- Kept the change inside the existing Progress flow by adding a small helper for the locked preview state.
- The unlocked mistake-bank experience stays unchanged after the first saved session.
- Tests now verify the locked preview copy, first correction selection and unlock count.
- This reduces below-the-fold overload on first visit while preserving the motivating unlock loop.

What went wrong:

- Progress still repeats the first-save action in both the top guide and Session history card; that duplication is smaller now, but still present.
- The first-time mistake-bank preview is informative rather than interactive, so a later pass may connect it more explicitly to the recommended next sprint.
- Tests will still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 49 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- First-time Progress should reveal one upcoming correction, not the entire mistake system.
- Keep unlock-based motivation professional by showing what opens next without dumping every detail.
- The next useful improvement is likely reducing repeated first-save CTAs across the Progress screen.

Next suggested task:

- Merge or simplify the duplicate first-save prompts between the Progress guide card and Session history unlock card.

## 2026-06-27: Progress First Save Quest Card

Built one focused clarity improvement: the empty Session history state in Progress is now a "First save quest" unlock card. It shows `0/1 saved`, a `+40 XP` reward, three clear steps and a direct button to start the first save quest.

What went well:

- Reused the existing `createProgressEmptyState` helper instead of adding new screen-level logic.
- The empty Progress state now matches the Home and Practice quest language.
- Tests verify the new first-save quest copy, reward and unlock steps.
- Mobile preview confirmed the old "No saved sessions yet" copy is gone and the new unlock card appears.

What went wrong:

- Progress still has a lot below the fold because the full mistake bank remains visible for first-time users.
- The first top guide and Session history unlock card repeat a similar first-save action; a later pass can merge or simplify them.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 48 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://127.0.0.1:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep turning empty or broad overview states into single clear quests.
- Progress should eventually hide advanced mistake-bank detail until the first saved session.
- Kevin wants the app to feel game-like through guided progression, not through childish visuals.

Next suggested task:

- Simplify first-time Progress further by collapsing the mistake bank into one locked preview until a session is saved.

## 2026-06-27: Guided Practice Career Path

Built one focused practice-flow improvement: the Practice screen now opens with a guided career path instead of starting with a flat module list. Users see one recommended next sprint, path progress, locked and unlocked roleplays, and the full scenario library remains available below.

What went well:

- The Practice tab now matches the clearer, more game-like guidance already added to Home without becoming childish.
- Reused the existing `LearningPath` component so the new flow stays simple and easy to extend.
- Added `createPracticeCareerPath` so unlock order, replay behavior and copy are tested outside the screen.
- Mobile browser preview confirmed Practice shows `Recommended next`, `0 of 5 complete`, one active Job Interview step and the library below it.

What went wrong:

- The new path is still based on saved local sessions, so unlocking remains mock/local until backend work is approved later.
- Replacing the old top module cards makes Practice more focused, but the scenario library below is still a long scroll on mobile.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 48 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://127.0.0.1:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Practice should open with one recommended sprint and visible progress, not a broad wall of options.
- Sequential unlocks create a stronger habit loop when they are tied to saved local sessions.
- Keep the full library available, but always subordinate it to the next guided action.

Next suggested task:

- Turn the first-time Progress session history empty state into a guided first-save card tied to the new Practice path.

## 2026-06-27: Gamified Home Quest

Built one focused UX improvement after Kevin said the app felt too cluttered and not game-like enough. Home now opens with a clear daily quest, streak, level, target, reward and a three-step career path instead of separate "How it works", mission and library sections.

What went well:

- Made the first screen feel more like a guided learning game without making it childish.
- Removed Home overload by moving away from multiple explanatory cards and roleplay previews.
- Added `createHomeQuestPath` so the career path behavior is tested and easy to extend.
- Mobile preview confirmed Home shows Today's quest, Streak, Level, Career path and no old "How it works" block.

What went wrong:

- This is still static local gamification; streaks and XP are based on local/mock progress until backend work is approved.
- The Practice tab still needs a more game-like path view later, because Home is now cleaner than the library experience.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 45 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://127.0.0.1:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Kevin wants more professional game feel: quests, levels, streaks, unlocks and a clear path.
- Reduce clutter before adding more content.
- The next high-value visual step is turning Practice into a simple path/map instead of a plain library.

Next suggested task:

- Redesign the Practice screen into a simple career path map with locked/unlocked modules.

## 2026-06-27: Simpler Guided Angle Picker

Built one focused UX improvement: the Roleplay practice angle card now shows progress like "1 of 5", a "Next recommended" hint and option labels that identify the recommended next angle. This makes scenarios with four or five angles feel more guided on mobile.

What went well:

- Improved choice clarity without adding a new screen or changing the practice flow.
- Reused the existing roleplay angle picker helper and kept UI logic simple.
- Tests now verify progress labels, recommended-next metadata and five-angle picker behavior.
- Mobile preview confirmed Presentation Practice shows "1 of 5", "Next recommended: Smooth transition" and "Recommended next" in the picker.

What went wrong:

- The angle picker still shows all alternate angles when expanded; later it may need grouping if scenarios grow beyond five angles.
- The preview click target needed DOM-based selection because the in-app browser scaled the mobile tab bar oddly.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 44 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://127.0.0.1:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Kevin wants the app to feel simpler and more guided, especially before adding more content.
- Five-angle scenarios should show the recommended next move instead of forcing users to choose from a flat list.
- The next useful UX step is to make the first saved-session empty state or onboarding handoff even clearer.

Next suggested task:

- Add a cleaner first-time Progress empty state or improve the first practice handoff after onboarding.

## 2026-06-27: Presentation Q&A Follow-Up Angle

Built one focused practice improvement: Presentation Practice now includes a "Q&A follow-up" angle. The user practices answering a second audience question, naming the next step and inviting agreement.

What went well:

- Added a realistic presentation moment without changing screens or app architecture.
- Reused the existing prompt variant, phrase starter and rule-based feedback pattern.
- Tests verify the title order, phrase guidance, rewrite and angle-specific feedback.
- The content keeps the exercise focused on one professional communication move.

What went wrong:

- Presentation Practice now has five angles, so future additions should focus on selection clarity before adding many more.
- This remains a one-turn written mock exercise rather than a live presentation Q&A.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 44 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Presentation Q&A practice should teach direct answer, next step and audience alignment.
- Several scenarios now have four or five angles; improving picker simplicity may soon matter more than adding content.
- Keep backend, auth, payments and analytics untouched until the local practice loop feels clearly valuable.

Next suggested task:

- Improve the roleplay angle picker so scenarios with five angles still feel simple and guided on mobile.

## 2026-06-27: Meeting Polite Interruption Angle

Built one focused practice improvement: Meeting Practice now includes a "Polite interruption" angle. The user practices interrupting respectfully, adding one relevant point and handing the conversation back.

What went well:

- Added a common workplace meeting moment without changing navigation or architecture.
- Reused the existing prompt variant and rule-based feedback structure.
- Tests verify the title order, phrase guidance, rewrite and angle-specific feedback.
- The content stays short enough for the existing read-first mobile card.

What went wrong:

- Meeting Practice now has five angles, so the picker may need grouping later if content keeps growing.
- This is still a one-turn written practice, not a live meeting simulation.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 44 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Meeting content is getting useful; keep each angle focused on one real workplace move.
- If a scenario grows past five angles, improve selection simplicity before adding many more.
- A strong next improvement is Presentation Q&A follow-up because it adds practice depth without backend work.

Next suggested task:

- Add one concise Presentation Q&A follow-up prompt variant.

## 2026-06-27: Workplace Project Follow-Up Small Talk

Built one focused practice improvement: Workplace Small Talk now includes a "Project follow-up" angle. The user practices responding to a colleague's work update, adding one useful detail and asking a friendly professional question back.

What went well:

- Added a realistic small-talk follow-up without expanding into a full course.
- Reused the existing prompt variant, quick starter and rule-based feedback structure.
- Tests verify the new title, phrase guidance, rewrite and angle-specific feedback.
- Mobile preview confirmed the new angle appears in the picker and updates the prompt, goal and quick starter.

What went wrong:

- Workplace Small Talk now has four angles, so future small-talk additions should be chosen carefully.
- The scenario is still a one-turn mock practice flow, not a live back-and-forth conversation.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 44 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://127.0.0.1:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Small talk should stay professional and work-adjacent, not personal.
- Follow-up variants should teach an answer, one detail and one question back.
- More English MVP value should come from realistic workplace moments before adding backend or integrations.

Next suggested task:

- Add one concise Meeting clarification or interruption angle so meeting practice has more guided depth.

## 2026-06-27: Sales Budget Value Objection

Built one focused practice improvement: Sales Call now includes a "Budget value" objection angle. The user practices acknowledging a budget constraint, asking how budget decisions are approved and connecting value to one measurable business result.

What went well:

- Added one realistic sales objection without changing app architecture.
- The variant includes opening line, goal, coaching note, three phrase starters and tailored feedback guidance.
- Tests now verify the new title, phrase guidance and angle-specific feedback.
- Mobile preview confirmed Budget value appears in the Sales Call angle picker and updates the prompt and quick starter after selection.

What went wrong:

- Sales Call now has four angles while Small Talk still has three; this is intentional because the roadmap calls out sales objection variants.
- This is still a mock one-turn exercise, not a real buyer conversation.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 44 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://127.0.0.1:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Sales objections should stay consultative: acknowledge, ask one useful question, then connect value to business impact.
- Keep variant user goals short because the read-first mobile card has length limits.
- More practice value should come from realistic workplace moments before adding backend or integrations.

Next suggested task:

- Add one concise Workplace Small Talk follow-up variant so casual workplace conversation also has more guided depth.

## 2026-06-27: Consistent First Sprint Hero Labels

Built one focused improvement: the Home hero now reuses the same first-sprint labels as Onboarding for first-time users: "5 minutes", "2-4 sentences" and "Clear rewrite". Returning users still see the practical Home labels with language, time and reward.

What went well:

- Home and Onboarding now speak with the same simple first-practice language.
- Added `src/utils/homeHeroLabels.ts` so first-run and returning hero labels are easy to test.
- The change removes a small source of inconsistency without adding backend, auth, payments or new product scope.
- Mobile preview confirmed the Home hero shows "First sprint: Job Interview", "5 minutes", "2-4 sentences" and "Clear rewrite".

What went wrong:

- This is a polish task, so it improves clarity more than it adds new practice depth.
- The first-run state still depends on local saved-session state, so browser previews need a clean local origin or Home tab selection.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 44 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://127.0.0.1:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Reuse existing guided-start data before adding more copy.
- Small consistency fixes matter because Kevin wants the app to feel simple and guided.
- Next improvements should add more actual practice value after this polish pass.

Next suggested task:

- Add one concise Sales Call budget/value objection variant to deepen the English MVP content without changing architecture.

## 2026-06-27: Simple Home Daily Mission

Built one focused improvement: the Home `Today` card is now a single daily mission card instead of a broad XP progress summary. First-time users see one clear target: save one Job Interview answer, with a 5-minute sprint, target, reward and a short reason to practice now.

What went well:

- The first-run Home screen now reinforces one action instead of showing progress math from mock data.
- The new mission state lives in `src/utils/homeDailyMission.ts`, so first-run, partial and complete mission states are covered without component-test setup.
- Mobile preview confirmed the card shows "Save one Job Interview answer", "0/1 saved", "+40 XP" and a clear "Why now" reason.
- The change keeps the app professional and habit-forming without adding backend, auth, payments or secrets.

What went wrong:

- The browser first opened Roleplay after the start CTA, so Home had to be selected again to verify the mission card.
- The Home hero still has hard-coded detail pills; it could reuse guided-start detail labels next.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 43 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://127.0.0.1:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- First-run Home should use completion-based progress, not mock XP progress, so the user understands exactly what to do.
- "Why now" copy is useful when Kevin wants the app to feel habit-forming but still professional.
- Keep Home focused on one next action before adding more library or dashboard elements.

Next suggested task:

- Reuse `guidedStart.detailLabels` in the Home hero so the first sprint details stay consistent between Onboarding and Home.

## 2026-06-26: Guided Home Unlock Preview

Built one focused improvement: first-time Home now previews the real next English roleplays in one compact `What unlocks next` card instead of using abstract preview pills or a full roleplay wall.

What went well:

- The first-run Home screen now stays guided while still showing where the product goes after the first saved answer.
- The preview uses actual roleplays like Meeting Practice and Presentation Practice, which makes the MVP feel more concrete and useful.
- Returning users still keep the normal roleplay-card library, so this change does not slow down repeat practice.
- The logic lives in `src/utils/homeLibrary.ts`, which kept the behavior easy to test without adding component-test setup.

What went wrong:

- This improvement builds on an existing first-run Home simplification already present on the branch, so the final change was a refinement rather than a brand-new screen pattern.
- The Home hero still hard-codes `English` and `5 minutes` instead of fully reusing guided-start detail labels.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 42 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://127.0.0.1:8091` on a 390x844 viewport; first-run Home showed a compact unlock-preview list instead of the full roleplay card library.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- First-run Home should tease the next value clearly without asking the user to browse a big library yet.
- Real scenario names work better than abstract labels when previewing what comes after the first sprint.
- The next small task should make the first-run hero and Today card feel even more like one guided daily mission.

Next suggested task:

- Turn the first-run Today card into a simpler daily mission card with one completion target and one reason to practice now.

## 2026-06-26: Simpler First Practice Guidance

Built one focused UX improvement: the first practice path now feels more guided and less busy. Onboarding points users to one 5-minute Job Interview sprint with 2-4 sentences and a clear rewrite, and the Roleplay answer card now shows one "Quick starter" before hiding extra help behind a single More button.

What went well:

- The first-run copy is more concrete: one Job Interview answer first, not a broad set of choices.
- Onboarding now shows simple detail pills for "5 minutes", "2-4 sentences" and "Clear rewrite".
- The answer card is calmer because the old separate Plan and Phrases buttons are collapsed into one More control.
- Mobile preview confirmed the Roleplay card shows "Quick starter", "1 starter + 3-step plan" and the More button without the old Phrases button.

What went wrong:

- A half-finished writing-support change was present on the active branch, which caused the first rerun of typecheck/tests to fail.
- The current browser already had saved sessions, so the first-run Home hero could not be visually verified there; tests cover the first-run recommendation state.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 41 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Kevin wants fewer choices at the start, so make the next action obvious before showing the full app.
- Prefer one visible helper plus optional expansion over multiple helper buttons.
- If a branch changes unexpectedly, inspect and finish the current safe direction instead of reverting user or automation work.

Next suggested task:

- Add a first-run Home mode that keeps the full roleplay library less prominent until the user saves their first practice.

## 2026-06-26: Presentation Audience Question Variant

Built one focused improvement: Presentation Practice now includes an "Audience question" practice angle. It trains users to handle a realistic Q&A moment by acknowledging the question, giving one business reason and returning to a clear next step.

What went well:

- Added one practical presentation follow-up prompt without expanding into a full course.
- Reused the existing `promptVariants`, answer placeholder and rule-based feedback structure.
- The first test run caught that the new goal text was one character too long for the mobile read-first card.
- Mobile preview confirmed the new angle appears in the picker and updates the prompt and placeholder.

What went wrong:

- Presentation Practice now has four angles while some roleplays still have three; this is intentional because Q&A was next in the development plan.
- The Q&A moment is still a mock one-turn exercise, not a real back-and-forth AI conversation.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 41 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep new roleplay goals under the mobile read-first card length limits.
- Presentation Q&A should stay practical: acknowledge, answer, recommend the next step.
- Kevin wants the app to feel simpler and more guided, so prefer one clear next action over extra choices.

Next suggested task:

- Simplify the first-run introduction further with a guided "first 5-minute practice" path before adding more scenario content.

## 2026-06-26: Angle-Specific Answer Placeholders

Built one focused improvement: the Roleplay answer box now uses the selected practice angle's suggested phrases as its placeholder. Meeting Practice no longer shows the generic interview-style "Currently, I focus..." starter.

What went well:

- The change reuses existing `suggestedPhrases`, so content and UI stay in sync without extra data fields.
- Meeting Practice now shows useful starters like "Since our last meeting..." and "I see the goal, but I am concerned about...".
- Added test coverage for the default answer coach and the Polite disagreement meeting placeholder.
- Mobile preview confirmed the placeholder changes after selecting the Polite disagreement angle.

What went wrong:

- The placeholder can become a little long on small screens because it joins all three suggested phrases.
- This improves the first answer box only; the follow-up answer placeholder is still generic.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 41 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Use existing content fields before adding new data structure.
- Placeholders should guide the user into the exact workplace skill they selected.
- Keep watching mobile text length as prompts and placeholders become more specific.

Next suggested task:

- Add one concise Presentation Practice Q&A follow-up variant, since the roadmap calls out presentation follow-up prompts next.

## 2026-06-26: Meeting Polite Disagreement Variant

Built one focused improvement: Meeting Practice now includes a new "Polite disagreement" practice angle. It trains users to disagree respectfully, name one risk and ask for a focused clarification before suggesting a safer next step.

What went well:

- Added one practical workplace conversation pattern without expanding into a full course.
- The new variant includes opening line, goal, coaching note, three suggested phrases and tailored feedback guidance.
- Tests now verify the new angle appears in Meeting Practice and that rule-based feedback uses its guidance.
- Mobile preview confirmed the angle appears in the picker and updates the prompt after selection.

What went wrong:

- The answer placeholder is still generic and does not adapt to the selected meeting angle.
- Meeting Practice now has four angles while other roleplays mostly have three; that is fine for roadmap priority but should stay intentional.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 41 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- More content should be added as small, realistic workplace moments with specific coaching and feedback.
- Prompt variants should stay easy to scan in the angle picker: title plus one coaching sentence.
- A useful next UX step is making the answer placeholder adapt to the selected practice angle.

Next suggested task:

- Make the Roleplay answer placeholder adapt to the selected practice angle, starting with Meeting Practice.

## 2026-06-26: Mark Mistake Drill Practiced

Built one focused improvement: the Progress mistake drill now has a local "Mark practiced" mini-win. After the user says the correction out loud, they can mark it practiced and the card changes to a short "Practice win" state.

What went well:

- Added a small reward loop without auth, backend, payments or stored private data.
- The interaction stays focused on professional English: repeat one better sentence, then use it in a roleplay.
- The state is intentionally local to the current screen session, keeping the MVP simple.
- Mobile preview confirmed "Mark practiced" changes to "Practice win" and "Practiced once".

What went wrong:

- The practiced state is not persisted yet, so it resets after reload.
- The button is not disabled after completion; it stays harmless but still tappable.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 41 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Tiny completion states make the app feel more alive without turning it childish.
- Keep micro-rewards tied to real learning behavior, not empty points.
- If this pattern works, later persist practiced corrections locally after the product flow is stable.

Next suggested task:

- Add one more workplace-specific prompt variant for Meeting Practice focused on polite disagreement or clarification.

## 2026-06-26: Actionable Mistake Practice Drill

Built one focused improvement: Progress now turns the top mistake-bank item into a short practice drill. Users see what to avoid, what to say instead, three micro-steps and a CTA into the connected roleplay.

What went well:

- The mistake bank is now more actionable instead of being only a reference list.
- The drill picks the highest-priority mistake and maps it to the relevant English career roleplay.
- The UI stays professional and simple: one correction, one pattern and one next practice button.
- Mobile preview confirmed the drill appears above the mistake list and "Practice Job Interview" opens the Job Interview flow.

What went wrong:

- The drill is still static mock data and does not yet adapt to the user's latest saved mistake.
- The mistake bank below the drill is still a long list; later it may need grouping or filters.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 41 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Feedback gets more useful when each correction has a next action, not only a score or explanation.
- Keep these drills tiny: one correction, one speaking pattern, one roleplay CTA.
- Later, real AI feedback should feed the top drill from saved user sessions instead of static mock mistakes.

Next suggested task:

- Add one small "repeat this sentence" interaction to the drill, such as a local checked state after the user marks the correction as practiced.

## 2026-06-26: Guided Progress Next Step

Built one focused improvement: Progress now starts with a simple guided next-step card for first-time and returning users. It tells the user what to do next, shows three small steps and opens the recommended next roleplay.

What went well:

- Replaced the heavier first-progress hero with a calmer, lighter guided card.
- Returning users now see a clear next action such as "2 sprints left today" instead of only stats.
- The CTA correctly opens the next recommended roleplay after the latest saved session.
- Added focused tests for first-time, in-progress and daily-target-complete states.

What went wrong:

- Progress still has several stats below the guide, so the screen can be simplified further later.
- The daily target logic is still local-session based, not true calendar-day tracking.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 40 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport; Progress showed the new guide and its CTA opened Meeting Practice.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Kevin wants the app to feel more guided and less complex; every screen should make the next action obvious.
- Keep the habit loop professional: small sprints, clear progress and useful next steps without childish game UI.
- Progress can still be simplified by grouping stats lower on the page and making the mistake bank feel more actionable.

Next suggested task:

- Make the mistake bank more actionable by turning the top mistake into one short "practice this correction" drill.

## 2026-06-26: Persistent Practice Sessions

Built one focused improvement: completed mock practice sessions are now saved locally with AsyncStorage. Progress, local XP and recent completion history can survive a browser reload or app restart.

What went well:

- Reused the small validated storage-helper pattern from onboarding and daily target persistence.
- Stored only the lightweight `PracticeSession` summary, not full typed answers, secrets or account data.
- `AppNavigator` now loads saved sessions during startup and writes the latest 10 sessions after each completed lesson.
- Added test coverage for safe parsing, corrupt JSON fallback and the 10-session storage cap.
- Mobile preview confirmed a Job Interview lesson can be completed, reloaded and still appear in Home and Progress.

What went wrong:

- This is still local-only progress, so it does not sync across devices or accounts.
- AsyncStorage web data is not easy to inspect as a plain localStorage key, so UI reload behavior is the strongest preview signal.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 39 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep local persistence narrow and validated before putting data into app state.
- Session persistence makes the habit loop feel much more real; the next improvements should make returning progress easier to understand.
- Do not save full answers long-term until there is an explicit product/privacy decision.

Next suggested task:

- Add a cleaner first-time and returning-state polish to Progress, so saved sessions feel more guided and less like raw stats.

## 2026-06-26: Persistent Daily Target

Built one focused improvement: the Profile daily practice target is now saved locally with AsyncStorage. If a user chooses 2 or 3 roleplays per day, that target survives reloads and app restarts.

What went well:

- The feature reuses the same narrow local-storage pattern as onboarding, without adding auth, Supabase or backend work.
- The target parser only accepts valid MVP values: 1, 2 or 3.
- Profile copy now correctly says the setting is saved on this device.
- Mobile preview confirmed target 3 remains selected after reload.

What went wrong:

- Only the daily target persists; sessions, XP and streak still reset after restart.
- AsyncStorage on web does not expose the saved value as the plain localStorage key during preview, so the visual Profile reload state was the strongest verification.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 38 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Use AsyncStorage only for low-risk local MVP preferences and progress, not secrets.
- Keep persisted values validated before they enter app state.
- The next high-value persistence step is saved practice sessions, because that would make Progress and XP survive restarts.

Next suggested task:

- Persist local practice sessions so Progress, XP and completion history survive app restart.

## 2026-06-26: Persistent Onboarding Completion

Built one focused improvement: onboarding completion is now saved locally with AsyncStorage. After a user taps Start guided practice once, reopening or reloading the app skips onboarding and starts directly on Home.

What went well:

- This makes the MVP feel more product-ready without adding auth, Supabase or a backend.
- The storage logic lives in `src/utils/onboardingStorage.ts`, with a focused in-memory storage test.
- `AppNavigator` now waits for the local onboarding flag before choosing Onboarding or Home, avoiding a first-screen flicker.
- Mobile web preview confirmed a clean first launch shows onboarding, then reload after Start guided practice opens Home directly.

What went wrong:

- Installing AsyncStorage via Expo reported existing moderate npm audit warnings; no automatic audit fix was run because that could introduce unrelated dependency churn.
- Only onboarding completion persists so far; sessions, XP, daily target and streak are still in-memory.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 37 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- AsyncStorage is now available and should only be used for low-risk local MVP state, not secrets.
- Keep persistence narrowly scoped and testable through small storage helpers.
- Repeat-open polish matters: avoid making users redo onboarding once they have started practicing.

Next suggested task:

- Persist the selected daily practice target locally so Profile settings survive app restart.

## 2026-06-26: Lesson-Complete Milestone

Built one focused improvement: the Roleplay completion flow now feels more like finishing a lesson. After review, the app frames the final save as lesson completion, and after saving it shows daily-target progress plus streak context so the next step feels more motivating.

What went well:

- The save moment is now more aligned with the habit-forming product direction: complete lesson, bank XP, then see whether today's target is done.
- The completion milestone logic lives in `src/utils/practiceCompletion.ts`, so the UI copy stays simple and testable.
- Roleplay now receives the current sessions and daily target, which lets the saved-state card reflect real in-run progress without adding persistence or backend logic.
- Added focused coverage for both the finish-lesson save prompt and the new completion milestone states.

What went wrong:

- Daily target and streak are still local in-memory progress, so they reset after app restart.
- Draft PR creation is blocked in this environment because GitHub CLI `gh` is not installed, which is required by the publishing workflow skill used here.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 36 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- End-of-lesson feedback should show progress toward today's target, not only that a session was saved.
- Keep motivational progress cues tied to professional practice outcomes like streak, target completion and next roleplay.
- The app remains compatible with Kevin's Expo Go on SDK 54; do not upgrade unless the learning log says that changed.

Next suggested task:

- Add persistent onboarding completion with local storage so repeat opens feel more product-ready.

## 2026-06-26: Short Step 2 Instruction

Built one focused improvement: the Roleplay Step 2 instruction is now shorter and easier to scan on mobile. It changed from a full explanatory sentence to the direct instruction "Answer in 2-4 spoken sentences."

What went well:

- The answer card now gets to Writing support and the answer box faster.
- The change stays inside `src/utils/answerCoach.ts`, so the screen layout did not need more complexity.
- A focused test now locks the concise instruction copy.
- Mobile preview at 390x844 confirmed the new line appears correctly and the old longer wording is gone.

What went wrong:

- This is still a copy-only simplification, so feedback depth and personalization did not change.
- The Step 2 card still has optional support controls before the input; they remain collapsed by default.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 36 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Short action copy works better for the guided mobile flow than explanatory paragraphs.
- Keep the answer box close to Step 2, even when optional support remains available.
- The next small task should improve the first completion reward or make the post-review action clearer.

Next suggested task:

- Make the post-review save action feel more like completing a lesson, without adding a new screen.

## 2026-06-26: Inline Answer Input Cue

Built one focused improvement: the Roleplay answer card no longer shows "Now write your answer" as a separate green panel. The cue is now a simple header directly above the answer text box, so Step 2 feels less stacked and the typing area is more central.

What went well:

- The change removed one visual block before typing without removing beginner guidance.
- The existing answer-coach copy stays reused, so the behavior remains simple and consistent.
- Mobile preview at 390x844 confirmed the input cue sits under Writing support and above the answer box.

What went wrong:

- The answer card is cleaner, but Step 2 still has several elements before the keyboard: instruction, support, cue and input.
- This was a UI-only simplification, so it does not improve feedback depth yet.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 36 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Put action cues as close as possible to the control they explain.
- Removing visual panels can make the guided flow feel simpler without deleting useful guidance.
- The next small task should make the first roleplay completion more satisfying or reduce Step 2 copy further.

Next suggested task:

- Shorten the Step 2 instruction copy so the answer box appears even faster on mobile.

## 2026-06-26: Combined Writing Support

Built one focused improvement: the Roleplay answer card now combines the old Answer plan and Helpful phrases sections into one compact Writing support area. Plan and phrases remain optional, but they no longer feel like two separate stacked tasks before the user can write.

What went well:

- Step 2 now has one support surface instead of two, which makes the writing flow calmer.
- The Plan and Phrases controls still open independently, so beginners can choose only the support they need.
- The summary and helper copy live in `src/utils/writingSupportHelper.ts`, with focused unit coverage.
- Mobile preview at 390x844 confirmed the support toggles open and the answer input remains directly below the support area.

What went wrong:

- When both support options are open, the helper area is still tall; the default state is intentionally compact.
- The answer transition panel still adds another small block before the text input, so a later pass can merge it into the input header.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 36 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep combining nearby helper controls when they support the same action.
- Default Roleplay should show one clear next action first, with optional coaching available only when asked for.
- The next small task should make the answer input even more central by merging the "Now write your answer" cue into the input area.

Next suggested task:

- Merge the "Now write your answer" transition into the answer input header so there is one fewer block before typing.

## 2026-06-26: Collapsible Helpful Phrases

Built one focused improvement: the Roleplay answer card now keeps helpful phrases collapsed by default behind a small Show/Hide control. This keeps the answer input closer to the top of the writing step while still preserving optional phrase support for users who want it.

What went well:

- The change directly improves the writing flow without adding another screen, dependency or persistence layer.
- Phrase-toggle copy and accessibility labels are isolated in `src/utils/roleplayPhraseHelper.ts`, so the UI stays small and testable.
- The answer card still shows phrase availability with a compact summary, which keeps the support discoverable without forcing more scrolling.
- Added focused test coverage for the closed and open phrase-helper states.

What went wrong:

- This is still a simple disclosure pattern; phrases are not yet personalized to the user's weakness or hidden automatically after typing starts.
- The answer card remains content-rich even after collapsing phrase help, so a later pass may still trim guidance further if the writing step feels dense.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 33 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep optional coaching behind progressive disclosure when the writing task should stay primary.
- Small roleplay-flow improvements are working best when they reduce vertical clutter without removing useful guidance.
- The next step can simplify another dense support area inside Roleplay before adding more content or integrations.

Next suggested task:

- Make the follow-up round feel more guided with a compact step cue and shorter helper copy.

## 2026-06-26: Home Next Practice Recommendation

Built one focused improvement: the Home hero now recommends the actual next roleplay after a saved session instead of reopening the default Job Interview scenario. This keeps the practice loop moving forward with a clearer next action and a more useful repeat-practice habit.

What went well:

- The change fixed a real practice-flow gap without adding persistence, backend work or new navigation architecture.
- Added `src/utils/homeRecommendation.ts` so the Home recommendation logic stays small and testable.
- The Home CTA, title and supporting copy now stay aligned with the same next-step recommendation.
- Added focused coverage for first-visit and post-save Home recommendations.

What went wrong:

- The next recommendation is still a simple rotation through the roleplay library, not yet personalized by mistakes, scores or session history depth.
- The Node test run still prints the known harmless `MODULE_TYPELESS_PACKAGE_JSON` warning when importing TypeScript modules directly.
- GitHub CLI is not installed in this environment, so draft PR creation may require connector support or remain blocked.

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

- Home should keep pointing to the next useful practice action, not fall back to the first roleplay after a save.
- `createHomePracticeRecommendation` is now the place to evolve Home recommendations without touching screen layout logic.
- Keep recommendation logic local and predictable until real persistence or personalization is explicitly needed.

Next suggested task:

- Add persistent onboarding completion with local storage so repeat opens feel production-ready.

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

## 2026-06-26: Sales Variant-Aware Feedback

Built one focused improvement: Sales Call feedback now adapts to the selected objection angle. Price concern, Timing concern and Existing tool each provide their own feedback emphasis and suggested rewrite.

What went well:

- Sales feedback now coaches the exact objection the user chose instead of using only generic sales feedback.
- The guidance keeps sales language consultative: acknowledge, ask, then connect value or a next step.
- The change reused the existing `RoleplayPromptVariant.feedbackGuidance` field.
- Added focused tests for sales-specific feedback guidance and variant-aware feedback output.

What went wrong:

- Variant-aware feedback guidance now exists for Interview, Meeting, Presentation and Sales only.
- Workplace Small Talk still uses generic rule-based feedback even though its phrases are variant-specific.
- Score logic remains general-purpose and does not yet change per sales objection.
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

- Sales feedback should stay consultative and never sound pushy.
- `feedbackGuidance` is now proven across four core roleplay categories.
- Preserve the default non-variant feedback path while finishing the last scenario.

Next suggested task:

- Add variant-aware feedback guidance for Workplace Small Talk.

## 2026-06-26: Workplace Small Talk Variant-Aware Feedback

Built one focused improvement: Workplace Small Talk feedback now adapts to the selected practice angle. Quick introduction, Friendly follow-up and Move to meeting each provide their own feedback emphasis and suggested rewrite.

What went well:

- All five core MVP roleplays now have variant-aware feedback guidance.
- Small Talk feedback now coaches natural professional warmth without becoming too personal.
- The change reused the existing `RoleplayPromptVariant.feedbackGuidance` field.
- Added focused tests for small-talk-specific feedback guidance and variant-aware feedback output.

What went wrong:

- Score logic remains general-purpose and does not yet change per selected practice angle.
- Feedback guidance is still curated local content, not personalized AI.
- There is some repetition in tests now that every scenario checks the same feedback guidance shape.
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

- Every core roleplay now has tailored phrases and variant-aware feedback guidance.
- The next high-value step should improve the practice loop or UI polish, not add more static text.
- Consider reducing repeated test assertions with a small helper if tests become harder to scan.

Next suggested task:

- Improve the roleplay completion UI so saving a session feels more rewarding and clear.

## 2026-06-26: Rewarding Roleplay Completion UI

Built one focused improvement: saving a roleplay session now shows a completion card instead of a small saved text line. The card confirms the session is saved to Progress, shows total XP, labels the reward and offers a clear "Practice another answer" action.

What went well:

- The saved-session moment now feels more motivating and easier to understand.
- The UI stays professional and calm while adding a stronger habit-loop reward.
- Completion copy is generated by a small tested utility instead of hardcoded across the screen.
- Added a focused test for the roleplay completion summary.

What went wrong:

- This is still a local mock completion state; it does not persist across app restarts yet.
- The completion card does not navigate directly to Progress because the current Roleplay screen has no navigation prop for that.
- The UI has not been visually checked in Expo during this heartbeat.
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

- Roleplay completion now has a dedicated `createPracticeCompletionSummary` utility.
- The next high-value practice-loop step is letting the user jump from the completion card to Progress or a recommended next roleplay.
- Keep reward UI professional: clear XP, clear saved state and one obvious next action.

Next suggested task:

- Add a simple next-practice recommendation after session completion.

## 2026-06-26: Next Practice Recommendation

Built one focused improvement: the roleplay completion card now recommends the next scenario in the practice library. After saving a session, the user sees a recommended next roleplay, why it helps and a direct "Start next roleplay" action.

What went well:

- The completion moment now has a clearer habit loop: reward, saved state and one next practice action.
- The recommendation logic stays simple by rotating through the existing English roleplay library.
- The change reused the existing `onSelectRoleplay` flow instead of adding new navigation architecture.
- Added test coverage for the next-practice recommendation utility.

What went wrong:

- Recommendations are not personalized yet; they simply move to the next roleplay in the library.
- The completion card still cannot jump directly to Progress.
- The UI has not been visually checked in Expo during this heartbeat.
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

- `createNextPracticeRecommendation` keeps the next-step loop testable and simple.
- The next high-value UI step is making Progress access clearer after completion.
- Keep recommendation logic local and predictable until real session history/personalization exists.

Next suggested task:

- Add a completion-card action to review Progress after saving a session.

## 2026-06-26: Completion Progress Action

Built one focused improvement: the roleplay completion card now has a direct "Review Progress" action. Saving a session stays on the completion card so the user can see the XP reward, then choose whether to start the next roleplay, review Progress or practice another answer.

What went well:

- The completion reward is now actually visible after saving because saving no longer immediately navigates away.
- Progress is still one tap away from the completion card.
- The change reused the existing `activeScreen` state instead of adding navigation complexity.
- Added test coverage for the Progress CTA label in the completion summary.

What went wrong:

- This is still local session state and does not persist across app restarts.
- The completion card still has not been visually checked in Expo during this heartbeat.
- There is no component-level test for tapping the Progress button yet.
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

- Keep the completion card visible after save; do not auto-navigate away from the reward state.
- Completion actions now cover next roleplay, Progress review and same-roleplay retry.
- The next high-value step should improve persistence or visually verify the flow in Expo.

Next suggested task:

- Visually test the Roleplay completion flow in Expo and adjust spacing if needed.

## 2026-06-26: Completion Card Stat Spacing

Built one focused improvement: the roleplay completion card now adds spacing between the Reward and Saved in stat boxes so the card reads more cleanly on narrow mobile screens.

What went well:

- The change keeps the completion UI calmer and easier to scan.
- It stayed extremely small and did not change navigation, data or reward logic.
- The existing completion-card flow remains intact.

What went wrong:

- This was a code-level spacing polish, not a full Expo visual QA pass.
- The completion card still needs a real mobile screenshot check.
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

- The completion stat row uses `completionStatSecondary` for horizontal spacing.
- A real Expo mobile visual check is still worth doing before larger UI changes.
- Keep mobile completion UI uncluttered because the card already has three actions.

Next suggested task:

- Run a real Expo visual check of the completion card and adjust action layout if it feels too busy.

## 2026-06-26: Completion Action Hierarchy

Built one focused improvement: the completion card now treats "Practice another answer" as a lighter tertiary text action instead of a full button. The primary next-roleplay action and secondary Progress action remain clear, while the card feels less crowded on mobile.

What went well:

- The completion card now has a clearer action hierarchy.
- The primary "Start next roleplay" habit-loop action is easier to notice.
- The same-roleplay retry option remains accessible without adding visual weight.
- The change stayed limited to UI styling and did not touch data, payments, auth or integrations.

What went wrong:

- This is still code-level UI polish, not a true Expo screenshot pass.
- The completion card still needs real mobile visual QA.
- There is no component-level test for the tertiary action press state.
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

- Completion card actions are now primary next roleplay, secondary Progress and tertiary same-roleplay retry.
- Keep the completion card visually calm because it already carries reward, stats, recommendation and actions.
- A real Expo visual check is still the next best UI validation step.

Next suggested task:

- Start Expo and visually verify the completion card flow on a phone-sized viewport.

## 2026-06-26: Guided First Experience Simplification

Built one focused improvement: the first launch and Home screen now guide the user through SpeakCareer in three simple steps. Onboarding explains the product as choose one work situation, write one short answer and review simple feedback. Home now has one clear "Start guided practice" action, a calmer first-practice card, a simple Today progress card and the roleplay library below the fold. Expo web preview support was added so UI changes can be checked in a browser-sized phone viewport.

What went well:

- The first experience is much easier to understand and no longer starts with several competing stats, missions and path concepts.
- The same guided intro content is shared between Onboarding and Home through `src/data/guidedIntro.ts`.
- Home can now recommend the real next roleplay after a saved session using a small local utility.
- The simplified Home screen was visually checked at a 390x844 phone viewport with no overlap.

What went wrong:

- The previous Home screen had become too dense from stacked gamification layers.
- A concurrent local `homeRecommendation` change appeared during the run, so checks had to be rerun after including it.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 27 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Kevin wants the app to feel very guided and simple before it feels rich or advanced.
- Keep one obvious primary action on first launch and Home.
- Add habit-loop elements only when they support the next simple step; avoid stacking many stats at the top.
- A good next step is to simplify the Roleplay screen into a clear step-by-step flow: read prompt, write answer, review feedback, save.

Next suggested task:

- Simplify the Roleplay screen with a guided step indicator and less dense instruction copy.

## 2026-06-26: Guided Roleplay Step Indicator

Built one focused improvement: the Roleplay screen now starts with a guided practice card that shows the user's current step: Read, Answer, Review or Save. The screen title is now the active roleplay name, the subtitle explains the simple flow, and the old generic mock-AI backend note is no longer the first thing users see.

What went well:

- Roleplay now feels more like a guided lesson instead of a stack of separate cards.
- The current step is generated by `src/utils/roleplayGuide.ts`, so the UI can stay simple while state changes after typing, reviewing and saving.
- The top of the Roleplay screen was visually checked at a 390x844 phone viewport with no overlap.
- Added tests for the guide state transitions.

What went wrong:

- The Roleplay screen still has many useful cards below the guide: scenario selector, prompt, angle, timer, phrases, answer, feedback and save.
- The first visible viewport is clearer, but a later pass should simplify the answer area and feedback order.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 28 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep Roleplay guided by the user's current action, not by exposing every feature at once.
- The next useful simplification is to make the answer card itself more instructional: one prompt, one placeholder, one primary action.
- Avoid putting implementation caveats like mock backend status in the main user-facing subtitle.

Next suggested task:

- Simplify the Roleplay answer card so it clearly says what to write and when to tap Review.

## 2026-06-26: Simplified Roleplay Answer Coach

Built one focused improvement: the Roleplay answer card now acts as a small writing coach. It shows the target length, a short instruction, three concrete writing points, the answer input and the Review/Clear actions in one place.

What went well:

- The answer step is easier for a new user because the card says exactly what to write before asking for input.
- The Review action now lives inside the answer card, so the user does not have to connect a separate button row to the text field.
- The guidance is generated by `src/utils/answerCoach.ts`, keeping the UI copy simple and testable.
- The answer card was visually checked at a 390x844 phone viewport.

What went wrong:

- The answer card is clearer, but the screen still has several cards before the answer area.
- The placeholder is useful but could later become scenario-specific.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 29 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep guidance inside the card where the user acts.
- The next small simplification should reduce the number of cards before the answer area or make useful phrases collapsible/shorter.
- Keep all guidance local and mock-only until real AI/backend work is explicitly approved.

Next suggested task:

- Move the most useful phrases closer to the answer card or make them easier to scan without adding another large section.

## 2026-06-26: Inline Answer Phrase Help

Built one focused improvement: the separate Useful phrases card was removed from Roleplay, and the same phrase help now appears inside the answer card as compact chips under "Helpful phrases". This reduces one extra section before the user writes and keeps the writing help next to the input.

What went well:

- The Roleplay writing flow now has one fewer card before the answer input.
- Useful phrases are easier to connect to the answer because they sit inside the same action card.
- The copy remains local and simple through `src/utils/answerCoach.ts`.
- The updated answer card was visually checked at a 390x844 phone viewport.

What went wrong:

- The phrase chips can wrap to multiple lines on narrow screens, so long future phrases should stay short.
- The answer area is improved, but the overall Roleplay screen still has several cards before completion.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 29 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep examples and phrase support next to the place where the user writes.
- Watch chip length on mobile; shorter phrase labels scan better.
- The next small step should reduce clutter around the timer or make the active roleplay selector less visually heavy.

Next suggested task:

- Simplify the Roleplay timer card or make it secondary so the writing task remains the main focus.

## 2026-06-26: Secondary Roleplay Timer

Built one focused improvement: the separate Roleplay focus timer card was removed, and the same 5-minute timer now lives as a compact optional helper inside the guided practice card. The main Roleplay flow now starts with the steps, prompt and answer instead of another large card.

What went well:

- The timer is still available for habit-building, but it no longer competes with the writing task.
- The guide header is calmer because the timer value moved into the optional timer panel.
- Timer button labels and accessibility labels are now generated by `src/utils/focusTimer.ts`, keeping the UI logic testable.
- The existing timer test now covers Start, Pause and Restart states.

What went wrong:

- The guided practice card is still fairly tall on small phones.
- The roleplay selector remains visually busy and is the next obvious simplification target.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 29 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep habit-loop elements supportive and secondary; the user action should stay visually dominant.
- Prefer merging helper controls into the step-by-step flow instead of adding standalone cards.
- The next small task should simplify the roleplay selector so beginners see one recommended path first.

Next suggested task:

- Replace the busy Roleplay scenario selector with one recommended scenario and a simple "change scenario" control.

## 2026-06-26: Calm Roleplay Scenario Picker

Built one focused improvement: the Roleplay screen no longer shows all five scenario chips by default. It now shows one current scenario summary with a simple "Change" button, and the other scenarios appear only when the user asks for them.

What went well:

- The top of Roleplay feels more guided because the user sees one path first instead of five choices at once.
- The current scenario row keeps useful context visible: title, level, minutes and category.
- Scenario picker copy and button state are generated by `src/utils/roleplayScenarioPicker.ts`, with a focused unit test.
- Mobile preview at 390px confirmed the closed and open states work without horizontal overflow.

What went wrong:

- Opening the selector still adds four stacked options, so it is intentionally calmer when closed but still a list when expanded.
- The Practice angle card remains another choice-heavy section after the prompt.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 30 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep beginner paths collapsed to one recommended action first.
- Use progressive disclosure for optional choices instead of showing every option immediately.
- The next small task should simplify the Practice angle section so users pick one angle without feeling overloaded.

Next suggested task:

- Make the Practice angle section default to one recommended angle with a compact "change angle" control.

## 2026-06-26: Calm Practice Angle Picker

Built one focused improvement: the Roleplay Practice angle section now shows one active recommended angle by default, with a compact "Change" button that reveals the other angles only when needed.

What went well:

- The user now sees one recommended prompt angle first instead of multiple chips at once.
- The active angle title and coaching note stay visible, so the user still understands how to answer.
- The optional angle list is handled through `src/utils/roleplayAnglePicker.ts` and covered by a focused test.
- Mobile preview at 390px confirmed closed and open angle states work without horizontal overflow.

What went wrong:

- Opening the angle picker still adds two detailed options, which is useful but visually taller.
- The Roleplay screen is now clearer, but the prompt/context card and opening-line card may still be merged later.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 31 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep roleplay choices progressive: one recommended option first, optional alternatives behind a simple control.
- Preserve coaching notes when hiding choice lists, because they tell the user how to answer.
- The next small task should reduce the number of separate cards before the answer box.

Next suggested task:

- Merge the current prompt, context, goal and opening line into one simpler "Read this first" card before the answer step.

## 2026-06-26: Single Read-First Roleplay Card

Built one focused improvement: the Roleplay screen now combines the old Current prompt, Context, Your goal and opening-line cards into one "Read this first" card before the answer step.

What went well:

- The user now reads one consolidated prompt card instead of jumping between separate prompt and persona-opening cards.
- The card updates from the selected practice angle because `src/utils/roleplayReadCard.ts` uses the active prompt variant for the goal and opening line.
- The old "Current prompt" and "opens with" labels are gone from the Roleplay screen.
- Mobile preview at 390px confirmed the new card appears correctly without horizontal overflow.

What went wrong:

- The read-first card is information-dense, so future polish should make the active action even more obvious.
- The guided intro card is still tall, especially with the optional timer visible.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 32 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep roleplay reading context in one card before the answer step.
- If a card is information-dense, avoid adding another card near it; improve hierarchy inside the same card first.
- The next small task should make the answer action feel more like the primary next step after reading.

Next suggested task:

- Add a compact "Now write your answer" transition above the answer box so the next action is unmistakable.

## 2026-06-26: Clear Answer Action Cue

Built one focused improvement: the Roleplay answer card now shows a compact "Now write your answer" cue directly above the text box, so the next action is unmistakable after reading the prompt and phrases.

What went well:

- The cue lives inside the existing answer card, so it improves clarity without adding another section.
- The copy is generated by `src/utils/answerCoach.ts` and covered by the existing answer coach test.
- The cue appears immediately before the answer input, which keeps the user focused on writing.
- Mobile preview at 390px confirmed the cue appears above the text box without horizontal overflow.

What went wrong:

- The answer card is now clearer but still contains several support elements before the input.
- The cue uses a soft green panel; future design work should verify it does not compete too much with the input.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 32 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep action cues near the actual control the user should use next.
- Prefer strengthening hierarchy inside an existing card over adding new cards.
- The next small task should make the answer input itself feel more primary and easier to start.

Next suggested task:

- Make the answer text box feel more active by improving its placeholder and visual emphasis without adding new flow steps.

## 2026-06-26: Active Answer Text Box

Built one focused improvement: the Roleplay answer text box now has a clearer starter placeholder and becomes visually active when focused or when it contains text.

What went well:

- The placeholder now starts with "Start with:", making it easier for a beginner to begin typing.
- The answer input uses a white background and green border when active or filled, so it feels like the primary action.
- The change reuses the existing answer card and `src/utils/answerCoach.ts` instead of adding another step.
- Mobile preview at 390px confirmed the placeholder and active state work without horizontal overflow.

What went wrong:

- The active-state visual check needed a filled input before the computed style reflected the new border.
- The answer card still has several support elements above the text box.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 32 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep starter copy concrete and close to the typing surface.
- Filled/focused fields should keep a stronger visual state without changing layout dimensions.
- The next small task should reduce support clutter above the answer input or make helper phrases collapsible.

Next suggested task:

- Make the helpful phrases block collapsible so the answer input can sit closer to the top of the answer card.

## 2026-06-26: Compact Roleplay Setup

Built one focused improvement: the Roleplay setup area now hides secondary scenario and angle helper text until the user opens a Change control.

What went well:

- The closed Roleplay start is shorter and calmer: scenario and angle now read like compact setup cards.
- The extra guidance is still available when a user opens the scenario or angle chooser.
- The picker helpers expose `showHelperText`, so this UI rule is covered by the existing unit tests.
- Mobile preview at 390x844 confirmed the long helper text is gone in the closed state and returns when the scenario picker opens.

What went wrong:

- The first patch missed two JSX `: null` branches, which broke typecheck and lint before being fixed.
- The top of Roleplay is cleaner, but the optional timer still takes meaningful vertical space.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed after the JSX fix.
- `npm.cmd run test` passed with 33 tests.
- `npm.cmd run lint` passed after the JSX fix.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Optional guidance should be nearby but collapsed when it is not the next action.
- When simplifying mobile UI, verify both the closed state and the expanded state.
- The next small task should make the optional timer less visually heavy, because it still pushes the first roleplay prompt down.

Next suggested task:

- Collapse the optional timer into a compact row or move it below the answer action so Step 1 starts faster.

## 2026-06-26: Compact Focus Timer

Built one focused improvement: the Roleplay optional timer is now a compact row instead of a large panel, with Reset hidden until the timer has started.

What went well:

- The timer still supports Start, Pause, Restart and Reset, but the idle state takes much less vertical space.
- The timer helper now exposes `caption` and `showReset`, so the UI rule is easy to test.
- Mobile preview at 390x844 confirmed the compact timer fits cleanly and the running state shows Pause plus Reset.
- The first roleplay setup now reaches scenario, angle and the read-first card faster on mobile.

What went wrong:

- The running timer still adds a small Reset row, so there is a tiny layout height change after starting it.
- The guide card is better, but the overall Roleplay page is still long for a first-time user.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 33 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Optional tools should be visibly available without pushing the core practice task down.
- Hide secondary controls until the user has started using that feature.
- The next small task should shorten the read-first card or make context/goal easier to scan.

Next suggested task:

- Make the read-first card more scannable by turning context and goal into shorter labeled bullets.

## 2026-06-26: Scannable Read-First Card

Built one focused improvement: the Roleplay "Read this first" card now shows Situation and Goal as two numbered scan rows instead of two plain text blocks.

What went well:

- The card is easier to scan on mobile before writing an answer.
- The active practice angle still controls the Goal row through `src/utils/roleplayReadCard.ts`.
- The old Context/Your goal labels were removed from the UI, reducing repeated reading work.
- Mobile preview at 390x844 confirmed the Situation, Goal and opening-line blocks fit cleanly before Step 2.

What went wrong:

- The card may be slightly taller visually because each row now has its own white surface.
- The underlying text is still the same length; future content work can shorten individual scenario copy.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 33 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Prefer numbered scan rows when a beginner needs to understand a prompt quickly.
- Keep the selected practice angle connected to the visible Goal, because it makes variants feel real.
- The next small task should shorten scenario copy at the content level, starting with the read-first card text.

Next suggested task:

- Shorten the roleplay workplace context and user goal copy so each read-first row stays under two mobile lines where possible.

## 2026-06-26: Short Read-First Copy

Built one focused improvement: the Situation and Goal copy for all five English roleplays and their practice angles is shorter and easier to scan on mobile.

What went well:

- The Job Interview read-first card now shows shorter Situation and Goal rows in the mobile preview.
- The wording keeps the professional practice intent while removing extra phrasing.
- A new test keeps read-first card detail rows under concise mobile-friendly limits.
- The change stays inside local mock content and does not touch backend, auth, payments or secrets.

What went wrong:

- Shorter copy can lose nuance, so future content work should verify each roleplay still feels realistic.
- The opening-line card is still visually heavier than the Situation and Goal rows.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 34 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep mobile read-first rows short enough to scan before writing.
- If copy gets shorter, preserve the business action the user should practice.
- The next small task should reduce the visual weight of the AI opening line or make Step 2 even easier to start.

Next suggested task:

- Make the AI opening line in the read-first card more compact so Step 2 moves closer on mobile.

## 2026-06-26: Compact AI Prompt Line

Built one focused improvement: the Roleplay read-first card now shows the AI opening line as a compact `AI prompt` row with the speaker inline.

What went well:

- The prompt is still visible and clearly tied to the persona, but it no longer uses a large quote-style block.
- The helper now returns `openingSpeaker`, which keeps the UI compact without losing who is speaking.
- Mobile preview at 390x844 confirmed Step 2 sits closer to the read-first card.
- The change stayed in the local mock Roleplay flow and did not touch integrations or secrets.

What went wrong:

- The prompt still wraps across multiple lines for longer opening questions.
- The answer card still starts with several support elements before the text input.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 34 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep the AI prompt visible, but visually lighter than the user's next action.
- Persona context can live inline instead of as a large label.
- The next small task should make Step 2 start faster by collapsing the answer checklist or showing only the active writing instruction first.

Next suggested task:

- Make the answer checklist collapsible or more compact so the text input appears sooner.

## 2026-06-26: Collapsible Answer Plan

Built one focused improvement: the Roleplay answer checklist is now collapsed by default as a compact `Answer plan` row, with Show/Hide for the full three-step structure.

What went well:

- The text input appears sooner because the three checklist rows are hidden until the user asks for structure.
- The answer plan follows the same optional-help pattern as helpful phrases, keeping the UI consistent.
- A new helper and test cover the closed/open answer-plan state.
- Mobile preview at 390x844 confirmed the compact default state and the Show toggle work.

What went wrong:

- The answer card still has two optional help blocks before the input: answer plan and helpful phrases.
- The compact answer-plan row adds one more Show button, so future polish should avoid making the card feel too control-heavy.
- Tests still print the known harmless Node warning when importing TypeScript helpers directly.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 35 tests.
- `npm.cmd run lint` passed.
- Expo web preview was checked at `http://localhost:8091` on a 390x844 viewport.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Optional writing support should stay available but collapsed until needed.
- Keep collapsible helper patterns consistent across answer plan and helpful phrases.
- The next small task should reduce duplicate optional-help blocks or make the write input the visual center of Step 2.

Next suggested task:

- Combine the Answer plan and Helpful phrases helper blocks into one compact writing support area.
