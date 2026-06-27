# SpeakCareer Visual Roadmap

Goal: make SpeakCareer fun, premium, modern, motivating and simple without copying Duolingo, Speak, ELSA, Praktika or Babbel.

Design direction: **Career Arcade**.

## Next 20 Design Tasks

1. Done: Redesign Learn/Home into a vertical career lesson path with one active node and two locked nodes.
2. Done: Hide bottom navigation during active lesson and roleplay flows, even after the first save.
3. Done: Rebuild returning Roleplay into a conversation-first screen: coach prompt, answer box, CTA.
4. Next: Move timer, scenario change and angle change into one collapsed `Options` area if they return.
5. Done: Replace `FeedbackPanel` with a coach feedback card: scores, corrections, rewrite and save action.
6. Done: Redesign the first-save/completion state with stronger XP and next-lesson visuals.
7. Done: Simplify Wins top section into total XP, daily goal, latest win and next fix.
8. Next: Hide long mistake-bank lists behind `See all mistakes`.
9. Done: Redesign Profile/Me as learner settings and remove technical integration status from the UI.
10. Done: Create shared visual tokens for active, locked, completed, reward, coach, user-answer and correction states.
11. Next: Add icon support to `AppButton` and use icons only where they clarify actions.
12. Done: Build a reusable `LessonCard` component for active, locked and completed states.
13. Done: Build a reusable `CoachBubble` component for onboarding, lessons and feedback.
14. Next: Convert Foundation Step 1 from passive reading into a tap-to-build mini lesson.
15. Done: Add compact streak, XP and level/status badges.
16. Done: Reduce uppercase-heavy labels in redesigned screens.
17. Done: Add correction/AI feedback color roles separate from primary and XP.
18. Done: Tighten key screens so the primary CTA or input appears faster.
19. Done: Add simple completion microcopy and visual structure.
20. Next: Capture fresh mobile screenshots for every main screen once the browser controller is stable.

## Recommended First Implementation Task

Start with task 1:

**Make Foundation Step 1 interactive.**

Why first:

- The new visual system is in place.
- The first lesson still reads more than it teaches.
- A tap-to-build mini lesson would make the app feel more like a real consumer language app.
- It can remain fully local with no API risk.

Acceptance criteria:

- User taps `I`, `action`, `result` in order.
- The example sentence builds visually.
- One Continue button unlocks only after the structure is complete.
- No extra navigation or settings appear.
- Mobile first viewport still has one clear job.

## Design Implementation Order

Phase 1: Simplify the path

- Done: Learn/Home lesson path
- Done: Hide nav in lesson mode
- Done: Simple completion unlock

Phase 2: Make practice feel alive

- Done: Conversation-first Roleplay
- Done: Coach feedback card
- Done: Better answer input state

Phase 3: Make progress motivating

- Done: Wins redesign
- Next: Mistake bank progressive disclosure
- Done: XP/streak system polish

Phase 4: Polish brand system

- Done: Coach bubble
- Done: Lesson cards/nodes
- Next: Button/icon variants
- Next: Visual QA screenshot checklist

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
