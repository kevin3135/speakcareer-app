# Agent Learning Log

## 2026-06-29: Resume Unfinished Roleplay Drafts

Made one focused MVP-usability improvement: the app now saves one unfinished roleplay answer locally and restores it after app exits or back-navigation, with a resume-first handoff on Home and a `Draft restored` cue inside Roleplay.

Why it changed:

- An interrupted practice session could lose momentum because unfinished work disappeared.
- The English MVP should feel dependable for short daily practice, especially on mobile.
- Resuming one unfinished answer is higher value than adding more content because it protects the existing habit loop.

What changed:

- Added `src/utils/roleplayDraftStorage.ts` plus a shared `RoleplayDraft` type for one local unsaved answer.
- Updated `src/navigation/AppNavigator.tsx` to load, save and clear the local draft with AsyncStorage.
- Updated `src/screens/HomeScreen.tsx` so the main Learn CTA becomes `Resume ...` when a saved draft exists.
- Updated `src/screens/RoleplayScreen.tsx` to restore the draft into the answer box, keep it synced locally and offer `Start fresh`.
- Added focused coverage in `tests/practiceContent.test.mjs` for draft normalization, save, restore and clear behavior.

What went well:

- The feature stayed small and reused the existing roleplay/home flow instead of adding a new screen.
- The main CTA still stays singular on Home: the app chooses resume when unfinished work exists.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the Home resume card and Roleplay restore cue should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- For a daily practice product, protecting unfinished progress can be more valuable than adding another new lesson or card.
- Resume states should override browsing states so the app keeps one obvious next action.

Next suggested task:

- Do a narrow mobile QA pass on Home and Roleplay, then tighten the resume cue spacing if it pushes the answer box too far down.

## 2026-06-29: Profile Privacy Copy

Made one focused night design polish: the Profile privacy card now reads like a learner-facing device preview instead of a technical MVP integration note.

Why it changed:

- The design audit called out Profile/Me as still containing implementation notes that feel technical.
- Me should feel calm and trustworthy, not like a developer status page.
- A short device-preview badge keeps the privacy reassurance visible without competing with daily target or Learn handoff.

What changed:

- Replaced `Local MVP mode` with `Private practice space`.
- Added a compact `Device preview` badge using the existing Badge component and theme tokens.
- Shortened the body copy to focus on local progress and no account setup.

What went well:

- The change stayed inside `ProfileScreen` and this log.
- No app logic, storage, APIs, auth, payments, analytics, backend work or dependencies were changed.
- The copy is shorter, more user-facing and still accurate for the local MVP.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 3
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 3
- Safety and privacy: 5

Agent memory for next time:

- Keep user-facing privacy copy focused on trust and control, not on internal integration status.
- Technical integration notes belong in docs unless they help the learner make a decision.

Next suggested task:

- Preview the Me screen on a narrow mobile viewport and make the Premium preview CTA feel more action-oriented if it still reads like a static card.

## 2026-06-29: Coach Bubble Identity

Made one focused night design polish: the shared CoachBubble now has a warmer Career Coach identity with a framed `SC` avatar, premium bubble surface and compact `Guide` badge.

Why it changed:

- The design audit called out the coach identity as still too weak.
- Onboarding and coaching moments should feel like one helpful AI coach, not generic text blocks.
- A stronger shared CoachBubble improves multiple guided moments without changing screen logic.

What changed:

- Changed the default coach label from `AI coach` to `Career coach`.
- Added a nested framed avatar core for the `SC` badge.
- Added a compact `Guide` badge beside the coach label.
- Polished the bubble surface with shared theme colors, radius and shadows.

What went well:

- The implementation stayed inside the shared UI component file and this log.
- No screens, APIs, auth, payments, analytics, backend work, storage changes or dependencies were added.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Shared coach moments should use consistent Career Coach language and visual identity.
- Prefer improving the shared coach primitive before adding one-off coach styles to individual screens.

Next suggested task:

- Preview Onboarding and Foundation on mobile to confirm the richer coach bubble still fits cleanly above the primary action.

## 2026-06-29: Foundation Starter Preview

Made one focused practice-flow improvement: the first Job Interview screen now shows the Lesson 1 starter as an explicit warmup panel instead of only silently preloading the answer box.

Why it changed:

- The starter line was already auto-applied after Lesson 1, but the handoff was too easy to miss once the interview screen opened.
- The English MVP should make the first answer feel easier to begin without adding another step.
- A compact preview keeps the lesson-to-roleplay connection visible and tells the learner to edit the line for their real work.

What changed:

- Added `src/utils/foundationWarmupPanel.ts` to keep the first-interview warmup copy simple and reusable.
- Replaced the old `Starter loaded. Edit, then check.` strip in `src/screens/RoleplayScreen.tsx` with a richer Lesson 1 warmup panel.
- The new panel shows the loaded starter answer, the coach note, and clear edit guidance before the answer box.
- Added a focused assertion in `tests/practiceContent.test.mjs` for the warmup panel copy and level-matched starter text.

What went well:

- The change stayed inside the existing Lesson 1 to Quest 1 path with no new storage, navigation, dependencies, APIs or backend work.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- The UI now makes the first interview answer feel more intentional while preserving the same simple flow.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the new warmup panel spacing should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- When a starter answer is auto-applied, show the source and edit guidance instead of relying on the text box alone.
- Foundation-to-Roleplay transitions work better when the learner can see both the loaded line and the reason it helps.

Next suggested task:

- Add a small `Reload starter` action to the Lesson 1 warmup panel so beginners can restore the model line after editing.

## 2026-06-29: Premium Preview Polish

Made one focused night design polish: the shared Premium preview card now feels more like a polished future-upgrade preview and less like a static payment block.

Why it changed:

- The Premium mock section had the lowest CTA strength score in the design scoreboard.
- In the MVP it should look premium while clearly staying non-transactional.
- Better visual framing helps Profile feel more finished without adding payments or new navigation.

What changed:

- Added a `Coming later` badge to the Premium card header.
- Turned premium benefits into stronger framed rows with a small accent marker.
- Changed pricing labels to `Monthly preview` and `Yearly preview`.
- Reworded the safety note to `No payment is connected in this MVP.`

What went well:

- The implementation stayed inside the shared `PremiumCard` styles in `src/components/ui/index.tsx`.
- No APIs, auth, payments, analytics, backend work, storage changes or dependencies were added.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Premium preview should always read as future value, not an active payment surface.
- Use badges and framed benefit rows to make future features feel polished without connecting monetization.

Next suggested task:

- Preview Profile/Me on mobile and check whether the Premium card now feels premium without pulling attention away from Learn.

## 2026-06-29: Profile Learn Handoff

Made one focused night design polish: the Me/Profile hero now includes a clear `Back to Learn` action so settings feels secondary to the guided learning path.

Why it changed:

- Profile/Me had useful learner settings, but it could still feel like a quiet dead end.
- Learn should stay the main product surface that decides the next useful step.
- A small hero-level handoff keeps Me useful without making it compete with the practice loop.

What changed:

- Added an `onBackToLearn` handoff from `AppNavigator` to `ProfileScreen`.
- Added a `Back to Learn` button inside the Profile hero.
- Kept daily target, language plan, premium preview and local privacy note unchanged.

What went well:

- The implementation touched only `src/navigation/AppNavigator.tsx`, `src/screens/ProfileScreen.tsx` and this log.
- No APIs, auth, payments, analytics, backend work, storage changes or dependencies were added.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Me should behave like a settings support area and always make it easy to return to Learn.
- Keep Profile copy learner-facing and avoid technical integration language.

Next suggested task:

- Do a quick mobile screenshot QA pass on Me to confirm the hero CTA fits cleanly above the daily target card.

## 2026-06-29: Foundation Quest Unlock Cue

Made one focused practice-flow improvement: Lesson 1 completion now shows a compact `What happens next` cue so the learner sees the immediate interview launch and the first unlock after saving.

Why it changed:

- The Foundation screen already showed the first interview handoff, but it did not make the next two app states explicit enough.
- The English MVP should keep one obvious path: finish Lesson 1, open Job Interview, save once, unlock the ongoing Learn and Wins loop.
- A small unlock cue is higher value than adding more content because it reduces hesitation before the first real practice step.

What changed:

- Extended `createFoundationHandoff` with a short two-step next-state preview: `Now` and `After save`.
- Added a compact `What happens next` panel to `src/screens/FoundationScreen.tsx`.
- Kept the existing starter answer and coach note intact so the cue reinforces the current handoff instead of replacing it.
- Added focused assertions in `tests/practiceContent.test.mjs`.

What went well:

- The implementation stayed inside `src/utils/foundationHandoff.ts`, `src/screens/FoundationScreen.tsx`, `tests/practiceContent.test.mjs` and this log.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- The new copy keeps the user-facing loop concrete without adding new navigation, storage, backend or onboarding scope.

What went wrong:

- This run did not include fresh mobile screenshot QA, so the new handoff panel spacing should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Early guided screens should show both the next action and the first unlock after that action.
- Small progress-loop cues are more useful than adding extra explanation copy to the same handoff card.

Next suggested task:

- Preview the completed Foundation handoff on a narrow viewport and tighten spacing if the `Continue to interview` button sits too low.

## 2026-06-29: Wins Mistake Queue Polish

Made one focused night design polish: the collapsed mistake queue in Wins now looks like an intentional saved-for-later cue instead of a plain text strip.

Why it changed:

- Wins should show one correction first and keep the full mistake list secondary.
- The queue was already collapsed, but the hidden-state cue did not feel visual or app-led enough.
- A compact correction-colored cue makes it clearer that extra mistakes are saved safely without competing with the active fix.

What changed:

- Reworked the collapsed mistake queue cue into a small correction card with a `Q` badge.
- Added one short hint: `Open only when you want the full queue.`
- Kept the existing `See all mistakes` toggle and all mistake-practice behavior intact.

What went well:

- The implementation stayed inside `src/screens/ProgressScreen.tsx` plus this log.
- No navigation, APIs, auth, payments, analytics, backend work or dependencies changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Mistake Bank should reinforce one active correction first, with saved mistakes visually quiet until opened.
- Use correction color roles for hidden mistake-bank cues instead of generic grey strips.

Next suggested task:

- Capture a narrow mobile screenshot of Wins to verify the mistake queue cue does not push the active correction too far down.

## 2026-06-29: Wins Learn Handoff

Made one focused night design polish: the top action on Wins now routes back to the guided Learn path instead of launching a roleplay directly.

Why it changed:

- Wins should feel like a reward/support area, not a second starting point.
- Learn is the main product surface and should stay responsible for choosing the next step.
- The user can still retry saved scenarios and practice mistakes from Wins, but the first recommended action now returns to the app-led path.

What changed:

- Added an `onBackToLearn` handoff from `AppNavigator` to `ProgressScreen`.
- Changed the primary next-step button in Wins to `Back to Learn`.
- Kept all existing roleplay retry and mistake-practice actions intact.

What went well:

- The implementation touched only `src/navigation/AppNavigator.tsx`, `src/screens/ProgressScreen.tsx` and this log.
- No screens, APIs, auth, payments, analytics, backend work or dependencies were added.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Secondary areas should usually hand the learner back to Learn instead of becoming parallel launch points.
- Wins can keep retry/fix actions, but its main job is to confirm progress and guide back to the path.

Next suggested task:

- Use mobile screenshot QA to confirm the Wins first viewport still feels like a reward area and not a dashboard.

## 2026-06-29: Simplified App Flow

Made one focused UX-flow improvement: the bottom navigation now makes `Learn` feel like the primary route while `Wins` and `Me` stay quieter secondary areas.

Audit notes:

- `AppNavigator` already hides bottom navigation during Foundation and Roleplay, so focused flows are protected.
- `HomeScreen` is clearly the main product surface with one active learning step.
- `ProgressScreen` and `ProfileScreen` are useful, but the bottom nav made all destinations feel equally important.
- The smallest high-value fix was to polish `BottomNav` instead of changing navigation architecture.

What changed:

- `Learn` is now a wider, softly framed primary tab.
- Active `Learn` gets the strongest nav state.
- Active `Wins` and `Me` use quieter secondary styling so they do not compete with the learning path.
- No tab was removed and no routing logic changed.

What went well:

- The implementation stayed inside `src/components/BottomNav.tsx`.
- No screens, APIs, auth, payments, analytics, backend work or dependencies changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep Learn visually dominant in any global navigation.
- Treat Wins and Me as support spaces, not equal starting points.

Next suggested task:

- Add a small `Back to Learn` CTA near the top of Wins/Me if browser QA still shows users may linger there.

## 2026-06-29: Brand System Polish

Made one focused design-system polish: shared typography, radius, shadow and UI primitive styles now feel more like a consistent Career Arcade brand without changing screen logic.

Why it changed:

- The app had cleaner screens, but the shared brand language still felt a bit generic.
- Headings, CTAs, cards, badges and lesson nodes should share the same friendly, premium, tappable feel.
- This keeps future screen polish easier because the base components now carry more of the visual identity.

What changed:

- Increased the headline/body typography scale slightly while keeping readable line heights.
- Rounded the shared large radii so cards and CTAs feel softer and more consumer-grade.
- Strengthened soft, medium, button and lesson-node shadows through theme tokens.
- Gave shared cards more breathing room, buttons stronger tactile depth, badges a stable readable height, and completed lesson nodes their own success state.

What went well:

- The change stayed in shared theme/UI files only.
- No screen logic, APIs, auth, payments, backend work or dependencies changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA, so mobile visual spacing should still be checked by eye.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep Career Arcade visual language in the primitives first: rounded confident type, tactile CTAs, premium cards and stateful lesson nodes.
- Avoid one-off screen styling when a shared token or component style can carry the brand.

Next suggested task:

- Do a quick mobile screenshot QA pass on Home, Roleplay and Completion to catch any spacing changes from the larger shared typography/cards.

## 2026-06-29: Completion Reward Moment

Made one focused reward polish: the saved Roleplay completion state now has a compact reward moment card with a subtle pulse, stronger XP placement, streak/progress badges, and a clearer next-unlocked label.

Why it changed:

- The completion screen already showed XP, streak and progress, but the win felt static.
- A small professional reward beat helps the learner feel career momentum without adding a new reward system.
- The Continue button should stay the main action after the reward is understood.

What went well:

- The change stayed inside the existing completion UI in `src/screens/RoleplayScreen.tsx`.
- The animation uses React Native `Animated` only, with no new dependencies, sounds, APIs, auth, payments or backend work.
- The reward copy stays short and professional: one compact reward phrase, then next step.

What went wrong:

- This run did not include fresh browser screenshot QA.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Completion rewards should feel like career momentum, not entertainment for its own sake.
- Keep the post-save hierarchy: XP first, streak/progress second, next unlocked third, Continue strongest.

Next suggested task:

- Preview the completion reward on a narrow mobile viewport and tune vertical spacing around Continue if needed.

## 2026-06-29: Foundation Live Sentence Build

Made one focused English MVP improvement: Foundation Step 1 now shows a live sentence build preview, so the learner sees the example sentence assemble part by part as they tap `I`, `action`, and `result`.

Why it changed:

- The first lesson was already tap-based, but the sentence itself still did not visibly build as progress happened.
- The English MVP should make the first win concrete before sending the learner into Job Interview practice.
- A live build preview makes Lesson 1 feel more like a real micro-lesson without adding any backend, auth or navigation scope.

What went well:

- The logic stayed simple by moving the builder state into `src/utils/foundationSentenceBuilder.ts`.
- `src/screens/FoundationScreen.tsx` now reuses that helper for the rail, progress and live preview instead of duplicating step logic in the screen.
- A focused test now covers start, mid-build and complete lesson states in `tests/practiceContent.test.mjs`.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile visual QA, so the new token-wrap layout should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Foundation gets more useful when progress is visible inside the sentence, not only in the step rail.
- Keep the first lesson focused on one interaction pattern: tap, reveal, continue.
- The next small task should strengthen the Lesson 1 to Quest 1 handoff without adding another screen.

Next suggested task:

- Add a compact unlock cue above the `Continue to interview` button so Quest 1 feels like the clear next required step.

## 2026-06-29: Roleplay Active Step Simplification

Made one focused Roleplay active-practice simplification: the `Check` CTA now appears directly after the answer box, the readiness cue is visually quieter, and the daily-goal preview no longer sits inside the active answer card.

Why it changed:

- The active Roleplay step already had a coach prompt and answer box, but the learner still saw status and progress context before the main action.
- During practice the flow should read: coach asks, user answers, app checks.
- Daily goal context is useful after saving, but it does not help the current answer action.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- Back button, progress strip, coach prompt, answer input, collapsed help and mock/local behavior stayed intact.
- No real audio, AI, backend, auth, payments, storage or app-store setup changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- In active Roleplay, the primary CTA should come immediately after the answer box.
- Status and progress cues should be softer than the answer/check loop.
- Keep daily-goal or save-progress context for post-check/post-save states, not the answer step.

Next suggested task:

- Preview the active Roleplay first viewport on mobile and tune vertical spacing if `Check` still sits too low.

## 2026-06-29: Roleplay Save Hierarchy

Made one focused Roleplay polish: the optional bonus-turn chip is now visually quieter, so the primary `Save` action stays the clear required next step after feedback.

Why it changed:

- The bonus-turn preview became more useful, but it still needed to stay secondary to saving the answer.
- The post-feedback step should preserve one obvious primary action: save the practice win.
- Optional bonus practice should feel helpful and available, not like a competing CTA.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- No storage, feedback, AI, audio, backend, auth or payment behavior changed.
- The bonus focus and XP preview remain visible, but the styling now uses quieter surfaces and borders.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Required save actions should stay visually stronger than optional bonus practice.
- Optional actions can show value, but muted styling keeps the path simple.
- The post-feedback card should be checked on mobile for CTA hierarchy before adding more reward UI.

Next suggested task:

- Preview the save card at `390x844` and trim any body copy if the primary save action sits too low.

## 2026-06-29: Roleplay Bonus Turn Preview

Made one focused Roleplay polish: the collapsed optional bonus-turn chip now previews the follow-up focus, such as `Next: Add impact`, next to the `+15 XP` reward.

Why it changed:

- The previous chip made the bonus feel like generic XP instead of a useful next practice step.
- Learners should know why an optional follow-up matters before opening it.
- The primary save action still stays stronger; the bonus turn remains clearly optional.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- No real audio, AI, backend, payment, auth or storage behavior changed.
- The chip now uses existing follow-up prompt data and theme tokens.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Optional practice should explain the learning value, not only the XP value.
- Keep bonus actions below the required save action so they do not create a second primary path.
- Short `Next: ...` language works well for coaching previews.

Next suggested task:

- Preview the post-feedback save card on mobile and make the save-versus-bonus hierarchy even clearer if needed.

## 2026-06-29: Onboarding First Session Loop

Made one focused onboarding improvement: the selected starting-level plan now shows a compact `Your first practice loop` preview with the first lesson, the first Job Interview step, and the coach-review/save step.

Why it changed:

- The onboarding screen already captured level and daily target, but it still did not show the actual first-use loop clearly enough.
- New users should understand the product in under a minute: learn one pattern, answer one work prompt, get feedback, save progress.
- A small first-session preview strengthens the English MVP without adding backend scope or new navigation paths.

What went well:

- The change stayed focused in `src/screens/OnboardingScreen.tsx`, `src/utils/onboardingPlan.ts`, and `tests/practiceContent.test.mjs`.
- Existing onboarding plan data was extended instead of adding another screen or a more complex state model.
- The new copy keeps the flow professional and habit-oriented without becoming childish.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the new onboarding loop card should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Onboarding gets stronger when the first five-minute loop is explicit instead of implied.
- Keep onboarding focused on one clear path rather than adding more choice or more copy blocks.
- Habit framing works better when the first saved answer is presented as the win, with extra roleplays clearly secondary.

Next suggested task:

- Improve the Roleplay bonus-turn chip so it previews the follow-up focus before the learner opens the extra turn.

## 2026-06-29: Mistake Bank Progressive Disclosure

Made one focused Progress polish: the Mistake Bank now keeps queued mistakes hidden by default behind a compact `See all mistakes` control, so the active correction remains the clear task.

Why it changed:

- The visual roadmap called for hiding long mistake-bank lists behind `See all mistakes`.
- Progress already had one active correction, but the queued bank still previewed another mistake and competed for attention.
- The screen should feel like one next coaching win, not a full report.

What went well:

- The change stayed inside `src/screens/ProgressScreen.tsx`.
- No new data, APIs, payments, auth, backend logic or dependencies were added.
- The existing full mistake list is still available when the user opens it.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Progress should show one active correction first; queued mistakes are secondary.
- `See all mistakes` is clearer than showing one extra queued mistake by default.
- Keep mistake-bank detail available, but never let it compete with the current practice task.

Next suggested task:

- Preview Progress on mobile after a saved session and tune the active correction card if it still feels too dense.

## 2026-06-29: App Button Depth Polish

Made one focused shared UI polish: primary, danger and secondary `AppButton` states now have slightly more tactile depth using existing theme colors and shadow tokens.

Why it changed:

- The design audit called buttons functional but not yet rewarding or premium enough.
- Primary CTAs should feel easy to tap and a little more game-like without becoming childish.
- A shared component change improves Home, Roleplay, Feedback, Progress and Profile without adding product scope.

What went well:

- The change stayed inside `src/components/ui/index.tsx`.
- No new props, dependencies, APIs, auth, payments or backend logic were added.
- The button labels, accessibility behavior and app flows stayed unchanged.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 3
- Safety and privacy: 5

Agent memory for next time:

- Small shared component polish can improve the whole app without adding new decisions.
- Keep primary buttons tactile, but leave secondary and quiet actions visually calmer.
- Preview the primary CTA on Home and Roleplay next to ensure the added depth feels premium, not heavy.

Next suggested task:

- Capture a fresh mobile preview and tune any button spacing if the added depth makes compact cards feel crowded.

## 2026-06-29: Simplified Roleplay Active Step

Made one focused Roleplay UX simplification: the active practice state now shows a small step progress strip, one coach prompt bubble, the answer box, and one primary `Check` action before optional support.

Why it changed:

- The Roleplay screen was improved, but the active step still showed too many helpful elements before the user answered.
- During practice the user should see one job at a time: read the coach prompt, answer, then check.
- Optional starters, writing support and daily goal context should not compete with the main action.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- The old first-quest explanation was reduced to a compact progress strip.
- Warm-up and starter actions now live inside collapsed `Need help?` support unless a starter was already auto-loaded.
- The main CTA is now the shorter `Check` label.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- The in-app browser preview connection timed out during this run, so visual QA should still be checked manually at `http://localhost:8091/`.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Active practice should keep help below the main CTA or behind one collapsed row.
- Roleplay should feel like `coach asks -> user answers -> check`, not like a setup form.
- The answer box should appear before any optional planning or phrase support.

Next suggested task:

- Manually preview the Roleplay screen on a narrow mobile viewport and tune spacing if the `Check` CTA sits too low.

## 2026-06-29: Visual Home Coach Cue

Made one focused Home polish: the coach tip is now a compact visual cue with a round `SC` coach badge and one short `Next: ...` instruction.

Why it changed:

- The coach tip was short, but still looked like another text strip.
- Learn/Home should keep the active START card dominant while still giving one useful AI-coach nudge.
- A one-row cue feels more like a friendly coach instruction and less like a report.

What went well:

- The visual change stayed inside `src/screens/HomeScreen.tsx`.
- The copy helper in `src/utils/homeCoachFocus.ts` now avoids more long/ellipsis cases for colon tips and stronger-verb tips.
- Saved-session data, feedback generation, storage, navigation, APIs and backend behavior did not change.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser screenshot QA because unrelated working-tree changes appeared during the run and I kept the commit narrowly scoped.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Home coach guidance should be one visual cue, not a second mini-card.
- A round `SC` badge gives the AI coach more presence without adding a mascot or extra screen.
- Keep the primary START card visually stronger than any coaching tip.

Next suggested task:

- Add icon support to the Home map nodes so `Goal` and `Next` can become clearer without extra text.

## 2026-06-29: Balanced Coach Recap

Made one focused AI feedback UI improvement: the Roleplay review card now shows a compact `Coach recap` with one `Working well` score, one `Improve next` score, and one short coaching line before the detailed breakdown.

Why it changed:

- The review step already showed a next move, but it did not balance that instruction with one clear positive signal.
- The MVP loop should feel useful and motivating: the learner needs to know what to keep as well as what to fix.
- A compact keep/next recap makes the feedback easier to scan before the optional details and save step.

What went well:

- The change stayed focused in [`/C:/Dev/speakcareer-app/src/screens/RoleplayScreen.tsx`](/C:/Dev/speakcareer-app/src/screens/RoleplayScreen.tsx), [`/C:/Dev/speakcareer-app/src/utils/feedbackMomentum.ts`](/C:/Dev/speakcareer-app/src/utils/feedbackMomentum.ts), and [`/C:/Dev/speakcareer-app/tests/practiceContent.test.mjs`](/C:/Dev/speakcareer-app/tests/practiceContent.test.mjs).
- The new helper keeps the coaching recap deterministic and easy to extend without touching storage, navigation, or feedback generation.
- `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the new recap row should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Feedback feels stronger when one positive signal and one improvement signal sit together before the detailed notes.
- Keep the review step focused on one short coaching sentence before asking the learner to read full score breakdowns.
- Reuse score-summary helpers for motivational UI before adding any new progress system.

Next suggested task:

- Make the collapsed bonus-turn chip preview the follow-up focus so the extra practice turn feels more concrete.

## 2026-06-29: Premium Home Lesson Map

Made one focused Home redesign: the Learn screen now reads as a compact career path with one large active START node, a daily-goal checkpoint and one locked next node.

Why it changed:

- Home was simple, but the lesson flow still felt like separate cards instead of a guided map.
- The user should immediately understand: start the current quest, make daily progress, unlock the next career-English step.
- A vertical path rail makes the habit loop visible without adding new choices or product features.

What went well:

- The change stayed inside `src/screens/HomeScreen.tsx`.
- The old separate mission card and next-unlock card became map nodes under the active lesson.
- Home now uses theme tokens only in this screen; the previous raw `rgba(...)` Home colors were replaced.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A fresh in-app browser preview at `390x844` showed the active card, checkpoint, locked node and compact coach cue fitting cleanly above the bottom nav.

What went wrong:

- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.
- The map still uses text labels instead of icons, so a later button/icon pass can make the nodes feel more polished.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Home feels more game-like when progress and locked content sit on the same visual rail as the active START action.
- Keep the active card as the only pressable hero; next nodes should tease progress without becoming choices.
- Compact map nodes work better than stacking full cards for daily goal and unlock states.

Next suggested task:

- Add icon support to the map nodes through the shared UI system so `Goal` and `Next` can become clearer symbols without adding text.

## 2026-06-29: Short Home Coach Focus

Made one focused Home polish: the coach focus strip now turns long saved feedback into one short, actionable line before showing it on Learn/Home.

Why it changed:

- The latest Home preview still showed a long coach sentence with ellipsis.
- Learn/Home should keep the user focused on the next action, not a mini feedback report.
- A short `Next: ...` instruction keeps the coach useful without adding reading effort.

What went well:

- The change stayed focused on Home display copy through `src/utils/homeCoachFocus.ts` and `src/screens/HomeScreen.tsx`.
- Saved-session data, feedback generation, storage, navigation and backend behavior did not change.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- The in-app browser reload QA timed out after the checks, so this run did not capture a fresh visual screenshot.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Home should summarize coaching as one action, even when older saved sessions only have a long feedback summary.
- If a line needs `numberOfLines={1}`, make the source copy short enough that truncation is the exception.
- Small copy reducers are useful design-system tools when app-led screens reuse detailed practice data.

Next suggested task:

- Reconnect the in-app browser preview and visually confirm the compact Home coach strip at `390x844`.

## 2026-06-29: Compact Saved Next Stop Card

Made one focused Roleplay completion polish: the fallback saved-success `Next stop` card is now a compact one-line strip, matching the path-aware completion card.

Why it changed:

- The saved-success screen should keep the primary continuation action close in every completion branch.
- The fallback `Next stop` card still used a large label and title stack.
- A one-line strip keeps the next destination visible without adding another tall card.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- No saved-session data, completion logic, storage, navigation or backend behavior changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the fallback completion branch should still be checked at `390x844`.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep completion fallbacks visually consistent with the primary path-aware state.
- When a completion screen already has XP, streak and coach-target signals, the next destination should be a strip, not a second large card.
- Small height reductions compound on mobile and keep the learner's next action obvious.

Next suggested task:

- Mobile-preview both saved-success branches and decide whether the badge row needs wrapping limits on narrow screens.

## 2026-06-29: Compact Saved Level-Up Strip

Made one focused Roleplay completion polish: the saved-success level-up state is now a compact one-line strip, and the new level plus total XP move into the existing badge row instead of using a taller standalone panel.

Why it changed:

- The saved-success screen should keep the primary continuation action visible near the win state.
- The old level-up box repeated information across a title, badge row and body copy, which pushed the CTA lower without changing the learner's next action.
- A compact strip keeps the level-up moment visible while preserving the fast, businesslike finish the MVP needs.

What went well:

- The change stayed focused in `src/screens/RoleplayScreen.tsx`, `src/utils/practiceCompletion.ts` and `tests/practiceContent.test.mjs`.
- The new helper keeps the level-up copy easy to reuse and test without changing saved-session, storage, navigation or backend behavior.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the compact saved-success stack should still be checked at `390x844`.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Completion screens feel stronger when progress rewards reuse the same badge row instead of adding another full card.
- If the learner already understands the win, use one short recap strip instead of a second explanatory panel.
- Keep post-save attention on one clear next action and compress supporting progress signals around it.

Next suggested task:

- Make the fallback saved-success `Next stop` card as compact as the path-aware version so both completion branches keep the CTA equally close.

## 2026-06-29: Compact Saved Career Path Card

Made one focused Roleplay completion polish: the saved-success career path card now shows the next unlocked roleplay as one compact line and uses tighter padding.

Why it changed:

- The completion screen should keep the `Continue` action close after XP, streak and coach target.
- The path card repeated the path title before the next step, which added height without changing the learner's next action.
- A compact path card preserves progress feedback while keeping the win moment fast and scannable.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- No career-path logic, saved-session data, storage, navigation or backend behavior changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the completion stack should still be checked at `390x844`.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Mobile-preview the saved-success screen and, if it still feels tall, make the level-up box a one-line strip too.

## 2026-06-29: Compact Saved Coach Target Strip

Made one focused Roleplay completion polish: the saved coach target on the success screen is now a compact one-line strip instead of a taller panel with a separate badge row.

Why it changed:

- The saved-success screen should end with one win, one coach target and one clear next action.
- The previous coach-target panel was useful, but it added height before the next lesson and primary continuation area.
- A one-line strip keeps the improvement target visible without making the completion screen feel like another report.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- No saved-session data, completion logic, storage, navigation or backend behavior changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the completion screen should still be checked at a narrow phone width.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Mobile-preview the saved-success screen and, if the CTA is still low, make the career path progress card more compact.

## 2026-06-29: Saved Coach Target Recap

Made one focused practice-flow improvement: after a roleplay is saved, the success screen now shows the saved coach target in one compact panel so the learner leaves with one clear improvement to repeat next.

Why it changed:

- The save-success state already showed XP, streak and next lesson, but it did not restate the specific coaching target from the feedback.
- The MVP loop should end with one memorable next action, not only a generic success state.
- Repeating the saved coach target at the win moment makes the feedback feel more actionable without adding another screen or extra navigation.

What went well:

- The change stayed focused in `src/screens/RoleplayScreen.tsx`, `src/utils/practiceCompletion.ts` and `tests/practiceContent.test.mjs`.
- It reuses existing `PracticeSession.nextFocusLabel`, `nextFocusText` and `feedbackSummary` data instead of adding new storage or state.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the saved-success card stack should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- If feedback identifies one concrete next move, restate it at the exact point where the learner finishes and decides what to do next.
- Success screens should balance motivation and instruction: one win signal, one next lesson, one coach target.
- Reuse saved-session coaching fields before adding any new progress-memory model.

Next suggested task:

- Mobile-preview the saved success screen and tighten spacing only if the new coach target panel pushes the primary CTA too low.

## 2026-06-29: Quieter Home Mission Card

Made one focused Home polish: the daily mission card is now a quieter progress strip that shows the current saved target and XP reward without the extra `Goal/Done` node.

Why it changed:

- The Home start card already shows the daily target, level progress and latest coach focus.
- The separate mission card was still visually loud for a secondary confirmation area.
- Removing the node keeps the main `START` card dominant while preserving the daily progress signal.

What went well:

- The change stayed inside `src/screens/HomeScreen.tsx`.
- No mission logic, storage, navigation or backend behavior changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the quieter Home stack should still be checked at `390x844`.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Mobile-preview the full Home stack after a saved session and decide whether the `Coach` recap should become a smaller pill if it pushes the next unlock too low.

## 2026-06-28: Home Coach Focus Recap

Made one focused Home polish: returning users now see one compact `Coach` recap under the main `START` card with the latest saved session's next coaching target.

Why it changed:

- The Roleplay save step now explains what gets locked into Progress, but Home did not yet remind the learner what to improve next.
- Kevin wants the app to guide the user instead of making them hunt through screens.
- A single coach-focus strip keeps the next practice personal without adding a new button, tab or dashboard.

What went well:

- The change stayed inside `src/screens/HomeScreen.tsx`.
- It reuses existing `PracticeSession.nextFocusLabel`, `nextFocusText` and feedback summary data.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the new coach strip should still be checked on a narrow phone.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Mobile-preview the Home screen after a saved session and decide whether the separate daily mission card should be visually quieter.

## 2026-06-28: Roleplay Save Lock-In Preview

Made one focused practice-flow improvement: the Roleplay save step now shows a compact `Locks in` summary before `Complete lesson`, so the learner can see exactly what will be saved to Progress, how today changes, and how much XP gets banked.

Why it changed:

- The review step already explained the feedback, but the final save action still depended too much on the generic `Complete lesson` label.
- The MVP should make the habit loop obvious: get feedback, save once, and see the progress move.
- A compact lock-in summary makes the primary action more concrete while keeping the optional bonus turn secondary.

What went well:

- The change stayed focused in `src/screens/RoleplayScreen.tsx`, `src/utils/practiceCompletion.ts` and `tests/practiceContent.test.mjs`.
- It reuses the existing daily-target preview and XP data instead of adding new state, storage or navigation logic.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the new save-summary rows should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- If a CTA is what actually advances XP, streaks or saved history, say what it locks in right next to the button.
- Reuse existing progress signals at the save moment before adding more reward mechanics.
- Keep optional bonus turns clearly secondary to the main save action.

Next suggested task:

- Add one compact latest-coaching-target recap to the Home start area so returning users know what to improve before opening the next roleplay.

## 2026-06-28: Compact Home Level Strip

Made one focused Home polish: the level progress area inside the main `START` card is now a slimmer strip with the current level, one progress label and the progress track.

Why it changed:

- The Home start card had become more motivating after the daily habit badge, but the level box still used three rows.
- Kevin wants the app to stay extremely simple at the start, with one obvious action and less visual weight.
- A compact strip keeps progress visible without pushing the daily mission and next unlock further down.

What went well:

- The change stayed inside `src/screens/HomeScreen.tsx`.
- No progress data, navigation, storage or backend behavior changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the Home card should still be checked at `390x844`.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Mobile-preview the Home screen and decide whether the separate daily mission card can become even quieter now that the start card shows the daily target.

## 2026-06-28: Home Start Habit Badge

Made one focused Home polish: the main `START` card now shows a compact daily habit badge with the current target state, for example `Today goal` and `0/1 saved`.

Why it changed:

- Home should answer "why start now?" before the learner opens a roleplay.
- The daily mission already existed below the start card, but the main action could use one tiny habit-loop cue.
- A small badge keeps the page app-led without adding more buttons, tabs or explanation.

What went well:

- The change stayed inside `src/screens/HomeScreen.tsx`.
- It reuses existing `missionCard.targetLabel` data and theme tokens.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the new pill should still be checked at a narrow phone width.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Mobile-preview the Home start card and tighten the level-progress box if the first card feels too tall.

## 2026-06-28: Progress Earlier Save History

Made one focused Progress improvement: after the latest win card, the Progress screen now shows a compact `Recent saves` block with up to three earlier saved sessions, their XP, and the next coaching target to repeat.

Why it changed:

- The app already stores local practice sessions, but Progress only surfaced the newest one.
- That made repeat practice feel disposable instead of cumulative.
- A short earlier-save history makes the local practice loop feel more habit-forming without adding a new screen or more navigation.

What went well:

- The change stayed focused in `src/screens/ProgressScreen.tsx` with one small helper in `src/utils/progressRecentSessions.ts`.
- The new history block reuses existing session fields, so no storage, backend or navigation changes were needed.
- Focused coverage was added in `tests/practiceContent.test.mjs`.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the new recent-save rows should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- If local history already exists, surface it in a compact way before inventing a new progress feature.
- Earlier saved sessions are more useful when they restate the next coaching target, not only the old answer text.
- Keep Progress cumulative but quiet: one detailed latest win plus one compact earlier-save list is enough for now.

Next suggested task:

- Add one compact streak or target-lock badge to the Home start card so today’s habit goal is visible before opening a roleplay.

## 2026-06-28: Tighter Writing Support Phrase Chips

Made one focused Roleplay polish: phrase chips inside the opened `Writing support` drawer now stay one line with safe sizing, so long professional starters do not make the helper feel heavy on mobile.

Why it changed:

- The drawer can include longer workplace phrases.
- Multi-line chips can make the answer step look busy after the learner asks for help.
- One-line chips keep support scannable while the main job stays clear: write one answer and tap `Check answer`.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- It did not change phrase insertion logic, roleplay data, storage or backend behavior.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the opened drawer should still be checked visually on a narrow phone.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Mobile-preview the opened writing support drawer and decide whether the answer plan section should be shortened further.

## 2026-06-28: Quieter Writing Support Toggle

Made one focused Roleplay polish: the collapsed `Writing support` drawer now shows only a short label and `More`, while the helper copy and support badge appear only after the learner opens it.

Why it changed:

- The drawer was collapsed, but it still showed helper text and a support badge under the answer box.
- Kevin wants the practice step to stay simple and avoid extra visible instructions unless the learner asks for help.
- A one-line closed drawer keeps writing support available without competing with the answer field or `Check answer`.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- No helper logic, content data, storage or backend behavior changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the opened drawer still needs a narrow-phone check for phrase-chip wrapping.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Preview the opened writing support drawer on mobile and tighten phrase chips only if they wrap awkwardly.

## 2026-06-28: Compact Roleplay Writing Support Drawer

Made one focused Roleplay improvement: the answer step now has one compact `Writing support` drawer that quietly combines a coach note, a short answer plan, and tap-to-insert helpful phrases without pushing the main answer box out of focus.

Why it changed:

- The Roleplay answer step had become cleaner, but it no longer exposed the local phrase and structure support already available in the app.
- Kevin wants the English MVP to feel guided and habit-forming, which means help should be nearby when the learner gets stuck, but secondary to the main writing action.
- One collapsed drawer keeps the draft box central while still giving the learner a quick way to borrow a phrase or restart with structure.

What went well:

- The change stayed focused in [`C:\Dev\speakcareer-app\src\screens\RoleplayScreen.tsx`](C:\Dev\speakcareer-app\src\screens\RoleplayScreen.tsx), [`C:\Dev\speakcareer-app\src\utils\writingSupportHelper.ts`](C:\Dev\speakcareer-app\src\utils\writingSupportHelper.ts) and one focused test block in [`C:\Dev\speakcareer-app\tests\practiceContent.test.mjs`](C:\Dev\speakcareer-app\tests\practiceContent.test.mjs).
- Existing local roleplay data and helper utilities were reused, so no new content model, backend logic or storage was added.
- The first Job Interview still avoids duplicate starter guidance because the larger starter-answer chip stays separate from the new compact drawer.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the drawer height and phrase-chip wrapping should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 4
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- If optional writing help exists, keep it in one collapsed drawer instead of scattering multiple helper modules around the answer step.
- Phrase insertion should help the learner start faster without replacing ownership of the final answer.
- Avoid duplicating the stronger first-quest starter-answer support inside the general writing-support drawer.

Next suggested task:

- Add a compact practice-angle switcher on Roleplay so users can choose different prompts inside the same scenario before writing.

## 2026-06-28: Shorter Roleplay Prompt Header

Made one focused Roleplay answer-step polish: the question area now uses one small `Coach asks` label instead of a full `Question` header row with a `1 answer` badge.

Why it changed:

- The first Roleplay screen still had extra header chrome above the prompt.
- Kevin wants the answer box to appear sooner and the practice step to feel less busy.
- Removing the extra badge row keeps the coach question clear while moving the learner closer to the editable answer.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- No feature logic changed; this was a pure hierarchy and spacing polish.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the first viewport should still be checked on a narrow phone.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Preview the first Roleplay screen and, if the answer field is still too low, tighten the outer screen header or first quest cue next.

## 2026-06-28: Compact Foundation Warmup Card

Made one focused Roleplay handoff polish: when the Foundation starter answer is auto-loaded, the warmup card now becomes a compact confirmation row instead of repeating the full starter answer and coach note above the answer box.

Why it changed:

- The first Roleplay already starts with the starter answer in the draft, so repeating the same text above it added clutter.
- Kevin wants the app to guide the learner without showing too many modules at once.
- A compact loaded-state keeps the handoff reassuring while letting the answer box stay central.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- Progress mistake-bank warmups still show the full correction and note, because those are opt-in practice drills.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the compact warmup row should still be checked on a narrow phone.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Preview the first Foundation-to-Roleplay handoff on mobile and tighten the prompt/header area if the answer box is still too low on the screen.

## 2026-06-28: Auto-Loaded Foundation Starter Draft

Made one focused onboarding-to-practice improvement: the first Foundation handoff into `Quest 1: Job Interview` now opens with the level-matched starter answer already loaded into the draft, and the warmup card explains that the learner can edit it before checking.

Why it changed:

- The app already generated a helpful first-answer starter from the selected English level, but the learner still landed on an empty answer box and had to tap again.
- Kevin wants the English MVP to feel guided and habit-forming, which means the first roleplay should start with less friction.
- Auto-loading the starter keeps the level-matched support visible while preserving the user's control to edit the answer.

What went well:

- The change stayed focused in `src/screens/RoleplayScreen.tsx`, `src/utils/roleplayWarmupCue.ts`, `src/types.ts` and one test block in `tests/practiceContent.test.mjs`.
- Progress mistake-bank warmup cues still stay manual, so only the Foundation handoff gets the auto-loaded draft behavior.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the loaded-starter note should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- If the app already knows the learner's first safe answer shape, load it directly into the first roleplay draft instead of asking for another tap.
- Keep auto-applied support specific to onboarding/foundation moments; Progress correction drills should stay opt-in.
- When reducing first-answer friction, make it obvious the loaded text is editable so the learner still feels ownership.

Next suggested task:

- Preview the first Foundation-to-Roleplay handoff on a phone and, if needed, make the warmup card more compact once the starter is already loaded.

## 2026-06-28: Quieter Roleplay Target Preview

Made one focused Roleplay answer-step polish: the daily target preview now appears after `Check answer` as a compact row, instead of interrupting the answer-to-check flow as a fuller card.

Why it changed:

- The learner's main job in the answer step is to type one answer and check it.
- The daily target cue is motivating, but it should not sit between the answer box and the primary action.
- Moving it below the CTA keeps the habit loop visible while making `Check answer` feel like the obvious next tap.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- The preview still uses the existing target helper and progress bar, so no new state or feature logic was added.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the new order should still be checked on a narrow phone.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Preview the full Roleplay answer screen and decide whether the compact target row should become even smaller or disappear until the answer has text.

## 2026-06-28: Quieter Roleplay Bonus Chip

Made one focused Roleplay save-step polish: the collapsed optional bonus turn is now a small chip instead of a wide helper row with body copy and a separate button.

Why it changed:

- The save step should have one obvious main action: `Complete lesson`.
- The optional bonus turn is useful, but it should feel like a secondary choice, not another required task.
- A compact chip keeps the healthy game loop visible without adding more text to the save moment.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- The expanded bonus flow still works when the learner chooses it.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the chip spacing should still be checked on a narrow phone.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Preview the full Roleplay flow on a phone and tighten whichever optional helper still competes most with the primary CTA.

## 2026-06-28: In-Session Daily Target Preview

Made one focused practice-flow improvement: the active Roleplay answer step now shows a compact `Today` preview that tells the learner what today’s target will look like after saving the current lesson.

Why it changed:

- The habit-loop progress previously appeared after save, not while the learner was still writing.
- Kevin wants the Roleplay step to feel connected to streaks and daily progress without turning it into a dashboard.
- Previewing the post-save target state keeps `Check answer` and `Complete lesson` tied to a visible daily goal.

What went well:

- The change stayed focused in `src/utils/practiceCompletion.ts`, `src/screens/RoleplayScreen.tsx` and one test block in `tests/practiceContent.test.mjs`.
- The new helper covers first-sprint, target-complete and extra-practice states, so the copy stays consistent across the loop.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the new `Today` preview box should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- If the learner only earns progress after save, preview that post-save state inside the active lesson instead of waiting for the completion screen.
- Keep habit-loop cues compact and close to the main answer action so they motivate without competing.
- Handle target-already-complete states explicitly so extra practice feels intentional, not like a broken counter.

Next suggested task:

- Add a compact save-step badge that makes it even clearer `Complete lesson` is what locks in today’s target.

## 2026-06-28: Quieter Roleplay Starter Chip

Made one focused Roleplay polish: the first-answer starter reminder is now a small optional chip instead of a full helper row with body text and a button.

Why it changed:

- Kevin wants the practice step to show one obvious action and avoid extra buttons.
- The starter reminder is useful for beginners, but it should feel secondary to typing the answer.
- A compact chip keeps help available without competing with the answer field and `Check answer`.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- The UI still uses existing theme tokens and keeps the starter accessible as a button.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile screenshot QA, so the chip should still be checked on a real narrow phone view.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Continue simplifying the Roleplay answer step by making optional writing support feel like a quiet drawer instead of another visible module.

## 2026-06-28: Compact Roleplay Draft Status

Made one focused Roleplay polish: the live draft-status under the answer box now shows one short status line, the word-count badge and progress, instead of a separate `Draft check` label plus extra explanatory text.

Why it changed:

- Kevin wants the game/practice moment to show one thing at a time so the learner is not confused.
- The draft cue was useful, but it added too much text directly under the answer box.
- A compact HUD-style status keeps `Check answer` as the clear next action while still guiding the learner.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx`.
- No new features, data, dependencies, secrets or backend connections were added.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh phone screenshot QA, so the compact status should still be previewed in Expo on a narrow device.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Preview the Roleplay answer step on a phone and, if needed, make the starter reminder and writing support even more secondary so the input stays the only obvious action.

## 2026-06-28: Live Draft Readiness Cue

Made one focused practice-flow improvement: the Roleplay writing step now shows a live `Draft check` cue under the answer box so the learner can see word count, readiness status, and whether the answer is strong enough before pressing `Check answer`.

Why it changed:

- The Roleplay draft step previously gave no live guidance between an empty answer box and the review screen.
- Kevin wants the English MVP loop to feel guided and habit-forming, which means the writing step should coach the learner before the first submit, not only after it.
- A compact readiness cue makes the next action clearer without adding a new screen, new storage, or new backend logic.

What went well:

- The change stayed focused in `src/screens/RoleplayScreen.tsx` with one small helper in `src/utils/answerReadinessCue.ts`.
- The cue reuses the existing answer-review thresholds, so the live guidance matches the later feedback gate instead of inventing a second rule set.
- Added focused coverage in `tests/practiceContent.test.mjs` for empty, too-short and strong-answer states.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- The first test run failed because two expected word-count values in the new test were off; fixing those assertions resolved it.
- This run did not include fresh Expo/mobile visual QA, so the new readiness box should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- If the app already has answer-readiness rules, expose them live in the draft step before adding new review mechanics.
- Keep writing guidance compact and attached to the answer box so it feels like coaching, not another lesson card.
- When a new cue depends on counts or thresholds, test exact output strings to catch mismatched assumptions quickly.

Next suggested task:

- Show today's daily-target sprint progress inside the active Roleplay step so the current answer feels connected to the habit loop before save.

## 2026-06-28: Quieter Progress Mistake Queue

Made one focused Progress mistake-bank polish: queued corrections now read as saved for later instead of competing with the active correction.

Why it changed:

- The active mistake drill should be the one clear correction the learner acts on.
- Queue badges previously said `Next`, which made the waiting list feel like another immediate action.
- Renaming queued corrections to `Later` and `saved for later` keeps the queue useful but visually and mentally secondary.

What went well:

- The change stayed focused in `src/utils/progressMistakeBankQueue.ts`, `src/screens/ProgressScreen.tsx` and the related test.
- The active drill behavior did not change; only the queue framing changed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- The first test run failed because one assertion still expected the old body copy; updating the assertion fixed it.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Mobile-preview the Progress screen and tighten only if the mistake queue badges or saved-for-later text wrap awkwardly.

## 2026-06-28: Clearer Completion Daily Target Badge

Made one focused Roleplay completion polish: after saving a lesson, the completion hero now shows the daily target state as a human action label like `One more sprint today`, `2 sprints left today` or `Daily target complete`.

Why it changed:

- Onboarding asks the learner to commit to a daily practice target, but the first completion state only showed a numeric `1/2 done` badge.
- Kevin wants the day-one habit loop to stay obvious after the first win.
- A short target-status badge keeps the completion screen simple while making the next action clearer.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx` and reused existing milestone copy instead of adding a new component.
- The badge still uses the existing design tokens and turns success-colored when the daily target is complete.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include live Expo/mobile screenshot QA, so the longer badge labels should still be checked on small phones.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Tighten the Progress mistake-bank section so it shows one active drill first and keeps the queue visually secondary.

## 2026-06-28: Onboarding Commitment Footer

Made one focused onboarding improvement: once the learner selects a starting level, the footer now switches from a generic `Continue` prompt to a concrete first commitment with a level-matched CTA and day-one practice note.

Why it changed:

- The onboarding screen already previewed the path, but the final action still ended on a generic button and hint.
- Kevin wants the MVP loop to feel guided and habit-forming, which means the last onboarding moment should say exactly what starts next.
- Tying the CTA to the chosen level and daily target makes the first commitment feel more intentional without adding another onboarding step.

What went well:

- The change stayed focused in `src/utils/onboardingPlan.ts`, `src/screens/OnboardingScreen.tsx` and one onboarding test block.
- The onboarding helper now generates reusable commitment copy, a shortened quest label and a level-matched CTA, so the screen does not hardcode `Job Interview` or `Continue`.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the longer footer note and CTA should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- If onboarding already explains the path, the final CTA should restate the exact first commitment instead of falling back to generic copy.
- Keep day-one motivation inside the existing onboarding screen before adding any new step or modal.
- Reuse helper-generated quest labels in the UI instead of hardcoding scenario names in multiple places.

Next suggested task:

- On the first saved Job Interview completion state, show how many daily-target roleplays remain so the day-one habit loop stays visible after the first win.

## 2026-06-28: Tighter Progress Latest Win Card

Made one focused Progress design improvement: when a saved session has a coach target, the `Latest win` card now leads with one `Next correction` panel and moves the saved answer into a quiet one-line context row.

Why it changed:

- Progress should reinforce one correction, not feel like a report with answer preview, summary and coaching target competing.
- Kevin wants the app to guide the learner toward the next useful action with less text.
- Putting the correction first keeps the loop consistent with Roleplay's one-step feedback style.

What went well:

- The change stayed inside `src/screens/ProgressScreen.tsx` and only adjusted the latest-win card hierarchy.
- Legacy sessions without a stored coach target still show the older preview and feedback summary fallback.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include live Expo/mobile screenshot QA, so the new answer context row should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Tighten the Progress mistake-bank section so it shows one active drill first and keeps the queue visually secondary.

## 2026-06-28: Progress Next-Step Status Badge

Made one focused Progress design improvement: the main next-step card now shows a compact status badge such as `First save`, `Guided path`, `Back on path`, `Target done` or `Optional replay`.

Why it changed:

- The Progress card already chose the next roleplay, but it did not quickly explain what kind of next step it was.
- Kevin wants the app to take charge, so the card should say whether the user is following the guided path or doing an optional replay.
- A small badge improves clarity without adding another card or more body text.

What went well:

- The change stayed focused in `src/utils/progressNextStep.ts`, `src/screens/ProgressScreen.tsx` and one test section.
- The card now uses status language instead of another XP badge, making the next action easier to understand.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include live mobile screenshot QA, so the new badge should still be checked for wrapping on small phones.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Tighten the Progress latest-win card so the repeated coaching target feels like one clear correction, not another report section.

## 2026-06-28: Progress Coaching Focus Carryover

Made one focused Progress improvement: each newly saved roleplay session now stores its strongest next coaching target, and the Progress screen repeats that target inside the `Latest win` card.

Why it changed:

- The Roleplay coach step already showed one clear `Next move`, but that instruction disappeared once the learner left the session.
- Kevin wants the English MVP loop to feel guided and habit-forming, which means the user should see the same correction again when deciding what to practice next.
- Persisting one local coaching target keeps Progress useful as a follow-up coach without adding backend logic or another screen.

What went well:

- The change stayed focused in the local session model, storage normalization and the Progress latest-win UI.
- Existing stored sessions remain compatible because the new coaching fields are optional and normalize safely when missing.
- Added focused test coverage for saved coaching-focus persistence and legacy-session storage reads.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the new `Carry this next` panel should still be checked on a narrow phone viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- If the app already gives one coaching instruction in-session, persist that instruction instead of generating a different one elsewhere.
- Keep Progress focused on one repeated correction, not a broader feedback recap.
- When extending local session data, preserve backward compatibility for older stored records.

Next suggested task:

- Add one compact path-status badge to the Progress next-step card so users can see whether they are resuming the guided path or doing an optional replay.

## 2026-06-28: Shorter Roleplay Save CTA

Made one focused Roleplay save-step copy improvement: the primary save button now says `Complete lesson` instead of repeating XP inside the button label.

Why it changed:

- The save card already shows XP in a separate badge, so the button did not need to repeat it.
- Shorter CTA text is easier to scan and less likely to wrap on mobile.
- This supports Kevin's direction that the app should feel guided with one obvious next action.

What went well:

- The change stayed in `src/utils/practiceCompletion.ts` with one matching test update.
- The visible reward remains through the XP badge while the main action is cleaner.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include live Expo/mobile screenshot QA.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Use mobile preview to inspect the whole save step and only adjust spacing if the XP badge, button or bonus row wraps awkwardly.

## 2026-06-28: Quieter Roleplay Bonus Row

Made one focused Roleplay save-step polish: the collapsed optional bonus-turn row is now quieter, shorter and more mobile-friendly.

Why it changed:

- The save step already made `Complete lesson` the primary action, but the optional bonus row still had a long CTA and strong border.
- Kevin wants the app to guide the user instead of presenting equal choices.
- A shorter `Try bonus` action keeps the extra practice available without competing with lesson completion.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx` and only adjusted the collapsed optional row.
- The row now uses a calmer border/background, one-line helper copy and a smaller button width.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run still did not include live mobile screenshot QA, so the save step should be checked visually in Expo when possible.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Preview the Roleplay save step on a phone viewport and then tighten only if the bonus row or XP badges wrap awkwardly.

## 2026-06-28: Simpler Roleplay Save Prompt

Made one focused practice-flow improvement: the Roleplay review step now presents one primary `Complete lesson` action first, while the optional follow-up stays collapsed as a compact bonus-turn row until the learner chooses it.

Why it changed:

- The review step still asked the learner to process a full save panel and a full optional follow-up panel at the same time.
- Kevin wants the app loop to feel more guided, polished and habit-forming, which means one obvious finish action should win visually.
- Keeping the bonus turn available but quieter preserves the extra practice without slowing down lesson completion.

What went well:

- The change stayed focused in `src/screens/RoleplayScreen.tsx` and `src/utils/practiceCompletion.ts` with one small test update in `tests/practiceContent.test.mjs`.
- The save card now leads with XP and one clear completion CTA, and the bonus turn only expands after the learner opts in or already typed a follow-up.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the collapsed bonus-turn row should still be checked on a narrow phone width.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- In the lesson-finish step, save should stay primary and optional practice should stay collapsed until invited.
- Bonus practice works better as a compact secondary row than as a second full card competing with completion.
- When tightening the loop, prefer changing visual hierarchy before adding more reward mechanics.

Next suggested task:

- Mobile-preview the updated save step and tighten the collapsed bonus-turn row if the CTA wraps on smaller phones.

## 2026-06-28: Simpler Roleplay Completion Reward

Made one focused Roleplay completion design improvement: the saved lesson screen no longer shows a separate `Habit progress` card after the career path card.

Why it changed:

- The completion state should feel like one reward and one next step, not a small dashboard.
- Kevin wants less text while the user is in the game loop.
- Daily progress and streak are still visible, but now as compact reward badges near the XP badge.

What went well:

- The change stayed inside `src/screens/RoleplayScreen.tsx` and removed visual clutter without changing saved-session behavior.
- The completion screen now keeps the next lesson card and continue button closer together.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include live Expo screenshot QA, so badge wrapping should still be checked on narrow phone widths.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Simplify the finish/save prompt before completion so it has one main save action and the optional follow-up feels visually secondary.

## 2026-06-28: Simpler Roleplay Feedback Focus

Made one focused Roleplay feedback design improvement: after checking an answer, the first feedback card now leads with one clear `Next move` instead of showing the summary, best area, next area and answer preview as equal-weight text.

Why it changed:

- Kevin wants the practice flow to feel simpler and less confusing, especially while the user is actively playing.
- The feedback snapshot was useful, but it still asked the learner to scan too many items before knowing what to do next.
- A single coach instruction makes the app feel more guided and more game-like without adding a new feature.

What went well:

- The change stayed focused on the Roleplay feedback snapshot and its helper copy.
- The summary still exists as fallback, but snapshot users now see one primary coaching action first.
- The learner's original answer is reduced to a one-line proof point under the main instruction.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include live mobile screenshot QA, so the new one-line answer preview should still be checked in Expo on a narrow phone.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Simplify the saved completion screen in the same spirit: one reward, one next lesson, one continue button.

## 2026-06-28: Actionable Roleplay Feedback Snapshot

Made one focused AI feedback UI improvement: the Roleplay coach step now restates the learner's answer in a compact preview and highlights the single clearest next move beside the strongest and weakest score areas.

Why it changed:

- The review state already showed a summary, score and rewrite, but it still asked the learner to mentally remember what they had just written.
- Kevin wants the practice loop to feel guided and habit-forming, which means each coach screen should turn into one obvious action.
- A compact answer snapshot makes the feedback feel more concrete without adding another screen or more navigation.

What went well:

- The change stayed focused in `src/screens/RoleplayScreen.tsx` with one new helper in `src/utils/feedbackSnapshot.ts`.
- The new snapshot keeps the original answer, best area and next focus in one visible block before the learner opens detailed scores.
- Added a focused helper test in `tests/practiceContent.test.mjs` so the coach snapshot stays concrete and concise.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/mobile visual QA, so the new feedback snapshot should still be checked on a narrow phone layout.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Feedback becomes more useful when the learner can see their own answer and the next correction in the same glance.
- Keep the first coach step concrete and compact; hide the full score breakdown behind an optional details toggle.
- When improving feedback UI, prefer one clear next move over adding more summary copy.

Next suggested task:

- Carry the latest `Next move` coaching focus into Progress so the learner sees one repeated skill target across sessions.

## 2026-06-28: Path-Aware Progress Next Step

Made one focused Progress improvement: the main next-step card now uses the same guided career path as Home, Practice and Roleplay instead of choosing the next roleplay from simple library order.

Why it changed:

- Progress still used a list-order next-step helper, so it could recommend the wrong lesson after someone practiced out of sequence.
- The rest of the app already treats the English MVP as one guided path, and Progress should reinforce the same loop.
- A path-aware next step makes the screen more useful as a coach, not just a history summary.

What went well:

- The change stayed focused in `src/utils/progressNextStep.ts` and reused `createPracticeCareerPath` instead of adding new state or another recommendation model.
- Progress now returns learners to the earliest missing roleplay when they save an off-path session, and the completed-target state names the actual optional next sprint.
- Added focused coverage for in-sequence, off-path and daily-target-complete progress states in `tests/practiceContent.test.mjs`.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run changed guidance logic only, so it did not include fresh Expo/mobile visual QA of the Progress screen copy length.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Progress recommendations should always reuse the same guided path model as other screens.
- If a learner practices out of sequence, coach them back to the earliest missing lesson instead of continuing list order.
- Prefer tightening loop consistency through shared helpers before adding another motivational UI surface.

Next suggested task:

- Add one compact path-status badge to the Progress next-step card so users can see whether they are resuming the guided path or replaying after completion.

## 2026-06-28: Compact Roleplay Habit Progress

Made one focused Roleplay completion polish: the `Habit progress` card now uses a compact header with badges, tighter spacing and one-line title/body text.

Why it changed:

- The saved completion screen was becoming a stack of reward and progress cards.
- Kevin wants the app to feel guided and game-like without forcing users to read too much.
- Habit progress is useful, but it should not push the main next-action button too far down.

What went well:

- The change stayed inside `RoleplayScreen` and only adjusted the saved completion layout.
- The card still shows today's progress, streak and progress bar, but takes less vertical space.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile screenshot QA, so the completion stack should still be checked at phone width.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Completion progress details should be compact after the main reward and path card.
- One-line support copy is enough when the progress bar already communicates state.
- Keep shrinking repeated reward UI before adding new completion effects.

Next suggested task:

- Mobile-preview the Roleplay completion stack and decide whether the level-up card should also become a compact row.

## 2026-06-28: Cleaner Roleplay Completion Next Step

Made one focused Roleplay completion simplification: when career-path progress is available, the saved screen no longer shows a separate `Next lesson` card before the `Career path` card.

Why it changed:

- The success state had started to repeat the same next lesson in two stacked cards.
- Kevin wants the game flow to feel obvious and not text-heavy.
- The `Career path` card already explains the next unlock and progress, so the extra card was visual clutter.

What went well:

- The change stayed inside `RoleplayScreen` and removed duplicate UI without changing product behavior.
- The saved completion state is shorter and should keep the primary continue button closer on mobile.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile screenshot QA, so the saved completion state still needs a phone-width visual check.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Completion screens should not repeat the next lesson in multiple cards.
- If the path card exists, it should own the next-step explanation.
- Keep reward screens short enough that the next action stays visible.

Next suggested task:

- Mobile-preview the saved Roleplay completion screen and tighten the habit-progress card if it still pushes the CTA too low.

## 2026-06-28: Path-Aware Roleplay Completion

Made one focused practice-flow improvement: after a roleplay is saved, the success state now shows career-path progress and recommends the next lesson from the actual unlocked sequence instead of simply moving to the next item in the library order.

Why it changed:

- The saved screen already showed XP, streak and habit progress, but it did not show how the lesson advanced the overall English career path.
- If a learner practiced out of sequence, the old completion CTA could point to a different roleplay than the guided path, which weakened the app-led loop.
- A compact path-progress block makes the next action feel earned and keeps the MVP closer to a businesslike streak-and-level practice system.

What went well:

- The change stayed focused inside `RoleplayScreen` and `practiceCompletion` helpers, reusing the existing `createPracticeCareerPath` model instead of adding new state.
- The saved completion CTA is now path-aware, so the success screen and guided roleplay sequence stay aligned even after off-path practice.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- The completion helper now has focused coverage for in-progress and fully completed path states.

What went wrong:

- This run did not include fresh Expo/browser mobile visual QA, so the saved completion hero should still be checked on a phone-sized viewport for vertical length.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Completion states should confirm progress in the broader career path, not only the single saved answer.
- Reuse the existing path helper when choosing the next recommended roleplay so guidance stays consistent across screens.
- When adding motivational UI, keep it inside the current flow instead of creating another screen or navigation step.

Next suggested task:

- Mobile-preview the saved roleplay completion state and tighten spacing if the new path-progress block pushes the CTA too low.

## 2026-06-28: Compact Onboarding Path Preview

Made one focused onboarding simplification: after a level is selected, the first-path preview now uses one compact `Next path` row instead of two separate lesson/quest cards.

Why it changed:

- Kevin wants the app to take charge and reduce early confusion.
- The previous preview was useful but still asked the learner to scan multiple stacked cards before continuing.
- One path row keeps the sequence clear: learn the sentence first, then use it in the Job Interview.

What went well:

- The change stayed inside `OnboardingScreen` and reused existing theme tokens.
- The onboarding card is shorter without removing the level, daily rhythm or starter-answer context.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh Expo/browser mobile visual QA, so the one-line path title should still be checked at phone width.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Onboarding previews should feel like a route sign, not a mini dashboard.
- Keep one visible sequence and one starter example before Continue.
- If path copy wraps awkwardly on mobile, shorten the title instead of adding another card.

Next suggested task:

- Mobile-preview the selected-level onboarding state and tighten the `Next path` row if the title wraps or competes with the Continue button.

## 2026-06-28: Compact Onboarding Target Selector

Made one focused onboarding layout polish: the daily-target selector now uses compact `1/day`, `2/day`, `3/day` labels and keeps the explanatory target note to one line.

Why it changed:

- The daily-target choice is useful, but onboarding should still feel fast and guided.
- The previous selector used two-line labels and more vertical height, which risked making the first-run screen feel too tall.
- The accessibility labels still spell out the full roleplay target, so the visual label can stay short.

What went well:

- The change stayed inside `OnboardingScreen` and reused existing theme tokens.
- The daily rhythm card is shorter without removing the choice.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile visual QA, so the compact selector should still be checked at phone width.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Onboarding personalization should be compact: useful choices, short labels, no extra reading.
- Keep full meaning in accessibility labels when visual labels need to stay small.
- If a selector is secondary to the main level choice, make it visually lighter than the level cards.

Next suggested task:

- Mobile-preview onboarding after selecting a level and decide whether the plan preview steps should collapse into one "Next path" row.

## 2026-06-28: Onboarding Daily Target Selection

Made one focused onboarding improvement: first-run users can now choose a daily roleplay target during onboarding, and that target is saved immediately before they enter the Foundation lesson.

Why it changed:

- The app already had local daily targets, but new users only discovered that setting later in Profile.
- Bringing the target into onboarding makes the streak and mission loop feel intentional from the first session.
- The onboarding plan preview now reflects both the selected English level and the chosen daily practice rhythm.

What went well:

- The change stayed small across onboarding UI, the onboarding preview helper and the existing local daily-target storage flow.
- The onboarding plan card now gives one clearer habit commitment: level, first path and daily pace in one place.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/browser mobile visual QA, so the new onboarding target selector should still be checked on a phone-sized viewport for height and tap comfort.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Put habit settings in the first-run flow when they shape the rest of the loop.
- Reuse existing local settings and storage instead of creating separate onboarding-only state.
- Keep onboarding personalization compact: one level choice, one target choice, one preview of the first path.

Next suggested task:

- Mobile-preview the onboarding daily-target card at phone width and trim the layout if the selector makes the first screen feel too tall.

## 2026-06-28: Compact Foundation Rail Labels

Made one focused Foundation rail polish: the three-slot sentence rail now uses short status labels (`Done`, `Tap`, `Next`) instead of placing long sentence fragments inside narrow mobile slots.

Why it changed:

- The previous rail made progress clearer, but long action/result phrases could truncate awkwardly on phone widths.
- The large tap card already shows the active sentence piece, so the rail can stay focused on progress state.
- Short labels make the lesson feel cleaner and easier to understand at a glance.

What went well:

- The change stayed inside `FoundationScreen` and only adjusted rail copy/layout.
- The rail is shorter, centered and less likely to overflow on mobile.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run still did not include a live 390px screenshot, so the rail should be visually checked in Expo/web.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep narrow progress rails for state, not long content.
- Put the full learning sentence in the large active area where it has room.
- Mobile-first lesson UI should prefer short labels over truncated copy.

Next suggested task:

- Mobile-preview Foundation Step 1 and decide whether the main tap card can become slightly more animated or reward-like after each tap.

## 2026-06-28: Foundation Sentence Rail

Made one focused Foundation polish: Lesson 1 now shows a compact three-slot sentence rail for `I`, `action` and `result`. Completed parts fill in as the learner taps, the current part is highlighted, and the old separate preview block was removed so the lesson stays inside one clear card.

Why it changed:

- Foundation already used taps, but the learner needed a stronger visual sense of building the sentence.
- The rail makes the lesson feel more game-like and guided without adding choices or another screen.
- The disabled CTA now says exactly which block to tap next instead of the generic `Tap the 3 blocks first`.

What went well:

- The change stayed inside `FoundationScreen` and reused existing theme tokens.
- The first lesson now has clearer progress while preserving one main action: tap the active block.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile visual QA, so the three-slot rail should still be checked on narrow phone widths for truncation.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Foundation should feel like building, not reading.
- Keep all first-lesson progress inside one card so the user does not scan multiple sections.
- Disabled CTAs can still guide the next tap with concrete copy.

Next suggested task:

- Mobile-preview Foundation Step 1 at 390px and tune the rail text if long action phrases truncate awkwardly.

## 2026-06-28: Focused Practice Next Path

Made one focused Practice improvement: the Practice tab now leads with one recommended next roleplay and keeps the rest of the library hidden behind a quiet `Show list` action. The off-path `Exam Speaking` card was removed so the screen stays aligned with the English career-conversation MVP.

What went well:

- The change reused the existing `createPracticeCareerPath` sequence instead of inventing another recommendation model.
- `src/utils/practiceLibraryState.ts` now gives the screen one testable state shape for the recommended card and the hidden library list.
- The Practice tab now feels more app-led: one `Do this now` card first, with the full library available only on request.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh mobile visual QA, so the collapsed and expanded Practice states should still be checked on a phone-sized viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep the Practice tab centered on one recommended next conversation, not a full library first.
- Reuse the existing guided path helpers before adding another recommendation system.
- Remove off-positioning practice cards instead of trying to explain them with UI copy.

Next suggested task:

- Mobile-preview the closed and expanded Practice library states and trim spacing if the toggle starts to compete with the main recommended card.

## 2026-06-28: Collapsed Progress Mistake Bank

Made one focused Progress simplification: the Mistake Bank queue now shows one queued correction by default and hides the rest behind a quiet `Show all` toggle.

Why it changed:

- Progress was still drifting toward a list view, while the product principle says one active correction should lead.
- The full mistake bank is useful, but it should not compete with the current correction drill.
- This keeps the screen more app-led without removing access to the saved corrections.

What went well:

- The change stayed inside `ProgressScreen` and reused existing card, badge, button and theme tokens.
- The queue is now calmer by default: one correction visible, the rest intentionally hidden until needed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile visual QA, so the collapsed and expanded Mistake Bank states should still be checked on a phone-sized viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Progress should coach one fix first, then reveal lists only on request.
- A quiet toggle is better than showing multiple correction cards by default.
- Keep mistake-bank copy short so the active correction remains the main action.

Next suggested task:

- Mobile-preview the collapsed Mistake Bank and tune the `Show all` row if it feels like another primary CTA.

## 2026-06-28: Roleplay Level-Up Moment

Made one focused completion polish: the saved Roleplay success state now detects when the newly saved session crosses an XP level boundary and shows one compact `Level up` reward card with the new level and total XP.

Why it changed:

- The completion screen already saved XP and streak progress, but crossing a level should feel like a small game-like reward.
- This keeps the user inside the guided loop without adding another button, screen or feature.
- The reward uses the same local XP model as Home, so level language stays consistent.

What went well:

- The change stayed focused inside `RoleplayScreen` and reused `createDailyMission` plus `createLevelProgress`.
- The level-up card only appears when a real level boundary is crossed, so normal saves stay simple.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile visual QA, so the saved-answer completion screen should still be checked with and without a level-up state.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Completion rewards should be conditional and compact, not another permanent card on every save.
- Reuse the same XP and level helpers across Home and Roleplay so the gamification model stays coherent.
- Keep the reward close to the existing success hero rather than adding another navigation step.

Next suggested task:

- Mobile-preview the saved-answer completion state with and without level-up, then tune vertical spacing if the CTA sits too low.

## 2026-06-28: Home Level Progress Rail

Made one focused habit-loop improvement on Home: the main `Do this now` start card now includes a compact level-progress rail that shows the learner's current level, XP progress inside the level, total XP, and how many XP remain until the next level.

What went well:

- This reused the existing local XP model instead of adding new state, storage or another screen.
- The level cue now sits beside the primary next action, so progress feels motivating without weakening the `Start` CTA.
- A small helper in `src/utils/levelProgress.ts` keeps the math and copy testable and easy to reuse later.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile visual QA, so the new level rail should still be checked on a phone-sized viewport for wrapping and contrast.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Reuse the existing XP model before inventing new progression systems.
- Put motivation cues beside the main next action, not in a separate dashboard card.
- Keep level language compact and businesslike so the app stays professional.

Next suggested task:

- Add a small level-up moment on the saved-answer completion screen when a roleplay crosses the next XP threshold.

## 2026-06-28: Single Roleplay Handoff Cue

Made one focused Roleplay simplification: when a Foundation or Progress warm-up cue is present, the separate `First quest` banner is hidden. The learner now sees one guidance card before the question instead of two competing cues.

What went well:

- This directly reduces first-run visual crowding after preserving the Foundation starter cue through Home.
- The change stayed inside `RoleplayScreen` and only affects cue visibility.
- Warm-up cues remain the stronger context because they include the exact starter sentence or correction.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile visual QA, so the Roleplay first viewport should still be checked in the local preview.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- If a specific warm-up cue exists, do not also show generic first-quest guidance.
- Prioritize the card that tells the learner exactly what to do next.
- One guidance cue before the answer box is the ceiling for first-run Roleplay.

Next suggested task:

- Mobile-preview the Home-to-first-interview screen and decide whether the warm-up cue itself should be shortened further.

## 2026-06-28: Home First Interview Starter Cue

Made one focused handoff polish: when Home opens the first Job Interview after Foundation is complete and before any interview answer is saved, `AppNavigator` now automatically attaches the same level-matched Foundation warm-up cue. The starter survives leaving Foundation, while explicit warm-up cues from Progress still take priority.

What went well:

- This keeps the app-led first interview flow consistent even if the learner returns to Home before starting.
- The change stayed small inside `AppNavigator` and reused the existing `createFoundationWarmupCue` model.
- The cue only appears for the first Job Interview after Foundation completion, so later practice stays quieter.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile visual QA, so the Home-to-Roleplay first interview cue should still be checked in the local preview.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- First-run guidance should survive route changes, not only direct button handoffs.
- Prefer adding automatic context in the navigator over duplicating first-run UI in screens.
- Explicit Progress warm-up cues should always override default Foundation starter cues.

Next suggested task:

- Mobile-preview the Home-to-first-interview path and confirm the warm-up cue, first quest cue and answer box still fit comfortably.

## 2026-06-28: Foundation Interview Starter Handoff

Made one focused practice-flow improvement: finishing Foundation now opens the first Job Interview with a level-matched warm-up cue already attached. The Roleplay screen reuses the existing warm-up pattern to show the starter line and coach note from Lesson 1, so the first English answer feels easier to begin immediately after the handoff.

What went well:

- This stayed small by extending the existing warm-up cue model instead of adding a new screen or another onboarding step.
- The handoff now carries the actual level-based starter answer and coach note the learner just practiced in Foundation.
- The warm-up cue type is now generic enough to support both Progress corrections and Foundation handoffs cleanly.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh mobile visual QA, so the Foundation handoff cue should still be checked on a phone-sized viewport for height and emphasis.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- When one guided step leads into another, pass the actual starter content forward instead of leaving it implicit.
- Keep warm-up cues generic so the same UI can support multiple entry paths without new screen states.
- Preserve the answer-first layout even when adding a stronger handoff cue.

Next suggested task:

- Show the same level-matched starter cue when Home opens the first Job Interview before the first saved interview, so the hint survives leaving Foundation.

## 2026-06-28: Collapsed Feedback Details

Made one focused Roleplay feedback polish: the feedback card now keeps the overall score, summary, quick read and `Better English` rewrite visible, while the score bars and strengths/improvements lists are collapsed behind a quiet `Show details` row by default. This keeps the feedback useful without making the first view feel like a report.

What went well:

- This directly reduces the visual weight created by the expanded feedback card.
- The primary loop stays clear: read the coach summary, use the better sentence if needed, then save.
- The detailed score content is still available for users who want it.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile visual QA, so the collapsed and expanded feedback states should still be checked in the local preview.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Keep the coach summary and rewrite visible; collapse analytical detail by default.
- Use one quiet disclosure row for optional detail instead of stacking every feedback element immediately.
- If feedback grows again, protect the answer, rewrite and save loop first.

Next suggested task:

- Mobile-preview the collapsed feedback card and tune the `Show details` row if it still feels like too much interaction.

## 2026-06-28: Follow-Up Starter Action

Made one focused Roleplay bonus-turn polish: the optional follow-up now has a one-tap `Use starter` action that opens the follow-up field with an editable starter sentence. The starter is generated by the existing adaptive follow-up prompt logic, so the bonus turn feels easier to begin without adding another screen or extra choice.

What went well:

- This improves the bonus XP loop by removing the empty follow-up field problem.
- The change stayed focused across `RoleplayScreen`, `followUpPrompt` and one existing test.
- The starter sentence is part of the follow-up prompt contract, so it can be reused and tested.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile visual QA, so the optional follow-up block should still be checked in the local preview.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Bonus turns should start with help, not a blank field.
- Keep optional practice edit-friendly and one tap away.
- Add starter copy to the utility contract instead of hardcoding it in the screen.

Next suggested task:

- Mobile-preview the expanded Roleplay feedback and optional follow-up stack to decide whether score details should become collapsible.

## 2026-06-28: Visible Roleplay Coach Feedback

Made one focused AI feedback UI improvement: the Roleplay coach step now shows the actual local feedback summary, score breakdown, strongest area, next focus, and the generated strengths/improvements lists before the rewrite. This makes the mock coach feel useful instead of only showing a better sentence.

What went well:

- This closes a real MVP gap because the app was already computing scores, strengths and improvements but not surfacing them on the main feedback step.
- The change stayed focused on one screen, with one small helper in `src/utils/feedbackScoreSummary.ts` to keep the score summary logic reusable and testable.
- The feedback card still preserves the simple loop: review, optionally use better English, then save.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh mobile visual QA, so the new feedback card height and spacing should still be checked on a phone-sized viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- If the app computes coach feedback details, show them in the core practice loop instead of hiding them in data only.
- Keep feedback structured as summary, strengths, improvements, rewrite and one next action.
- Preserve the score/XP motivation cues without adding another screen.

Next suggested task:

- Add a one-tap starter for the optional follow-up turn so the bonus answer is easier to begin.

## 2026-06-28: Focused Roleplay Save Step

Made one focused Roleplay feedback polish: after the learner taps `Use better English` and checks the improved answer again, the feedback card no longer repeats the same secondary action. The next visible action becomes the `Save answer` card, which keeps the loop clearer: answer, improve, save.

What went well:

- This removes a repeated choice instead of adding another button.
- The change stays local to `RoleplayScreen` with one small state flag for whether the better rewrite has already been applied.
- Manual edits, starter help and warm-up starters reset the flag, so the helper action can return when it is useful again.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile visual QA, so the post-rewrite feedback/save state should still be checked in the local preview.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- After a learner applies the rewrite, stop offering the same rewrite action again.
- Preserve one clear next action per roleplay state, especially around feedback and save.
- Reset helper state when the learner edits or uses another starter path.

Next suggested task:

- Mobile-preview the full answer, feedback, use-rewrite and save loop to confirm the card stack feels simple on a 390px viewport.

## 2026-06-28: Better English Retry Action

Made one focused Roleplay feedback polish: when feedback is ready, the secondary feedback action now says `Use better English` and moves the suggested rewrite back into the answer box. This replaces the vague `Try again` action with a clearer one-tap improvement loop.

What went well:

- The feedback step now tells the learner exactly what to do with the better sentence.
- This keeps the screen simple by changing one existing action instead of adding another button.
- The change stayed inside `RoleplayScreen` and reused existing feedback data, `AppButton` and theme tokens.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include fresh mobile visual QA, so the feedback card should still be checked in the local preview.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Feedback actions should be specific: tell the learner how to use the rewrite, not just to try again.
- Prefer replacing vague buttons over adding more buttons.
- Keep the roleplay loop as answer, check, use better English, save.

Next suggested task:

- Preview the feedback state on mobile and consider making `Save answer` the only primary action after the learner uses the better English rewrite.

## 2026-06-28: Progress Warm-Up Answer Starter

Made one focused practice-flow improvement: when the learner opens a Roleplay from the active Progress correction card, the warm-up cue now includes a one-tap `Use this line` action that drops the saved correction into the answer box. The generic first-interview starter helper is also suppressed for this case, so the learner sees one relevant coaching action instead of two competing prompts.

What went well:

- This makes the mistake-bank-to-roleplay handoff more usable without adding a new screen, state model or storage path.
- The change stayed small by extending the existing `RoleplayWarmupCue` shape and reusing the current `RoleplayScreen` draft-answer flow.
- A focused test now covers the reusable warm-up cue contract, and `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/browser mobile visual QA, so the warm-up cue spacing and button placement should still be checked on a phone-sized viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- When Progress sends a saved correction into Roleplay, turn it into the default coaching action instead of showing a second generic helper.
- Reusing an existing correction as the first sentence is a stronger habit loop than only displaying the sentence as static review text.
- Keep correction-to-practice handoffs one tap away and avoid adding another layer of navigation.

Next suggested task:

- Add a one-tap `Use better English` action on the feedback step so learners can retry with the suggested rewrite immediately.

## 2026-06-28: Compact Roleplay Starter Help

Made one focused Roleplay polish: the first Job Interview starter help is no longer a full text block before the answer field. It now appears as a compact helper row after the answer box, with one small `Use starter` action. This keeps the first viewport closer to the simple flow: question, answer, check.

What went well:

- The first quest cue remains visible, but the starter answer no longer competes with the main task.
- The user still has a shortcut if they are stuck, and tapping it fills the same starter answer as before.
- The change stayed inside `RoleplayScreen` and reused the existing `AppButton`, spacing, radius, typography and color tokens.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run still did not capture a fresh phone-sized screenshot, so the first Job Interview viewport needs visual confirmation in the browser or Expo Go.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Starter help is useful, but it should sit below the answer field so the learner sees the main task first.
- Do not show full starter answers unless the user asks for help.
- For first-run screens, reduce visible helper copy before adding more guidance.

Next suggested task:

- Preview the first Job Interview on a 390px mobile viewport and tune the vertical spacing if the cue, question and answer field still feel crowded.

## 2026-06-28: First Roleplay Arrival Cue

Made one focused Roleplay polish: the first Job Interview now shows a compact `First quest` arrival cue before the question when there are no saved sessions yet. It reuses the existing guided-start data, shows `0/1 saved`, and keeps the instruction short so the first real practice feels like the next step after Foundation instead of a fresh choice screen.

What went well:

- This connects the Foundation handoff to the first interview without adding a new screen or navigation path.
- The cue is only shown for the initial Job Interview state, so returning practice stays quieter.
- The change reused existing `guidedStart`, `createRoleplayFirstQuestState`, `Badge`, `Card` and theme tokens.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches.

What went wrong:

- This run did not include a fresh phone-sized screenshot, so the first viewport should still be checked for vertical crowding.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- First-run Roleplay should feel like a quest handoff, not a library item.
- Reuse existing guided-intro data before adding new copy.
- Keep first-quest UI compact because the answer field still needs to appear quickly.

Next suggested task:

- Mobile-preview the first Job Interview screen and reduce any vertical crowding around the new first-quest cue, starter reminder and answer box.

## 2026-06-28: Persistent Foundation Resume

Made one focused onboarding/usability improvement: the first Foundation lesson now saves its local progress, resumes from the last completed block, and unlocks the first Job Interview on Home as soon as Foundation is done even before the first saved roleplay. This fixes the first-run loop where the app could treat a finished or in-progress Foundation lesson like a fresh start.

What went well:

- The change stayed local-only and reused the existing AsyncStorage pattern already used for onboarding, sessions, daily target and starting level.
- `FoundationScreen`, `AppNavigator`, `HomeScreen`, `createHomeLearnState` and `createHomeDailyMissionCard` now agree on one source of truth for the first lesson state.
- Home now gives better next-action guidance in two useful edge states: partial Foundation progress and completed Foundation with zero saved sessions.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/browser mobile visual QA, so the resumed Home copy and completed-Foundation first-roleplay state should still be checked on a phone-sized viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Persisting onboarding alone is not enough; the first Foundation lesson must also resume cleanly or the first-run loop feels broken.
- Home coaching copy should change as soon as Foundation unlocks the first roleplay, even before any saved session exists.
- Small local persistence helpers are a safe way to improve usability without adding architecture or integrations.

Next suggested task:

- Add a compact first-roleplay arrival cue on the unlocked Job Interview screen so the transition from Foundation into real practice feels even more continuous.

## 2026-06-28: Progress Latest Win Retry CTA

Made one focused Progress polish: the `Latest win` card now caps the saved answer and coach feedback to two lines, then offers one clear `Retry this scenario` action. This turns a saved result into one-tap practice without adding another destination or more visual noise.

What went well:

- This follows the previous recommendation to connect Progress review back into practice.
- The card now has less text pressure and one useful next action.
- The change stayed inside one screen and reused the existing `AppButton`, `Card`, spacing, typography and color tokens.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- A raw hex scan across `src/screens` and `src/components` returned no matches, so the polish stayed on the design system.

What went wrong:

- This run did not include fresh mobile screenshot QA, so the `Latest win` card should still be checked in the browser/phone preview.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Progress review is strongest when it points the learner back into practice.
- Keep saved answer and feedback copy short when adding an action.
- Use a secondary retry CTA so the top next-step card remains the primary guide.

Next suggested task:

- Mobile-preview Progress and check if `Latest win` plus `Retry this scenario` still fits comfortably below the next-step card.

## 2026-06-28: Compact Progress Correction Queue

Made one focused Progress/Mistake Bank polish: the correction queue now caps its body and correction text to two lines, shows only the first two queued corrections, and summarizes the rest with a quiet count. The active correction still stays above, while the queue feels lighter on mobile.

What went well:

- This keeps the new active correction loop intact while reducing lower-page visual weight.
- The change stayed inside one screen and reused existing `Card`, `Badge`, colors, spacing and typography tokens.
- The user still understands there are more corrections, but does not see a long review stack.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile screenshot QA, so the correction queue should still be checked on a phone-sized viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Mistake Bank should show one active correction and a quiet queue, not a full list.
- Use line limits and item caps before adding new collapse state.
- Keep correction review scannable so Progress still feels like coaching.

Next suggested task:

- Add a `Retry this scenario` CTA to the `Latest win` card so Progress turns the saved answer into one-tap practice.

## 2026-06-28: Active Progress Mistake Queue

Made one focused Progress improvement: the active correction drill now advances to the next unpracticed mistake after the learner marks one as practiced, and the long mistake-bank card list is replaced with a compact correction queue. This keeps Progress coaching one clear English fix at a time instead of repeating the same top mistake and showing a long review stack.

What went well:

- The change fixed a real loop issue: `Mark practiced` now moves the learner forward to the next correction instead of leaving Progress stuck on the same one.
- The new `src/utils/progressMistakeBankQueue.ts` helper keeps the queue order explicit and testable, with upcoming corrections first and practiced ones moved quietly to the end.
- The UI change stayed inside `ProgressScreen` and reused existing `Card`, `Badge` and theme tokens, so the MVP flow stayed simple.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh mobile visual QA, so the new compact queue card should still be checked on a phone-sized viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Progress works better when one correction is active and the rest are visibly queued, not equally loud.
- If a review action says `Mark practiced`, the next state should advance immediately instead of confirming without movement.
- Quiet review summaries can still show progress if upcoming and completed items are visually separated.

Next suggested task:

- Add a `Retry this scenario` CTA to the `Latest win` card so Progress turns review into one-tap practice.

## 2026-06-28: Compact Progress Weekly Chart

Made one focused Progress/Wins design polish: the weekly activity chart is now a quieter muted card with one short label, a lower chart height and softer bars. This keeps the habit signal visible without making the lower Progress page feel like analytics.

What went well:

- This follows the previous recommendation to reduce the weekly chart weight after simplifying the stats strip.
- The change stayed inside one screen and reused existing `Card`, theme colors, spacing and typography tokens.
- The weekly rhythm remains visible, but it now supports the page instead of competing with the next action.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile screenshot QA, so the lower Progress page should still be checked visually.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Progress charts should be habit cues, not analytics blocks.
- If a chart is not the next action, keep its label short and its visual height modest.
- Preserve motivating data, but keep it below the active practice recommendation.

Next suggested task:

- Mobile-preview Progress after one saved session and decide whether the Mistake Bank list should be collapsed to one top correction.

## 2026-06-28: Compact Progress Stats Strip

Made one focused Progress/Wins design polish: the three separate stat cards for minutes, roleplays and fixes are now one compact muted stats strip. This keeps the numbers visible, but makes the page feel less like an analytics dashboard after the coach's next-step card.

What went well:

- This directly follows the prior recommendation to reduce Progress visual weight after the next-step card.
- The change stayed inside one screen and reused existing `Card`, theme colors, spacing and typography tokens.
- The learner still sees useful progress, but the stats now feel secondary to the next action.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile screenshot QA, so the strip should still be checked on a phone-sized viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Progress stats should support motivation, not compete with the next practice action.
- Use one compact stats surface when multiple small cards start feeling like a dashboard.
- Keep detailed charts and review content lower on the page.

Next suggested task:

- Mobile-preview Progress after one saved session and, if it still feels heavy, make the weekly activity chart more compact or optional.

## 2026-06-28: Saved Roleplay Milestone Loop

Made one focused practice-flow improvement: after saving a roleplay answer, the completion hero now shows a compact habit-progress card with today progress, streak, daily-target copy and a short progress bar. This gives the learner an immediate reason to continue while the save moment still feels rewarding.

What went well:

- This uses the existing local progress and completion helpers, so the change stayed small and aligned with the MVP's local-only loop.
- The new `createSavedRoleplayMilestone` helper keeps the post-save progress math testable and avoids double-counting the just-saved session when parent state catches up.
- The saved Roleplay state now surfaces streak and daily-target progress at the exact completion moment, which better supports the habit-forming path.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile visual QA, so the saved completion hero should still be checked on a phone-sized viewport for height and spacing.
- The helper needs one local `@ts-expect-error` comment because the Node test runner requires an explicit `.ts` extension on the runtime import, while Expo TypeScript does not.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- The save moment is a strong place to reinforce streak and daily-target progress, not only the Home or Progress screens.
- Keep completion rewards compact: next lesson and habit progress can live in the same saved-state hero as long as the primary CTA stays obvious.
- When a utility is imported at runtime by Node-based tests, watch for TypeScript extension-resolution mismatches before widening project config.

Next suggested task:

- Mobile-preview the saved Roleplay completion state and, if it feels tall, tighten the next-lesson and habit-progress blocks into one denser reward stack.

## 2026-06-28: Simpler Progress Next Step

Made one focused Progress/Wins simplification: the top next-step card now shows one `Do now` action instead of three numbered guide rows. The explanatory body is capped to two lines so the screen feels more like a coach telling the learner the next move, not a progress report.

What went well:

- This directly addresses the audit note that Progress can feel too dense and analytical.
- The change stayed in one screen and reused existing theme colors, radius, spacing and typography tokens.
- The primary CTA remains unchanged, so the learning flow is safer while the visual hierarchy improves.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile screenshot QA, so the new `Do now` panel should still be checked at phone size.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Progress should coach one next action before showing stats.
- If a progress card has a CTA, avoid showing multiple equal instruction rows above it.
- Keep dense review details lower on the page, after the next action is clear.

Next suggested task:

- Mobile-preview Progress after one saved session and, if it still feels busy, reduce the stat grid or weekly chart weight.

## 2026-06-28: Quiet Home Next Unlock

Made one focused Home simplification: the `Unlocks next` row is now a quiet preview strip with one small `Next` or `Done` node and one lesson title. The old secondary badge was removed so the row feels like future context, not another button or dashboard signal.

What went well:

- This keeps Home aligned with the app-led path: `START` first, habit progress second, next unlock quietly third.
- The change stayed in one screen and reused existing theme colors, spacing, radius and typography tokens.
- The next lesson remains visible, but there is less text and no competing badge.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile screenshot QA, so Home should still be checked visually at phone size.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- The next unlock should reassure the learner, not ask for attention.
- Keep locked/future Home content visually quieter than the active `START` card.
- Avoid badges on secondary preview rows when the label and title are already enough.

Next suggested task:

- Mobile-preview the full Home first viewport now that status, `START`, mission and next unlock have all been simplified.

## 2026-06-28: First Interview Starter Reminder

Made one focused practice-flow improvement: the first unsaved `Job Interview` answer card now shows a compact starter reminder with the learner's level-matched sample answer and a `Use starter` action. The reminder only appears before the learner has typed and disappears for returning interview sessions, so it supports the first answer without adding noise to the wider Roleplay flow.

What went well:

- This directly extends the new Foundation handoff into the exact moment the learner needs help starting.
- The logic stayed small by using one new helper in `src/utils/roleplayStarterReminder.ts` plus a compact panel inside the existing [`/C:/Dev/speakcareer-app/src/screens/RoleplayScreen.tsx`](/C:/Dev/speakcareer-app/src/screens/RoleplayScreen.tsx).
- A focused test now protects the first-time interview-only behavior and level-matched starter copy.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile Expo/browser QA, so the starter reminder height and spacing should still be checked on a phone-sized viewport.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Starter scaffolding is strongest when it appears at the exact answer box, not only in onboarding or Foundation.
- Keep first-time support specific to the initial `Job Interview` run so repeat practice stays clean.
- If a starter helper can prefill the answer safely, hide it once the learner begins typing.

Next suggested task:

- Check the first `Job Interview` viewport on mobile and, if the card stack feels tall, tighten the reminder spacing or move `Use starter` inline.

## 2026-06-28: Compact Home Daily Mission

Made one focused Home simplification: the daily mission card is now a compact goal strip instead of a text-heavy mini dashboard. It shows a small `Goal` or `Done` node, the short mission title, the XP reward and one progress bar. The extra body paragraph, target badge and meta footer were removed from the visible Home UI.

What went well:

- This keeps the big `START` card as the obvious first action while preserving the daily habit loop.
- The change stayed in one screen and reused existing theme colors, spacing, radius, `XPBadge` and `ProgressBar`.
- Removing repeated mission copy makes the first Home viewport easier to scan.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run still did not include fresh mobile screenshot QA, so the compact strip should be checked visually in the browser/Expo preview.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Home can show progress, but it should never feel like a dashboard before the user starts.
- Mission cards should be a habit cue, not another explanation card.
- Keep secondary Home signals to one row plus one progress bar when possible.

Next suggested task:

- Use a mobile preview to check whether the Home first viewport now clearly shows status, `START`, the mission strip and the next unlock without feeling crowded.

## 2026-06-28: Simpler Home Start Card

Made one focused Home design improvement: the animated start card now behaves more like a single obvious game action. It no longer shows a separate `Today` row, lesson meta line or CTA pill. Instead, the card centers the user on one animated `START` target, one lesson title, one short action hint and a small XP reward chip.

What went well:

- This directly supports Kevin's request for a simpler Home screen with less text and clearer app-led instruction.
- The change stayed in one screen and reused the existing theme colors, spacing, radius and badge component.
- The primary action is easier to spot because the animated circle now says `START` instead of the less direct `TAP`.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile screenshot QA, so the larger start target should still be checked at phone size.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Home should feel like one guided start action, not a dashboard.
- If a first-viewport element has multiple text layers, remove the weakest one before adding anything new.
- Keep XP visible as a reward, but small enough that it does not compete with `START`.

Next suggested task:

- Mobile-preview Home and, if the first viewport still feels busy, simplify or collapse the daily mission card under the start action.

## 2026-06-28: Quiet Foundation Handoff Chrome

Polished the completed Foundation lesson handoff area after confirming the handoff content is already compact on this branch. The visible code change makes the Foundation back button smaller and pill-shaped, matching the quieter Roleplay chrome so `Continue to interview` remains the main action.

What went well:

- This kept the foundation-to-roleplay bridge focused on one next action.
- The change stayed in one screen and reused existing theme spacing and radius tokens.
- The handoff card already had two-line starter/coach limits, so no extra text changes were needed.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh mobile browser QA, so the finished Foundation state should still be screenshot-checked.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Foundation handoff should show enough confidence to start the interview, not another long lesson.
- Keep Back visible, but treat it as secondary chrome.
- Keep the starter answer visible but visually secondary to `Continue to interview`.

Next suggested task:

- Mobile-preview the completed Foundation state and, if needed, make the `Continue to interview` button sticky or closer to the handoff.

## 2026-06-28: Foundation-to-Interview Starter Handoff

Made one focused practice-flow improvement: after the learner finishes the Foundation sentence, the screen now shows a compact handoff card for `Quest 1: Job Interview` with a level-matched starter answer and the matching coach note. This makes the first interview response easier to begin before the learner enters Roleplay.

What went well:

- The improvement stayed inside the existing Foundation-to-Roleplay path and reused the existing starting-level profile data.
- A tiny helper now keeps the handoff copy explicit instead of burying it inside the screen.
- The new card gives the learner one concrete next sentence without adding another step or storing new data.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/browser mobile visual QA, so the completed Foundation state still needs a quick phone-sized spacing check.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- The first interview feels easier when the app carries one exact sentence starter from Foundation into the next step.
- Reuse starting-level profiles for scaffolding before inventing new onboarding or practice state.
- Keep handoff support compact and concrete so the learner still reaches the main CTA quickly.

Next suggested task:

- Show the same level-matched starter answer as an optional reminder at the top of the very first Job Interview answer card.

## 2026-06-28: Compact Onboarding Plan Card

Made the onboarding first-path preview more compact after level selection. The plan card now uses tighter padding, a smaller level title, shorter step spacing and two-line limits for coach, step detail and starter text so the `Continue` action has a better chance of staying close on small phones.

What went well:

- This kept the new onboarding reassurance pattern while reducing visual height.
- The change stayed in one screen and reused existing spacing and typography tokens.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- The browser viewport override was reset after the attempted mobile QA.

What went wrong:

- The in-app browser timed out while trying to reset local app storage and reload onboarding, so this run used code inspection instead of a fresh screenshot.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- The onboarding plan preview is useful, but it must stay short enough that the learner still sees the next action quickly.
- Prefer line limits and tighter spacing before removing the reassurance content entirely.
- If browser reset is flaky, avoid making broad visual guesses and keep the code change tiny.

Next suggested task:

- Add a small test or helper state for keeping onboarding plan copy short, then do a fresh mobile screenshot when browser control is stable.

## 2026-06-28: Onboarding Plan Preview

Finished the onboarding level handoff by showing a simple first-path preview after the learner picks a starting level. The preview explains the first two steps, shows the selected level, includes the coach note and gives the first answer starter before the learner continues.

What went well:

- This makes onboarding more app-led: after choosing a level, the user sees exactly what will happen next.
- The preview stays focused on English foundation first, then the first Job Interview quest.
- The helper is covered by a focused test for starter and confident level paths.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- The first check run caught an unfinished helper API mismatch between the screen and test; the current files are aligned and now pass.
- This run did not include fresh mobile browser QA, so the plan card height should be checked on small phones.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Onboarding should reassure the learner with the next two steps, not open a full dashboard.
- Keep the first path concrete: level, one foundation lesson, one interview quest.
- If level-based preview logic grows, keep it in a tiny helper instead of burying it in the screen.

Next suggested task:

- Mobile-preview onboarding after selecting each level and tighten the plan card if the Continue button falls too low.

## 2026-06-27: Prioritized Roleplay Save Action

Made the post-feedback Roleplay flow clearer by moving the primary save button above the optional follow-up prompt. After `Better English`, the learner now sees the save action before the bonus turn, so the main path is easier to understand and the follow-up feels like optional extra practice instead of a competing requirement.

What went well:

- This directly addressed the feedback-card hierarchy without adding a new feature.
- The change stayed in one screen and only reordered existing UI blocks.
- The safer default path is now: read correction, save answer, optionally do bonus follow-up.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh browser visual QA after the reorder, so the post-feedback fold should still be checked on mobile.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- In Roleplay feedback, saving the corrected answer is the main route; follow-up is bonus depth.
- Keep optional practice below the main action unless the user explicitly opens it.
- Reordering existing UI can remove confusion without increasing code complexity.

Next suggested task:

- Mobile-preview the post-feedback state and, if needed, make the optional bonus turn visually lighter than the save section.

## 2026-06-27: Quiet Roleplay Back Button

Verified the Roleplay first viewport at a mobile `390x844` size in the in-app browser. The answer field and disabled `Check answer` button are visible above the fold, with the button ending around y=464, so the main practice action is reachable without scrolling. Then made the Roleplay back button smaller and pill-shaped so it remains available without competing with the coach prompt.

What went well:

- Browser QA confirmed the previous answer-card compaction worked before adding more changes.
- The code change stayed tiny: one existing back-button style became quieter.
- The user still has a clear way back, but the first viewport gives more attention to the answer flow.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- The first browser click attempt timed out, so the browser connection had to be recovered before measuring the Roleplay view.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Do not shrink the Roleplay answer card further unless a screenshot shows the CTA falling below the fold.
- Keep Back visible, but treat it as secondary chrome.
- Browser viewport QA is useful before making more Roleplay layout guesses.

Next suggested task:

- Simplify the post-feedback card so `Better English`, `Save answer` and optional follow-up are visually prioritized without feeling like three equal actions.

## 2026-06-27: Optional Roleplay Follow-Up Turn

Added one focused roleplay-loop improvement: after a strong first answer, the learner can now open one optional adaptive follow-up turn before saving. The Roleplay screen now shows a follow-up prompt based on the first answer weakness, tracks a small bonus XP reward when the follow-up is strong enough, saves that extra turn into the local session summary, and shows a `Follow-up saved` cue in Progress for the latest win.

What went well:

- This used helpers that already existed in the repo, especially adaptive follow-up prompt logic and follow-up-aware completion copy, instead of inventing another practice flow.
- The improvement stayed inside the current English MVP loop: one answer, one rewrite, one optional deeper turn, then save.
- Local storage and session history now preserve whether a saved session included a follow-up, which makes the new loop feel real instead of cosmetic.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/browser visual QA, so the new follow-up card stack still needs a quick mobile spacing check.
- The follow-up turn currently reuses the first-answer feedback summary rather than generating a second dedicated rewrite for the follow-up itself.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 4
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- The roleplay loop is stronger when a saved answer can turn into one optional deeper turn instead of ending immediately.
- If a new practice turn affects motivation, store it in local session data so Progress can acknowledge it later.
- Keep follow-up depth optional and lightweight; do not turn the MVP into a full chat transcript yet.

Next suggested task:

- Add a compact daily-target milestone card to the saved Roleplay state so the learner sees streak and today progress immediately after saving.

## 2026-06-27: Compact Roleplay Answer Card

Made the first Roleplay answer card shorter and calmer so the learner reaches the answer box and `Check answer` action faster. The coach question now uses a smaller heading size, the answer field is slightly shorter, and warm-up cue spacing is tighter while keeping the same single-step practice flow.

What went well:

- This improved the highest-priority Roleplay issue without adding another component or feature.
- The change stayed in one screen and only adjusted existing theme typography and spacing tokens.
- The first viewport should now feel closer to one coach prompt, one answer area and one clear action.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include fresh Expo/browser visual QA, so the exact mobile fold still needs a screenshot check.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Roleplay is already functionally simple; the remaining work is mostly reducing vertical height and optional visual noise.
- Keep the answer field and primary check action visible as early as possible.
- Avoid adding explanation above the answer box unless it directly helps the learner answer.

Next suggested task:

- Use the in-app browser/mobile preview to verify the Roleplay first viewport and adjust only if the answer CTA still falls too low.

## 2026-06-27: Compact Home Start Area

Made the top of Home calmer and shorter. The first status row now keeps only streak and XP, and the animated start card uses tighter spacing, a smaller tap target and a smaller title size so the next action and the daily mission fit with less visual noise.

What went well:

- This directly supports the app-led Home direction: fewer signals before the single main `Start` action.
- The change stayed in one screen and reused existing theme spacing and typography tokens.
- Removing the level badge from the first viewport reduced clutter without removing progress from the product.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This was code-reviewed without a fresh mobile screenshot, so Home still needs a visual check in Expo/browser.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Home should show streak and XP early, but level is secondary and does not need to compete with Start.
- Compact spacing is better than adding another explanation when a screen feels overwhelming.
- Keep the first viewport focused on one action plus one habit cue.

Next suggested task:

- Give the Roleplay first viewport the same simplification treatment: one coach prompt, one answer area and one clear action before optional helpers.

## 2026-06-27: Progress Drill Warm-Up Cue

Added one focused roleplay handoff improvement: when the learner starts a roleplay from the top Progress correction drill, the exact correction now follows into Roleplay as a compact warm-up cue above the answer box. The cue keeps the stronger sentence and note visible at the moment the learner needs to reuse it, without changing the rest of the roleplay loop.

What went well:

- The change stayed narrow: one new warm-up helper, one navigation context and one small Roleplay UI panel.
- The Progress drill now connects directly to the next practice action instead of losing the correction at screen transition.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include Expo/browser visual QA, so the new warm-up panel still needs a quick mobile spacing check.
- The warm-up cue only comes from the top Progress drill right now; the full mistake bank cards still open roleplay without exact correction context.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- If Progress recommends one correction, carry that exact sentence into the next practice step instead of making the learner remember it.
- A short warm-up panel above the answer box is enough; do not turn the drill handoff into another setup flow.
- Keep roleplay launch context tiny and optional so normal roleplay entry points stay unchanged.

Next suggested task:

- Pass the exact correction cue from each mistake bank card too, not only from the top Progress drill.

## 2026-06-27: Home Mission Complete State

Made the Home daily mission strip visually switch into a clearer complete state once today's target is hit. The card now uses a success-tinted background, success border, success badge and a shorter `Mission complete` kicker so the learner gets a stronger finish cue without seeing another button.

What went well:

- The change stayed focused on one Home surface and did not add any new flows or choices.
- Existing mission progress data was enough to drive the visual state, so no new storage or mock data was needed.
- Theme colors were reused and the raw color scan found no screen/component hex colors.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include Expo/browser visual QA, so the complete-state spacing still needs a quick mobile check.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- A completed Home mission should feel rewarding, but it should not introduce another primary action.
- Keep the daily habit loop visible in one compact card under the start card.
- Use existing mission progress helpers before adding new Home state.

Next suggested task:

- Do a quick mobile visual pass on Home and tighten spacing if the start card plus mission strip feels too tall.

## 2026-06-27: Home Daily Mission Strip

Added a compact daily mission strip to the Home screen so the learner sees today's target progress directly under the main start card. The strip now shows one professional mission title, `saved` progress, a progress bar and the XP reward, while keeping the primary tap target focused on the current lesson.

What went well:

- This made the habit loop more visible without adding a second CTA or a new screen.
- The existing `createHomeDailyMissionCard` and `createLocalProgressStats` helpers were reused instead of adding more state logic to Home.
- First-run mission copy is now more accurate because it points to the foundation step before the first saved answer.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include Expo/browser visual QA, so the new strip still needs a quick mobile spacing check.
- The mission strip is still based on local mock progress, not a real date-aware streak/history model yet.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Home can carry one quiet progress surface as long as the main start card remains the only obvious action.
- Mission copy must respect the first-run order: foundation first, then the first saved roleplay.
- Reuse existing local progress helpers before inventing another home-state layer.

Next suggested task:

- Add a compact post-save "daily target complete" state on Home so the learner gets a stronger same-day finish cue after hitting the goal.

## 2026-06-27: Persisted Mistake Drill Practice

Persisted the top Wins correction drill locally so the learner can mark one correction as practiced and return to a real `Practiced once` state later. The Progress drill now shows a short repeat-status panel, stores practiced mistake IDs in AsyncStorage, and keeps the linked roleplay CTA available for immediate reuse.

What went well:

- This strengthened the habit loop without adding screens, integrations or new content models.
- The existing `createMistakePracticeStatus` helper was reused instead of inventing a second status format.
- The change stayed focused on one local storage helper, navigator state wiring and one Progress card update.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include Expo/browser visual QA, so the new status panel still needs a quick mobile layout check.
- The practiced state is still driven by the static mock mistake bank, not by parsing mistakes out of real saved answers yet.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- Persisting one small correction action is enough to make Progress feel more earned.
- Keep the correction drill connected to an immediate roleplay CTA so the user can reuse the phrase while it is fresh.
- Prefer adding lightweight local state around the existing mock mistake bank before attempting automatic mistake extraction.

Next suggested task:

- When a learner opens a roleplay from the top correction drill, show that exact correction as a short warm-up cue above the answer box.

## 2026-06-27: Actionable Progress Coaching

Turned the Progress screen into a clearer coach surface after a saved roleplay. The old generic daily-goal card now uses the existing next-step guidance helper, showing one recommended action, three short steps and a direct CTA into the right next roleplay. Progress also now highlights one top-priority correction as a focused practice drill before the full mistake bank.

What went well:

- The Progress screen now tells the learner exactly what to do next instead of acting like a passive dashboard.
- The top mistake is now elevated into one concrete correction drill, which fits the product goal of small daily improvement.
- Existing helper logic for next-step guidance, first-save empty states and mistake previews was reused instead of adding new architecture.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include Expo/browser visual QA, so the new Progress composition still needs a mobile layout check.
- The screen still uses mock summary totals and weekly activity data; this run improved actionability, not data realism.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 5
- Safety and privacy: 5

Agent memory for next time:

- On Progress, lead with one recommended next action before showing supporting stats.
- Elevating one mistake into a drill is stronger than presenting the full correction list first.
- Reuse helper logic that already exists in `src/utils` before adding new state builders.

Next suggested task:

- Persist one practiced correction locally so the top mistake drill can switch to a real `Practiced once` state.

## 2026-06-27: One-Card Learn Start

Simplified the Learn/Home top area into one tappable start card. The old stack of screen header, hero card, animated instruction card and lesson card is now a compact status row plus one large pulsing `TAP` card that starts the active lesson. The next unlock hint stays below as quiet context.

What went well:

- The first viewport now has one obvious primary action instead of multiple large surfaces.
- XP, streak and level remain visible without competing with the start action.
- The active lesson card uses theme colors, spacing and shadow tokens; no raw screen colors were added.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- This run did not include browser screenshot QA, so the exact mobile composition still needs visual review in Expo.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Next best design task:

- Preview the new Learn/Home start card on mobile and tune the card height/text wrapping if it feels too large.

## 2026-06-27: Animated Roleplay Answer Cue

Added a subtle pulsing focus ring around the empty Roleplay answer field. The cue appears only before the learner has focused or typed, then disappears so the screen stays calm. The answer field now also keeps its active styling once text is present, making the next action feel more obvious without adding more copy.

What went well:

- The Roleplay step now visually points to the exact place the learner should tap.
- The change stayed inside the existing Roleplay screen and did not add buttons, screens or integrations.
- Theme colors and spacing tokens were used; no raw colors were added to screens/components.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- The first lint run caught a React ref rule around `Animated.Value`; it was fixed by initializing the animation value with state.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.
- This run did not include browser screenshot QA, so the animation was verified through code inspection and automated checks.

Next best design task:

- Simplify the Learn/Home top area one more step by showing only the active lesson path, XP/streak and one animated start cue in the first viewport.

## 2026-06-27: Short Roleplay Step Header

Simplified the active Roleplay header so the game step shows `Step 1 of 3` with `Your turn`, then changes to `Step 2 of 3` with `Better English` after checking an answer. The saved state no longer repeats a separate screen header above the success card, and the first prompt card now says `Question` with a simple `1 answer` badge.

What went well:

- The Roleplay screen has less top text before the user writes an answer.
- The active state now tells the user where they are in the mini-game without adding another button.
- The saved success state is cleaner because it avoids duplicate `Saved`/lesson-complete messaging.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.

What went wrong:

- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.
- This run did not include browser screenshot QA, so the visual result was verified through code inspection and checks.

Next best design task:

- Add a tiny animated focus cue to the Roleplay answer input so the next tap target feels even more obvious without adding more copy.

## 2026-06-27: Single Saved Roleplay Handoff

Simplified the saved Roleplay completion state. After `Save answer`, the user now sees one focused success handoff with `Saved`, XP, `Streak updated`, the next recommended lesson title and one primary next-step button. The extra level momentum card, duplicate continue button and separate recommended lesson card were removed.

What went well:

- The main English practice loop now ends with one clearer next action.
- Added a small `createSavedRoleplayHandoff` helper so the saved-state copy and CTA rules stay testable.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.
- The change stayed inside the existing local Roleplay flow without adding integrations or new screens.

What went wrong:

- This run did not include browser preview QA, so the result was validated through code inspection and automated checks only.
- The saved handoff still keeps the Back action visible; a later pass can decide whether completion should fully trap the user into the next recommended path.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep post-practice states to one reward surface and one primary button.
- If progress context is useful, embed it inside the completion handoff instead of adding a second panel.
- Preserve the app-led next lesson recommendation after a save; do not reopen broad browsing immediately.

Next suggested task:

- Make the next recommended roleplay start with one short `Why this next` coaching line above the prompt so the transition feels more intentional.

## 2026-06-27: One-Card Roleplay Feedback

Simplified the Roleplay post-check state. After `Check answer`, the prompt and answer field now disappear and the learner sees one focused coach card: readiness label, XP, `Better English`, `Save answer` and `Try again`. The detailed multi-score feedback card is hidden from this core game step.

What went well:

- The Roleplay loop now stays closer to one thing at a time.
- The feedback step feels more like a reward/correction moment and less like a report.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- No raw hex colors were added to screens/components.

What went wrong:

- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.
- The detailed feedback component still exists for future advanced screens, but it is no longer used in the main Roleplay loop.

Next suggested task:

- Simplify the saved/complete Roleplay state so it shows `Saved`, XP and one next lesson button without extra progress panels.

## 2026-06-27: Back Buttons And One-Step Practice

Added a clear `Back` button to the Foundation lesson and Roleplay screen. Simplified the Foundation game so it shows one active tap target at a time instead of three blocks plus multiple explanation cards. Simplified the Roleplay start so the user immediately sees one prompt, one answer box and one `Check answer` action.

What went well:

- The first lesson now feels much more like a guided game step.
- Roleplay has fewer intro panels before the answer field.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- No raw hex colors were added to screens/components.

What went wrong:

- Browser preview reload timed out once after the code change, so this pass is verified by automated checks rather than visual browser QA.
- The Roleplay feedback card is still detailed after checking an answer; a later pass should simplify that next state too.

Next suggested task:

- Simplify the post-check feedback state into one short `Better English` card with one save action.

## 2026-06-27: Simpler Animated Home Instruction

Simplified the Learn/Home screen again and added a real pulsing `Animated` instruction card. The page now keeps the hero CTA, a compact XP/level row, one animated `TAP` instruction, one active lesson card, and one tiny `Unlocks next` hint. The larger daily mission panel, path preview card and roleplay unlock preview were removed from Home to reduce noise.

What went well:

- Home now feels more app-led and less like a dashboard.
- The animated instruction tells the user exactly what to do without adding another button.
- `npm.cmd run typecheck`, `npm.cmd run lint` and `npm.cmd run test` all passed.
- Browser preview at `http://localhost:8091/` loaded successfully and showed only two tap targets on Home.

What went wrong:

- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.
- The animation is a subtle pulse only; richer motion should wait until the main flow is stable.

Next suggested task:

- Simplify the returning Roleplay screen so the answer input appears in the first viewport with one clear `Check answer` action.

## 2026-06-27: Single Active Learn Path

Built one focused onboarding and practice-flow improvement: the Learn screen now shows one highlighted current lesson card and moves the rest of the path into softer preview rows. The quiet `What unlocks next` preview stays below that path, so the user sees one clear next action without losing a sense of progress.

What went well:

- The current lesson is now visually dominant, which better matches the app-led flow.
- Completed and locked lessons still give progress context without competing with the active card.
- Added a small `homeLearnState` helper so the hero and Learn path stay aligned on the same next step.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not add a component-level UI test; coverage still comes from helper tests and full project checks.
- No browser preview was run in this pass, so the visual result was validated through code inspection and automated checks only.
- Returning users still see both the hero CTA and the daily mission progress card, so a later pass can reduce duplication there too.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 56 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- On Learn, the active lesson should stay visually louder than completed and locked lessons.
- Quiet previews work well for upcoming roleplays because they preserve momentum without letting the user wander.
- If progress context is needed, prefer softer preview rows over multiple full-size action cards.

Next suggested task:

- Reduce duplicate motivation panels on Learn by folding the daily mission progress into the hero or active lesson card.

## 2026-06-27: Starting Level Now Matters

Built one focused onboarding improvement: the selected starting English level is now saved locally and reused in the first guided lesson and first roleplay starter copy. `starter`, `basic` and `confident` learners now see different foundation examples, rules and answer starters instead of losing that choice after onboarding.

What went well:

- The change stayed inside the first-run loop without adding new screens or integrations.
- Existing users who already completed onboarding safely fall back to `basic`.
- Added focused tests for starting-level storage and content profiles, and all project checks passed.

What went wrong:

- This run did not add a visible way to change the saved starting level after onboarding.
- The level choice currently personalizes the foundation lesson and answer starter, but it does not yet change the interview prompt difficulty or feedback wording.
- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Checks run:

- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run lint`

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Keep the onboarding level choice meaningful; do not ask for it unless later screens use it.
- Default returning users to `basic` when earlier app versions have no saved starting level.
- The next useful step is to adapt the first interview prompt/coaching tone to the saved starting level, not just the starter copy.

Next suggested task:

- Adjust the first Job Interview prompt and coaching note by saved starting level so beginners and stronger users get a better-matched first practice.

## 2026-06-27: Simpler Home First Step

Changed the Learn/Home screen so the first-run experience has fewer competing actions. The hero now names the exact next step, the daily quest is a quiet progress card instead of a second CTA, lesson cards no longer show extra CTA labels, and the recommended roleplay card stays hidden until the learner has saved at least one practice.

Why it changed:

- Kevin wants the app to feel app-led and obvious at the start.
- Home still exposed too many choices before the user had completed the first guided step.
- The first viewport should answer one question: what do I press now?

What went well:

- The change stayed scoped to one screen.
- The Home start now has one dominant action and less browsing pressure.
- Theme tokens and existing UI components were used; no raw colors were added to screens/components.

What failed:

- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Checks run:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run test`
- `rg "#[0-9A-Fa-f]{3,8}" src\screens src\components`

Next best design task:

- Polish the returning Roleplay screen so the answer input appears earlier and scenario options feel secondary.

## 2026-06-27: Interactive Foundation Lesson

Changed the first foundation lesson from a passive explanation into a small tap-to-build sentence exercise. The learner now taps `I`, `action`, and `result` in order, sees sentence progress, and only unlocks Continue after completing the three simple steps.

Why it changed:

- Kevin wants the app to take charge and feel much simpler at the start.
- The first lesson should teach one basic English structure before asking for career roleplay.
- A tiny interaction creates more game-like momentum without adding new APIs or large features.

What went well:

- The change stayed focused on one visible screen.
- The lesson now has one obvious action at a time.
- Existing theme tokens and reusable UI components were used; no raw colors were added to screens.

What failed:

- Tests still show the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Checks run:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run test`
- `rg "#[0-9A-Fa-f]{3,8}" src\screens src\components`

Agent memory for next time:

- Keep early learning extremely guided: one prompt, one tap, one clear next step.
- The next best design task is to simplify the first Home/Learn decision after the foundation lesson so the user does not see too many paths at once.

## 2026-06-27: Major Design System Upgrade

Built a broad visual upgrade around the new `Career Arcade` design direction. Added theme tokens in `src/theme`, a reusable UI layer in `src/components/ui`, and redesigned the main app surfaces to feel more premium, colorful, modern and guided.

What changed:

- Added centralized colors, spacing, typography, radius and shadow tokens.
- Added reusable UI components for screen containers, headers, heroes, buttons, cards, lesson cards, roleplay cards, feedback cards, progress bars, XP/streak/level badges, daily quest cards, coach bubbles, mistake cards, skill progress cards, premium preview cards, empty states and section headers.
- Redesigned Learn/Home into a guided lesson path with daily quest, streak/XP badges, locked/current lesson cards and recommended roleplay.
- Redesigned Roleplay into a conversation-first mock AI screen with coach bubble, scenario hero, chat area, mock microphone, type fallback, coach feedback and lesson-complete state.
- Redesigned Progress/Wins with total XP, streak, daily goal, latest win, skill progress cards, weekly activity chart and polished mistake cards.
- Redesigned Profile/Me into learner settings with a premium mock preview and no technical integration checklist.
- Updated Onboarding, Foundation, Practice and BottomNav to use the new premium visual system.

What went well:

- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` passed.
- Raw hex colors now live in `src/theme/colors.ts`; redesigned screens use theme tokens.
- The app is much more app-led and visually motivating without adding real APIs, payments or secrets.
- Screen scoreboard was updated with all redesigned screens scoring at least 8/10.

What went wrong:

- The in-app browser controller timed out during final screenshot QA, although `http://localhost:8091/` returned HTTP 200.
- The mock microphone is visual only and intentionally does not record audio.
- The premium area is a mock preview section inside Profile, not a real payment screen.

Agent memory for next time:

- Keep the new design system as the source of truth; avoid raw colors and ad hoc spacing in screens.
- The next best design step is interaction quality, not more surfaces.
- Foundation Step 1 should become a tap-to-build mini lesson so the first learning moment feels truly interactive.

Next suggested task:

- Make Foundation Step 1 interactive: tap `I`, `action`, `result` in order, build the example sentence, then unlock Continue.

## 2026-06-27: Design Research And UX Audit

Created a documentation-only design research and audit pass for SpeakCareer. Reviewed public patterns from Duolingo, Speak, ELSA Speak, Praktika, Babbel, Apple Human Interface Guidelines and Material Design, then inspected the current mobile app preview and source screens.

What went well:

- Defined a clearer original design direction: `Career Arcade`.
- Confirmed the biggest UX problem is not missing features, but showing too many concepts too early.
- Documented exact redesign priorities for Learn/Home, Roleplay, Wins/Progress, Feedback and Profile.
- Created a screen-by-screen scoreboard so future design work can be measured.

What went wrong:

- This run did not implement UI changes because it was intentionally research and audit only.
- Public competitor research is pattern-level; it should not be treated as permission to copy visuals.
- The current app state in local storage showed a returning-user flow, so first-run onboarding was also reviewed through code.

Checks run:

- Documentation reviewed manually.
- No app lint/typecheck/test run, because this was docs-only and no code changes were intended.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Kevin wants the app to be extremely obvious: one action, one path, no early browsing.
- Make the app more game-like through lesson nodes, XP, unlocks and coach warmth, not by copying Duolingo.
- First implementation task should be the Learn/Home career lesson path.

Next suggested task:

- Redesign Learn/Home into a vertical career lesson path with one active node, two locked nodes, compact XP/streak status and one Start button.

## 2026-06-27: First-Quest Success Handoff

Built one focused practice-loop improvement: after the very first saved Job Interview answer, the app now stays in a dedicated success handoff instead of dropping straight into the full Roleplay screen. The user sees the XP reward, what unlocked, one next recommended quest and one primary button.

What went well:

- The first save now feels intentional and motivating instead of abruptly switching into the richer post-save UI.
- Added a small `createFirstQuestCompletionState` helper so the success copy stays simple and testable.
- Kept the first-quest completion state to one next action, which matches the guided onboarding flow.
- All required checks passed after the change.

What went wrong:

- This run did not add a component-level UI test, only helper coverage and full project checks.
- The dedicated success state is only for the first saved answer; later completion states are still denser.
- No browser preview was run in this pass, so the behavior was validated through code inspection and checks only.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 53 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 5
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- After a first practice win, keep the user in one clear success state with one next action.
- First-run completion should celebrate progress and unlocks without exposing the full advanced flow immediately.
- The next useful onboarding improvement is storing the chosen starting level and using it to adjust the first examples.

## 2026-06-27: Three-Tab Simple Navigation

Built one focused simplification: the bottom navigation no longer shows `Home`, `Practice`, `Roleplay`, `Progress`, `Profile`. After the first save it now shows only three simple choices: `Learn`, `Wins` and `Me`. Practice and Roleplay stay app-led instead of user-selected tabs. The first-run screens also received a rounder, friendlier system font treatment.

What went well:

- Removed the most confusing navigation labels from the bottom bar.
- `Practice` and `Roleplay` are no longer presented as top-level choices.
- `Home` became `Learn`, which better matches the app-led flow.
- Shared typography now uses a rounder font family where the platform supports it.

What went wrong:

- Browser preview timed out twice during reload, so this run relied on typecheck/tests/lint instead of a screenshot.
- The full rich screens still exist after the first save; later simplification should continue there.
- The font is platform-dependent because no custom font package has been added yet.

Checks run:

- `npm.cmd run typecheck` passed.
- `npm.cmd run test` passed with 52 tests.
- `npm.cmd run lint` passed.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 4
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Kevin does not want users choosing between `Home`, `Practice`, `Roleplay`, `Progress` at the start.
- Keep navigation app-led: Learn first, then unlock richer areas only when needed.
- If browser reload times out, do not burn the run; rely on checks and report the limitation.

Next suggested task:

- Replace the rich post-save completion screen with one simple unlock screen: `Saved`, `+XP`, `Next lesson`.

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

## 2026-06-28: Personalized Onboarding First-Path Preview

Made one focused onboarding improvement: after the learner picks a starting level, the screen now shows a personalized first-path preview before Continue. The new panel explains the selected level, the first foundation lesson, the first job interview quest, and a level-matched answer starter so the next step feels concrete instead of generic.

What went well:

- This stayed inside the existing onboarding flow and did not add another step or any new storage.
- The preview reuses existing guided-intro and starting-level data, so the content remains aligned with the rest of the MVP loop.
- A focused helper test now protects the personalized onboarding path copy for starter and confident users.
- `npm.cmd run typecheck`, `npm.cmd run test` and `npm.cmd run lint` all passed.

What went wrong:

- This run did not include fresh Expo/browser mobile visual QA, so the new preview card spacing still needs a quick check on a phone-sized viewport.
- The test run still shows the existing Node module-type warning for `guidedIntro.ts`, but all tests pass.

Rubric self-evaluation:

- Career usefulness: 4
- MVP focus: 5
- Professional tone: 5
- Simplicity: 5
- Feedback quality: 4
- Safety and privacy: 5

Agent memory for next time:

- Onboarding gets stronger when the user sees an exact first path, not only a level choice.
- Reuse the starting-level profile data for concrete starter copy instead of inventing extra onboarding content.
- Keep onboarding improvements inside the current one-screen flow unless the user explicitly needs another step.

Next suggested task:

- Make the Foundation-to-Roleplay handoff show one level-matched starter answer so the first interview response feels easier to begin.
