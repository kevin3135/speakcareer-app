# SpeakCareer Screen Scoreboard

Scoring: `1` = weak, `10` = excellent.

This scoreboard reflects the current app state on 2026-06-27 after the major design-system upgrade. Scores are based on code review, existing live preview context and local server availability. The in-app browser controller timed out during the final screenshot pass, so the next design run should capture fresh mobile screenshots before further visual work.

| Screen | First impression | Clarity | Visual hierarchy | Spacing | Colors | CTA strength | Premium feel | Learning motivation | Mobile usability | Consistency | Priority |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Onboarding level assessment | 8 | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 8 | 8 | Medium |
| Learn/Home | 9 | 9 | 9 | 8 | 9 | 9 | 8 | 9 | 8 | 9 | High |
| Foundation Step 1 | 8 | 9 | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 9 | Medium |
| Practice category screen | 8 | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 8 | 9 | Medium |
| Roleplay conversation screen | 8 | 8 | 8 | 8 | 9 | 8 | 8 | 9 | 8 | 9 | Critical |
| AI Feedback card | 8 | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 8 | 9 | High |
| Lesson Complete state | 8 | 9 | 8 | 8 | 9 | 9 | 8 | 9 | 8 | 9 | High |
| Wins/Progress | 8 | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 8 | 9 | High |
| Mistake Bank | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 9 | High |
| Profile/Me | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 7 | 8 | 9 | Medium |
| Premium mock section | 8 | 8 | 8 | 8 | 9 | 7 | 9 | 8 | 8 | 9 | Medium |
| Bottom navigation shell | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 9 | Medium |

## Notes By Screen

### Onboarding Level Assessment

Strengths:

- Dark mode feels more distinctive.
- Coach bubble gives a guided start.
- Level cards are easy to tap.

Problems:

- `SC` badge is not warm enough yet.
- The screen borrows the broad pattern of popular apps but needs its own career identity.
- The selected level is not yet visually connected to the first lesson.

Current status:

- Upgraded to a lighter premium start with coach bubble, level cards and a clearer Continue state.
- Uses the shared theme tokens instead of raw screen colors.

Next fix:

- Add a professional coach badge style and a stronger "we will start simple" handoff.

### Learn/Home

Strengths:

- One lesson, one button is the right direction.
- Emerald card gives stronger brand presence.
- The sentence formula is clear.

Problems:

- After saving, bottom nav appears and weakens the app-led feeling.
- It is still a single large card rather than a path.
- It says "Start here" even for returning users.

Current status:

- Converted to a career lesson path with one active card, locked future cards, XP/streak badges, daily quest and recommended roleplay.

Next fix:

- Add small animation or visual unlock motion after saving a lesson.

### Foundation Step 1

Strengths:

- Clear language structure.
- Simple CTA.
- Good bridge into interview.

Problems:

- Passive reading only.
- Not game-like enough.
- White card feels less branded than Home.

Current status:

- Restyled with the new hero, coach bubble and stronger structure blocks.

Next fix:

- Turn into a tap-to-build sentence lesson: `I`, `action`, `result`.

### Practice Path / Library

Strengths:

- Has a good map concept.
- Category and level filters are useful later.
- Career path idea is aligned with product.

Problems:

- Too much library behavior for beginners.
- Filters make the user choose too much.
- It is currently not part of the simplified nav, so its role is unclear.

Current status:

- Reframed as beautiful category cards with difficulty, time, XP and CTA.

Next fix:

- Decide whether Practice should stay hidden behind Learn or become a later secondary destination.

### Roleplay First-Quest Mode

Strengths:

- Much simpler than the full roleplay.
- One question, one input, one CTA.
- Uses the foundation sentence structure.

Problems:

- Needs stronger coach/conversation visual identity.
- Could make the answer box feel more central.
- Needs a better success transition after save.

Current status:

- Rebuilt as a conversation-first screen with coach bubble, scenario hero, chat area, mock microphone, type action, feedback card and completion state.

Next fix:

- Add real voice recording only after backend/audio strategy is approved.

### Roleplay Returning / Full

Strengths:

- Contains strong practice mechanics.
- Scenario and angle pickers are useful.
- Read-first card and writing support are thoughtful.

Problems:

- Too many sections before the answer box.
- Timer, scenario, angle and read card all compete.
- Bottom nav remains visible during a focused exercise.
- It feels like a configuration page, not a conversation.

Current status:

- The old dense returning flow has been replaced with the same conversation-first flow.

Next fix:

- Add a compact `Options` drawer later if scenario/angle switching is needed again.

### First-Save Completion

Strengths:

- Good direction: simple save, XP, unlock.
- CTA can lead the user forward.

Problems:

- Needs more visual reward energy.
- Should be tied to lesson-node unlock.

Current status:

- Completion now uses a celebratory hero, XP badge, streak update, progress bar, next lesson and Continue button.

Next fix:

- Add a subtle node-unlock animation later.

### Wins / Progress

Strengths:

- Strong content: session history, daily target, mistake bank.
- Mistake corrections are valuable.

Problems:

- Too much appears on one page.
- Looks like analytics instead of motivating wins.
- Full mistake list appears too early.

Current status:

- Progress now opens with total XP, streak, daily goal, latest win, skill cards, weekly chart and styled mistake cards.

Next fix:

- Add collapse/expand for long mistake-bank lists.

### Profile / Me

Strengths:

- Daily target control is useful.
- Simple structure.

Problems:

- Developer integration status should not be user-facing.
- Low emotional value.
- Looks unfinished.

Current status:

- Removed the technical integration checklist and added learner settings, language plan, privacy note and premium mock section.

Next fix:

- Split Premium into a dedicated preview screen only if navigation stays simple.

### FeedbackPanel

Strengths:

- Has scores, strengths, improvements and rewrite.

Problems:

- Too generic.
- Too much feedback at once.
- "Mock AI feedback" breaks product immersion.

Current status:

- Replaced by reusable `FeedbackCard` with overall score, four skill scores, strengths, improvements, corrected version and stronger professional version.

Next fix:

- Tune score copy after observing real user answers.

### Bottom Navigation Shell

Strengths:

- Three tabs is better than five.
- Labels are simpler.

Problems:

- Still appears too early after first save.
- Active state is mild.
- Tabs imply browsing instead of guided learning.

Current status:

- Bottom nav now has a premium pill shell and is hidden during Foundation and Roleplay.

Next fix:

- Consider hiding bottom nav until after several saved sessions if users still wander.
