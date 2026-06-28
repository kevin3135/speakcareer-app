import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const practiceContent = JSON.parse(
  await readFile(new URL('../src/data/practiceContent.json', import.meta.url), 'utf8'),
);
const progressMock = JSON.parse(
  await readFile(new URL('../src/data/progressMock.json', import.meta.url), 'utf8'),
);

test('includes the required English roleplay scenarios', () => {
  const titles = practiceContent.roleplays.map((roleplay) => roleplay.title);
  const categories = practiceContent.roleplays.map((roleplay) => roleplay.category);

  assert.deepEqual(titles, [
    'Job Interview',
    'Meeting Practice',
    'Presentation Practice',
    'Sales Call',
    'Workplace Small Talk',
  ]);
  assert.deepEqual(categories, ['Interview', 'Meeting', 'Presentation', 'Sales', 'Small Talk']);
});

test('keeps the first MVP focused on English', () => {
  assert.equal(practiceContent.firstTargetLanguage, 'English');

  for (const roleplay of practiceContent.roleplays) {
    assert.equal(roleplay.targetLanguage, 'English');
  }
});

test('keeps the guided first experience simple and action oriented', async () => {
  const {
    foundationStart,
    guidedIntroSteps,
    guidedStart,
    levelAssessment,
  } = await import('../src/data/guidedIntro.ts');

  assert.deepEqual(
    guidedIntroSteps.map((step) => step.id),
    ['structure', 'example', 'practice'],
  );
  assert.equal(guidedIntroSteps.length, 3);
  assert.equal(levelAssessment.choices.length, 3);
  assert.deepEqual(
    levelAssessment.choices.map((choice) => choice.label),
    ['A1-A2', 'B1', 'B2'],
  );
  assert.deepEqual(
    levelAssessment.choices.map((choice) => choice.id),
    ['starter', 'basic', 'confident'],
  );
  assert.equal(foundationStart.ctaLabel, 'Start lesson');
  assert.deepEqual(foundationStart.structure, ['I', 'action', 'result']);
  assert.ok(foundationStart.subtitle.includes('one sentence shape'));
  assert.equal(guidedStart.roleplayId, 'job-interview');
  assert.deepEqual(guidedStart.detailLabels, ['5 minutes', '2-4 sentences', 'Clear rewrite']);
  assert.equal(guidedStart.title, 'Quest 1: Job Interview');
  assert.ok(guidedIntroSteps.every((step) => step.title.length <= 32));
  assert.ok(guidedIntroSteps.every((step) => step.body.length <= 72));
});

test('shows a first-quest banner only for the initial Job Interview run', async () => {
  const { guidedStart } = await import('../src/data/guidedIntro.ts');
  const { createRoleplayFirstQuestState } = await import('../src/utils/roleplayFirstQuest.ts');

  const firstQuest = createRoleplayFirstQuestState({
    guidedStart,
    roleplayId: 'job-interview',
    sessions: [],
  });

  assert.equal(firstQuest.eyebrow, 'First quest');
  assert.equal(firstQuest.title, 'Quest 1: Job Interview');
  assert.equal(firstQuest.progressLabel, '0/1 saved');
  assert.equal(firstQuest.unlockLabel, 'Unlock Home and Progress');
  assert.deepEqual(firstQuest.detailLabels, ['5 minutes', '2-4 sentences', 'Clear rewrite']);
  assert.ok(firstQuest.body.includes('Save one short Job Interview answer'));

  assert.equal(
    createRoleplayFirstQuestState({
      guidedStart,
      roleplayId: 'meeting-practice',
      sessions: [],
    }),
    null,
  );
  assert.equal(
    createRoleplayFirstQuestState({
      guidedStart,
      roleplayId: 'job-interview',
      sessions: [{ roleplayId: 'job-interview' }],
    }),
    null,
  );
});

test('creates one simple first-quest feedback card', async () => {
  const { createFirstQuestFeedbackState } = await import('../src/utils/firstQuestFeedback.ts');

  assert.equal(
    createFirstQuestFeedbackState({
      answerReview: null,
      feedbackResult: null,
    }),
    null,
  );

  const needsWork = createFirstQuestFeedbackState({
    answerReview: {
      isReadyForFeedback: false,
      readinessLabel: 'Add one more sentence',
      reviewNote: 'Write at least two short sentences before saving.',
    },
    feedbackResult: null,
  });

  assert.equal(needsWork.title, 'Add one more sentence');
  assert.equal(needsWork.body, 'Write at least two short sentences before saving.');
  assert.equal(needsWork.rewrite, undefined);

  const ready = createFirstQuestFeedbackState({
    answerReview: {
      isReadyForFeedback: true,
      readinessLabel: 'Ready',
      reviewNote: 'Good enough to review.',
    },
    feedbackResult: {
      feedback: {
        suggestedRewrite: 'I helped the team finish the project on time.',
      },
      xpReward: 40,
    },
  });

  assert.equal(ready.title, 'Good. Say it like this.');
  assert.equal(ready.rewriteLabel, 'Better English');
  assert.equal(
    ready.rewrite,
    'I helped my team finish a project on time by organizing tasks and sharing clear updates.',
  );
  assert.ok(ready.rewrite.length < 92);
  assert.equal(ready.xpLabel, '+40 XP');
});

test('summarizes roleplay feedback scores for the coach step', async () => {
  const { createFeedbackScoreSummary } = await import('../src/utils/feedbackScoreSummary.ts');

  assert.deepEqual(createFeedbackScoreSummary([]), {
    nextFocusArea: null,
    overallScore: 0,
    strongestArea: null,
  });

  const summary = createFeedbackScoreSummary([
    { label: 'Clarity', value: 78.4 },
    { label: 'Confidence', value: 61.2 },
    { label: 'Structure', value: 105 },
    { label: 'Vocabulary', value: -5 },
  ]);

  assert.equal(summary.overallScore, 60);
  assert.deepEqual(summary.strongestArea, { label: 'Structure', value: 100 });
  assert.deepEqual(summary.nextFocusArea, { label: 'Vocabulary', value: 0 });
});

test('creates a concrete coach snapshot from the learner answer', async () => {
  const { createFeedbackScoreSummary } = await import('../src/utils/feedbackScoreSummary.ts');
  const { createFeedbackSnapshot } = await import('../src/utils/feedbackSnapshot.ts');

  const summary = createFeedbackScoreSummary([
    { label: 'Clarity', value: 78 },
    { label: 'Confidence', value: 65 },
    { label: 'Structure', value: 88 },
    { label: 'Vocabulary', value: 62 },
  ]);
  const snapshot = createFeedbackSnapshot({
    answer: `
      In my previous role, I led the onboarding handoff for new clients and shared weekly updates
      with the support team so everyone knew the next step before launch.
    `,
    improvements: ['Add one measurable result or business outcome.'],
    summary,
  });

  assert.equal(snapshot.strongestLabel, 'Structure 88');
  assert.equal(snapshot.nextFocusLabel, 'Vocabulary 62');
  assert.ok(snapshot.answerPreview.startsWith('In my previous role'));
  assert.ok(snapshot.answerPreview.endsWith('...'));
  assert.equal(
    snapshot.nextMoveText,
    'Add one measurable result or business outcome.',
  );
});

test('creates a simple first-quest completion handoff', async () => {
  const { createFirstQuestCompletionState } = await import('../src/utils/firstQuestCompletion.ts');

  const completion = createFirstQuestCompletionState({
    nextPracticeRecommendation: {
      reason: 'Train a different meeting skill: concise updates and follow-up questions.',
      title: 'Meeting Practice',
    },
    xpReward: 40,
  });

  assert.equal(completion.eyebrow, 'Step 3 of 3');
  assert.equal(completion.title, 'Saved');
  assert.equal(completion.unlockLabel, 'Next lesson unlocked');
  assert.equal(completion.nextTitle, 'Meeting Practice');
  assert.equal(completion.ctaLabel, 'Continue');
  assert.equal(completion.ctaTarget, 'roleplay');
  assert.equal(completion.xpLabel, '+40 XP');
  assert.ok(completion.body.includes('next lesson'));

  const fallback = createFirstQuestCompletionState({
    nextPracticeRecommendation: null,
    xpReward: 25,
  });

  assert.equal(fallback.ctaLabel, 'Continue');
  assert.equal(fallback.ctaTarget, 'progress');
  assert.equal(fallback.nextTitle, 'Wins');
  assert.equal(fallback.xpLabel, '+25 XP');
});

test('stores onboarding completion in local storage', async () => {
  const {
    ONBOARDING_COMPLETED_KEY,
    readOnboardingCompletion,
    saveOnboardingCompletion,
  } = await import('../src/utils/onboardingStorage.ts');
  const values = new Map();
  const storage = {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      values.set(key, value);
    },
  };

  assert.equal(await readOnboardingCompletion(storage), false);

  await saveOnboardingCompletion(storage);

  assert.equal(values.get(ONBOARDING_COMPLETED_KEY), 'true');
  assert.equal(await readOnboardingCompletion(storage), true);
  assert.equal(
    await readOnboardingCompletion({
      getItem: async () => {
        throw new Error('Storage unavailable');
      },
      setItem: async () => undefined,
    }),
    false,
  );
});

test('stores the selected starting level in local storage', async () => {
  const {
    STARTING_LEVEL_KEY,
    parseStartingLevelValue,
    readStartingLevel,
    saveStartingLevel,
  } = await import('../src/utils/startingLevelStorage.ts');
  const values = new Map();
  const storage = {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      values.set(key, value);
    },
  };

  assert.equal(parseStartingLevelValue('starter'), 'starter');
  assert.equal(parseStartingLevelValue('confident'), 'confident');
  assert.equal(parseStartingLevelValue('something-else'), 'basic');
  assert.equal(await readStartingLevel(storage), 'basic');

  await saveStartingLevel(storage, 'confident');

  assert.equal(values.get(STARTING_LEVEL_KEY), 'confident');
  assert.equal(await readStartingLevel(storage), 'confident');
  assert.equal(
    await readStartingLevel({
      getItem: async () => {
        throw new Error('Storage unavailable');
      },
      setItem: async () => undefined,
    }),
    'basic',
  );
});

test('stores foundation progress in local storage', async () => {
  const {
    FOUNDATION_PROGRESS_KEY,
    FOUNDATION_TOTAL_STEPS,
    parseFoundationProgressValue,
    readFoundationProgress,
    saveFoundationProgress,
  } = await import('../src/utils/foundationProgressStorage.ts');
  const values = new Map();
  const storage = {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      values.set(key, value);
    },
  };

  assert.equal(parseFoundationProgressValue(null), 0);
  assert.equal(parseFoundationProgressValue('2'), 2);
  assert.equal(parseFoundationProgressValue('9'), FOUNDATION_TOTAL_STEPS);
  assert.equal(parseFoundationProgressValue('-3'), 0);
  assert.equal(await readFoundationProgress(storage), 0);

  await saveFoundationProgress(storage, 2);

  assert.equal(values.get(FOUNDATION_PROGRESS_KEY), '2');
  assert.equal(await readFoundationProgress(storage), 2);

  await saveFoundationProgress(storage, 99);

  assert.equal(values.get(FOUNDATION_PROGRESS_KEY), FOUNDATION_TOTAL_STEPS.toString());
  assert.equal(
    await readFoundationProgress({
      getItem: async () => {
        throw new Error('Storage unavailable');
      },
      setItem: async () => undefined,
    }),
    0,
  );
});

test('creates a personalized onboarding first-path preview from the selected level', async () => {
  const { createOnboardingPlanPreview } = await import('../src/utils/onboardingPlan.ts');
  const { foundationStart, guidedStart, levelAssessment } = await import('../src/data/guidedIntro.ts');
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterChoice = levelAssessment.choices.find((choice) => choice.id === 'starter');
  const starterProfile = getStartingLevelProfile('starter');
  const starterPreview = createOnboardingPlanPreview({
    coachNote: starterProfile.coachMessage,
    dailyTarget: 1,
    firstLessonDetail: starterProfile.foundationRule,
    firstLessonTitle: foundationStart.title,
    firstQuestSubtitle: guidedStart.subtitle,
    firstQuestTitle: guidedStart.title,
    levelLabel: starterChoice.label,
    starterPrompt: starterProfile.answerPlaceholder,
  });
  const confidentChoice = levelAssessment.choices.find((choice) => choice.id === 'confident');
  const confidentProfile = getStartingLevelProfile('confident');
  const confidentPreview = createOnboardingPlanPreview({
    coachNote: confidentProfile.coachMessage,
    dailyTarget: 3,
    firstLessonDetail: confidentProfile.foundationRule,
    firstLessonTitle: foundationStart.title,
    firstQuestSubtitle: guidedStart.subtitle,
    firstQuestTitle: guidedStart.title,
    levelLabel: confidentChoice.label,
    starterPrompt: confidentProfile.answerPlaceholder,
  });

  assert.equal(starterPreview.title, 'Your first English path');
  assert.equal(starterPreview.levelLabel, 'A1-A2');
  assert.equal(starterPreview.steps[0].label, 'Lesson 1');
  assert.equal(starterPreview.steps[0].title, 'Learn one clear sentence');
  assert.ok(starterPreview.steps[0].detail.includes('one clear result'));
  assert.equal(starterPreview.steps[1].label, 'Quest 1');
  assert.equal(starterPreview.steps[1].title, 'Quest 1: Job Interview');
  assert.ok(starterPreview.coachNote.includes('Keep it simple'));
  assert.ok(starterPreview.starterPrompt.includes('I worked on'));
  assert.equal(starterPreview.dailyTargetLabel, '1 roleplay a day');
  assert.ok(starterPreview.dailyTargetNote.includes('steady five-minute'));

  assert.equal(confidentPreview.levelLabel, 'B2');
  assert.ok(confidentPreview.steps[0].detail.includes('business result'));
  assert.ok(confidentPreview.coachNote.includes('business result'));
  assert.ok(confidentPreview.starterPrompt.includes('In my current role'));
  assert.equal(confidentPreview.dailyTargetLabel, '3 roleplays a day');
  assert.ok(confidentPreview.dailyTargetNote.includes('extra interview reps'));
});

test('stores the daily practice target in local storage', async () => {
  const {
    DAILY_TARGET_KEY,
    parseDailyTargetValue,
    readDailyTarget,
    saveDailyTarget,
  } = await import('../src/utils/dailyTargetStorage.ts');
  const values = new Map();
  const storage = {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      values.set(key, value);
    },
  };

  assert.equal(parseDailyTargetValue('2'), 2);
  assert.equal(parseDailyTargetValue('3'), 3);
  assert.equal(parseDailyTargetValue('8'), 1);
  assert.equal(await readDailyTarget(storage), 1);

  await saveDailyTarget(storage, 3);

  assert.equal(values.get(DAILY_TARGET_KEY), '3');
  assert.equal(await readDailyTarget(storage), 3);
  assert.equal(
    await readDailyTarget({
      getItem: async () => {
        throw new Error('Storage unavailable');
      },
      setItem: async () => undefined,
    }),
    1,
  );
});

test('personalizes the first lesson and answer starter by starting level', async () => {
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterProfile = getStartingLevelProfile('starter');
  const basicProfile = getStartingLevelProfile('basic');
  const confidentProfile = getStartingLevelProfile('confident');

  assert.deepEqual(starterProfile.foundationExampleParts, ['I', 'organized the weekly report', 'and sent it on time.']);
  assert.ok(starterProfile.answerPlaceholder.includes('I worked on'));
  assert.ok(starterProfile.starterAnswer.includes('The result was'));

  assert.deepEqual(basicProfile.foundationExampleParts, ['I', 'helped the team finish', 'the project on time.']);
  assert.ok(basicProfile.answerPlaceholder.includes('Currently, I'));

  assert.deepEqual(confidentProfile.foundationExampleParts, ['I', 'led the project update', 'and reduced delays for the team.']);
  assert.ok(confidentProfile.answerPlaceholder.includes('In my current role'));
  assert.equal(getStartingLevelProfile(null).foundationExample, basicProfile.foundationExample);
});

test('creates a level-matched foundation handoff before the first interview', async () => {
  const { guidedStart } = await import('../src/data/guidedIntro.ts');
  const { createFoundationHandoff } = await import('../src/utils/foundationHandoff.ts');
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterProfile = getStartingLevelProfile('starter');
  const confidentProfile = getStartingLevelProfile('confident');
  const starterHandoff = createFoundationHandoff({
    coachNote: starterProfile.coachMessage,
    nextQuestTitle: guidedStart.title,
    starterAnswer: starterProfile.starterAnswer,
  });
  const confidentHandoff = createFoundationHandoff({
    coachNote: confidentProfile.coachMessage,
    nextQuestTitle: guidedStart.title,
    starterAnswer: confidentProfile.starterAnswer,
  });

  assert.equal(starterHandoff.eyebrow, 'Next step');
  assert.equal(starterHandoff.title, 'Quest 1: Job Interview');
  assert.equal(starterHandoff.starterLabel, 'Starter answer');
  assert.ok(starterHandoff.body.includes('first interview answer'));
  assert.ok(starterHandoff.coachNote.includes('Keep it simple'));
  assert.ok(starterHandoff.starterAnswer.includes('The result was'));

  assert.ok(confidentHandoff.coachNote.includes('business result'));
  assert.ok(confidentHandoff.starterAnswer.includes('As a result'));
  assert.notEqual(confidentHandoff.starterAnswer, starterHandoff.starterAnswer);
});

test('shows a starter reminder only on the first Job Interview answer card', async () => {
  const { createRoleplayStarterReminder } = await import('../src/utils/roleplayStarterReminder.ts');
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterProfile = getStartingLevelProfile('starter');
  const confidentProfile = getStartingLevelProfile('confident');
  const starterReminder = createRoleplayStarterReminder({
    roleplayId: 'job-interview',
    sessions: [],
    starterAnswer: starterProfile.starterAnswer,
  });
  const confidentReminder = createRoleplayStarterReminder({
    roleplayId: 'job-interview',
    sessions: [],
    starterAnswer: confidentProfile.starterAnswer,
  });

  assert.equal(starterReminder.eyebrow, 'Starter reminder');
  assert.equal(starterReminder.ctaLabel, 'Use starter');
  assert.ok(starterReminder.body.includes('faster first answer'));
  assert.ok(starterReminder.starterAnswer.includes('The result was'));
  assert.ok(confidentReminder.starterAnswer.includes('As a result'));

  assert.equal(
    createRoleplayStarterReminder({
      roleplayId: 'meeting-practice',
      sessions: [],
      starterAnswer: starterProfile.starterAnswer,
    }),
    null,
  );
  assert.equal(
    createRoleplayStarterReminder({
      roleplayId: 'job-interview',
      sessions: [{ roleplayId: 'job-interview' }],
      starterAnswer: starterProfile.starterAnswer,
    }),
    null,
  );
});

test('creates a foundation handoff cue for the first interview answer', async () => {
  const { createFoundationWarmupCue } = await import('../src/utils/roleplayWarmupCue.ts');
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterProfile = getStartingLevelProfile('starter');
  const confidentProfile = getStartingLevelProfile('confident');
  const starterCue = createFoundationWarmupCue({
    coachNote: starterProfile.coachMessage,
    starterAnswer: starterProfile.starterAnswer,
  });
  const confidentCue = createFoundationWarmupCue({
    coachNote: confidentProfile.coachMessage,
    starterAnswer: confidentProfile.starterAnswer,
  });

  assert.equal(starterCue.cueId, 'foundation-starter');
  assert.equal(starterCue.eyebrow, 'Foundation handoff');
  assert.equal(starterCue.badgeLabel, 'From Lesson 1');
  assert.equal(starterCue.ctaLabel, 'Use starter line');
  assert.ok(starterCue.note.includes('Keep it simple'));
  assert.ok(starterCue.starterAnswer.includes('The result was'));
  assert.ok(confidentCue.note.includes('business result'));
  assert.ok(confidentCue.starterAnswer.includes('As a result'));
});

test('provides mock feedback and mistake-bank data', () => {
  for (const roleplay of practiceContent.roleplays) {
    assert.ok(roleplay.feedback.summary.length > 20);
    assert.ok(roleplay.feedback.scores.length >= 4);
    assert.ok(roleplay.feedback.suggestedRewrite.length > 20);
    assert.ok(roleplay.followUpPrompts.length >= 2);
    assert.ok(roleplay.followUpPrompts[0].length > 20);
  }

  assert.ok(progressMock.mistakeBank.length >= 4);
  assert.ok(progressMock.summary.nextFocus.length > 10);
});

test('adds repeatable prompt variants for core roleplay categories', () => {
  const interview = practiceContent.roleplays.find((roleplay) => roleplay.id === 'job-interview');
  const meeting = practiceContent.roleplays.find((roleplay) => roleplay.id === 'meeting-practice');
  const presentation = practiceContent.roleplays.find((roleplay) => roleplay.id === 'presentation-practice');
  const sales = practiceContent.roleplays.find((roleplay) => roleplay.id === 'sales-call');
  const smallTalk = practiceContent.roleplays.find((roleplay) => roleplay.id === 'workplace-small-talk');

  assert.ok(interview.promptVariants.length >= 3);
  assert.ok(meeting.promptVariants.length >= 3);
  assert.ok(presentation.promptVariants.length >= 3);
  assert.ok(sales.promptVariants.length >= 3);
  assert.ok(smallTalk.promptVariants.length >= 3);
  assert.deepEqual(
    interview.promptVariants.map((variant) => variant.title),
    ['Tell me about yourself', 'Why this role?', 'Difficult situation'],
  );
  assert.deepEqual(
    meeting.promptVariants.map((variant) => variant.title),
    [
      'Status update',
      'Clarify deadline',
      'Polite interruption',
      'Challenge decision',
      'Polite disagreement',
    ],
  );
  assert.deepEqual(
    presentation.promptVariants.map((variant) => variant.title),
    ['Opening agenda', 'Smooth transition', 'Handle challenge', 'Audience question', 'Q&A follow-up'],
  );
  assert.deepEqual(
    sales.promptVariants.map((variant) => variant.title),
    ['Price concern', 'Budget value', 'Timing concern', 'Existing tool'],
  );
  assert.deepEqual(
    smallTalk.promptVariants.map((variant) => variant.title),
    ['Quick introduction', 'Friendly follow-up', 'Project follow-up', 'Move to meeting'],
  );

  for (const variant of [
    ...interview.promptVariants,
    ...meeting.promptVariants,
    ...presentation.promptVariants,
    ...sales.promptVariants,
    ...smallTalk.promptVariants,
  ]) {
    assert.ok(variant.openingLine.length > 20);
    assert.ok(variant.userGoal.length > 20);
    assert.ok(variant.coachingNote.length > 20);
  }
});

test('adds interview-specific phrases for each interview practice angle', () => {
  const interview = practiceContent.roleplays.find((roleplay) => roleplay.id === 'job-interview');

  for (const variant of interview.promptVariants) {
    assert.equal(variant.suggestedPhrases.length, 3);
    assert.ok(variant.suggestedPhrases.every((phrase) => phrase.length > 15));
    assert.ok(variant.feedbackGuidance.summaryHint.length > 20);
    assert.ok(variant.feedbackGuidance.strengthFocus.length > 20);
    assert.ok(variant.feedbackGuidance.improvementFocus.length > 20);
    assert.ok(variant.feedbackGuidance.suggestedRewrite.length > 40);
  }

  assert.ok(
    interview.promptVariants
      .find((variant) => variant.id === 'role-motivation')
      .suggestedPhrases.some((phrase) => phrase.includes('interests me')),
  );
  assert.ok(
    interview.promptVariants
      .find((variant) => variant.id === 'difficult-situation')
      .suggestedPhrases.some((phrase) => phrase.includes('challenging')),
  );
});

test('adds meeting-specific phrases for each meeting practice angle', () => {
  const meeting = practiceContent.roleplays.find((roleplay) => roleplay.id === 'meeting-practice');

  for (const variant of meeting.promptVariants) {
    assert.equal(variant.suggestedPhrases.length, 3);
    assert.ok(variant.suggestedPhrases.every((phrase) => phrase.length > 15));
    assert.ok(variant.feedbackGuidance.summaryHint.length > 20);
    assert.ok(variant.feedbackGuidance.strengthFocus.length > 20);
    assert.ok(variant.feedbackGuidance.improvementFocus.length > 20);
    assert.ok(variant.feedbackGuidance.suggestedRewrite.length > 40);
  }

  assert.ok(
    meeting.promptVariants
      .find((variant) => variant.id === 'status-update')
      .suggestedPhrases.some((phrase) => phrase.includes('last meeting')),
  );
  assert.ok(
    meeting.promptVariants
      .find((variant) => variant.id === 'clarify-deadline')
      .suggestedPhrases.some((phrase) => phrase.includes('deadline')),
  );
  assert.ok(
    meeting.promptVariants
      .find((variant) => variant.id === 'polite-interruption')
      .suggestedPhrases.some((phrase) => phrase.includes('interrupt')),
  );
  assert.ok(
    meeting.promptVariants
      .find((variant) => variant.id === 'polite-interruption')
      .feedbackGuidance.suggestedRewrite.includes('Please continue'),
  );
  assert.ok(
    meeting.promptVariants
      .find((variant) => variant.id === 'challenge-decision')
      .suggestedPhrases.some((phrase) => phrase.includes('risk')),
  );
  assert.ok(
    meeting.promptVariants
      .find((variant) => variant.id === 'polite-disagreement')
      .suggestedPhrases.some((phrase) => phrase.includes('concerned')),
  );
  assert.ok(
    meeting.promptVariants
      .find((variant) => variant.id === 'polite-disagreement')
      .feedbackGuidance.suggestedRewrite.includes('Could we clarify'),
  );
});

test('adds presentation-specific phrases for each presentation practice angle', () => {
  const presentation = practiceContent.roleplays.find((roleplay) => roleplay.id === 'presentation-practice');

  for (const variant of presentation.promptVariants) {
    assert.equal(variant.suggestedPhrases.length, 3);
    assert.ok(variant.suggestedPhrases.every((phrase) => phrase.length > 15));
    assert.ok(variant.feedbackGuidance.summaryHint.length > 20);
    assert.ok(variant.feedbackGuidance.strengthFocus.length > 20);
    assert.ok(variant.feedbackGuidance.improvementFocus.length > 20);
    assert.ok(variant.feedbackGuidance.suggestedRewrite.length > 40);
  }

  assert.ok(
    presentation.promptVariants
      .find((variant) => variant.id === 'opening-agenda')
      .suggestedPhrases.some((phrase) => phrase.includes('decision')),
  );
  assert.ok(
    presentation.promptVariants
      .find((variant) => variant.id === 'smooth-transition')
      .suggestedPhrases.some((phrase) => phrase.includes('next point')),
  );
  assert.ok(
    presentation.promptVariants
      .find((variant) => variant.id === 'handle-challenge')
      .suggestedPhrases.some((phrase) => phrase.includes('low-risk')),
  );
  assert.ok(
    presentation.promptVariants
      .find((variant) => variant.id === 'audience-question')
      .suggestedPhrases.some((phrase) => phrase.includes('fair question')),
  );
  assert.ok(
    presentation.promptVariants
      .find((variant) => variant.id === 'audience-question')
      .feedbackGuidance.suggestedRewrite.includes('short pilot'),
  );
  assert.ok(
    presentation.promptVariants
      .find((variant) => variant.id === 'qa-follow-up')
      .suggestedPhrases.some((phrase) => phrase.includes('pilot')),
  );
  assert.ok(
    presentation.promptVariants
      .find((variant) => variant.id === 'qa-follow-up')
      .feedbackGuidance.suggestedRewrite.includes('decision rule'),
  );
});

test('adds sales-specific phrases for each sales objection angle', () => {
  const sales = practiceContent.roleplays.find((roleplay) => roleplay.id === 'sales-call');

  for (const variant of sales.promptVariants) {
    assert.equal(variant.suggestedPhrases.length, 3);
    assert.ok(variant.suggestedPhrases.every((phrase) => phrase.length > 15));
    assert.ok(variant.feedbackGuidance.summaryHint.length > 20);
    assert.ok(variant.feedbackGuidance.strengthFocus.length > 20);
    assert.ok(variant.feedbackGuidance.improvementFocus.length > 20);
    assert.ok(variant.feedbackGuidance.suggestedRewrite.length > 40);
  }

  assert.ok(
    sales.promptVariants
      .find((variant) => variant.id === 'price-concern')
      .suggestedPhrases.some((phrase) => phrase.includes('price')),
  );
  assert.ok(
    sales.promptVariants
      .find((variant) => variant.id === 'budget-value')
      .suggestedPhrases.some((phrase) => phrase.includes('budget decisions')),
  );
  assert.ok(
    sales.promptVariants
      .find((variant) => variant.id === 'budget-value')
      .feedbackGuidance.suggestedRewrite.includes('compare the cost'),
  );
  assert.ok(
    sales.promptVariants
      .find((variant) => variant.id === 'timing-concern')
      .suggestedPhrases.some((phrase) => phrase.includes('priority')),
  );
  assert.ok(
    sales.promptVariants
      .find((variant) => variant.id === 'existing-tool')
      .suggestedPhrases.some((phrase) => phrase.includes('current tool')),
  );
});

test('adds small-talk-specific phrases for each workplace small talk angle', () => {
  const smallTalk = practiceContent.roleplays.find((roleplay) => roleplay.id === 'workplace-small-talk');

  for (const variant of smallTalk.promptVariants) {
    assert.equal(variant.suggestedPhrases.length, 3);
    assert.ok(variant.suggestedPhrases.every((phrase) => phrase.length > 15));
    assert.ok(variant.feedbackGuidance.summaryHint.length > 20);
    assert.ok(variant.feedbackGuidance.strengthFocus.length > 20);
    assert.ok(variant.feedbackGuidance.improvementFocus.length > 20);
    assert.ok(variant.feedbackGuidance.suggestedRewrite.length > 40);
  }

  assert.ok(
    smallTalk.promptVariants
      .find((variant) => variant.id === 'quick-introduction')
      .suggestedPhrases.some((phrase) => phrase.includes('role')),
  );
  assert.ok(
    smallTalk.promptVariants
      .find((variant) => variant.id === 'friendly-follow-up')
      .suggestedPhrases.some((phrase) => phrase.includes('project')),
  );
  assert.ok(
    smallTalk.promptVariants
      .find((variant) => variant.id === 'project-follow-up')
      .suggestedPhrases.some((phrase) => phrase.includes('main update')),
  );
  assert.ok(
    smallTalk.promptVariants
      .find((variant) => variant.id === 'project-follow-up')
      .feedbackGuidance.suggestedRewrite.includes('How is your project going'),
  );
  assert.ok(
    smallTalk.promptVariants
      .find((variant) => variant.id === 'move-to-meeting')
      .suggestedPhrases.some((phrase) => phrase.includes('agenda')),
  );
});

test('reviews typed roleplay answers with simple local rules', async () => {
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');

  assert.equal(summarizePracticeAnswer('').isReadyForFeedback, false);
  assert.equal(summarizePracticeAnswer('Too short').readinessLabel, 'Needs more detail');

  const review = summarizePracticeAnswer(
    'In my previous role, I coordinated the weekly customer feedback review and turned repeated complaints into product priorities for the team.',
  );

  assert.equal(review.isReadyForFeedback, true);
  assert.ok(review.wordCount >= 12);
});

test('creates local practice sessions from reviewed answers', async () => {
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');
  const { createRuleBasedFeedback } = await import('../src/utils/ruleBasedFeedback.ts');
  const { createPracticeSession } = await import('../src/utils/sessionHistory.ts');
  const roleplay = practiceContent.roleplays[0];
  const answer = 'I led customer feedback reviews and turned repeated issues into clear product priorities for the team.';
  const followUpAnswer = 'As a result, we reduced repeat issues and made the weekly review faster for the team.';
  const review = summarizePracticeAnswer(answer);
  const feedbackResult = createRuleBasedFeedback(roleplay, answer, review);
  const session = createPracticeSession({
    answer,
    followUpAnswer,
    includedFollowUp: true,
    feedback: feedbackResult.feedback,
    review,
    roleplay,
    xpReward: feedbackResult.xpReward,
    completedAt: new Date('2026-06-26T10:00:00.000Z'),
  });

  assert.equal(session.roleplayTitle, 'Job Interview');
  assert.equal(session.roleplayId, 'job-interview');
  assert.equal(session.wordCount, review.wordCount);
  assert.ok(session.answerPreview.includes('Follow-up:'));
  assert.equal(session.xpReward, feedbackResult.xpReward);
  assert.ok(session.feedbackSummary.includes('Follow-up included.'));
  assert.ok(session.nextFocusLabel);
  assert.ok(session.nextFocusText);
  assert.ok(session.nextFocusText.includes('Add') || session.nextFocusText.includes('Use'));
  assert.equal(session.completedAt, '2026-06-26T10:00:00.000Z');
  assert.equal(session.includedFollowUp, true);
});

test('stores local practice sessions safely', async () => {
  const {
    PRACTICE_SESSIONS_KEY,
    MAX_STORED_PRACTICE_SESSIONS,
    normalizePracticeSessions,
    readPracticeSessions,
    savePracticeSessions,
  } = await import('../src/utils/practiceSessionStorage.ts');
  const sessions = Array.from({ length: 12 }, (_, index) => ({
    id: `job-interview-${index}`,
    roleplayId: 'job-interview',
    roleplayTitle: 'Job Interview',
    completedAt: `2026-06-26T10:${String(index).padStart(2, '0')}:00.000Z`,
    answerPreview: `Answer preview ${index}`,
    wordCount: 20 + index,
    readinessLabel: 'Ready for feedback',
    feedbackSummary: 'Clear answer with useful detail.',
    nextFocusLabel: 'Structure 68',
    nextFocusText: 'Use a simple structure: context, action, result.',
    includedFollowUp: index === 0,
    xpReward: 40 + index,
  }));
  const values = new Map();
  const storage = {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      values.set(key, value);
    },
  };

  await savePracticeSessions(storage, sessions);

  assert.equal(JSON.parse(values.get(PRACTICE_SESSIONS_KEY)).length, MAX_STORED_PRACTICE_SESSIONS);
  assert.equal((await readPracticeSessions(storage)).length, MAX_STORED_PRACTICE_SESSIONS);
  assert.equal((await readPracticeSessions(storage))[0].id, 'job-interview-0');
  assert.equal((await readPracticeSessions(storage))[0].includedFollowUp, true);
  assert.equal((await readPracticeSessions(storage))[0].nextFocusLabel, 'Structure 68');
  assert.equal(
    (await readPracticeSessions(storage))[0].nextFocusText,
    'Use a simple structure: context, action, result.',
  );
  assert.deepEqual(
    normalizePracticeSessions([
      {
        id: 'legacy-session',
        roleplayId: 'job-interview',
        roleplayTitle: 'Job Interview',
        completedAt: '2026-06-26T10:00:00.000Z',
        answerPreview: 'Legacy answer preview',
        wordCount: 22,
        readinessLabel: 'Ready for feedback',
        feedbackSummary: 'Legacy summary',
        includedFollowUp: false,
        xpReward: 30,
      },
    ])[0]?.nextFocusText,
    '',
  );
  assert.deepEqual(normalizePracticeSessions([{ id: 'missing-fields' }]), []);
  assert.deepEqual(
    await readPracticeSessions({
      getItem: async () => '{broken-json',
      setItem: async () => undefined,
    }),
    [],
  );
});

test('stores practiced mistake ids in local storage', async () => {
  const {
    PRACTICED_MISTAKE_IDS_KEY,
    normalizePracticedMistakeIds,
    readPracticedMistakeIds,
    savePracticedMistakeIds,
  } = await import('../src/utils/mistakePracticeStorage.ts');
  const values = new Map();
  const storage = {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      values.set(key, value);
    },
  };

  assert.deepEqual(normalizePracticedMistakeIds(['m-001', '', 12, 'm-002']), ['m-001', 'm-002']);
  assert.deepEqual(await readPracticedMistakeIds(storage), []);

  await savePracticedMistakeIds(storage, ['m-001', 'm-002', 'm-001']);

  assert.equal(values.get(PRACTICED_MISTAKE_IDS_KEY), JSON.stringify(['m-001', 'm-002']));
  assert.deepEqual(await readPracticedMistakeIds(storage), ['m-001', 'm-002']);
  assert.deepEqual(
    await readPracticedMistakeIds({
      getItem: async () => {
        throw new Error('Storage unavailable');
      },
      setItem: async () => undefined,
    }),
    [],
  );
});

test('creates a lesson-complete summary from saved sessions', async () => {
  const { createLessonCompleteSummary } = await import('../src/utils/lessonComplete.ts');
  const sessions = [
    {
      id: 'meeting-practice-1',
      roleplayId: 'meeting-practice',
      roleplayTitle: 'Meeting Practice',
      completedAt: '2026-06-26T10:00:00.000Z',
      answerPreview: 'Since our last meeting, I completed the first draft.',
      wordCount: 42,
      readinessLabel: 'Ready for feedback',
      feedbackSummary: 'Strong update with clear next steps.',
      xpReward: 65,
    },
    {
      id: 'job-interview-1',
      roleplayId: 'job-interview',
      roleplayTitle: 'Job Interview',
      completedAt: '2026-06-25T10:00:00.000Z',
      answerPreview: 'In my previous role, I improved the process.',
      wordCount: 20,
      readinessLabel: 'Good start',
      feedbackSummary: 'Add one result.',
      xpReward: 35,
    },
  ];
  const summary = createLessonCompleteSummary(sessions);

  assert.equal(summary.latestSession.roleplayTitle, 'Meeting Practice');
  assert.equal(summary.totalLocalXp, 100);
  assert.ok(summary.nextAction.includes('streak'));
  assert.equal(createLessonCompleteSummary([]), null);
});

test('creates a rewarding roleplay completion summary', async () => {
  const {
    createNextPracticeRecommendation,
    createPracticeCompletionMilestone,
    createPracticeCompletionSummary,
    createPracticeSavePrompt,
    createSavedRoleplayMilestone,
    createSavedRoleplayHandoff,
    createSavedRoleplayPathProgress,
  } = await import('../src/utils/practiceCompletion.ts');

  const firstAnswerPrompt = createPracticeSavePrompt({
    includedFollowUp: false,
    xpReward: 55,
  });

  assert.equal(firstAnswerPrompt.eyebrow, 'Finish lesson');
  assert.equal(firstAnswerPrompt.title, 'Save this lesson');
  assert.equal(firstAnswerPrompt.xpLabel, '+55 XP');
  assert.equal(firstAnswerPrompt.ctaLabel, 'Complete lesson');
  assert.equal(firstAnswerPrompt.followUpLabel, 'Bonus turn optional');
  assert.ok(firstAnswerPrompt.body.includes('optional'));

  const followUpPrompt = createPracticeSavePrompt({
    includedFollowUp: true,
    xpReward: 70,
  });

  assert.equal(followUpPrompt.followUpLabel, 'Bonus turn added');
  assert.ok(followUpPrompt.body.includes('both turns'));

  const firstAnswerSummary = createPracticeCompletionSummary({
    includedFollowUp: false,
    roleplayTitle: 'Sales Call',
    xpReward: 55,
  });

  assert.equal(firstAnswerSummary.title, 'Sales Call saved');
  assert.equal(firstAnswerSummary.rewardLabel, 'Strong practice win');
  assert.equal(firstAnswerSummary.progressCtaLabel, 'Review Progress');
  assert.ok(firstAnswerSummary.body.includes('saved to Progress'));
  assert.ok(firstAnswerSummary.nextAction.includes('follow-up'));

  const fullSessionSummary = createPracticeCompletionSummary({
    includedFollowUp: true,
    roleplayTitle: 'Job Interview',
    xpReward: 70,
  });

  assert.equal(fullSessionSummary.rewardLabel, 'Career-ready sprint');
  assert.ok(fullSessionSummary.body.includes('follow-up'));
  assert.ok(fullSessionSummary.nextAction.includes('fresh practice angle'));

  const milestoneComplete = createPracticeCompletionMilestone({
    dailyTarget: 1,
    progress: {
      currentStreakDays: 5,
      targetSessionsCompleted: 1,
      targetSessionsRemaining: 0,
    },
  });

  assert.equal(milestoneComplete.title, 'Daily target complete');
  assert.equal(milestoneComplete.todayValue, '1/1 done');
  assert.equal(milestoneComplete.streakValue, '5 days');
  assert.ok(milestoneComplete.body.includes('today\'s practice target'));

  const milestoneRemaining = createPracticeCompletionMilestone({
    dailyTarget: 3,
    progress: {
      currentStreakDays: 1,
      targetSessionsCompleted: 1,
      targetSessionsRemaining: 2,
    },
  });

  assert.equal(milestoneRemaining.title, '2 sprints left today');
  assert.equal(milestoneRemaining.todayValue, '1/3 done');
  assert.equal(milestoneRemaining.streakValue, '1 day');
  assert.ok(milestoneRemaining.body.includes('2 more short roleplays'));

  const savedSession = {
    id: 'presentation-practice-1',
    roleplayId: 'presentation-practice',
    roleplayTitle: 'Presentation Practice',
    completedAt: '2026-06-28T10:00:00.000Z',
    answerPreview: 'I would start with the main business update.',
    wordCount: 18,
    readinessLabel: 'Ready for feedback',
    feedbackSummary: 'Clear opening with a useful next step.',
    includedFollowUp: false,
    xpReward: 55,
  };
  const savedMilestone = createSavedRoleplayMilestone({
    dailyTarget: 2,
    savedSession,
    sessions: [savedSession],
    summary: {
      sessionsCompleted: 3,
      minutesPracticed: 15,
      currentStreakDays: 4,
      confidenceScore: 72,
      clarityScore: 70,
      nextFocus: 'Add one measurable result.',
    },
  });

  assert.equal(savedMilestone.title, 'One more sprint today');
  assert.equal(savedMilestone.todayValue, '1/2 done');
  assert.equal(savedMilestone.streakValue, '5 days');
  assert.equal(savedMilestone.progressLabel, '1/2 roleplays today');
  assert.equal(savedMilestone.progressPercent, 50);
  assert.ok(savedMilestone.body.includes('complete today\'s target'));

  const savedPathProgress = createSavedRoleplayPathProgress({
    roleplays: practiceContent.roleplays,
    savedSession: {
      id: savedSession.id,
      roleplayId: savedSession.roleplayId,
    },
    sessions: [
      {
        id: 'meeting-practice-1',
        roleplayId: 'meeting-practice',
      },
      {
        id: 'job-interview-1',
        roleplayId: 'job-interview',
      },
    ],
  });

  assert.equal(savedPathProgress.title, 'Next: Sales Call');
  assert.equal(savedPathProgress.badgeLabel, '3 of 5 complete');
  assert.equal(savedPathProgress.nextLabel, 'Unlocked next');
  assert.equal(savedPathProgress.nextTitle, 'Sales Call');
  assert.equal(savedPathProgress.roleplayId, 'sales-call');
  assert.equal(savedPathProgress.progressLabel, '3 of 5 complete');
  assert.equal(savedPathProgress.progressPercent, 60);
  assert.equal(savedPathProgress.isPathComplete, false);

  const nextAfterSales = createNextPracticeRecommendation('sales-call', practiceContent.roleplays);
  assert.equal(nextAfterSales.roleplayId, 'workplace-small-talk');
  assert.equal(nextAfterSales.ctaLabel, 'Start next roleplay');
  assert.ok(nextAfterSales.reason.includes('small talk'));

  const savedHandoff = createSavedRoleplayHandoff({
    isPathComplete: savedPathProgress.isPathComplete,
    nextPracticeTitle: savedPathProgress.nextTitle,
    xpReward: 45,
  });

  assert.equal(savedHandoff.title, 'Saved');
  assert.equal(savedHandoff.ctaTarget, 'roleplay');
  assert.equal(savedHandoff.ctaLabel, 'Start Sales Call');
  assert.equal(savedHandoff.nextLabel, 'Next lesson');
  assert.equal(savedHandoff.nextTitle, 'Sales Call');
  assert.equal(savedHandoff.xpLabel, '+45 XP');
  assert.ok(savedHandoff.body.includes('streak'));

  const nextAfterSmallTalk = createNextPracticeRecommendation('workplace-small-talk', practiceContent.roleplays);
  assert.equal(nextAfterSmallTalk.roleplayId, 'job-interview');

  const fallbackSavedHandoff = createSavedRoleplayHandoff({
    nextPracticeTitle: null,
    xpReward: 25,
  });

  assert.equal(fallbackSavedHandoff.ctaTarget, 'progress');
  assert.equal(fallbackSavedHandoff.ctaLabel, 'Open Progress');
  assert.equal(fallbackSavedHandoff.nextLabel, 'Next stop');
  assert.equal(fallbackSavedHandoff.nextTitle, 'Progress');
  assert.equal(fallbackSavedHandoff.xpLabel, '+25 XP');

  const completedPathProgress = createSavedRoleplayPathProgress({
    roleplays: practiceContent.roleplays,
    savedSession: {
      id: 'workplace-small-talk-1',
      roleplayId: 'workplace-small-talk',
    },
    sessions: [
      { id: 'sales-call-1', roleplayId: 'sales-call' },
      { id: 'presentation-practice-1', roleplayId: 'presentation-practice' },
      { id: 'meeting-practice-1', roleplayId: 'meeting-practice' },
      { id: 'job-interview-1', roleplayId: 'job-interview' },
    ],
  });

  const replayHandoff = createSavedRoleplayHandoff({
    isPathComplete: completedPathProgress.isPathComplete,
    nextPracticeTitle: completedPathProgress.nextTitle,
    xpReward: 45,
  });

  assert.equal(completedPathProgress.title, 'Career path complete');
  assert.equal(completedPathProgress.nextLabel, 'Replay ready');
  assert.equal(completedPathProgress.progressPercent, 100);
  assert.equal(completedPathProgress.isPathComplete, true);
  assert.equal(replayHandoff.ctaLabel, 'Replay Job Interview');
  assert.ok(replayHandoff.body.includes('cleared the full career path'));
});

test('shows a locked mistake-bank preview before the first saved session', async () => {
  const { createProgressMistakeBankPreview } = await import('../src/utils/progressMistakeBankPreview.ts');
  const preview = createProgressMistakeBankPreview(progressMock.mistakeBank);

  assert.equal(preview.eyebrow, 'Locked until first save');
  assert.equal(preview.title, 'Your first correction is ready');
  assert.equal(preview.progressLabel, '0/1 saved');
  assert.equal(preview.previewCategory, 'Interview Structure');
  assert.ok(preview.previewCorrection.includes('customer feedback analysis'));
  assert.equal(preview.totalPatternsLabel, '4 patterns ready after unlock');
  assert.equal(createProgressMistakeBankPreview([]), null);
});

test('keeps the unlocked mistake bank focused on one active correction', async () => {
  const { createProgressMistakeBankQueue } = await import('../src/utils/progressMistakeBankQueue.ts');

  const initialQueue = createProgressMistakeBankQueue(progressMock.mistakeBank, []);
  assert.equal(initialQueue.eyebrow, 'Correction queue');
  assert.equal(initialQueue.title, '3 more corrections waiting');
  assert.equal(initialQueue.progressLabel, '0/4 practiced');
  assert.deepEqual(
    initialQueue.items.map((item) => item.category),
    ['Meeting Clarity', 'Sales Calls', 'Small Talk'],
  );
  assert.ok(initialQueue.body.includes('one active correction'));

  const nextQueue = createProgressMistakeBankQueue(progressMock.mistakeBank, ['m-001']);
  assert.equal(nextQueue.title, '2 more corrections waiting');
  assert.equal(nextQueue.progressLabel, '1/4 practiced');
  assert.deepEqual(
    nextQueue.items.map((item) => `${item.category}:${item.statusLabel}`),
    ['Sales Calls:Next', 'Small Talk:Next', 'Interview Structure:Done'],
  );
  assert.ok(nextQueue.body.includes('moved you to the next correction'));

  assert.equal(createProgressMistakeBankQueue([], []), null);
});

test('creates a reusable warm-up cue from a saved correction', async () => {
  const { createRoleplayWarmupCue } = await import('../src/utils/roleplayWarmupCue.ts');
  const cue = createRoleplayWarmupCue(progressMock.mistakeBank[0]);

  assert.equal(cue.cueId, progressMock.mistakeBank[0].id);
  assert.equal(cue.eyebrow, 'Warm-up cue');
  assert.equal(cue.badgeLabel, 'From Progress');
  assert.equal(cue.ctaLabel, 'Use this line');
  assert.equal(cue.starterAnswer, progressMock.mistakeBank[0].correction);
  assert.ok(cue.note.includes('specific action and result'));
});

test('recommends the real next roleplay on Home after a saved session', async () => {
  const { createHomePracticeRecommendation } = await import('../src/utils/homeRecommendation.ts');
  const { guidedStart } = await import('../src/data/guidedIntro.ts');
  const firstVisitRecommendation = createHomePracticeRecommendation([], practiceContent.roleplays, {
    ctaLabel: guidedStart.ctaLabel,
    roleplayId: guidedStart.roleplayId,
    subtitle: guidedStart.subtitle,
    title: guidedStart.title,
  });

  assert.equal(firstVisitRecommendation.roleplayId, 'job-interview');
  assert.equal(firstVisitRecommendation.ctaLabel, 'Start first quest');
  assert.ok(firstVisitRecommendation.title.includes('Job Interview'));

  const continueRecommendation = createHomePracticeRecommendation(
    [
      {
        id: 'job-interview-1',
        roleplayId: 'job-interview',
        roleplayTitle: 'Job Interview',
        completedAt: '2026-06-26T10:00:00.000Z',
        answerPreview: 'I improved the weekly customer feedback process.',
        wordCount: 24,
        readinessLabel: 'Ready for feedback',
        feedbackSummary: 'Good structure and result.',
        xpReward: 55,
      },
    ],
    practiceContent.roleplays,
    {
      ctaLabel: guidedStart.ctaLabel,
      roleplayId: guidedStart.roleplayId,
      subtitle: guidedStart.subtitle,
      title: guidedStart.title,
    },
  );

  assert.equal(continueRecommendation.roleplayId, 'meeting-practice');
  assert.equal(continueRecommendation.ctaLabel, 'Start next roleplay');
  assert.equal(continueRecommendation.title, 'Next: Meeting Practice');
  assert.ok(continueRecommendation.subtitle.includes('saved'));
  assert.ok(continueRecommendation.subtitle.includes('meeting'));
});

test('reuses guided first quest labels in the Home hero', async () => {
  const { guidedStart } = await import('../src/data/guidedIntro.ts');
  const { createHomeHeroFocusLabels } = await import('../src/utils/homeHeroLabels.ts');

  const firstRunLabels = createHomeHeroFocusLabels({
    detailLabels: guidedStart.detailLabels,
    rewardLabel: '+40 XP',
    sessions: [],
  });

  assert.deepEqual(firstRunLabels, ['5 minutes', '2-4 sentences', 'Clear rewrite']);

  const returningLabels = createHomeHeroFocusLabels({
    detailLabels: guidedStart.detailLabels,
    rewardLabel: '+55 XP',
    sessions: [{ id: 'job-interview-1' }],
  });

  assert.deepEqual(returningLabels, ['English', '5 minutes', '+55 XP']);
});

test('keeps the Home library quiet until the first saved practice', async () => {
  const { createHomeLibraryState } = await import('../src/utils/homeLibrary.ts');

  const firstRunLibrary = createHomeLibraryState(
    [],
    practiceContent.roleplays,
    'job-interview',
  );

  assert.equal(firstRunLibrary.showRoleplayCards, false);
  assert.equal(firstRunLibrary.title, 'What unlocks next');
  assert.equal(firstRunLibrary.meta, 'Keep it simple');
  assert.ok(firstRunLibrary.body.includes('Save your first answer'));
  assert.ok(firstRunLibrary.body.includes('meetings'));
  assert.equal(firstRunLibrary.previewRoleplays.length, 3);
  assert.equal(firstRunLibrary.previewRoleplays[0].id, 'meeting-practice');
  assert.equal(firstRunLibrary.previewRoleplays.some((roleplay) => roleplay.id === 'job-interview'), false);

  const activeLibrary = createHomeLibraryState(
    [
      {
        id: 'job-interview-1',
      },
    ],
    practiceContent.roleplays,
    'job-interview',
  );

  assert.equal(activeLibrary.showRoleplayCards, true);
  assert.equal(activeLibrary.title, 'Roleplay library');
  assert.equal(activeLibrary.meta, 'English MVP');
  assert.equal(activeLibrary.previewRoleplays.length, 3);
  assert.equal(activeLibrary.previewRoleplays[0].id, 'job-interview');
});

test('creates a simple game-like Home quest path', async () => {
  const { createHomeQuestPath } = await import('../src/utils/homeQuestPath.ts');
  const recommendedRoleplay = practiceContent.roleplays.find((roleplay) => roleplay.id === 'job-interview');
  const previewRoleplays = practiceContent.roleplays.filter((roleplay) =>
    ['meeting-practice', 'presentation-practice', 'sales-call'].includes(roleplay.id),
  );

  const firstRunPath = createHomeQuestPath({
    previewRoleplays,
    recommendedRoleplay,
    sessions: [],
  });

  assert.equal(firstRunPath.title, 'Career path');
  assert.equal(firstRunPath.meta, 'Start simple');
  assert.deepEqual(
    firstRunPath.nodes.map((node) => node.status),
    ['active', 'locked', 'locked'],
  );
  assert.equal(firstRunPath.nodes[0].tag, 'Now');
  assert.equal(firstRunPath.nodes[1].title, 'Meeting Practice');
  assert.ok(firstRunPath.nodes[1].body.includes('focused'));

  const returningPath = createHomeQuestPath({
    previewRoleplays,
    recommendedRoleplay,
    sessions: [{ id: 'job-interview-1' }],
  });

  assert.equal(returningPath.meta, 'Next quest ready');
  assert.deepEqual(
    returningPath.nodes.map((node) => node.status),
    ['done', 'active', 'locked'],
  );
  assert.equal(returningPath.nodes[0].tag, 'Done');
  assert.equal(returningPath.nodes[1].tag, 'Next');
  assert.ok(returningPath.nodes[2].body.includes('5-minute sprint'));
});

test('keeps the Learn path focused on one current step', async () => {
  const { foundationStart } = await import('../src/data/guidedIntro.ts');
  const { FOUNDATION_TOTAL_STEPS } = await import('../src/utils/foundationProgressStorage.ts');
  const { createHomeLearnState } = await import('../src/utils/homeLearnState.ts');

  const firstRunLearnState = createHomeLearnState({
    foundationCtaLabel: foundationStart.ctaLabel,
    foundationCompletedSteps: 0,
    foundationTitle: foundationStart.title,
    roleplays: practiceContent.roleplays,
    sessions: [],
    totalFoundationSteps: FOUNDATION_TOTAL_STEPS,
  });

  assert.equal(firstRunLearnState.hero.target, 'foundation');
  assert.equal(firstRunLearnState.hero.ctaLabel, 'Start step 1');
  assert.equal(firstRunLearnState.steps.filter((step) => step.state === 'current').length, 1);
  assert.equal(firstRunLearnState.steps[0].title, 'Clear sentence');
  assert.equal(firstRunLearnState.steps[0].state, 'current');
  assert.equal(firstRunLearnState.steps[1].title, 'Job Interview');
  assert.equal(firstRunLearnState.steps[1].state, 'locked');
  assert.ok(firstRunLearnState.steps[1].body.includes('foundation lesson'));

  const resumedFoundationLearnState = createHomeLearnState({
    foundationCtaLabel: foundationStart.ctaLabel,
    foundationCompletedSteps: 2,
    foundationTitle: foundationStart.title,
    roleplays: practiceContent.roleplays,
    sessions: [],
    totalFoundationSteps: FOUNDATION_TOTAL_STEPS,
  });

  assert.equal(resumedFoundationLearnState.hero.target, 'foundation');
  assert.equal(resumedFoundationLearnState.hero.ctaLabel, 'Resume lesson');
  assert.ok(resumedFoundationLearnState.hero.body.includes('step 3 of 3'));
  assert.equal(resumedFoundationLearnState.steps[0].meta, '2/3 blocks done');
  assert.ok(resumedFoundationLearnState.steps[0].body.includes('unlock Job Interview'));
  assert.equal(resumedFoundationLearnState.steps[1].state, 'locked');

  const postFoundationLearnState = createHomeLearnState({
    foundationCtaLabel: foundationStart.ctaLabel,
    foundationCompletedSteps: FOUNDATION_TOTAL_STEPS,
    foundationTitle: foundationStart.title,
    roleplays: practiceContent.roleplays,
    sessions: [],
    totalFoundationSteps: FOUNDATION_TOTAL_STEPS,
  });

  assert.equal(postFoundationLearnState.hero.target, 'job-interview');
  assert.equal(postFoundationLearnState.hero.title, 'Next: Job Interview');
  assert.equal(postFoundationLearnState.steps[0].state, 'completed');
  assert.equal(postFoundationLearnState.steps[1].state, 'current');
  assert.ok(postFoundationLearnState.steps[0].body.includes('interview is now unlocked'));
  assert.ok(postFoundationLearnState.steps[1].body.includes('app chose Job Interview'));

  const returningLearnState = createHomeLearnState({
    foundationCtaLabel: foundationStart.ctaLabel,
    foundationCompletedSteps: FOUNDATION_TOTAL_STEPS,
    foundationTitle: foundationStart.title,
    roleplays: practiceContent.roleplays,
    sessions: [{ roleplayId: 'job-interview' }],
    totalFoundationSteps: FOUNDATION_TOTAL_STEPS,
  });

  assert.equal(returningLearnState.hero.target, 'meeting-practice');
  assert.equal(returningLearnState.hero.title, 'Next: Meeting Practice');
  assert.equal(returningLearnState.steps.filter((step) => step.state === 'current').length, 1);
  assert.deepEqual(
    returningLearnState.steps.slice(0, 4).map((step) => step.state),
    ['completed', 'completed', 'current', 'locked'],
  );
  assert.ok(returningLearnState.steps[1].body.includes('practice history'));
  assert.ok(returningLearnState.steps[2].body.includes('Meeting Practice'));
  assert.ok(returningLearnState.steps[3].body.includes('Unlocks after'));
});

test('creates one clear Home daily mission card', async () => {
  const { createDailyMission } = await import('../src/utils/gamification.ts');
  const { createHomeDailyMissionCard } = await import('../src/utils/homeDailyMission.ts');
  const { createLocalProgressStats } = await import('../src/utils/localProgress.ts');
  const savedSession = {
    id: 'job-interview-1',
    roleplayId: 'job-interview',
    roleplayTitle: 'Job Interview',
    completedAt: '2026-06-26T10:00:00.000Z',
    answerPreview: 'I improved the weekly customer feedback process.',
    wordCount: 24,
    readinessLabel: 'Ready for feedback',
    feedbackSummary: 'Good structure and result.',
    xpReward: 55,
  };

  const firstRunMission = createHomeDailyMissionCard({
    dailyMission: createDailyMission(progressMock.summary, [], 1),
    dailyTarget: 1,
    hasCompletedFoundation: false,
    localProgress: createLocalProgressStats(progressMock.summary, [], 1),
    sessions: [],
  });

  assert.equal(firstRunMission.title, 'Save your first practice answer');
  assert.equal(firstRunMission.meta, '5-minute sprint');
  assert.equal(firstRunMission.targetLabel, '0/1 saved');
  assert.equal(firstRunMission.progressPercent, 0);
  assert.ok(firstRunMission.body.includes('foundation'));
  assert.ok(firstRunMission.reason.includes('interview English'));

  const postFoundationMission = createHomeDailyMissionCard({
    dailyMission: createDailyMission(progressMock.summary, [], 1),
    dailyTarget: 1,
    hasCompletedFoundation: true,
    localProgress: createLocalProgressStats(progressMock.summary, [], 1),
    sessions: [],
  });

  assert.equal(postFoundationMission.title, 'Save your first practice answer');
  assert.equal(postFoundationMission.targetLabel, '0/1 saved');
  assert.ok(postFoundationMission.body.includes('Foundation is done'));
  assert.ok(!postFoundationMission.body.includes('Finish the short foundation step'));

  const partialMission = createHomeDailyMissionCard({
    dailyMission: createDailyMission(progressMock.summary, [savedSession], 3),
    dailyTarget: 3,
    hasCompletedFoundation: true,
    localProgress: createLocalProgressStats(progressMock.summary, [savedSession], 3),
    sessions: [savedSession],
  });

  assert.equal(partialMission.title, "Finish today's mission");
  assert.equal(partialMission.meta, '2 left');
  assert.equal(partialMission.targetLabel, '1/3 saved');
  assert.equal(partialMission.progressPercent, 33);
  assert.ok(partialMission.body.includes('Finish 2 more'));

  const completeMission = createHomeDailyMissionCard({
    dailyMission: createDailyMission(progressMock.summary, [savedSession], 1),
    dailyTarget: 1,
    hasCompletedFoundation: true,
    localProgress: createLocalProgressStats(progressMock.summary, [savedSession], 1),
    sessions: [savedSession],
  });

  assert.equal(completeMission.title, "Today's mission complete");
  assert.equal(completeMission.meta, 'Done today');
  assert.equal(completeMission.targetLabel, '1/1 saved');
  assert.equal(completeMission.progressPercent, 100);
});

test('guides roleplay practice through one simple step at a time', async () => {
  const { createRoleplayGuideState } = await import('../src/utils/roleplayGuide.ts');
  const firstStep = createRoleplayGuideState({
    hasDraftAnswer: false,
    hasReviewedAnswer: false,
    isReadyForFeedback: false,
    isSaved: false,
  });

  assert.equal(firstStep.activeLabel, 'Step 1 of 4');
  assert.deepEqual(
    firstStep.steps.map((step) => step.status),
    ['active', 'locked', 'locked', 'locked'],
  );

  const reviewStep = createRoleplayGuideState({
    hasDraftAnswer: true,
    hasReviewedAnswer: false,
    isReadyForFeedback: false,
    isSaved: false,
  });

  assert.equal(reviewStep.activeLabel, 'Step 3 of 4');
  assert.deepEqual(
    reviewStep.steps.map((step) => step.status),
    ['done', 'done', 'active', 'locked'],
  );

  const saveStep = createRoleplayGuideState({
    hasDraftAnswer: true,
    hasReviewedAnswer: true,
    isReadyForFeedback: true,
    isSaved: false,
  });

  assert.equal(saveStep.activeLabel, 'Step 4 of 4');
  assert.deepEqual(
    saveStep.steps.map((step) => step.status),
    ['done', 'done', 'done', 'active'],
  );

  const savedStep = createRoleplayGuideState({
    hasDraftAnswer: true,
    hasReviewedAnswer: true,
    isReadyForFeedback: true,
    isSaved: true,
  });

  assert.equal(savedStep.activeLabel, 'Session saved');
  assert.ok(savedStep.steps.every((step) => step.status === 'done'));
});

test('creates a simple answer coach for the roleplay answer card', async () => {
  const { createAnswerCoachContent } = await import('../src/utils/answerCoach.ts');
  const coach = createAnswerCoachContent({ persona: 'Hiring Manager' });
  const meeting = practiceContent.roleplays.find((roleplay) => roleplay.id === 'meeting-practice');
  const disagreementVariant = meeting.promptVariants.find((variant) => variant.id === 'polite-disagreement');
  const meetingCoach = createAnswerCoachContent({
    persona: 'Project Lead',
    promptVariant: disagreementVariant,
  });

  assert.equal(coach.title, 'Write your answer');
  assert.equal(coach.wordTargetLabel, '2-4 sentences');
  assert.equal(coach.reviewCtaLabel, 'Review answer');
  assert.equal(coach.phraseLabel, 'Helpful phrases');
  assert.equal(coach.transitionTitle, 'Now write your answer');
  assert.ok(coach.transitionBody.includes('short'));
  assert.equal(coach.instruction, 'Answer in 2-4 spoken sentences.');
  assert.deepEqual(coach.checklist, [
    'Answer the question directly.',
    'Add one concrete detail or result.',
    'Finish with a clear next step.',
  ]);
  assert.ok(coach.placeholder.startsWith('Start with:'));
  assert.ok(coach.placeholder.includes('Currently'));
  assert.ok(meetingCoach.placeholder.startsWith('Start with:'));
  assert.ok(meetingCoach.placeholder.includes('I see the goal'));
  assert.ok(meetingCoach.placeholder.includes('Could we clarify'));
  assert.ok(!meetingCoach.placeholder.includes('Currently'));
});

test('creates a collapsible helpful phrase helper state', async () => {
  const { createRoleplayPhraseHelperState } = await import('../src/utils/roleplayPhraseHelper.ts');

  const closedHelper = createRoleplayPhraseHelperState({
    isOpen: false,
    phraseCount: 3,
  });

  assert.equal(closedHelper.toggleLabel, 'Show');
  assert.equal(closedHelper.toggleAccessibilityLabel, 'Show helpful phrases');
  assert.equal(closedHelper.summaryLabel, '3 phrases');
  assert.ok(closedHelper.helperText.includes('optional'));

  const openHelper = createRoleplayPhraseHelperState({
    isOpen: true,
    phraseCount: 1,
  });

  assert.equal(openHelper.toggleLabel, 'Hide');
  assert.equal(openHelper.toggleAccessibilityLabel, 'Hide helpful phrases');
  assert.equal(openHelper.summaryLabel, '1 phrase');
  assert.ok(openHelper.helperText.includes('natural answer'));
});

test('creates a collapsible answer plan helper state', async () => {
  const { createAnswerPlanHelperState } = await import('../src/utils/answerPlanHelper.ts');
  const steps = [
    'Answer the question directly.',
    'Add one concrete detail or result.',
    'Finish with a clear next step.',
  ];

  const closedHelper = createAnswerPlanHelperState({
    isOpen: false,
    steps,
  });

  assert.equal(closedHelper.title, 'Answer plan');
  assert.equal(closedHelper.stepCountLabel, '3-step plan');
  assert.equal(closedHelper.toggleLabel, 'Show');
  assert.equal(closedHelper.toggleAccessibilityLabel, 'Show answer plan');
  assert.deepEqual(closedHelper.steps, []);

  const openHelper = createAnswerPlanHelperState({
    isOpen: true,
    steps,
  });

  assert.equal(openHelper.toggleLabel, 'Hide');
  assert.equal(openHelper.toggleAccessibilityLabel, 'Hide answer plan');
  assert.deepEqual(openHelper.steps, steps);
});

test('creates a combined writing support helper state', async () => {
  const { createWritingSupportState } = await import('../src/utils/writingSupportHelper.ts');

  const closedSupport = createWritingSupportState({
    isExpanded: false,
    isAnswerPlanOpen: false,
    phraseLabel: '3 phrases',
    planLabel: '3-step plan',
    quickStartPhrase: 'I can give a short update on that.',
  });

  assert.equal(closedSupport.title, 'Writing support');
  assert.equal(closedSupport.summaryLabel, '1 starter + 3-step plan');
  assert.equal(closedSupport.quickStartLabel, 'Quick starter');
  assert.equal(closedSupport.quickStartText, 'I can give a short update on that.');
  assert.equal(closedSupport.toggleLabel, 'More');
  assert.equal(closedSupport.toggleAccessibilityLabel, 'Show writing support');
  assert.ok(closedSupport.helperText.includes('get stuck'));

  const openSupport = createWritingSupportState({
    isExpanded: true,
    isAnswerPlanOpen: true,
    phraseLabel: '3 phrases',
    planLabel: '3-step plan',
    quickStartPhrase: 'I can give a short update on that.',
  });

  assert.equal(openSupport.summaryLabel, '3 phrases + 3-step plan');
  assert.equal(openSupport.toggleLabel, 'Hide');
  assert.equal(openSupport.toggleAccessibilityLabel, 'Hide writing support');
  assert.ok(openSupport.helperText.includes('Use only what helps'));
});

test('creates a locked session history preview for first-time progress users', async () => {
  const { createProgressEmptyState } = await import('../src/utils/progressEmptyState.ts');
  const emptyState = createProgressEmptyState();

  assert.equal(emptyState.eyebrow, 'Locked until first save');
  assert.equal(emptyState.progressLabel, '0/1 saved');
  assert.equal(emptyState.title, 'Session history starts after one save');
  assert.ok(emptyState.body.includes('feedback summary'));
  assert.equal(emptyState.unlockLabel, 'First unlock: history, XP and daily target progress');
});

test('creates a guided next step for progress states', async () => {
  const { createProgressNextStepGuide } = await import('../src/utils/progressNextStep.ts');
  const firstTimeGuide = createProgressNextStepGuide({
    dailyTarget: 2,
    roleplays: practiceContent.roleplays,
    sessions: [],
  });

  assert.equal(firstTimeGuide.roleplayId, 'job-interview');
  assert.equal(firstTimeGuide.ctaLabel, 'Start Job Interview');
  assert.equal(firstTimeGuide.title, 'Save your first answer');
  assert.ok(firstTimeGuide.body.includes('first saved answer'));

  const oneSavedSession = [
    {
      id: 'job-interview-1',
      roleplayId: 'job-interview',
      roleplayTitle: 'Job Interview',
      completedAt: '2026-06-26T10:00:00.000Z',
      answerPreview: 'I improved onboarding handoffs.',
      wordCount: 36,
      readinessLabel: 'Ready for feedback',
      feedbackSummary: 'Clear answer with useful detail.',
      xpReward: 50,
    },
  ];
  const returningGuide = createProgressNextStepGuide({
    dailyTarget: 3,
    roleplays: practiceContent.roleplays,
    sessions: oneSavedSession,
  });

  assert.equal(returningGuide.roleplayId, 'meeting-practice');
  assert.equal(returningGuide.title, '2 sprints left today');
  assert.ok(returningGuide.body.includes('Job Interview'));
  assert.ok(returningGuide.steps.some((step) => step.includes('Meeting Practice')));
  assert.equal(returningGuide.ctaLabel, 'Start Meeting Practice');

  const offPathGuide = createProgressNextStepGuide({
    dailyTarget: 3,
    roleplays: practiceContent.roleplays,
    sessions: [
      {
        id: 'meeting-practice-1',
        roleplayId: 'meeting-practice',
        roleplayTitle: 'Meeting Practice',
        completedAt: '2026-06-26T11:00:00.000Z',
        answerPreview: 'I shared the project update and the next blocker.',
        wordCount: 29,
        readinessLabel: 'Ready for feedback',
        feedbackSummary: 'Clear structure with one useful next step.',
        xpReward: 44,
      },
    ],
  });

  assert.equal(offPathGuide.roleplayId, 'job-interview');
  assert.equal(offPathGuide.ctaLabel, 'Start Job Interview');
  assert.ok(offPathGuide.body.includes('Return to Job Interview'));
  assert.ok(offPathGuide.steps.some((step) => step.includes('Return to Job Interview')));

  const completeGuide = createProgressNextStepGuide({
    dailyTarget: 1,
    roleplays: practiceContent.roleplays,
    sessions: oneSavedSession,
  });

  assert.equal(completeGuide.title, 'Daily target complete');
  assert.equal(completeGuide.ctaLabel, 'Start Meeting Practice');
  assert.ok(completeGuide.body.includes('1/1 target'));
  assert.ok(completeGuide.steps.some((step) => step.includes('Meeting Practice')));
});

test('creates an actionable mistake practice drill', async () => {
  const { createMistakePracticeDrill, createMistakePracticeStatus } = await import('../src/utils/mistakePracticeDrill.ts');
  const { createRoleplayWarmupCue } = await import('../src/utils/roleplayWarmupCue.ts');
  const interviewDrill = createMistakePracticeDrill(progressMock.mistakeBank);

  assert.equal(interviewDrill.roleplayId, 'job-interview');
  assert.equal(interviewDrill.ctaLabel, 'Practice Job Interview');
  assert.equal(interviewDrill.eyebrow, 'High priority');
  assert.ok(interviewDrill.title.includes('Interview Structure'));
  assert.ok(interviewDrill.mistake.correction.includes('customer feedback analysis'));
  assert.deepEqual(interviewDrill.steps, [
    'Read the better sentence once.',
    'Say it out loud without looking at the original.',
    'Use the same pattern in your next answer.',
  ]);

  const salesDrill = createMistakePracticeDrill([
    {
      id: 'm-sales',
      category: 'Sales Calls',
      original: 'It is not expensive.',
      correction: 'The price connects to the time your team saves each month.',
      note: 'Connect pricing to value.',
      priority: 'Medium',
    },
  ]);

  assert.equal(salesDrill.roleplayId, 'sales-call');
  assert.equal(salesDrill.ctaLabel, 'Practice Sales Call');
  assert.equal(createMistakePracticeDrill([]), null);

  const nextDrill = createMistakePracticeDrill(progressMock.mistakeBank, ['m-001']);
  assert.equal(nextDrill.roleplayId, 'meeting-practice');
  assert.equal(nextDrill.ctaLabel, 'Practice Meeting Practice');
  assert.ok(nextDrill.title.includes('Meeting Clarity'));

  const warmupCue = createRoleplayWarmupCue(interviewDrill.mistake);
  assert.equal(warmupCue.cueId, interviewDrill.mistake.id);
  assert.equal(warmupCue.eyebrow, 'Warm-up cue');
  assert.equal(warmupCue.badgeLabel, 'From Progress');
  assert.equal(warmupCue.correction, interviewDrill.mistake.correction);
  assert.equal(warmupCue.note, interviewDrill.mistake.note);

  const readyStatus = createMistakePracticeStatus(false);
  assert.equal(readyStatus.label, 'Ready to repeat');
  assert.equal(readyStatus.ctaLabel, 'Mark practiced');
  assert.ok(readyStatus.body.includes('out loud'));

  const practicedStatus = createMistakePracticeStatus(true);
  assert.equal(practicedStatus.label, 'Practice win');
  assert.equal(practicedStatus.ctaLabel, 'Practiced once');
  assert.ok(practicedStatus.body.includes('fresh'));
});

test('adds saved sessions to local progress and daily mission', async () => {
  const { createDailyMission } = await import('../src/utils/gamification.ts');
  const { createLocalProgressStats } = await import('../src/utils/localProgress.ts');
  const sessions = [
    {
      id: 'sales-call-1',
      roleplayId: 'sales-call',
      roleplayTitle: 'Sales Call',
      completedAt: '2026-06-26T11:00:00.000Z',
      answerPreview: 'I would ask about the current cost of the problem.',
      wordCount: 38,
      readinessLabel: 'Ready for feedback',
      feedbackSummary: 'Clear response with a good next step.',
      xpReward: 55,
    },
  ];
  const localProgress = createLocalProgressStats(progressMock.summary, sessions);
  const mission = createDailyMission(progressMock.summary, sessions);

  assert.equal(localProgress.sessionsCompleted, progressMock.summary.sessionsCompleted + 1);
  assert.equal(localProgress.minutesPracticed, progressMock.summary.minutesPracticed + 5);
  assert.equal(localProgress.totalLocalXp, 55);
  assert.equal(mission.rewardLabel, '+55 XP');
  assert.equal(mission.xpToday, mission.xpGoal);

  const twoRoleplayMission = createDailyMission(progressMock.summary, sessions, 2);
  const twoRoleplayProgress = createLocalProgressStats(progressMock.summary, sessions, 2);

  assert.equal(twoRoleplayMission.title, 'Complete 2 career roleplays');
  assert.equal(twoRoleplayMission.xpGoal, 120);
  assert.equal(twoRoleplayProgress.xpGoal, 120);
  assert.equal(twoRoleplayProgress.targetSessionsCompleted, 1);
  assert.equal(twoRoleplayProgress.targetSessionsRemaining, 1);
  assert.equal(twoRoleplayProgress.targetCompletionPercent, 50);
  assert.ok(twoRoleplayMission.progressPercent < 100);
});

test('filters roleplays by category and target level', async () => {
  const {
    ALL_CATEGORIES_FILTER,
    ALL_LEVELS_FILTER,
    filterRoleplaysByCategory,
    filterRoleplaysByLevel,
    getRoleplayCategoryFilters,
    getRoleplayLevelFilters,
  } = await import('../src/utils/roleplayFilters.ts');

  assert.deepEqual(getRoleplayCategoryFilters(practiceContent.roleplays), [
    ALL_CATEGORIES_FILTER,
    'Interview',
    'Meeting',
    'Presentation',
    'Sales',
    'Small Talk',
  ]);
  assert.deepEqual(getRoleplayLevelFilters(practiceContent.roleplays), [
    ALL_LEVELS_FILTER,
    'B1-B2',
    'B2',
    'A2-B1',
  ]);
  assert.equal(filterRoleplaysByCategory(practiceContent.roleplays, ALL_CATEGORIES_FILTER).length, 5);
  assert.equal(filterRoleplaysByCategory(practiceContent.roleplays, 'Meeting')[0].title, 'Meeting Practice');
  assert.equal(filterRoleplaysByLevel(practiceContent.roleplays, ALL_LEVELS_FILTER).length, 5);
  assert.equal(filterRoleplaysByLevel(practiceContent.roleplays, 'B2').length, 2);
  assert.equal(filterRoleplaysByLevel(practiceContent.roleplays, 'A2-B1')[0].title, 'Workplace Small Talk');

  const meetingRoleplays = filterRoleplaysByCategory(practiceContent.roleplays, 'Meeting');
  assert.equal(filterRoleplaysByLevel(meetingRoleplays, 'B1-B2')[0].title, 'Meeting Practice');
});

test('creates a calm roleplay scenario picker state', async () => {
  const {
    createRoleplayScenarioPickerState,
    formatRoleplayScenarioMeta,
  } = await import('../src/utils/roleplayScenarioPicker.ts');

  const closedPicker = createRoleplayScenarioPickerState({
    activeRoleplayId: 'job-interview',
    isOpen: false,
    roleplays: practiceContent.roleplays,
  });

  assert.equal(closedPicker.currentScenario.title, 'Job Interview');
  assert.equal(closedPicker.toggleLabel, 'Change');
  assert.equal(closedPicker.options.length, 4);
  assert.equal(closedPicker.options.some((option) => option.id === 'job-interview'), false);
  assert.ok(closedPicker.helperText.includes('one scenario'));
  assert.equal(closedPicker.showHelperText, false);
  assert.equal(formatRoleplayScenarioMeta(closedPicker.currentScenario), 'B1-B2 / 12 min / Interview');

  const openPicker = createRoleplayScenarioPickerState({
    activeRoleplayId: 'sales-call',
    isOpen: true,
    roleplays: practiceContent.roleplays,
  });

  assert.equal(openPicker.currentScenario.title, 'Sales Call');
  assert.equal(openPicker.toggleLabel, 'Hide');
  assert.equal(openPicker.toggleAccessibilityLabel, 'Hide roleplay scenario choices');
  assert.equal(openPicker.showHelperText, true);
});

test('creates a calm roleplay angle picker state', async () => {
  const { createRoleplayAnglePickerState } = await import('../src/utils/roleplayAnglePicker.ts');
  const interviewVariants = practiceContent.roleplays[0].promptVariants;

  const closedPicker = createRoleplayAnglePickerState({
    activeVariantId: 'career-story',
    isOpen: false,
    variants: interviewVariants,
  });

  assert.equal(closedPicker.currentAngle.title, 'Tell me about yourself');
  assert.equal(closedPicker.toggleLabel, 'Change');
  assert.equal(closedPicker.progressLabel, '1 of 3');
  assert.equal(closedPicker.nextAngleTitle, 'Why this role?');
  assert.ok(closedPicker.closedGuidance.includes('Why this role?'));
  assert.equal(closedPicker.options.length, interviewVariants.length - 1);
  assert.equal(closedPicker.options.some((option) => option.variant.id === 'career-story'), false);
  assert.equal(closedPicker.options[0].metaLabel, 'Recommended next');
  assert.equal(closedPicker.options[0].isRecommendedNext, true);
  assert.ok(closedPicker.helperText.includes('one step at a time'));
  assert.equal(closedPicker.showHelperText, false);

  const openPicker = createRoleplayAnglePickerState({
    activeVariantId: 'role-motivation',
    isOpen: true,
    variants: interviewVariants,
  });

  assert.equal(openPicker.currentAngle.title, 'Why this role?');
  assert.equal(openPicker.toggleLabel, 'Hide');
  assert.equal(openPicker.toggleAccessibilityLabel, 'Hide practice angle choices');
  assert.equal(openPicker.showHelperText, true);

  const presentationVariants = practiceContent.roleplays.find(
    (roleplay) => roleplay.id === 'presentation-practice',
  ).promptVariants;
  const fiveAnglePicker = createRoleplayAnglePickerState({
    activeVariantId: 'audience-question',
    isOpen: true,
    variants: presentationVariants,
  });

  assert.equal(fiveAnglePicker.progressLabel, '4 of 5');
  assert.equal(fiveAnglePicker.nextAngleTitle, 'Q&A follow-up');
  assert.equal(
    fiveAnglePicker.options.find((option) => option.variant.id === 'qa-follow-up').metaLabel,
    'Recommended next',
  );
  assert.ok(
    fiveAnglePicker.options.some((option) => option.metaLabel === 'Option 1 of 5'),
  );
});

test('creates one read-first card from roleplay prompt details', async () => {
  const { createRoleplayReadCard } = await import('../src/utils/roleplayReadCard.ts');
  const roleplay = practiceContent.roleplays[0];
  const roleMotivationVariant = roleplay.promptVariants.find((variant) => variant.id === 'role-motivation');

  const defaultCard = createRoleplayReadCard({ roleplay });
  assert.equal(defaultCard.eyebrow, 'Read this first');
  assert.equal(defaultCard.focus, 'Structured answers and confident tone');
  assert.equal(defaultCard.openingLabel, 'AI prompt');
  assert.equal(defaultCard.openingLine, roleplay.openingLine);
  assert.equal(defaultCard.openingSpeaker, 'Hiring Manager');
  assert.deepEqual(
    defaultCard.details.map((detail) => detail.label),
    ['Situation', 'Goal'],
  );
  assert.equal(defaultCard.details[0].text, roleplay.workplaceContext);
  assert.equal(defaultCard.details[1].text, roleplay.userGoal);

  const variantCard = createRoleplayReadCard({
    activePromptVariant: roleMotivationVariant,
    roleplay,
  });
  assert.equal(variantCard.goal, roleMotivationVariant.userGoal);
  assert.equal(variantCard.details[1].text, roleMotivationVariant.userGoal);
  assert.equal(variantCard.openingLine, roleMotivationVariant.openingLine);
  assert.ok(variantCard.context.includes('hiring manager'));
});

test('keeps read-first card copy concise for mobile scanning', async () => {
  const { createRoleplayReadCard } = await import('../src/utils/roleplayReadCard.ts');

  for (const roleplay of practiceContent.roleplays) {
    const defaultCard = createRoleplayReadCard({ roleplay });
    assert.ok(defaultCard.details[0].text.length <= 70);
    assert.ok(defaultCard.details[1].text.length <= 72);

    for (const variant of roleplay.promptVariants) {
      const variantCard = createRoleplayReadCard({ activePromptVariant: variant, roleplay });
      assert.ok(variantCard.details[0].text.length <= 70);
      assert.ok(variantCard.details[1].text.length <= 72);
    }
  }
});

test('creates rule-based feedback and XP from typed answers', async () => {
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');
  const { createRuleBasedFeedback } = await import('../src/utils/ruleBasedFeedback.ts');
  const roleplay = practiceContent.roleplays[0];

  const shortReview = summarizePracticeAnswer('I think I can help.');
  const shortFeedback = createRuleBasedFeedback(roleplay, 'I think I can help.', shortReview);

  assert.equal(shortFeedback.xpReward, 10);
  assert.ok(shortFeedback.feedback.improvements.length >= 2);

  const strongAnswer = [
    'In my previous role, I led a customer feedback project with my team.',
    'First, I grouped the main issues by priority and then aligned with the manager on next steps.',
    'As a result, we reduced repeat complaints by 20% and improved the weekly decision process.',
  ].join(' ');
  const strongReview = summarizePracticeAnswer(strongAnswer);
  const strongFeedback = createRuleBasedFeedback(roleplay, strongAnswer, strongReview);

  assert.ok(strongFeedback.xpReward >= 50);
  assert.ok(strongFeedback.feedback.summary.includes('Strong job interview answer'));
  assert.ok(strongFeedback.feedback.scores.find((score) => score.label === 'Structure').value >= 80);
});

test('adapts interview feedback to the selected practice angle', async () => {
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');
  const { createRuleBasedFeedback } = await import('../src/utils/ruleBasedFeedback.ts');
  const roleplay = practiceContent.roleplays.find((item) => item.id === 'job-interview');
  const motivationVariant = roleplay.promptVariants.find((variant) => variant.id === 'role-motivation');
  const difficultVariant = roleplay.promptVariants.find((variant) => variant.id === 'difficult-situation');
  const answer = [
    'What interests me most is the chance to work closer to product decisions.',
    'First, I would use my customer feedback experience to help the team prioritize the right problems.',
    'As a result, the team could make clearer decisions and move faster.',
  ].join(' ');
  const review = summarizePracticeAnswer(answer);
  const motivationFeedback = createRuleBasedFeedback(roleplay, answer, review, motivationVariant);
  const difficultFeedback = createRuleBasedFeedback(roleplay, answer, review, difficultVariant);

  assert.ok(motivationFeedback.feedback.summary.includes('"Why this role?"'));
  assert.equal(
    motivationFeedback.feedback.suggestedRewrite,
    motivationVariant.feedbackGuidance.suggestedRewrite,
  );
  assert.ok(
    motivationFeedback.feedback.improvements.includes(
      motivationVariant.feedbackGuidance.improvementFocus,
    ),
  );
  assert.ok(
    difficultFeedback.feedback.strengths.includes(difficultVariant.feedbackGuidance.strengthFocus),
  );
  assert.notEqual(
    motivationFeedback.feedback.suggestedRewrite,
    difficultFeedback.feedback.suggestedRewrite,
  );
});

test('adapts meeting feedback to the selected practice angle', async () => {
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');
  const { createRuleBasedFeedback } = await import('../src/utils/ruleBasedFeedback.ts');
  const roleplay = practiceContent.roleplays.find((item) => item.id === 'meeting-practice');
  const statusVariant = roleplay.promptVariants.find((variant) => variant.id === 'status-update');
  const interruptionVariant = roleplay.promptVariants.find((variant) => variant.id === 'polite-interruption');
  const challengeVariant = roleplay.promptVariants.find((variant) => variant.id === 'challenge-decision');
  const disagreementVariant = roleplay.promptVariants.find((variant) => variant.id === 'polite-disagreement');
  const answer = [
    'Since our last meeting, I completed the draft with the team.',
    'First, I clarified the blocker and deadline with the project owner.',
    'As a result, we agreed on a next step and reduced the delivery risk.',
  ].join(' ');
  const review = summarizePracticeAnswer(answer);
  const statusFeedback = createRuleBasedFeedback(roleplay, answer, review, statusVariant);
  const interruptionFeedback = createRuleBasedFeedback(roleplay, answer, review, interruptionVariant);
  const challengeFeedback = createRuleBasedFeedback(roleplay, answer, review, challengeVariant);
  const disagreementFeedback = createRuleBasedFeedback(roleplay, answer, review, disagreementVariant);

  assert.ok(statusFeedback.feedback.summary.includes('"Status update"'));
  assert.equal(
    statusFeedback.feedback.suggestedRewrite,
    statusVariant.feedbackGuidance.suggestedRewrite,
  );
  assert.ok(
    statusFeedback.feedback.improvements.includes(
      statusVariant.feedbackGuidance.improvementFocus,
    ),
  );
  assert.ok(
    challengeFeedback.feedback.strengths.includes(challengeVariant.feedbackGuidance.strengthFocus),
  );
  assert.ok(interruptionFeedback.feedback.summary.includes('"Polite interruption"'));
  assert.ok(
    interruptionFeedback.feedback.improvements.includes(
      interruptionVariant.feedbackGuidance.improvementFocus,
    ),
  );
  assert.notEqual(
    statusFeedback.feedback.suggestedRewrite,
    challengeFeedback.feedback.suggestedRewrite,
  );
  assert.notEqual(
    interruptionFeedback.feedback.suggestedRewrite,
    statusFeedback.feedback.suggestedRewrite,
  );
  assert.ok(disagreementFeedback.feedback.summary.includes('"Polite disagreement"'));
  assert.ok(
    disagreementFeedback.feedback.improvements.includes(
      disagreementVariant.feedbackGuidance.improvementFocus,
    ),
  );
  assert.notEqual(
    disagreementFeedback.feedback.suggestedRewrite,
    challengeFeedback.feedback.suggestedRewrite,
  );
});

test('adapts presentation feedback to the selected practice angle', async () => {
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');
  const { createRuleBasedFeedback } = await import('../src/utils/ruleBasedFeedback.ts');
  const roleplay = practiceContent.roleplays.find((item) => item.id === 'presentation-practice');
  const transitionVariant = roleplay.promptVariants.find((variant) => variant.id === 'smooth-transition');
  const challengeVariant = roleplay.promptVariants.find((variant) => variant.id === 'handle-challenge');
  const audienceVariant = roleplay.promptVariants.find((variant) => variant.id === 'audience-question');
  const qaVariant = roleplay.promptVariants.find((variant) => variant.id === 'qa-follow-up');
  const answer = [
    'This leads to the next point about customer impact.',
    'First, I would explain the decision we need and then connect it to the timeline.',
    'As a result, the leadership team can choose a low-risk next step.',
  ].join(' ');
  const review = summarizePracticeAnswer(answer);
  const transitionFeedback = createRuleBasedFeedback(roleplay, answer, review, transitionVariant);
  const challengeFeedback = createRuleBasedFeedback(roleplay, answer, review, challengeVariant);
  const audienceFeedback = createRuleBasedFeedback(roleplay, answer, review, audienceVariant);
  const qaFeedback = createRuleBasedFeedback(roleplay, answer, review, qaVariant);

  assert.ok(transitionFeedback.feedback.summary.includes('"Smooth transition"'));
  assert.equal(
    transitionFeedback.feedback.suggestedRewrite,
    transitionVariant.feedbackGuidance.suggestedRewrite,
  );
  assert.ok(
    transitionFeedback.feedback.improvements.includes(
      transitionVariant.feedbackGuidance.improvementFocus,
    ),
  );
  assert.ok(
    challengeFeedback.feedback.strengths.includes(challengeVariant.feedbackGuidance.strengthFocus),
  );
  assert.notEqual(
    transitionFeedback.feedback.suggestedRewrite,
    challengeFeedback.feedback.suggestedRewrite,
  );
  assert.ok(audienceFeedback.feedback.summary.includes('"Audience question"'));
  assert.ok(
    audienceFeedback.feedback.strengths.includes(audienceVariant.feedbackGuidance.strengthFocus),
  );
  assert.ok(qaFeedback.feedback.summary.includes('"Q&A follow-up"'));
  assert.ok(
    qaFeedback.feedback.improvements.includes(
      qaVariant.feedbackGuidance.improvementFocus,
    ),
  );
  assert.notEqual(
    audienceFeedback.feedback.suggestedRewrite,
    challengeFeedback.feedback.suggestedRewrite,
  );
  assert.notEqual(
    qaFeedback.feedback.suggestedRewrite,
    audienceFeedback.feedback.suggestedRewrite,
  );
});

test('adapts sales feedback to the selected objection angle', async () => {
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');
  const { createRuleBasedFeedback } = await import('../src/utils/ruleBasedFeedback.ts');
  const roleplay = practiceContent.roleplays.find((item) => item.id === 'sales-call');
  const priceVariant = roleplay.promptVariants.find((variant) => variant.id === 'price-concern');
  const budgetVariant = roleplay.promptVariants.find((variant) => variant.id === 'budget-value');
  const timingVariant = roleplay.promptVariants.find((variant) => variant.id === 'timing-concern');
  const answer = [
    'That makes sense, and I would first clarify the business priority.',
    'Then I would ask what the current problem costs the team today.',
    'As a result, we can connect the value to a low-pressure next step.',
  ].join(' ');
  const review = summarizePracticeAnswer(answer);
  const priceFeedback = createRuleBasedFeedback(roleplay, answer, review, priceVariant);
  const budgetFeedback = createRuleBasedFeedback(roleplay, answer, review, budgetVariant);
  const timingFeedback = createRuleBasedFeedback(roleplay, answer, review, timingVariant);

  assert.ok(priceFeedback.feedback.summary.includes('"Price concern"'));
  assert.equal(
    priceFeedback.feedback.suggestedRewrite,
    priceVariant.feedbackGuidance.suggestedRewrite,
  );
  assert.ok(
    priceFeedback.feedback.improvements.includes(
      priceVariant.feedbackGuidance.improvementFocus,
    ),
  );
  assert.ok(
    timingFeedback.feedback.strengths.includes(timingVariant.feedbackGuidance.strengthFocus),
  );
  assert.notEqual(
    priceFeedback.feedback.suggestedRewrite,
    timingFeedback.feedback.suggestedRewrite,
  );
  assert.ok(budgetFeedback.feedback.summary.includes('"Budget value"'));
  assert.ok(
    budgetFeedback.feedback.improvements.includes(
      budgetVariant.feedbackGuidance.improvementFocus,
    ),
  );
  assert.notEqual(
    budgetFeedback.feedback.suggestedRewrite,
    priceFeedback.feedback.suggestedRewrite,
  );
});

test('adapts small talk feedback to the selected practice angle', async () => {
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');
  const { createRuleBasedFeedback } = await import('../src/utils/ruleBasedFeedback.ts');
  const roleplay = practiceContent.roleplays.find((item) => item.id === 'workplace-small-talk');
  const introVariant = roleplay.promptVariants.find((variant) => variant.id === 'quick-introduction');
  const projectVariant = roleplay.promptVariants.find((variant) => variant.id === 'project-follow-up');
  const meetingVariant = roleplay.promptVariants.find((variant) => variant.id === 'move-to-meeting');
  const answer = [
    'Nice to meet you, I work with the customer team.',
    'First, I would ask what project you are working on today.',
    'Then I would move to the meeting agenda when everyone joins.',
  ].join(' ');
  const review = summarizePracticeAnswer(answer);
  const introFeedback = createRuleBasedFeedback(roleplay, answer, review, introVariant);
  const projectFeedback = createRuleBasedFeedback(roleplay, answer, review, projectVariant);
  const meetingFeedback = createRuleBasedFeedback(roleplay, answer, review, meetingVariant);

  assert.ok(introFeedback.feedback.summary.includes('"Quick introduction"'));
  assert.equal(
    introFeedback.feedback.suggestedRewrite,
    introVariant.feedbackGuidance.suggestedRewrite,
  );
  assert.ok(
    introFeedback.feedback.improvements.includes(
      introVariant.feedbackGuidance.improvementFocus,
    ),
  );
  assert.ok(
    meetingFeedback.feedback.strengths.includes(meetingVariant.feedbackGuidance.strengthFocus),
  );
  assert.ok(projectFeedback.feedback.summary.includes('"Project follow-up"'));
  assert.ok(
    projectFeedback.feedback.improvements.includes(
      projectVariant.feedbackGuidance.improvementFocus,
    ),
  );
  assert.notEqual(
    introFeedback.feedback.suggestedRewrite,
    meetingFeedback.feedback.suggestedRewrite,
  );
  assert.notEqual(
    projectFeedback.feedback.suggestedRewrite,
    introFeedback.feedback.suggestedRewrite,
  );
});

test('adapts follow-up prompts to the first answer weakness', async () => {
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');
  const { createAdaptiveFollowUpPrompt } = await import('../src/utils/followUpPrompt.ts');
  const roleplay = practiceContent.roleplays[0];

  const vagueAnswer = 'I worked with the team and helped on different tasks during the project.';
  const vaguePrompt = createAdaptiveFollowUpPrompt(roleplay, vagueAnswer, summarizePracticeAnswer(vagueAnswer));

  assert.equal(vaguePrompt.focus, 'result');
  assert.ok(vaguePrompt.prompt.includes('result') || vaguePrompt.prompt.includes('impact'));
  assert.ok(vaguePrompt.starterAnswer.includes('As a result'));

  const strongAnswer = [
    'In my previous role, I led a customer feedback project with my team.',
    'First, I grouped issues by priority.',
    'As a result, we reduced repeat complaints by 20%.',
  ].join(' ');
  const strongPrompt = createAdaptiveFollowUpPrompt(roleplay, strongAnswer, summarizePracticeAnswer(strongAnswer));

  assert.equal(strongPrompt.focus, 'next-step');
  assert.equal(strongPrompt.prompt, roleplay.followUpPrompts[0]);
  assert.ok(strongPrompt.starterAnswer.includes('next step'));
});

test('creates a professional daily mission from progress data', async () => {
  const { createDailyMission } = await import('../src/utils/gamification.ts');
  const mission = createDailyMission(progressMock.summary);

  assert.equal(mission.title, 'Complete one career roleplay');
  assert.equal(mission.xpGoal, 60);
  assert.ok(mission.level >= 1);
  assert.ok(mission.xpTotal > 0);
  assert.ok(mission.progressPercent >= 0);
  assert.ok(mission.progressPercent <= 100);
});

test('creates level progress labels from total XP', async () => {
  const { createLevelProgress } = await import('../src/utils/levelProgress.ts');

  assert.deepEqual(createLevelProgress(0), {
    currentLevelLabel: 'Level 1',
    nextLevelLabel: '180 XP to Level 2',
    progressLabel: '0/180 XP',
    progressPercent: 0,
    totalXpLabel: '0 total XP',
  });

  assert.deepEqual(createLevelProgress(218), {
    currentLevelLabel: 'Level 2',
    nextLevelLabel: '142 XP to Level 3',
    progressLabel: '38/180 XP',
    progressPercent: 21,
    totalXpLabel: '218 total XP',
  });
});

test('creates a guided practice career path for first-time users', async () => {
  const { createPracticeCareerPath } = await import('../src/utils/practiceCareerPath.ts');
  const path = createPracticeCareerPath({
    roleplays: practiceContent.roleplays,
    sessions: [],
  });

  assert.equal(path.title, 'Next: Job Interview');
  assert.equal(path.meta, 'Start simple');
  assert.equal(path.progressLabel, '0 of 5 complete');
  assert.equal(path.progressPercent, 0);
  assert.equal(path.roleplayId, 'job-interview');
  assert.equal(path.ctaLabel, 'Start Job Interview');
  assert.deepEqual(
    path.steps.map((step) => step.state),
    ['active', 'locked', 'locked', 'locked', 'locked'],
  );
  assert.equal(path.steps[0].caption, 'Interview | B1-B2 | 12 min');
});

test('creates simple professional practice map stats', async () => {
  const { createPracticeMapStats } = await import('../src/utils/practiceMapStats.ts');

  const emptyStats = createPracticeMapStats({
    path: { progressLabel: '0 of 5 complete' },
    sessions: [],
  });

  assert.deepEqual(emptyStats, [
    { label: 'Streak', value: '0 day', tone: 'focus' },
    { label: 'XP', value: '+40', tone: 'reward' },
    { label: 'Path', value: '0 of 5 complete', tone: 'path' },
  ]);

  const activeStats = createPracticeMapStats({
    path: { progressLabel: '2 of 5 complete' },
    sessions: [{ xpReward: 32 }, { xpReward: 28 }],
  });

  assert.equal(activeStats[0].value, '2 day');
  assert.equal(activeStats[1].value, '60');
  assert.equal(activeStats[2].value, '2 of 5 complete');
});

test('unlocks the next practice sprint in sequence after saved sessions', async () => {
  const { createPracticeCareerPath } = await import('../src/utils/practiceCareerPath.ts');
  const path = createPracticeCareerPath({
    roleplays: practiceContent.roleplays,
    sessions: [
      { roleplayId: 'meeting-practice' },
      { roleplayId: 'job-interview' },
    ],
  });

  assert.equal(path.title, 'Next: Presentation Practice');
  assert.equal(path.meta, '2 of 5 complete');
  assert.equal(path.progressLabel, '2 of 5 complete');
  assert.equal(path.progressPercent, 40);
  assert.equal(path.roleplayId, 'presentation-practice');
  assert.deepEqual(
    path.steps.map((step) => step.state),
    ['done', 'done', 'active', 'locked', 'locked'],
  );
});

test('loops the practice career path after all core roleplays are complete', async () => {
  const { createPracticeCareerPath } = await import('../src/utils/practiceCareerPath.ts');
  const path = createPracticeCareerPath({
    roleplays: practiceContent.roleplays,
    sessions: practiceContent.roleplays.map((roleplay) => ({ roleplayId: roleplay.id })),
  });

  assert.equal(path.title, 'Career path complete');
  assert.equal(path.meta, 'Full path complete');
  assert.equal(path.progressLabel, '5 of 5 complete');
  assert.equal(path.progressPercent, 100);
  assert.equal(path.roleplayId, 'meeting-practice');
  assert.equal(path.ctaLabel, 'Replay Meeting Practice');
  assert.equal(path.steps.find((step) => step.roleplayId === 'meeting-practice').state, 'active');
  assert.equal(path.steps.filter((step) => step.state === 'done').length, 4);
});

test('keeps the Practice tab focused on one recommended roleplay first', async () => {
  const { createPracticeLibraryState } = await import('../src/utils/practiceLibraryState.ts');

  const firstRunState = createPracticeLibraryState({
    roleplays: practiceContent.roleplays,
    sessions: [],
  });

  assert.equal(firstRunState.title, 'Next: Job Interview');
  assert.equal(firstRunState.meta, 'Start simple');
  assert.equal(firstRunState.progressLabel, '0 of 5 complete');
  assert.equal(firstRunState.recommendedCard.roleplayId, 'job-interview');
  assert.equal(firstRunState.recommendedCard.categoryLabel, 'Next');
  assert.equal(firstRunState.recommendedCard.ctaLabel, 'Start now');
  assert.equal(firstRunState.browseCards.length, 4);
  assert.equal(firstRunState.browseCards[0].categoryLabel, 'Later');
  assert.equal(firstRunState.browseLabel, '4 more roleplays');

  const activeState = createPracticeLibraryState({
    roleplays: practiceContent.roleplays,
    sessions: [
      { roleplayId: 'meeting-practice' },
      { roleplayId: 'job-interview' },
    ],
  });

  assert.equal(activeState.title, 'Next: Presentation Practice');
  assert.equal(activeState.progressPercent, 40);
  assert.equal(activeState.recommendedCard.roleplayId, 'presentation-practice');
  assert.equal(activeState.browseCards.find((card) => card.roleplayId === 'job-interview').categoryLabel, 'Completed');
  assert.equal(activeState.browseCards.find((card) => card.roleplayId === 'job-interview').ctaLabel, 'Practice again');
  assert.equal(activeState.browseCards.find((card) => card.roleplayId === 'sales-call').categoryLabel, 'Later');
});

test('formats the five-minute focus timer', async () => {
  const {
    createFocusTimerControls,
    FOCUS_SESSION_SECONDS,
    formatFocusTime,
  } = await import('../src/utils/focusTimer.ts');

  assert.equal(FOCUS_SESSION_SECONDS, 300);
  assert.equal(formatFocusTime(300), '5:00');
  assert.equal(formatFocusTime(61), '1:01');
  assert.equal(formatFocusTime(-20), '0:00');

  const idleControls = createFocusTimerControls({ isRunning: false, secondsRemaining: 300 });
  assert.equal(idleControls.title, 'Optional timer');
  assert.equal(idleControls.caption, '5-minute sprint');
  assert.equal(idleControls.primaryLabel, 'Start');
  assert.ok(idleControls.description.includes('5-minute'));
  assert.equal(idleControls.showReset, false);

  const runningControls = createFocusTimerControls({ isRunning: true, secondsRemaining: 240 });
  assert.equal(runningControls.caption, 'Sprint running');
  assert.equal(runningControls.primaryLabel, 'Pause');
  assert.equal(runningControls.showReset, true);

  const finishedControls = createFocusTimerControls({ isRunning: false, secondsRemaining: 0 });
  assert.equal(finishedControls.caption, 'Sprint complete');
  assert.equal(finishedControls.primaryLabel, 'Restart');
  assert.equal(finishedControls.showReset, true);
});
