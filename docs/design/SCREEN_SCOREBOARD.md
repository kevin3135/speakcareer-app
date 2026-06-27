# SpeakCareer Screen Scoreboard

Scoring: `1` = weak, `10` = excellent.

This scoreboard reflects the current app state on 2026-06-27 after live mobile preview and code review.

| Screen | First impression | Clarity | Visual hierarchy | Spacing | Colors | CTA strength | Premium feel | Learning motivation | Mobile usability | Consistency | Priority |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Onboarding level assessment | 7 | 7 | 7 | 7 | 8 | 7 | 6 | 7 | 7 | 7 | Medium |
| Learn/Home | 7 | 8 | 7 | 7 | 8 | 8 | 6 | 7 | 7 | 7 | High |
| Foundation Step 1 | 6 | 8 | 6 | 7 | 6 | 8 | 5 | 6 | 7 | 7 | High |
| Practice path/library | 6 | 5 | 5 | 6 | 7 | 6 | 5 | 7 | 5 | 5 | Low until reintroduced |
| Roleplay first-quest mode | 7 | 8 | 7 | 7 | 7 | 8 | 6 | 8 | 7 | 7 | High |
| Roleplay returning/full | 5 | 4 | 4 | 5 | 6 | 5 | 5 | 6 | 4 | 5 | Critical |
| First-save completion | 7 | 8 | 7 | 7 | 7 | 8 | 6 | 8 | 8 | 7 | Medium |
| Wins/Progress | 5 | 5 | 4 | 5 | 6 | 5 | 5 | 6 | 4 | 5 | High |
| Profile/Me | 4 | 5 | 5 | 6 | 5 | 5 | 4 | 3 | 6 | 5 | Medium |
| FeedbackPanel | 4 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 5 | High |
| Bottom navigation shell | 5 | 6 | 5 | 7 | 6 | 5 | 5 | 5 | 7 | 6 | High |

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

Recommended fix:

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

Recommended fix:

- Convert to a vertical lesson path with one active node and locked next nodes.

### Foundation Step 1

Strengths:

- Clear language structure.
- Simple CTA.
- Good bridge into interview.

Problems:

- Passive reading only.
- Not game-like enough.
- White card feels less branded than Home.

Recommended fix:

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

Recommended fix:

- Keep the map concept, but fold it into Learn instead of a separate tab.

### Roleplay First-Quest Mode

Strengths:

- Much simpler than the full roleplay.
- One question, one input, one CTA.
- Uses the foundation sentence structure.

Problems:

- Needs stronger coach/conversation visual identity.
- Could make the answer box feel more central.
- Needs a better success transition after save.

Recommended fix:

- Use a chat-like coach prompt and a larger "Your answer" input.

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

Recommended fix:

- Rebuild as a conversation flow with optional controls hidden behind `Options`.

### First-Save Completion

Strengths:

- Good direction: simple save, XP, unlock.
- CTA can lead the user forward.

Problems:

- Needs more visual reward energy.
- Should be tied to lesson-node unlock.

Recommended fix:

- Add a simple unlock animation later; for now, use a stronger reward card.

### Wins / Progress

Strengths:

- Strong content: session history, daily target, mistake bank.
- Mistake corrections are valuable.

Problems:

- Too much appears on one page.
- Looks like analytics instead of motivating wins.
- Full mistake list appears too early.

Recommended fix:

- Top card: "Your latest win". Then one mistake to fix. Hide the rest.

### Profile / Me

Strengths:

- Daily target control is useful.
- Simple structure.

Problems:

- Developer integration status should not be user-facing.
- Low emotional value.
- Looks unfinished.

Recommended fix:

- Make it a quiet learner settings page with daily target, language, local data and future account placeholder only.

### FeedbackPanel

Strengths:

- Has scores, strengths, improvements and rewrite.

Problems:

- Too generic.
- Too much feedback at once.
- "Mock AI feedback" breaks product immersion.

Recommended fix:

- Replace with "Coach feedback" and one highlighted correction first.

### Bottom Navigation Shell

Strengths:

- Three tabs is better than five.
- Labels are simpler.

Problems:

- Still appears too early after first save.
- Active state is mild.
- Tabs imply browsing instead of guided learning.

Recommended fix:

- Keep tabs for later, but during lessons use a focused mode with no bottom nav.
