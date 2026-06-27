# SpeakCareer Visual Roadmap

Goal: make SpeakCareer fun, premium, modern, motivating and simple without copying Duolingo, Speak, ELSA, Praktika or Babbel.

Design direction: **Career Arcade**.

## Next 20 Design Tasks

1. Redesign Learn/Home into a vertical career lesson path with one active node and two locked nodes.
2. Hide bottom navigation during active lesson and roleplay flows, even after the first save.
3. Rebuild returning Roleplay into a conversation-first screen: coach prompt, answer box, CTA.
4. Move timer, scenario change and angle change into one collapsed `Options` area.
5. Replace `FeedbackPanel` with a coach feedback card: one win, one correction, one rewrite, one save CTA.
6. Redesign the first-save completion card with stronger XP and next-node unlock visuals.
7. Simplify Wins top section into `Latest win`, `Today`, and `Next fix`.
8. Hide the full mistake bank list behind `See all mistakes`.
9. Redesign Profile/Me as learner settings and remove technical integration status from the UI.
10. Create shared visual tokens for active, locked, completed, reward, coach, user-answer and correction states.
11. Add icon support to `AppButton` and use icons only where they clarify actions.
12. Build a reusable `LessonNode` component for active, locked and completed states.
13. Build a reusable `CoachBubble` component for onboarding, lessons and feedback.
14. Convert Foundation Step 1 from passive reading into a tap-to-build mini lesson.
15. Add a compact top status row: streak, XP and current unit.
16. Reduce uppercase labels across the app by 50%.
17. Add one premium accent color for correction/AI feedback separate from emerald and gold.
18. Tighten all card spacing so first viewport always shows the primary CTA or input.
19. Add simple completion microcopy rules: `Saved`, `+XP`, `Next unlocked`, `Continue`.
20. Create a visual QA checklist and screenshot every main screen at mobile size before merging design PRs.

## Recommended First Implementation Task

Start with task 1:

**Redesign Learn/Home into a vertical career lesson path.**

Why first:

- It directly solves the user's biggest complaint: "I do not know what to do."
- It makes the app feel game-like without adding complexity.
- It creates the visual system for future lessons.
- It can be built with local data and no API risk.

Acceptance criteria:

- First viewport shows a compact streak/XP row.
- One active lesson node is visually dominant.
- Two next lessons are locked and visible.
- One CTA starts the active lesson.
- No scenario library or filters appear.
- Copy is short enough to understand in 3 seconds.

## Design Implementation Order

Phase 1: Simplify the path

- Learn/Home lesson path
- Hide nav in lesson mode
- Simple completion unlock

Phase 2: Make practice feel alive

- Conversation-first Roleplay
- Coach feedback card
- Better answer input state

Phase 3: Make progress motivating

- Wins redesign
- Mistake bank progressive disclosure
- XP/streak system polish

Phase 4: Polish brand system

- Coach bubble
- Lesson nodes
- Button/icon variants
- Visual QA checklist

## Do Not Build Yet

- Payment/paywall implementation
- Real AI API connection
- Supabase auth or database
- Full Spanish/French/Mandarin courses
- App Store or Google Play setup

## Design QA Checklist

For every visual PR:

- Can a new user tell what to do in 3 seconds?
- Is there exactly one primary CTA above the fold?
- Is optional help collapsed?
- Does the screen feel career-focused?
- Does it feel more motivating than a form?
- Does it avoid copying competitor branding?
- Does it work at `390x844`?
- Does text fit inside buttons/cards?
- Does the screen avoid grey-heavy boredom?
- Does it preserve the English MVP focus?
