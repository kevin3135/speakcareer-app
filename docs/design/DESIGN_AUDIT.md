# SpeakCareer Design Audit

Audit date: 2026-06-27

Scope reviewed:

- Live mobile web preview at `390x844`
- `OnboardingScreen`
- `HomeScreen`
- `FoundationScreen`
- `RoleplayScreen`
- `PracticeScreen`
- `ProgressScreen`
- `ProfileScreen`
- Shared components: `Screen`, `Card`, `AppButton`, `BottomNav`, `FeedbackPanel`

## Current Product Impression

SpeakCareer has the right product direction: career English, short practice, XP, simple structure and mock AI feedback. The biggest issue is not lack of features. The biggest issue is that the app reveals too many concepts too early.

The best current screen is the simplified Learn/Home screen. The weakest current experience is the returning Roleplay screen because it shows guide steps, timer, scenario picker, angle picker, read card, writing support, input, review controls and bottom tabs in one long page.

## Top 20 Visual / Design Problems

1. Bottom navigation appears after one saved session and competes with the guided lesson path.
2. Roleplay has too many modules visible before the answer box.
3. The first viewport of Roleplay does not show the actual answer input.
4. Cards stack vertically without enough distinction between "must do now" and "optional".
5. Too many labels use uppercase, making the UI feel loud.
6. The app uses many small text sections instead of visual steps.
7. Progress/Wins shows too much data at once after the first saved answer.
8. The Profile/Me screen contains implementation notes that feel technical, not user-facing.
9. The theme is professional but not yet memorable enough as a brand.
10. Buttons are functional but do not feel rewarding or premium.
11. XP and reward states are not visually special enough.
12. The lesson path exists, but it is not the central home experience after onboarding.
13. The Practice screen still feels like a library and filter page, even though the user wants app-led learning.
14. Roleplay setup controls use "Change" buttons too early, inviting browsing instead of action.
15. Feedback can become text-heavy and analytical instead of one clear correction.
16. The coach identity is weak: `SC` appears in onboarding but not consistently afterward.
17. The app has no consistent lesson-node visual language.
18. Screen headers are plain and sometimes repeat what the card below already says.
19. The palette is close to emerald/office colors, but supporting colors are underdeveloped.
20. Empty/locked states explain too much instead of showing one next action.

## Screens That Feel Boring

- Profile/Me: reads like a settings/debug page.
- Progress/Wins: useful but dense; it feels like a report, not a motivating win screen.
- FeedbackPanel: looks like a basic card with bullets and progress bars.
- Foundation Step 1: clear, but too passive; it should feel like a tiny interactive lesson.

## Components That Look Too Basic

- `Card`: too generic; every card has similar weight.
- `AppButton`: good minimum but lacks pressed depth, reward variants and icon support.
- `BottomNav`: simpler than before, but visually bland and still too early in the journey.
- `FeedbackPanel`: should become a coach feedback module with one key fix, not a report.
- `ProgressBar`: useful but needs stronger success/active/locked variants.
- Scenario and angle pickers: functionally good, visually feel like settings controls.

## Flows That Are Unclear

- First save to next lesson: direction improved, but the user still sees navigation choices after saving.
- Returning Roleplay: unclear whether the user should use timer, change scenario, change angle, read card, open support or answer.
- Progress/Wins: unclear whether it is for motivation, reviewing mistakes or choosing the next lesson.
- Profile/Me: unclear why planned integrations are visible to a learner.
- Practice screen: unclear whether it is still part of the product now that bottom nav hides it.

## Screens To Redesign First

1. Returning Roleplay screen
2. Learn/Home after first save
3. Wins/Progress after first save
4. Foundation Step 1
5. Onboarding level assessment
6. Profile/Me
7. Practice path/library if it remains accessible later

## Exact Recommended Fixes

### 1. Make Learn a Lesson Map

- Replace the large static card with a vertical career path.
- Show one active node: `Lesson 1: Clear Sentence`.
- Show two locked nodes below: `Interview Answer`, `Meeting Update`.
- Keep only one primary CTA: `Start`.
- Move XP/streak into a small top row.

### 2. Rebuild Roleplay as One Conversation Step

- First viewport should show: coach prompt, one user answer field, one CTA.
- Hide timer, scenario picker and angle picker behind a small "Options" row.
- Use a message bubble layout: `Coach`, `You`, `Better English`.
- Show only one active step at a time.
- Move the answer box above optional helpers.

### 3. Turn Feedback Into a Reward Moment

- After checking an answer, show one card:
  - `Good start`
  - `+40 XP`
  - `Better English`
  - one short rewrite
  - one `Save` button
- Hide scores until after saving or until the user opens details.

### 4. Simplify Wins

- Top: today's streak/XP and "Next win".
- Second: latest saved answer.
- Third: one mistake to fix.
- Hide full mistake list behind `See all`.

### 5. Clean Profile/Me

- Remove implementation notes from user-facing UI.
- Keep daily target, language, saved-on-device note and future account placeholder.
- Rename technical integration status to a developer-only doc, not an app screen.

### 6. Establish Visual Tokens

- Define design tokens for:
  - active lesson
  - locked lesson
  - completed lesson
  - XP reward
  - coach message
  - user answer
  - correction
  - danger/blocker
- Keep card radius at `8` unless changing the full system deliberately.

### 7. Use a Clear Brand Direction

- Working theme: `Career Arcade`.
- Primary: deep emerald.
- Accent: premium gold.
- Background: bright cool off-white.
- Text: ink.
- Coach: warm teal.
- Correction: soft blue.
- Avoid grey-heavy surfaces.

### 8. Reduce Text Rules

- Max one paragraph per first viewport.
- Max one primary CTA per screen.
- Max one optional secondary control above the fold.
- Every screen must have a visible "what to do now" answer in 3 seconds.

## UX Audit Summary

SpeakCareer should not add more features right now. It should convert existing features into a guided visual sequence. The product will feel more Duolingo-like when the app controls the path, keeps the next action obvious and rewards tiny wins quickly.
