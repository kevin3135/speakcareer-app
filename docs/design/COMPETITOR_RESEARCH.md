# SpeakCareer Competitor Design Research

This research is for pattern learning only. SpeakCareer should not copy competitor assets, mascots, brand colors, layouts, illustrations or exact interaction flows.

Sources reviewed:

- [Duolingo home screen redesign](https://blog.duolingo.com/new-duolingo-home-screen-design/)
- [Duolingo](https://www.duolingo.com/)
- [Speak](https://www.speak.com/)
- [ELSA Speak](https://elsaspeak.com/)
- [Praktika](https://praktika.ai/)
- [Babbel](https://www.babbel.com/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)

## Duolingo

What they do well:

- Turns learning into one obvious path, not a library.
- Makes the next action visually dominant.
- Uses streaks, XP, hearts and locked nodes as simple habit-loop signals.
- Keeps lessons short and easy to start.
- Makes progress visible before, during and after each lesson.

What SpeakCareer should learn:

- Use a guided career path with one active lesson node.
- Make locked future lessons visible but not actionable yet.
- Celebrate completion with a small reward, then immediately offer the next step.
- Use daily streak and XP as motivation, not as the main product.

What SpeakCareer should avoid copying:

- No mascot clone.
- No bright green Duolingo brand look.
- No hearts system copied directly.
- No childlike copy or overly playful lesson names.

Design patterns to adapt in an original way:

- Replace language-island levels with a "Career English path".
- Use "office skill nodes" such as Interview, Meeting, Presentation and Sales.
- Use a premium emerald, ink and gold palette instead of cartoon green.
- Use a professional coach badge or avatar, not an animal mascot.

## Speak

What they do well:

- Centers the product around speaking and realistic conversation.
- Makes the AI conversation feel like the core experience.
- Uses modern, uncluttered product positioning.
- Focuses on fluency and active practice instead of passive lessons.

What SpeakCareer should learn:

- Roleplay should feel like the main event, not a form buried under setup cards.
- Use short conversational prompts and visible speaking/writing turns.
- Let the AI coach guide the user through one exchange at a time.
- Keep the interface calm while the conversation feels alive.

What SpeakCareer should avoid copying:

- Do not copy Speak's brand language or visual style.
- Do not over-index on general conversation; SpeakCareer must stay career-specific.
- Do not imply real AI conversation until backend AI is connected.

Design patterns to adapt in an original way:

- Conversation-first roleplay screen with one prompt, one answer field and one coach response.
- "Your turn" and "Coach says" blocks instead of many setup cards.
- Fast 3-step speaking loop: listen/read, answer, improve.

## ELSA Speak

What they do well:

- Makes feedback feel measurable and useful.
- Turns pronunciation and speaking into progress scores.
- Shows strengths and improvement areas clearly.
- Uses learning diagnostics to create a sense of coaching precision.

What SpeakCareer should learn:

- Feedback must be visual and specific, not a wall of text.
- Scores should map to career skills: clarity, structure, tone and confidence.
- Mistake bank should feel like a personal improvement system.
- Use "say this instead" as a high-value correction pattern.

What SpeakCareer should avoid copying:

- Do not become a pronunciation-only app.
- Do not overload users with technical language scores.
- Do not copy ELSA's score visuals or branding.

Design patterns to adapt in an original way:

- Career feedback card with three simple meters: clear, confident, work-ready.
- One correction per lesson before showing the full mistake bank.
- Progress screen focused on "next fix" rather than large analytics.

## Praktika

What they do well:

- Uses AI tutor warmth and presence as a motivator.
- Makes practice feel personal through coach-like characters.
- Leans into conversational roleplay and daily speaking practice.
- Creates a feeling of guided companionship.

What SpeakCareer should learn:

- SpeakCareer needs a warm AI career coach identity.
- The coach should give short prompts, not long instructions.
- Use visual presence sparingly to make the experience friendlier.
- Professional roleplay can still feel human and encouraging.

What SpeakCareer should avoid copying:

- Do not copy AI avatar styles, names or characters.
- Avoid making the app feel like entertainment-first roleplay.
- Avoid uncanny or overproduced avatar UI before the core flow works.

Design patterns to adapt in an original way:

- A simple "SC Coach" identity with a polished badge, not a full avatar yet.
- Coach speech bubbles in onboarding and feedback.
- Career-specific warmth: "Let's make this sound more confident at work."

## Babbel

What they do well:

- Feels structured, credible and adult.
- Uses lessons, reviews and practical phrases without looking childish.
- Keeps copy educational and focused.
- Feels more premium and less gamified than Duolingo.

What SpeakCareer should learn:

- Keep the career tone credible.
- Use real workplace examples, not generic phrase drills.
- Make practice feel useful for an interview or meeting tomorrow.
- Keep the premium feel through typography, spacing and restraint.

What SpeakCareer should avoid copying:

- Do not become too static or textbook-like.
- Do not bury motivation under lesson catalogues.
- Do not copy Babbel's brand colors or lesson layout.

Design patterns to adapt in an original way:

- Adult learning tone with game-like progression.
- Short practical lessons that unlock roleplay.
- "Review" as a smart mistake-bank habit rather than a generic flashcard list.

## Apple Human Interface Guidelines

What they do well:

- Emphasize clarity, deference and depth.
- Encourage predictable navigation and clear feedback.
- Favor progressive disclosure over showing every control upfront.
- Make controls feel native and easy to understand.

What SpeakCareer should learn:

- The first screen should answer one question: "What do I do now?"
- Hide advanced controls until the user needs them.
- Use familiar mobile patterns: segmented controls, tabs only for major destinations, clear disabled states.
- Make touch targets large and consistent.

What SpeakCareer should avoid copying:

- Do not become visually plain because "native" is interpreted too literally.
- Do not use system defaults as the final brand identity.

Design patterns to adapt in an original way:

- Native-feeling buttons and sheets, with SpeakCareer color and reward language.
- Clear hierarchy: coach prompt, active lesson, primary CTA.
- Less chrome around secondary controls.

## Material Design / Android Principles

What they do well:

- Strong hierarchy through elevation, color roles and spacing.
- Clear component states for buttons, cards, navigation and progress.
- Scalable design token systems.
- Helpful guidance around navigation patterns and responsive layouts.

What SpeakCareer should learn:

- Build a stronger design system before adding more screens.
- Define card types, button types, reward states and lesson-node states.
- Use color semantically: active, locked, reward, warning, success.
- Keep Android web/native layouts predictable.

What SpeakCareer should avoid copying:

- Do not use generic Material surfaces without brand personality.
- Do not add too many FABs, chips or navigation surfaces.

Design patterns to adapt in an original way:

- SpeakCareer-specific tokens for active lesson, coach, XP, locked step and correction.
- Consistent card elevation and spacing.
- Bottom navigation only after the user understands the core loop.

## Premium / Paywall Pattern Notes

Payments are intentionally out of scope now. Design research still shows useful future patterns:

- Premium screens should explain the value in one sentence.
- The free product must remain useful before any paywall appears.
- Paywall design should highlight roleplay depth, AI feedback and progress review.
- Avoid early monetization prompts before the first "aha" moment.

For the MVP, do not build a paywall. Instead, design completion screens and locked previews in a way that could later support premium value without blocking learning.
