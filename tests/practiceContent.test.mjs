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
    progressLabel: '0/1 saved',
    unlockLabel: 'Unlock Home and Progress',
  });

  assert.equal(ready.title, 'Good. Say it like this.');
  assert.equal(ready.rewriteLabel, 'Better English');
  assert.equal(
    ready.rewrite,
    'I helped my team finish a project on time by organizing tasks and sharing clear updates.',
  );
  assert.ok(ready.rewrite.length < 92);
  assert.equal(ready.xpLabel, '+40 XP');
  assert.deepEqual(ready.nextUnlock, {
    body: 'Next step is Save. This first win will unlock Home and Progress.',
    eyebrow: 'Next unlock',
    progressLabel: '0/1 saved',
    title: 'Unlock Home and Progress',
  });
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

test('creates a balanced coach recap for the review step', async () => {
  const { createFeedbackMomentumRecap } = await import('../src/utils/feedbackMomentum.ts');

  const recap = createFeedbackMomentumRecap({
    improvements: [' Add one measurable result or business outcome. '],
    summary: {
      overallScore: 73,
      strongestArea: { label: 'Structure', value: 88 },
      nextFocusArea: { label: 'Vocabulary', value: 62 },
    },
  });

  assert.equal(recap.strongestLabel, 'Working well');
  assert.equal(recap.strongestValue, 'Structure 88');
  assert.equal(recap.nextFocusLabel, 'Improve next');
  assert.equal(recap.nextFocusValue, 'Vocabulary 62');
  assert.equal(
    recap.coachLine,
    'Keep your structure. Add one measurable result or business outcome.',
  );

  const fallbackRecap = createFeedbackMomentumRecap({
    improvements: ['   '],
    summary: {
      overallScore: 72,
      strongestArea: { label: 'Clarity', value: 84 },
      nextFocusArea: { label: 'Confidence', value: 61 },
    },
  });

  assert.equal(fallbackRecap.coachLine, 'Keep your message clear. Improve confidence next.');
  assert.equal(
    createFeedbackMomentumRecap({
      improvements: [],
      summary: {
        overallScore: 0,
        strongestArea: null,
        nextFocusArea: null,
      },
    }),
    null,
  );
});

test('keeps roleplay feedback details clearly optional', async () => {
  const { createFeedbackDetailsToggleState } = await import(
    '../src/utils/feedbackDetailsToggle.ts'
  );

  assert.deepEqual(
    createFeedbackDetailsToggleState({
      improvementCount: 2,
      isOpen: false,
      scoreCount: 4,
      strengthCount: 2,
    }),
    {
      badgeLabel: 'Optional',
      meta: '4 score bars and 4 coach notes.',
      title: 'Optional coach details',
      tone: 'accent',
    },
  );

  assert.deepEqual(
    createFeedbackDetailsToggleState({
      improvementCount: 2,
      isOpen: true,
      scoreCount: 4,
      strengthCount: 2,
    }),
    {
      badgeLabel: 'Expanded',
      meta: 'Main correction stays above.',
      title: 'Hide coach details',
      tone: 'info',
    },
  );
});

test('creates a clear save-versus-retry cue in the review step', async () => {
  const { createReviewDecisionCue } = await import('../src/utils/reviewDecisionCue.ts');

  const needsRetry = createReviewDecisionCue({
    feedbackResult: {
      feedback: {
        improvements: ['Add one concrete action you took or would take.'],
      },
    },
    review: {
      isReadyForFeedback: false,
      readinessLabel: 'Needs more detail',
      reviewNote: 'Add one concrete action or example from work.',
      wordCount: 9,
    },
  });

  assert.equal(needsRetry.tone, 'info');
  assert.equal(needsRetry.badgeLabel, 'Retry first');
  assert.equal(needsRetry.title, 'Add one more sentence first');
  assert.ok(needsRetry.body.includes('Then check again before saving.'));

  const goodEnough = createReviewDecisionCue({
    feedbackResult: {
      feedback: {
        improvements: ['Add a result, decision or next step to make the answer stronger.'],
      },
    },
    review: {
      isReadyForFeedback: true,
      readinessLabel: 'Good start',
      reviewNote: 'Add a result, decision or next step to make the answer stronger.',
      wordCount: 24,
    },
  });

  assert.equal(goodEnough.tone, 'accent');
  assert.equal(goodEnough.badgeLabel, 'Save or retry once');
  assert.equal(goodEnough.title, 'Good enough to save');
  assert.ok(goodEnough.body.includes('Otherwise bank this rep'));

  const readyToSave = createReviewDecisionCue({
    feedbackResult: {
      feedback: {
        improvements: ['Add one stronger result line.'],
      },
    },
    review: {
      isReadyForFeedback: true,
      readinessLabel: 'Ready for feedback',
      reviewNote: 'Strong length for a short professional answer.',
      wordCount: 41,
    },
  });

  assert.equal(readyToSave.tone, 'success');
  assert.equal(readyToSave.badgeLabel, 'Bank this rep');
  assert.equal(readyToSave.title, 'Ready to save');
  assert.ok(readyToSave.body.includes('strong enough for today'));
});

test('keeps the Home coach focus short and actionable', async () => {
  const { createHomeCoachFocusText } = await import('../src/utils/homeCoachFocus.ts');

  assert.equal(
    createHomeCoachFocusText(
      'Good answer for "Tell me about yourself" with clear impact. Add one simple structure marker like "First" or "Next" to make it easier to follow.',
    ),
    'Next: add "First" or "Next".',
  );
  assert.equal(
    createHomeCoachFocusText('Add one measurable result or business outcome.'),
    'Next: add one measurable result.',
  );
  assert.equal(createHomeCoachFocusText('   '), null);
  assert.ok(
    createHomeCoachFocusText(
      'Use one stronger career verb such as led, organized or delivered before your result.',
    ).length <= 44,
  );
});

test('creates a compact Home coach strip state', async () => {
  const { createHomeCoachCue } = await import('../src/utils/homeCoachFocus.ts');

  assert.equal(createHomeCoachCue(null), null);

  assert.deepEqual(
    createHomeCoachCue({
      feedbackSummary: 'Good start. Add one measurable result or business outcome.',
      nextFocusLabel: 'Vocabulary 62',
      nextFocusText: 'Add one measurable result or business outcome.',
    }),
    {
      badgeLabel: 'Vocabulary 62',
      text: 'Next: add one measurable result.',
    },
  );

  assert.deepEqual(
    createHomeCoachCue({
      feedbackSummary:
        'Use one stronger career verb such as led, organized or delivered before your result.',
      nextFocusLabel: 'Coach target for saved answers',
    }),
    {
      badgeLabel: 'Next focus',
      text: 'Next: use a stronger career verb.',
    },
  );
});

test('creates a live readiness cue for the roleplay draft answer', async () => {
  const { createAnswerReadinessCue } = await import('../src/utils/answerReadinessCue.ts');
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');

  const emptyCue = createAnswerReadinessCue(summarizePracticeAnswer(''));
  const shortCue = createAnswerReadinessCue(
    summarizePracticeAnswer('I helped the team with updates and tasks this week.'),
  );
  const readyCue = createAnswerReadinessCue(
    summarizePracticeAnswer(
      [
        'In my previous role, I organized weekly client updates for the support team.',
        'First, I clarified the top issues and assigned clear owners.',
        'As a result, we reduced repeated questions and moved the launch forward on time.',
      ].join(' '),
    ),
  );

  assert.equal(emptyCue.title, 'Write your first answer');
  assert.equal(emptyCue.tone, 'secondary');
  assert.equal(emptyCue.progressLabel, '0/12 words to unlock feedback');
  assert.equal(emptyCue.badgeLabel, '0 words');

  assert.equal(shortCue.title, 'Needs more detail');
  assert.equal(shortCue.tone, 'secondary');
  assert.equal(shortCue.progressLabel, '10/12 words to unlock feedback');
  assert.equal(shortCue.progressPercent, 29);

  assert.equal(readyCue.title, 'Ready for feedback');
  assert.equal(readyCue.tone, 'success');
  assert.equal(readyCue.progressLabel, 'Strong short answer');
  assert.equal(readyCue.badgeLabel, '37 words');
  assert.equal(readyCue.progressPercent, 100);
});

test('creates a three-step runway for the roleplay flow', async () => {
  const { createRoleplayFlowRunway } = await import('../src/utils/roleplayFlowRunway.ts');

  const answerRunway = createRoleplayFlowRunway('answer');
  const reviewRunway = createRoleplayFlowRunway('review');
  const saveRunway = createRoleplayFlowRunway('save');

  assert.equal(answerRunway.progressLabel, 'Step 1 of 3');
  assert.equal(answerRunway.currentStepLabel, 'Answer now');
  assert.equal(answerRunway.progressPercent, 33);
  assert.deepEqual(
    answerRunway.steps.map((step) => `${step.numberLabel}-${step.label}-${step.state}`),
    ['1-Answer-current', '2-Review-upcoming', '3-Save-upcoming'],
  );

  assert.equal(reviewRunway.progressLabel, 'Step 2 of 3');
  assert.equal(reviewRunway.currentStepLabel, 'Review now');
  assert.equal(reviewRunway.progressPercent, 67);
  assert.deepEqual(
    reviewRunway.steps.map((step) => step.state),
    ['done', 'current', 'upcoming'],
  );

  assert.equal(saveRunway.progressLabel, 'Step 3 of 3');
  assert.equal(saveRunway.currentStepLabel, 'Save now');
  assert.equal(saveRunway.progressPercent, 100);
  assert.deepEqual(
    saveRunway.steps.map((step) => step.state),
    ['done', 'done', 'current'],
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

test('stores one unfinished roleplay draft in local storage', async () => {
  const {
    ROLEPLAY_DRAFT_KEY,
    clearRoleplayDraft,
    normalizeRoleplayDraft,
    readRoleplayDraft,
    saveRoleplayDraft,
  } = await import('../src/utils/roleplayDraftStorage.ts');
  const values = new Map();
  const storage = {
    getItem: async (key) => values.get(key) ?? null,
    removeItem: async (key) => {
      values.delete(key);
    },
    setItem: async (key, value) => {
      values.set(key, value);
    },
  };

  assert.equal(normalizeRoleplayDraft(null), null);
  assert.equal(
    normalizeRoleplayDraft({
      draftAnswer: '   ',
      roleplayId: 'job-interview',
      updatedAt: '2026-06-29T05:00:00.000Z',
    }),
    null,
  );
  assert.deepEqual(
    normalizeRoleplayDraft({
      draftAnswer: ' I led the kickoff and shared the next step. ',
      roleplayId: 'meeting-practice',
      updatedAt: '2026-06-29T05:00:00.000Z',
    }),
    {
      draftAnswer: 'I led the kickoff and shared the next step.',
      roleplayId: 'meeting-practice',
      updatedAt: '2026-06-29T05:00:00.000Z',
    },
  );
  assert.equal(await readRoleplayDraft(storage), null);

  await saveRoleplayDraft(storage, {
    draftAnswer: ' I led the kickoff and shared the next step. ',
    roleplayId: 'meeting-practice',
    updatedAt: '2026-06-29T05:00:00.000Z',
  });

  assert.equal(
    values.get(ROLEPLAY_DRAFT_KEY),
    JSON.stringify({
      draftAnswer: 'I led the kickoff and shared the next step.',
      roleplayId: 'meeting-practice',
      updatedAt: '2026-06-29T05:00:00.000Z',
    }),
  );
  assert.deepEqual(await readRoleplayDraft(storage), {
    draftAnswer: 'I led the kickoff and shared the next step.',
    roleplayId: 'meeting-practice',
    updatedAt: '2026-06-29T05:00:00.000Z',
  });

  await clearRoleplayDraft(storage);

  assert.equal(values.has(ROLEPLAY_DRAFT_KEY), false);
  assert.equal(await readRoleplayDraft(storage), null);
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
    starterAnswer: starterProfile.starterAnswer,
    starterEditSteps: starterProfile.starterEditSteps,
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
    starterAnswer: confidentProfile.starterAnswer,
    starterEditSteps: confidentProfile.starterEditSteps,
  });

  assert.equal(starterPreview.title, 'Your first English path');
  assert.equal(starterPreview.levelLabel, 'A1-A2');
  assert.equal(starterPreview.steps[0].label, 'Lesson 1');
  assert.equal(starterPreview.steps[0].title, 'Learn one clear sentence');
  assert.ok(starterPreview.steps[0].detail.includes('one clear result'));
  assert.equal(starterPreview.steps[1].label, 'Quest 1');
  assert.equal(starterPreview.steps[1].title, 'Quest 1: Job Interview');
  assert.ok(starterPreview.coachNote.includes('Keep it simple'));
  assert.ok(starterPreview.starterAnswer.includes('The result was'));
  assert.deepEqual(starterPreview.starterEditSteps, starterProfile.starterEditSteps);
  assert.equal(starterPreview.dailyTargetLabel, '1 roleplay a day');
  assert.ok(starterPreview.dailyTargetNote.includes('steady five-minute'));
  assert.equal(starterPreview.nextQuestTitleShort, 'Job Interview');
  assert.equal(starterPreview.sessionTitle, 'Your first practice loop');
  assert.equal(starterPreview.sessionBadgeLabel, 'First 5 min');
  assert.deepEqual(
    starterPreview.sessionSteps.map((step) => step.title),
    ['Learn one clear sentence', 'Job Interview', 'Coach review'],
  );
  assert.ok(starterPreview.sessionSteps[2].detail.includes('save the win for XP'));
  assert.ok(starterPreview.sessionNote.includes('enough to start the habit'));
  assert.equal(starterPreview.firstSaveMilestone.title, 'Day 1 target complete');
  assert.equal(starterPreview.firstSaveMilestone.badgeLabel, 'After save 1/1');
  assert.equal(starterPreview.firstSaveMilestone.progressLabel, 'After save: 1/1 roleplay today');
  assert.equal(starterPreview.firstSaveMilestone.progressPercent, 100);
  assert.equal(starterPreview.firstSaveMilestone.tone, 'success');
  assert.ok(starterPreview.firstSaveMilestone.body.includes('starts your streak'));
  assert.ok(starterPreview.firstSaveMilestone.body.includes('unlocks Progress'));
  assert.equal(starterPreview.ctaLabel, 'Start A1-A2 path');
  assert.equal(starterPreview.commitmentTitle, 'Learn one clear sentence now. Job Interview next.');
  assert.equal(starterPreview.commitmentNote, 'Lesson now. First Job Interview save today.');

  assert.equal(confidentPreview.levelLabel, 'B2');
  assert.ok(confidentPreview.steps[0].detail.includes('business result'));
  assert.ok(confidentPreview.coachNote.includes('business result'));
  assert.ok(confidentPreview.starterAnswer.includes('As a result'));
  assert.deepEqual(confidentPreview.starterEditSteps, confidentProfile.starterEditSteps);
  assert.equal(confidentPreview.dailyTargetLabel, '3 roleplays a day');
  assert.ok(confidentPreview.dailyTargetNote.includes('extra interview reps'));
  assert.ok(confidentPreview.sessionNote.includes('two more short roleplays later today'));
  assert.equal(confidentPreview.firstSaveMilestone.title, '2 more sprints later today');
  assert.equal(confidentPreview.firstSaveMilestone.badgeLabel, 'After save 1/3');
  assert.equal(confidentPreview.firstSaveMilestone.progressLabel, 'After save: 1/3 roleplays today');
  assert.equal(confidentPreview.firstSaveMilestone.progressPercent, 33);
  assert.equal(confidentPreview.firstSaveMilestone.tone, 'info');
  assert.ok(confidentPreview.firstSaveMilestone.body.includes('Save 2 more short roleplays later today'));
  assert.equal(confidentPreview.ctaLabel, 'Start B2 path');
  assert.equal(confidentPreview.commitmentNote, 'Lesson now. 3 saves today, starting with Job Interview.');
});

test('creates a compact onboarding first-week summary before showing full details', async () => {
  const { createOnboardingPlanPreview } = await import('../src/utils/onboardingPlan.ts');
  const { createOnboardingPlanSummary } = await import('../src/utils/onboardingPlanSummary.ts');
  const { foundationStart, guidedStart, levelAssessment } = await import('../src/data/guidedIntro.ts');
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterChoice = levelAssessment.choices.find((choice) => choice.id === 'starter');
  const starterProfile = getStartingLevelProfile('starter');
  const starterSummary = createOnboardingPlanSummary(
    createOnboardingPlanPreview({
      coachNote: starterProfile.coachMessage,
      dailyTarget: 1,
      firstLessonDetail: starterProfile.foundationRule,
      firstLessonTitle: foundationStart.title,
      firstQuestSubtitle: guidedStart.subtitle,
      firstQuestTitle: guidedStart.title,
      levelLabel: starterChoice.label,
      starterAnswer: starterProfile.starterAnswer,
      starterEditSteps: starterProfile.starterEditSteps,
    }),
  );

  assert.equal(starterSummary.pathTitle, 'Learn one clear sentence -> Job Interview');
  assert.equal(starterSummary.milestoneBadgeLabel, 'After save 1/1');
  assert.equal(starterSummary.milestoneTitle, 'Day 1 target complete');
  assert.equal(
    starterSummary.body,
    'First save starts your streak, opens Progress, and completes 1 roleplay a day.',
  );
  assert.equal(starterSummary.detailsLabel, 'See full first week');
  assert.equal(starterSummary.detailsBody, 'Daily pace, practice loop, and starter answer.');

  const confidentChoice = levelAssessment.choices.find((choice) => choice.id === 'confident');
  const confidentProfile = getStartingLevelProfile('confident');
  const confidentSummary = createOnboardingPlanSummary(
    createOnboardingPlanPreview({
      coachNote: confidentProfile.coachMessage,
      dailyTarget: 3,
      firstLessonDetail: confidentProfile.foundationRule,
      firstLessonTitle: foundationStart.title,
      firstQuestSubtitle: guidedStart.subtitle,
      firstQuestTitle: guidedStart.title,
      levelLabel: confidentChoice.label,
      starterAnswer: confidentProfile.starterAnswer,
      starterEditSteps: confidentProfile.starterEditSteps,
    }),
  );

  assert.equal(confidentSummary.milestoneBadgeLabel, 'After save 1/3');
  assert.equal(confidentSummary.milestoneTitle, '2 more sprints later today');
  assert.equal(
    confidentSummary.body,
    'First save starts your streak, opens Progress, and moves you to 1/3 today.',
  );
});

test('previews the exact first lesson sentence during onboarding', async () => {
  const { foundationStart, guidedStart } = await import('../src/data/guidedIntro.ts');
  const { createOnboardingLessonPreview } = await import('../src/utils/onboardingLessonPreview.ts');
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterProfile = getStartingLevelProfile('starter');
  const starterPreview = createOnboardingLessonPreview({
    exampleParts: starterProfile.foundationExampleParts,
    nextQuestTitle: guidedStart.title,
    structure: foundationStart.structure,
  });

  assert.equal(starterPreview.badgeLabel, '3 taps');
  assert.equal(starterPreview.title, 'I -> action -> result');
  assert.equal(starterPreview.exampleSentence, starterProfile.foundationExample);
  assert.equal(
    starterPreview.body,
    'Tap these parts in Lesson 1, then use the same shape in Job Interview.',
  );
  assert.deepEqual(starterPreview.parts, [
    { label: 'I', value: 'I' },
    { label: 'action', value: 'organized the weekly report' },
    { label: 'result', value: 'and sent it on time.' },
  ]);

  const confidentProfile = getStartingLevelProfile('confident');
  const confidentPreview = createOnboardingLessonPreview({
    exampleParts: confidentProfile.foundationExampleParts,
    nextQuestTitle: guidedStart.title,
    structure: foundationStart.structure,
  });

  assert.equal(confidentPreview.exampleSentence, confidentProfile.foundationExample);
  assert.ok(confidentPreview.parts[2].value.includes('reduced delays'));
});

test('connects the selected onboarding level to the first guided path', async () => {
  const { foundationStart, guidedStart } = await import('../src/data/guidedIntro.ts');
  const { createOnboardingLevelHandoff } = await import('../src/utils/onboardingLevelHandoff.ts');

  const handoff = createOnboardingLevelHandoff(foundationStart.title, guidedStart.title);

  assert.equal(handoff.title, 'We start simple');
  assert.equal(handoff.primaryStepLabel, 'Lesson 1');
  assert.equal(handoff.primaryStepTitle, 'Learn one clear sentence');
  assert.equal(handoff.secondaryStepLabel, 'Quest 1');
  assert.equal(handoff.secondaryStepTitle, 'Job Interview');
  assert.ok(handoff.body.includes('Learn one clear sentence'));
  assert.ok(handoff.body.includes('Job Interview'));
});

test('reuses the same coach path cue in onboarding and Foundation', async () => {
  const { foundationStart, guidedStart } = await import('../src/data/guidedIntro.ts');
  const { createFirstPathCoachCue } = await import('../src/utils/firstPathCoachCue.ts');

  const cue = createFirstPathCoachCue({
    coachNote: 'Build the sentence, then use the same shape in your interview answer.',
    firstLessonTitle: foundationStart.title,
    firstQuestTitle: guidedStart.title,
    levelLabel: 'B1',
  });

  assert.equal(cue.label, 'B1 path coach');
  assert.ok(cue.message.includes(foundationStart.title));
  assert.ok(cue.message.includes('Job Interview'));
  assert.ok(cue.message.includes('same shape'));
});

test('recommends a starting daily target based on onboarding level', async () => {
  const { createOnboardingDailyTargetGuide, resolveOnboardingDailyTarget } = await import(
    '../src/utils/onboardingDailyTargetGuide.ts'
  );

  const starterGuide = createOnboardingDailyTargetGuide('starter', 1);
  assert.equal(starterGuide.recommendedTarget, 1);
  assert.equal(starterGuide.recommendationLabel, '1/day');
  assert.equal(starterGuide.selectionLabel, 'Best fit');
  assert.equal(starterGuide.selectionTone, 'success');
  assert.ok(starterGuide.recommendationBody.includes('habit'));
  assert.deepEqual(starterGuide.previewStats, [
    { label: 'First week', value: '7 reps' },
    { label: 'Daily time', value: '5 min' },
  ]);
  assert.ok(starterGuide.previewBody.includes('daily streak'));

  const lighterGuide = createOnboardingDailyTargetGuide('basic', 1);
  assert.equal(lighterGuide.recommendedTarget, 2);
  assert.equal(lighterGuide.selectionLabel, 'Lighter start');
  assert.equal(lighterGuide.selectionTone, 'info');
  assert.ok(lighterGuide.selectionBody.includes('consistency'));
  assert.equal(lighterGuide.previewStats[0].value, '7 reps');

  const fasterGuide = createOnboardingDailyTargetGuide('basic', 3);
  assert.equal(fasterGuide.recommendedTarget, 2);
  assert.equal(fasterGuide.selectionLabel, 'Faster push');
  assert.equal(fasterGuide.selectionTone, 'accent');
  assert.ok(fasterGuide.selectionBody.includes('extra short reps'));
  assert.deepEqual(fasterGuide.previewStats, [
    { label: 'First week', value: '21 reps' },
    { label: 'Daily time', value: '15 min' },
  ]);
  assert.ok(fasterGuide.previewBody.includes('stronger sprint'));

  const confidentGuide = createOnboardingDailyTargetGuide('confident', 3);
  assert.equal(confidentGuide.recommendationTitle, 'Start with 3/day');
  assert.ok(confidentGuide.recommendationBody.includes('real interview practice'));

  assert.equal(resolveOnboardingDailyTarget('starter', 3, false), 1);
  assert.equal(resolveOnboardingDailyTarget('confident', 1, false), 3);
  assert.equal(resolveOnboardingDailyTarget('basic', 1, true), 1);
  assert.equal(resolveOnboardingDailyTarget('confident', 2, true), 2);
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

test('turns the profile daily target into a clear weekly pace summary', async () => {
  const { createProfileDailyTargetPlan } = await import(
    '../src/utils/profileDailyTargetPlan.ts'
  );

  const lightPlan = createProfileDailyTargetPlan(1);
  assert.equal(lightPlan.badgeLabel, 'Steady streak');
  assert.equal(lightPlan.title, '1 roleplay a day');
  assert.equal(lightPlan.optionPaceLabel, 'Light');
  assert.deepEqual(lightPlan.stats, [
    { label: 'This week', value: '7 reps' },
    { label: 'Daily time', value: '5 min' },
    { label: 'Rhythm', value: 'Light' },
  ]);
  assert.ok(lightPlan.body.includes('professional English active'));
  assert.ok(lightPlan.note.includes('five-minute rep'));

  const balancedPlan = createProfileDailyTargetPlan(2);
  assert.equal(balancedPlan.badgeLabel, 'Balanced pace');
  assert.equal(balancedPlan.optionPaceLabel, 'Balanced');
  assert.equal(balancedPlan.stats[0].value, '14 reps');
  assert.equal(balancedPlan.stats[1].value, '10 min');
  assert.ok(balancedPlan.body.includes('normal workday'));

  const focusedPlan = createProfileDailyTargetPlan(3);
  assert.equal(focusedPlan.badgeLabel, 'Focused push');
  assert.equal(focusedPlan.title, '3 roleplays a day');
  assert.equal(focusedPlan.optionPaceLabel, 'Focused');
  assert.equal(focusedPlan.stats[0].value, '21 reps');
  assert.equal(focusedPlan.stats[1].value, '15 min');
  assert.ok(focusedPlan.note.includes('interview, meeting, or presentation'));
});

test('creates a Profile current-focus handoff back to the next roleplay', async () => {
  const { createProfileCurrentFocus } = await import('../src/utils/profileCurrentFocus.ts');
  const practiceNow = new Date('2026-06-26T12:00:00.000Z');

  const firstFocus = createProfileCurrentFocus({
    dailyTarget: 1,
    now: practiceNow,
    roleplays: practiceContent.roleplays,
    sessions: [],
  });

  assert.equal(firstFocus.eyebrow, 'Current focus');
  assert.equal(firstFocus.title, 'Next: Job Interview');
  assert.equal(firstFocus.badgeLabel, '0/1 today');
  assert.equal(firstFocus.ctaLabel, 'Start Job Interview');
  assert.equal(firstFocus.roleplayId, 'job-interview');
  assert.ok(firstFocus.body.includes('first workplace answer'));
  assert.ok(firstFocus.metaLabel.includes('Interview'));

  const nextFocus = createProfileCurrentFocus({
    dailyTarget: 2,
    now: practiceNow,
    roleplays: practiceContent.roleplays,
    sessions: [{ completedAt: '2026-06-26T10:00:00.000Z', roleplayId: 'job-interview' }],
  });

  assert.equal(nextFocus.title, 'Next: Meeting Practice');
  assert.equal(nextFocus.badgeLabel, '1/2 today');
  assert.equal(nextFocus.roleplayId, 'meeting-practice');
  assert.ok(nextFocus.body.includes('Meeting Practice'));
  assert.equal(nextFocus.progressLabel, '1 of 5 complete');

  const bonusFocus = createProfileCurrentFocus({
    dailyTarget: 1,
    now: practiceNow,
    roleplays: practiceContent.roleplays,
    sessions: [{ completedAt: '2026-06-26T10:00:00.000Z', roleplayId: 'job-interview' }],
  });

  assert.equal(bonusFocus.badgeLabel, 'Target done');
  assert.ok(bonusFocus.body.includes('Optional Meeting Practice'));

  const freshDayFocus = createProfileCurrentFocus({
    dailyTarget: 2,
    now: new Date('2026-06-27T12:00:00.000Z'),
    roleplays: practiceContent.roleplays,
    sessions: [{ completedAt: '2026-06-26T10:00:00.000Z', roleplayId: 'job-interview' }],
  });

  assert.equal(freshDayFocus.badgeLabel, '0/2 today');
  assert.ok(freshDayFocus.body.includes("today's first short work rep"));
});

test('creates a friendly Profile privacy cue for local preview practice', async () => {
  const { createProfilePrivacyCue } = await import('../src/utils/profilePrivacyCue.ts');

  const cue = createProfilePrivacyCue();

  assert.equal(cue.badgeLabel, 'On this device');
  assert.equal(cue.title, 'Practice stays yours');
  assert.ok(cue.body.includes('No account'));
  assert.deepEqual(
    cue.items.map((item) => item.title),
    ['Saved here', 'No account'],
  );
  assert.ok(cue.items[0].body.includes('app preview'));
  assert.ok(cue.items[1].body.includes('without signup'));
});

test('personalizes the first lesson and answer starter by starting level', async () => {
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterProfile = getStartingLevelProfile('starter');
  const basicProfile = getStartingLevelProfile('basic');
  const confidentProfile = getStartingLevelProfile('confident');

  assert.deepEqual(starterProfile.foundationExampleParts, ['I', 'organized the weekly report', 'and sent it on time.']);
  assert.ok(starterProfile.answerPlaceholder.includes('I worked on'));
  assert.ok(starterProfile.starterAnswer.includes('The result was'));
  assert.deepEqual(starterProfile.starterEditSteps, [
    'Keep "I" first.',
    'Swap in your real task.',
    'End with one clear result.',
  ]);

  assert.deepEqual(basicProfile.foundationExampleParts, ['I', 'helped the team finish', 'the project on time.']);
  assert.ok(basicProfile.answerPlaceholder.includes('Currently, I'));

  assert.deepEqual(confidentProfile.foundationExampleParts, ['I', 'led the project update', 'and reduced delays for the team.']);
  assert.ok(confidentProfile.answerPlaceholder.includes('In my current role'));
  assert.deepEqual(confidentProfile.starterEditSteps, [
    'Lead with your real ownership.',
    'Name one business action.',
    'Finish with the business result.',
  ]);
  assert.equal(getStartingLevelProfile(null).foundationExample, basicProfile.foundationExample);
});

test('builds the first foundation sentence step by step', async () => {
  const { foundationStart } = await import('../src/data/guidedIntro.ts');
  const { createFoundationSentenceBuilderState } = await import('../src/utils/foundationSentenceBuilder.ts');
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterProfile = getStartingLevelProfile('starter');
  const startState = createFoundationSentenceBuilderState({
    completedSteps: 0,
    exampleParts: starterProfile.foundationExampleParts,
    structure: foundationStart.structure,
  });
  const midState = createFoundationSentenceBuilderState({
    completedSteps: 2,
    exampleParts: starterProfile.foundationExampleParts,
    structure: foundationStart.structure,
  });
  const completeState = createFoundationSentenceBuilderState({
    completedSteps: 9,
    exampleParts: starterProfile.foundationExampleParts,
    structure: foundationStart.structure,
  });

  assert.equal(startState.activePart, 'I');
  assert.equal(startState.activePiece, 'I');
  assert.equal(startState.progressLabel, '0/3 parts built');
  assert.equal(startState.previewText, '[I] [action] [result]');
  assert.equal(startState.helperLabel, 'Next: I');
  assert.equal(startState.helperText, 'Tap to add: "I"');
  assert.deepEqual(
    startState.previewSegments.map((segment) => segment.state),
    ['current', 'locked', 'locked'],
  );

  assert.equal(midState.activePart, 'result');
  assert.equal(midState.activePiece, 'and sent it on time.');
  assert.equal(midState.progressPercent, 67);
  assert.equal(midState.previewText, 'I organized the weekly report [result]');
  assert.equal(midState.helperLabel, 'Next: result');
  assert.equal(midState.helperText, 'Tap to add: "and sent it on time."');
  assert.deepEqual(
    midState.previewSegments.map((segment) => segment.text),
    ['I', 'organized the weekly report', 'result'],
  );

  assert.equal(completeState.activePart, null);
  assert.equal(completeState.activePiece, null);
  assert.equal(completeState.isComplete, true);
  assert.equal(completeState.progressLabel, '3/3 parts built');
  assert.equal(completeState.previewText, starterProfile.foundationExample);
  assert.equal(completeState.helperLabel, 'Sentence ready');
  assert.equal(
    completeState.helperText,
    'Use this exact shape in your first career answer.',
  );
});

test('creates a level-matched foundation handoff before the first interview', async () => {
  const { guidedStart } = await import('../src/data/guidedIntro.ts');
  const { createFoundationHandoff } = await import('../src/utils/foundationHandoff.ts');
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterProfile = getStartingLevelProfile('starter');
  const confidentProfile = getStartingLevelProfile('confident');
  const starterHandoff = createFoundationHandoff({
    coachNote: starterProfile.coachMessage,
    dailyTarget: 1,
    nextQuestTitle: guidedStart.title,
    starterAnswer: starterProfile.starterAnswer,
    starterEditSteps: starterProfile.starterEditSteps,
  });
  const confidentHandoff = createFoundationHandoff({
    coachNote: confidentProfile.coachMessage,
    dailyTarget: 3,
    nextQuestTitle: guidedStart.title,
    starterAnswer: confidentProfile.starterAnswer,
    starterEditSteps: confidentProfile.starterEditSteps,
  });

  assert.equal(starterHandoff.eyebrow, 'Next step');
  assert.equal(starterHandoff.title, 'Quest 1: Job Interview');
  assert.equal(starterHandoff.pathLabel, 'What happens next');
  assert.deepEqual(
    starterHandoff.pathSteps.map((step) => step.badgeLabel),
    ['Now', 'After save'],
  );
  assert.equal(starterHandoff.pathSteps[0].title, 'Open Job Interview');
  assert.ok(starterHandoff.pathSteps[0].detail.includes('starter line'));
  assert.equal(starterHandoff.pathSteps[1].title, 'Unlock Wins');
  assert.equal(starterHandoff.pathSteps[1].detail, 'Start your streak and complete 1/1 today.');
  assert.equal(starterHandoff.starterLabel, 'Starter answer');
  assert.equal(starterHandoff.editPlanLabel, 'Make it yours');
  assert.deepEqual(starterHandoff.editPlanSteps, starterProfile.starterEditSteps);
  assert.ok(starterHandoff.body.includes('first interview answer'));
  assert.ok(starterHandoff.coachNote.includes('Keep it simple'));
  assert.ok(starterHandoff.starterAnswer.includes('The result was'));

  assert.ok(confidentHandoff.coachNote.includes('business result'));
  assert.equal(confidentHandoff.pathSteps[1].detail, 'Start your streak and reach 1/3 today.');
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

test('chooses one visible inline answer starter before optional help', async () => {
  const { createRoleplayAnswerStarterState } = await import(
    '../src/utils/roleplayAnswerStarter.ts'
  );
  const { createRoleplayStarterReminder } = await import('../src/utils/roleplayStarterReminder.ts');
  const { createRoleplayWarmupCue } = await import('../src/utils/roleplayWarmupCue.ts');
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterProfile = getStartingLevelProfile('starter');
  const starterReminder = createRoleplayStarterReminder({
    roleplayId: 'job-interview',
    sessions: [],
    starterAnswer: starterProfile.starterAnswer,
  });
  const warmupCue = createRoleplayWarmupCue({
    correction: 'I organized the handoff and confirmed the next step with the client.',
    id: 'mistake-1',
    note: 'Say the action first, then the next step.',
    original: 'I do handoff with client.',
    priority: 'High',
    category: 'Clarity',
  });

  const warmupStarter = createRoleplayAnswerStarterState({
    hasDraftAnswer: false,
    quickStartPhrase: 'I can give a short update on that.',
    starterReminder,
    warmupCue,
  });

  assert.deepEqual(warmupStarter, {
    badgeLabel: 'From Progress',
    body: 'I organized the handoff and confirmed the next step with the client.',
    ctaLabel: 'Use this line',
    eyebrow: 'Warm-up cue',
    note: 'Say the action first, then the next step.',
    source: 'warmup',
    tone: 'info',
  });

  const reminderStarter = createRoleplayAnswerStarterState({
    hasDraftAnswer: false,
    quickStartPhrase: 'I can give a short update on that.',
    starterReminder,
    warmupCue: null,
  });

  assert.equal(reminderStarter.eyebrow, 'Starter reminder');
  assert.equal(reminderStarter.badgeLabel, 'First answer');
  assert.equal(reminderStarter.ctaLabel, 'Use starter');
  assert.equal(reminderStarter.source, 'starter-reminder');
  assert.equal(reminderStarter.tone, 'secondary');
  assert.ok(reminderStarter.body.includes('The result was'));

  assert.deepEqual(
    createRoleplayAnswerStarterState({
      hasDraftAnswer: false,
      quickStartPhrase: ' I can give a short update on that. ',
      starterReminder: null,
      warmupCue: null,
    }),
    {
      badgeLabel: 'Quick line',
      body: 'I can give a short update on that.',
      ctaLabel: 'Use starter',
      eyebrow: 'Quick starter',
      note: 'Use one short first line, then make the rest your own.',
      source: 'quick-start',
      tone: 'accent',
    },
  );

  assert.equal(
    createRoleplayAnswerStarterState({
      hasDraftAnswer: true,
      quickStartPhrase: 'I can give a short update on that.',
      starterReminder,
      warmupCue,
    }),
    null,
  );
});

test('creates a foundation handoff cue for the first interview answer', async () => {
  const { foundationStart, guidedStart, levelAssessment } = await import('../src/data/guidedIntro.ts');
  const { createFirstPathCoachCue } = await import('../src/utils/firstPathCoachCue.ts');
  const {
    createFoundationWarmupCue,
    createRoleplayWarmupCue,
  } = await import('../src/utils/roleplayWarmupCue.ts');
  const { createFoundationStarterAction } = await import('../src/utils/foundationStarterAction.ts');
  const { createFoundationAnswerBoxCue } = await import('../src/utils/foundationAnswerBoxCue.ts');
  const { createFoundationStarterChecklist } = await import('../src/utils/foundationStarterChecklist.ts');
  const { createFoundationWarmupPanel } = await import('../src/utils/foundationWarmupPanel.ts');
  const { createRoleplayFirstQuestState } = await import('../src/utils/roleplayFirstQuest.ts');
  const { getStartingLevelProfile } = await import('../src/utils/startingLevel.ts');

  const starterProfile = getStartingLevelProfile('starter');
  const confidentProfile = getStartingLevelProfile('confident');
  const starterLevelLabel = levelAssessment.choices.find((choice) => choice.id === 'starter')?.label;
  const confidentLevelLabel = levelAssessment.choices.find((choice) => choice.id === 'confident')?.label;
  const starterCue = createFoundationWarmupCue({
    coachNote: starterProfile.coachMessage,
    starterAnswer: starterProfile.starterAnswer,
  });
  const firstQuestState = createRoleplayFirstQuestState({
    guidedStart,
    roleplayId: guidedStart.roleplayId,
    sessions: [],
  });
  const confidentCue = createFoundationWarmupCue({
    coachNote: confidentProfile.coachMessage,
    starterAnswer: confidentProfile.starterAnswer,
  });
  assert.ok(firstQuestState);

  assert.equal(starterCue.cueId, 'foundation-starter');
  assert.equal(starterCue.eyebrow, 'Foundation handoff');
  assert.equal(starterCue.badgeLabel, 'From Lesson 1');
  assert.equal(starterCue.ctaLabel, 'Use starter line');
  assert.equal(starterCue.autoApplyStarter, true);
  assert.ok(starterCue.note.includes('Keep it simple'));
  assert.ok(starterCue.starterAnswer.includes('The result was'));
  const starterPathCoachCue = createFirstPathCoachCue({
    coachNote: starterProfile.coachMessage,
    firstLessonTitle: foundationStart.title,
    firstQuestTitle: guidedStart.title,
    levelLabel: starterLevelLabel,
  });
  const starterPanel = createFoundationWarmupPanel({
    coachCueLabel: starterPathCoachCue.label,
    coachCueMessage: starterPathCoachCue.message,
    editPlanSteps: starterProfile.starterEditSteps,
    note: starterCue.note,
    starterAnswer: starterCue.starterAnswer,
    unlockProgress: {
      progressLabel: firstQuestState.progressLabel,
      unlockLabel: firstQuestState.unlockLabel,
    },
  });
  assert.equal(starterPanel.title, 'Lesson 1 starter is ready');
  assert.equal(starterPanel.coachCueLabel, 'A1-A2 path coach');
  assert.ok(starterPanel.coachCueMessage.includes(foundationStart.title));
  assert.ok(starterPanel.coachCueMessage.includes('Job Interview'));
  assert.equal(starterPanel.starterLabel, 'Loaded starter');
  assert.equal(starterPanel.editPlanLabel, 'Make it yours');
  assert.deepEqual(starterPanel.editPlanSteps, starterProfile.starterEditSteps);
  assert.deepEqual(starterPanel.unlockProgress, {
    body: 'Save this edited answer to unlock Home and Progress.',
    progressLabel: '0/1 saved',
    unlockLabel: 'Unlock Home and Progress',
  });
  assert.equal(
    starterPanel.body,
    'Starter is loaded below. Edit the task and result in the answer box, then check.',
  );
  assert.ok(starterPanel.starterAnswer.includes('The result was'));
  assert.deepEqual(
    createFoundationStarterAction({
      draftAnswer: starterPanel.starterAnswer,
      starterAnswer: starterPanel.starterAnswer,
    }),
    {
      ctaLabel: 'Edit answer',
      mode: 'loaded',
    },
  );
  assert.deepEqual(
    createFoundationAnswerBoxCue({
      draftAnswer: starterPanel.starterAnswer,
      isReadyForFeedback: true,
      steps: starterPanel.editPlanSteps,
      starterAnswer: starterPanel.starterAnswer,
    }),
    {
      badgeLabel: 'Step 2 of 3',
      body: 'Make this one change in the answer box before you check.',
      title: 'Swap in your real task.',
      tone: 'secondary',
    },
  );
  assert.deepEqual(
    createFoundationStarterChecklist({
      draftAnswer: starterPanel.starterAnswer,
      isReadyForFeedback: true,
      starterAnswer: starterPanel.starterAnswer,
      steps: starterPanel.editPlanSteps,
    }),
    {
      items: [
        { state: 'done', statusLabel: 'Done', text: 'Keep "I" first.' },
        { state: 'current', statusLabel: 'Do now', text: 'Swap in your real task.' },
        { state: 'upcoming', statusLabel: 'Next', text: 'End with one clear result.' },
      ],
      progressLabel: 'Step 2 of 3',
    },
  );
  assert.deepEqual(
    createFoundationStarterAction({
      draftAnswer: '',
      starterAnswer: starterPanel.starterAnswer,
    }),
    {
      ctaLabel: 'Reload starter',
      mode: 'cleared',
    },
  );
  assert.deepEqual(
    createFoundationAnswerBoxCue({
      draftAnswer: '',
      isReadyForFeedback: false,
      steps: starterPanel.editPlanSteps,
      starterAnswer: starterPanel.starterAnswer,
    }),
    {
      badgeLabel: 'Write now',
      body: 'Reload the starter or write your own version below before you check.',
      title: 'Answer box is empty',
      tone: 'accent',
    },
  );
  assert.deepEqual(
    createFoundationStarterChecklist({
      draftAnswer: '',
      isReadyForFeedback: false,
      starterAnswer: starterPanel.starterAnswer,
      steps: starterPanel.editPlanSteps,
    }),
    {
      items: [
        { state: 'current', statusLabel: 'Do now', text: 'Keep "I" first.' },
        { state: 'upcoming', statusLabel: 'Next', text: 'Swap in your real task.' },
        { state: 'upcoming', statusLabel: 'Next', text: 'End with one clear result.' },
      ],
      progressLabel: 'Step 1 of 3',
    },
  );
  assert.deepEqual(
    createFoundationStarterAction({
      draftAnswer:
        'I worked on customer onboarding, and I helped the team reply faster. The result was happier customers.',
      starterAnswer: starterPanel.starterAnswer,
    }),
    {
      ctaLabel: 'Reload starter',
      mode: 'edited',
    },
  );
  assert.deepEqual(
    createFoundationAnswerBoxCue({
      draftAnswer: 'I led onboarding.',
      isReadyForFeedback: false,
      steps: starterPanel.editPlanSteps,
      starterAnswer: starterPanel.starterAnswer,
    }),
    {
      badgeLabel: 'Step 3 of 3',
      body: 'Add this final line in the answer box before you check.',
      title: 'End with one clear result.',
      tone: 'accent',
    },
  );
  assert.deepEqual(
    createFoundationStarterChecklist({
      draftAnswer: 'I led onboarding.',
      isReadyForFeedback: false,
      starterAnswer: starterPanel.starterAnswer,
      steps: starterPanel.editPlanSteps,
    }),
    {
      items: [
        { state: 'done', statusLabel: 'Done', text: 'Keep "I" first.' },
        { state: 'done', statusLabel: 'Done', text: 'Swap in your real task.' },
        { state: 'current', statusLabel: 'Do now', text: 'End with one clear result.' },
      ],
      progressLabel: 'Step 3 of 3',
    },
  );
  assert.deepEqual(
    createFoundationStarterChecklist({
      draftAnswer:
        'I worked on customer onboarding, and I helped the team reply faster. The result was happier customers.',
      isReadyForFeedback: true,
      starterAnswer: starterPanel.starterAnswer,
      steps: starterPanel.editPlanSteps,
    }),
    {
      items: [
        { state: 'done', statusLabel: 'Done', text: 'Keep "I" first.' },
        { state: 'done', statusLabel: 'Done', text: 'Swap in your real task.' },
        { state: 'done', statusLabel: 'Done', text: 'End with one clear result.' },
      ],
      progressLabel: '3/3 ready',
    },
  );
  assert.deepEqual(
    createFoundationAnswerBoxCue({
      draftAnswer:
        'I worked on customer onboarding, and I helped the team reply faster. The result was happier customers.',
      isReadyForFeedback: true,
      steps: starterPanel.editPlanSteps,
      starterAnswer: starterPanel.starterAnswer,
    }),
    {
      badgeLabel: 'Ready to check',
      body: 'Your answer already sounds personal. Do one quick clarity pass, then check it.',
      title: 'Your edit is ready for feedback',
      tone: 'success',
    },
  );
  assert.ok(confidentCue.note.includes('business result'));
  assert.ok(confidentCue.starterAnswer.includes('As a result'));
  const confidentPathCoachCue = createFirstPathCoachCue({
    coachNote: confidentProfile.coachMessage,
    firstLessonTitle: foundationStart.title,
    firstQuestTitle: guidedStart.title,
    levelLabel: confidentLevelLabel,
  });
  const confidentPanel = createFoundationWarmupPanel({
    coachCueLabel: confidentPathCoachCue.label,
    coachCueMessage: confidentPathCoachCue.message,
    editPlanSteps: confidentProfile.starterEditSteps,
    note: confidentCue.note,
    starterAnswer: confidentCue.starterAnswer,
    unlockProgress: {
      progressLabel: firstQuestState.progressLabel,
      unlockLabel: firstQuestState.unlockLabel,
    },
  });
  assert.equal(confidentPanel.coachCueLabel, 'B2 path coach');
  assert.ok(confidentPanel.coachCueMessage.includes('business result'));
  assert.equal(confidentPanel.unlockProgress?.progressLabel, '0/1 saved');
  assert.ok(confidentPanel.starterAnswer.includes('As a result'));

  const progressCue = createRoleplayWarmupCue({
    category: 'Grammar',
    correction: 'I led the handoff and clarified the next step.',
    id: 'mistake-1',
    note: 'Keep the verb in the past tense.',
    original: 'I lead the handoff and clarify the next step.',
    priority: 'High',
  });

  assert.equal(progressCue.autoApplyStarter, false);
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
    createFirstQuestSaveRecap,
    createNextPracticeRecommendation,
    createPracticeCompletionMilestone,
    createPracticeCompletionSummary,
    createPracticeSaveLockInPreview,
    createPracticeSavePrompt,
    createPracticeTargetPreview,
    createSavedCoachRecap,
    createSavedLevelUpRecap,
    createSavedRoleplayMilestone,
    createSavedRoleplayHandoff,
    createSavedRoleplayPathProgress,
  } = await import('../src/utils/practiceCompletion.ts');

  const firstAnswerPrompt = createPracticeSavePrompt({
    includedFollowUp: false,
    progressLabel: 'After save: 1/2 roleplays today',
    progressTitle: 'One more sprint after this',
    xpReward: 55,
  });

  assert.equal(firstAnswerPrompt.eyebrow, 'Keep today moving');
  assert.equal(firstAnswerPrompt.title, 'Save to reach 1/2 today');
  assert.equal(firstAnswerPrompt.xpLabel, '+55 XP');
  assert.equal(firstAnswerPrompt.ctaLabel, 'Save for 1/2 today');
  assert.equal(firstAnswerPrompt.followUpLabel, 'Bonus turn optional');
  assert.ok(firstAnswerPrompt.body.includes('reach 1/2 today'));
  assert.ok(firstAnswerPrompt.body.includes('optional'));

  const followUpPrompt = createPracticeSavePrompt({
    includedFollowUp: true,
    progressLabel: 'After save: 2/2 roleplays today',
    progressTitle: 'This lesson completes today\'s target',
    xpReward: 70,
  });

  assert.equal(followUpPrompt.eyebrow, 'Finish today');
  assert.equal(followUpPrompt.title, 'Save to finish 2/2 today');
  assert.equal(followUpPrompt.ctaLabel, 'Save and finish today');
  assert.equal(followUpPrompt.followUpLabel, 'Bonus turn added');
  assert.ok(followUpPrompt.body.includes('both turns'));
  assert.ok(followUpPrompt.body.includes('complete 2/2 today'));

  const bonusPrompt = createPracticeSavePrompt({
    includedFollowUp: false,
    progressLabel: '1/1 roleplay today',
    progressTitle: 'Daily target already complete',
    xpReward: 40,
  });

  assert.equal(bonusPrompt.eyebrow, 'Bonus practice');
  assert.equal(bonusPrompt.title, 'Bank an extra save');
  assert.equal(bonusPrompt.ctaLabel, 'Save bonus practice');
  assert.ok(bonusPrompt.body.includes('bonus practice'));

  const firstAnswerLockIn = createPracticeSaveLockInPreview({
    includedFollowUp: false,
    progressLabel: 'After save: 1/2 roleplays today',
    progressTitle: 'One more sprint after this',
    xpReward: 55,
  });

  assert.equal(firstAnswerLockIn.eyebrow, 'Locks in');
  assert.deepEqual(firstAnswerLockIn.items, [
    { label: 'Progress', value: 'Save this answer to Progress' },
    { label: 'Today', value: 'Reaches 1/2 today' },
    { label: 'XP', value: 'Bank +55 XP' },
  ]);

  const firstQuestRecap = createFirstQuestSaveRecap({
    progressLabel: 'After save: 1/1 roleplay today',
    progressTitle: 'This lesson completes today\'s target',
    unlockLabel: 'Unlock Home and Progress',
    xpReward: 55,
  });

  assert.equal(firstQuestRecap.ctaLabel, 'Save and unlock Home');
  assert.equal(firstQuestRecap.eyebrow, 'Unlocks');
  assert.equal(firstQuestRecap.primaryTitle, 'Save opens Home and Progress');
  assert.equal(
    firstQuestRecap.primaryBody,
    'One tap banks +55 XP, starts today and opens the guided app.',
  );
  assert.deepEqual(firstQuestRecap.items, [
    { label: 'App', value: 'Home and Progress' },
    { label: 'Today', value: 'Completes 1/1 today' },
    { label: 'XP', value: 'Bank +55 XP' },
  ]);

  const bonusLockIn = createPracticeSaveLockInPreview({
    includedFollowUp: true,
    progressLabel: '1/1 roleplay today',
    progressTitle: 'Daily target already complete',
    xpReward: 70,
  });

  assert.deepEqual(bonusLockIn.items, [
    { label: 'Progress', value: 'Save both turns to Progress' },
    { label: 'Today', value: 'Counts as bonus practice' },
    { label: 'XP', value: 'Bank +70 XP' },
  ]);

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

  const firstSprintPreview = createPracticeTargetPreview({
    dailyTarget: 2,
    completedSessions: 0,
  });

  assert.equal(firstSprintPreview.title, 'One more sprint after this');
  assert.equal(firstSprintPreview.badgeLabel, 'After save 1/2');
  assert.equal(firstSprintPreview.progressLabel, 'After save: 1/2 roleplays today');
  assert.equal(firstSprintPreview.progressPercent, 50);
  assert.equal(firstSprintPreview.tone, 'info');

  const finishingPreview = createPracticeTargetPreview({
    dailyTarget: 2,
    completedSessions: 1,
  });

  assert.equal(finishingPreview.title, 'This lesson completes today\'s target');
  assert.equal(finishingPreview.badgeLabel, 'After save 2/2');
  assert.equal(finishingPreview.progressPercent, 100);
  assert.equal(finishingPreview.tone, 'success');

  const bonusPreview = createPracticeTargetPreview({
    dailyTarget: 1,
    completedSessions: 2,
  });

  assert.equal(bonusPreview.title, 'Daily target already complete');
  assert.equal(bonusPreview.badgeLabel, 'Bonus practice');
  assert.equal(bonusPreview.progressLabel, '1/1 roleplay today');
  assert.equal(bonusPreview.progressPercent, 100);
  assert.equal(bonusPreview.tone, 'success');

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
  assert.equal(savedPathProgress.runway?.title, 'After Presentation Practice');
  assert.deepEqual(
    savedPathProgress.runway?.items.map((item) => `${item.sequenceLabel}:${item.title}:${item.statusLabel}`),
    [
      '03:Presentation Practice:Done',
      '04:Sales Call:Do now',
      '05:Workplace Small Talk:Unlock next',
    ],
  );
  assert.deepEqual(
    savedPathProgress.runway?.items.map((item) => item.supportLabel),
    [
      'Saved already',
      'Sales | B2 | 14 min • +56 XP',
      'Opens after this save',
    ],
  );
  assert.equal(
    savedPathProgress.runway?.body,
    'Presentation Practice saved. Start Sales Call to unlock Workplace Small Talk.',
  );

  const nextAfterSales = createNextPracticeRecommendation('sales-call', practiceContent.roleplays);
  assert.equal(nextAfterSales.roleplayId, 'workplace-small-talk');
  assert.equal(nextAfterSales.ctaLabel, 'Start next roleplay');
  assert.ok(nextAfterSales.reason.includes('small talk'));

  const savedHandoff = createSavedRoleplayHandoff({
    dailyTarget: 3,
    isPathComplete: savedPathProgress.isPathComplete,
    nextPracticeTitle: savedPathProgress.nextTitle,
    savedSessionCount: 2,
    xpReward: 45,
  });

  assert.equal(savedHandoff.title, 'Saved');
  assert.equal(savedHandoff.ctaTarget, 'roleplay');
  assert.equal(savedHandoff.ctaLabel, 'Start Sales Call');
  assert.equal(savedHandoff.nextLabel, 'Finish today with');
  assert.equal(savedHandoff.nextTitle, 'Sales Call');
  assert.equal(savedHandoff.payoffLine, 'Next: Sales Call is unlocked and ready.');
  assert.equal(savedHandoff.xpLabel, '+45 XP');
  assert.ok(savedHandoff.body.includes('finish 3/3 today'));

  const savedCoachRecap = createSavedCoachRecap({
    feedbackSummary: 'Clear opening with one useful next step.',
    nextFocusLabel: 'Coach target',
    nextFocusText: 'Add one concrete result before the final sentence.',
  });

  assert.equal(savedCoachRecap.badgeLabel, 'Coach target');
  assert.equal(savedCoachRecap.text, 'Add one concrete result before the final sentence.');

  const savedLevelUpRecap = createSavedLevelUpRecap({
    currentLevelLabel: 'Level 3',
    previousLevelLabel: 'Level 2',
    totalXpLabel: '185 XP total',
  });

  assert.equal(savedLevelUpRecap.badgeLabel, 'Level 3');
  assert.equal(savedLevelUpRecap.text, 'From Level 2 to Level 3');
  assert.equal(savedLevelUpRecap.totalXpLabel, '185 XP total');

  const fallbackCoachRecap = createSavedCoachRecap({
    feedbackSummary: 'Keep the structure and make the business result more specific.',
    nextFocusLabel: '',
    nextFocusText: '',
  });

  assert.equal(fallbackCoachRecap.badgeLabel, 'Coach note');
  assert.equal(
    fallbackCoachRecap.text,
    'Keep the structure and make the business result more specific.',
  );
  assert.equal(
    createSavedCoachRecap({
      feedbackSummary: '   ',
      nextFocusLabel: 'Coach target',
      nextFocusText: '   ',
    }),
    null,
  );

  const nextAfterSmallTalk = createNextPracticeRecommendation('workplace-small-talk', practiceContent.roleplays);
  assert.equal(nextAfterSmallTalk.roleplayId, 'job-interview');

  const fallbackSavedHandoff = createSavedRoleplayHandoff({
    dailyTarget: 2,
    nextPracticeTitle: null,
    savedSessionCount: 2,
    xpReward: 25,
  });

  assert.equal(fallbackSavedHandoff.ctaTarget, 'progress');
  assert.equal(fallbackSavedHandoff.ctaLabel, 'Review Wins');
  assert.equal(fallbackSavedHandoff.nextLabel, 'Bonus next');
  assert.equal(fallbackSavedHandoff.nextTitle, 'Another short English sprint');
  assert.equal(
    fallbackSavedHandoff.payoffLine,
    'Next: review your win or bank a bonus sprint later.',
  );
  assert.equal(fallbackSavedHandoff.xpLabel, '+25 XP');
  assert.ok(fallbackSavedHandoff.body.includes('Today is complete'));

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
    dailyTarget: 2,
    isPathComplete: completedPathProgress.isPathComplete,
    nextPracticeTitle: completedPathProgress.nextTitle,
    savedSessionCount: 1,
    xpReward: 45,
  });

  assert.equal(completedPathProgress.title, 'Career path complete');
  assert.equal(completedPathProgress.nextLabel, 'Replay ready');
  assert.equal(completedPathProgress.progressPercent, 100);
  assert.equal(completedPathProgress.isPathComplete, true);
  assert.equal(completedPathProgress.runway?.title, 'Full path complete');
  assert.equal(
    completedPathProgress.runway?.items.find((item) => item.state === 'active')?.statusLabel,
    'Replay now',
  );
  assert.equal(
    completedPathProgress.runway?.items.find((item) => item.state === 'active')?.supportLabel,
    'Interview | B1-B2 | 12 min • +48 XP',
  );
  assert.equal(
    completedPathProgress.runway?.body,
    'Full path cleared. Replay Job Interview to keep your streak moving.',
  );
  assert.equal(replayHandoff.ctaLabel, 'Replay Job Interview');
  assert.equal(replayHandoff.ctaTarget, 'roleplay');
  assert.equal(replayHandoff.nextLabel, 'Finish today with');
  assert.equal(replayHandoff.payoffLine, 'Next: replay Job Interview to keep the career path warm.');
  assert.ok(replayHandoff.body.includes('finish 2/2 today'));

  const targetCompleteHandoff = createSavedRoleplayHandoff({
    dailyTarget: 1,
    isPathComplete: false,
    nextPracticeTitle: 'Meeting Practice',
    savedSessionCount: 1,
    xpReward: 32,
  });

  assert.equal(targetCompleteHandoff.ctaTarget, 'progress');
  assert.equal(targetCompleteHandoff.ctaLabel, 'Review Wins');
  assert.equal(targetCompleteHandoff.nextLabel, 'Bonus practice');
  assert.equal(targetCompleteHandoff.nextTitle, 'Meeting Practice');
  assert.equal(
    targetCompleteHandoff.payoffLine,
    'Next: review Wins, then Meeting Practice is ready as bonus practice.',
  );
  assert.ok(targetCompleteHandoff.body.includes("Today's target is complete"));
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
  assert.equal(initialQueue.title, '3 saved for later');
  assert.equal(initialQueue.progressLabel, '0/4 practiced');
  assert.deepEqual(
    initialQueue.items.map((item) => item.category),
    ['Meeting Clarity', 'Sales Calls', 'Small Talk'],
  );
  assert.ok(initialQueue.body.includes('active above'));

  const nextQueue = createProgressMistakeBankQueue(progressMock.mistakeBank, ['m-001']);
  assert.equal(nextQueue.title, '2 saved for later');
  assert.equal(nextQueue.progressLabel, '1/4 practiced');
  assert.deepEqual(
    nextQueue.items.map((item) => `${item.category}:${item.statusLabel}`),
    ['Sales Calls:Later', 'Small Talk:Later', 'Interview Structure:Done'],
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
  const practiceNow = new Date('2026-06-26T12:00:00.000Z');
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
  assert.equal(firstRunMission.restartCue, undefined);

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
    dailyMission: createDailyMission(progressMock.summary, [savedSession], 3, { now: practiceNow }),
    dailyTarget: 3,
    hasCompletedFoundation: true,
    localProgress: createLocalProgressStats(progressMock.summary, [savedSession], 3, { now: practiceNow }),
    sessions: [savedSession],
  });

  assert.equal(partialMission.title, "Finish today's mission");
  assert.equal(partialMission.meta, '2 left');
  assert.equal(partialMission.targetLabel, '1/3 saved');
  assert.equal(partialMission.progressPercent, 33);
  assert.ok(partialMission.body.includes('Finish 2 more'));

  const completeMission = createHomeDailyMissionCard({
    dailyMission: createDailyMission(progressMock.summary, [savedSession], 1, { now: practiceNow }),
    dailyTarget: 1,
    hasCompletedFoundation: true,
    localProgress: createLocalProgressStats(progressMock.summary, [savedSession], 1, { now: practiceNow }),
    sessions: [savedSession],
  });

  assert.equal(completeMission.title, "Today's mission complete");
  assert.equal(completeMission.meta, 'Done today');
  assert.equal(completeMission.targetLabel, '1/1 saved');
  assert.equal(completeMission.progressPercent, 100);

  const freshDayMission = createHomeDailyMissionCard({
    dailyMission: createDailyMission(progressMock.summary, [savedSession], 1, {
      now: new Date('2026-06-27T12:00:00.000Z'),
    }),
    dailyTarget: 1,
    hasCompletedFoundation: true,
    localProgress: createLocalProgressStats(progressMock.summary, [savedSession], 1, {
      now: new Date('2026-06-27T12:00:00.000Z'),
    }),
    sessions: [savedSession],
  });

  assert.equal(freshDayMission.title, "Start today's mission");
  assert.equal(freshDayMission.meta, 'Fresh start');
  assert.equal(freshDayMission.targetLabel, '0/1 saved');
  assert.ok(freshDayMission.body.includes('New day'));
  assert.deepEqual(freshDayMission.restartCue, {
    label: 'Fresh day',
    value: 'Earlier wins stay saved. Today starts at 0/1 saved.',
  });
});

test('creates a clear Home start payoff preview', async () => {
  const { createHomeStartPreview } = await import('../src/utils/homeStartPreview.ts');

  const foundationPreview = createHomeStartPreview({
    currentTitle: 'Clear sentence',
    dailyTarget: 2,
    firstWinTomorrowPreview: null,
    hasCompletedFoundation: false,
    hasResumeDraft: false,
    isMissionComplete: false,
    nextUnlockTitle: 'Job Interview',
    targetSessionsCompleted: 0,
  });

  assert.equal(foundationPreview.eyebrow, 'After lesson');
  assert.equal(foundationPreview.title, 'Job Interview unlocks');
  assert.deepEqual(foundationPreview.rows, [
    { label: 'Today', value: '1/2 after first save' },
    { label: 'Path', value: 'Job Interview unlocks' },
    { label: 'Reward', value: 'Starts your streak and opens Progress' },
  ]);

  const firstSavePreview = createHomeStartPreview({
    currentTitle: 'Job Interview',
    dailyTarget: 1,
    firstWinTomorrowPreview: null,
    hasCompletedFoundation: true,
    hasResumeDraft: false,
    isMissionComplete: false,
    nextUnlockTitle: 'Meeting Practice',
    targetSessionsCompleted: 0,
  });

  assert.equal(firstSavePreview.eyebrow, 'After save');
  assert.equal(firstSavePreview.title, 'Meeting Practice unlocks');
  assert.deepEqual(firstSavePreview.rows, [
    { label: 'Today', value: '1/1 today complete' },
    { label: 'Path', value: 'Meeting Practice unlocks' },
    { label: 'Reward', value: 'Starts your streak and opens Progress' },
  ]);

  const resumePreview = createHomeStartPreview({
    currentTitle: 'Resume Job Interview',
    dailyTarget: 3,
    firstWinTomorrowPreview: null,
    hasCompletedFoundation: true,
    hasResumeDraft: true,
    isMissionComplete: false,
    nextUnlockTitle: 'Meeting Practice',
    targetSessionsCompleted: 1,
  });

  assert.equal(resumePreview.eyebrow, 'After save');
  assert.equal(resumePreview.title, 'Meeting Practice unlocks');
  assert.deepEqual(resumePreview.rows, [
    { label: 'Today', value: '2/3 today after save' },
    { label: 'Path', value: 'Meeting Practice unlocks' },
    { label: 'Reward', value: '1 more later' },
  ]);

  const bonusPreview = createHomeStartPreview({
    currentTitle: 'Sales Call',
    dailyTarget: 1,
    firstWinTomorrowPreview: null,
    hasCompletedFoundation: true,
    hasResumeDraft: false,
    isMissionComplete: true,
    nextUnlockTitle: 'Workplace Small Talk',
    targetSessionsCompleted: 1,
  });

  assert.equal(bonusPreview.eyebrow, 'Bonus after this');
  assert.equal(bonusPreview.title, 'Workplace Small Talk stays ready');
  assert.deepEqual(bonusPreview.rows, [
    { label: 'Today', value: '1/1 complete' },
    { label: 'Path', value: 'Workplace Small Talk stays ready' },
    { label: 'Reward', value: 'Bonus XP only' },
  ]);

  const firstWinTomorrowPreview = createHomeStartPreview({
    currentTitle: 'Meeting Practice',
    dailyTarget: 3,
    firstWinTomorrowPreview: {
      body: 'If you stop here today, Start Meeting Practice tomorrow to keep the streak active and reuse today\'s correction in a fresh work rep.',
      eyebrow: 'Return tomorrow',
      title: 'Start Meeting Practice first',
    },
    hasCompletedFoundation: true,
    hasResumeDraft: false,
    isMissionComplete: false,
    nextUnlockTitle: 'Presentation Practice',
    targetSessionsCompleted: 1,
  });

  assert.equal(firstWinTomorrowPreview.eyebrow, 'Return tomorrow');
  assert.equal(firstWinTomorrowPreview.title, 'Start Meeting Practice first');
  assert.deepEqual(firstWinTomorrowPreview.rows, [
    { label: 'Today', value: '1/3 saved' },
    { label: 'Tomorrow', value: 'Start Meeting Practice first' },
    { label: 'Coach', value: 'Reuse today\'s correction' },
  ]);
});

test('creates a compact Home runway under the start card', async () => {
  const { createHomeRunway } = await import('../src/utils/homeRunway.ts');

  const firstRunRunway = createHomeRunway({
    missionCard: {
      meta: '5-minute sprint',
      progressLabel: 'Mission progress',
      progressPercent: 0,
      rewardLabel: '+60 XP',
      targetLabel: '0/1 saved',
    },
    nextUnlock: {
      state: 'locked',
      title: 'Job Interview',
    },
  });

  assert.equal(firstRunRunway.title, 'See the next payoff');
  assert.equal(firstRunRunway.badgeLabel, 'Today + next');
  assert.equal(firstRunRunway.cards[0].eyebrow, 'Today');
  assert.equal(firstRunRunway.cards[0].title, '0/1 saved');
  assert.equal(firstRunRunway.cards[0].body, '5-minute sprint, +60 XP');
  assert.equal(firstRunRunway.cards[0].progressPercent, 0);
  assert.equal(firstRunRunway.cards[1].eyebrow, 'Next unlock');
  assert.equal(firstRunRunway.cards[1].title, 'Job Interview');
  assert.ok(firstRunRunway.cards[1].body.includes('Save the current sprint'));

  const progressRunway = createHomeRunway({
    missionCard: {
      meta: '1 left',
      progressLabel: 'Mission progress',
      progressPercent: 50,
      rewardLabel: '+120 XP',
      targetLabel: '1/2 saved',
    },
    nextUnlock: {
      state: 'locked',
      title: 'Sales Call',
    },
  });

  assert.equal(progressRunway.cards[0].body, '1 left, +120 XP');
  assert.equal(progressRunway.cards[0].progressPercent, 50);
  assert.equal(progressRunway.cards[1].title, 'Sales Call');

  const replayRunway = createHomeRunway({
    missionCard: {
      meta: 'Done today',
      progressLabel: 'Mission complete',
      progressPercent: 100,
      rewardLabel: '+60 XP',
      targetLabel: '1/1 saved',
    },
    nextUnlock: {
      state: 'completed',
      title: 'Meeting Practice',
    },
  });

  assert.equal(replayRunway.title, 'Keep the streak warm');
  assert.equal(replayRunway.badgeLabel, 'Bonus loop');
  assert.equal(replayRunway.cards[0].eyebrow, 'Today done');
  assert.equal(replayRunway.cards[0].body, '+60 XP locked in.');
  assert.equal(replayRunway.cards[1].eyebrow, 'Replay next');
  assert.equal(replayRunway.cards[1].title, 'Meeting Practice');
  assert.ok(replayRunway.cards[1].body.includes('extra reps and XP'));
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
    hasStarterEditPlan: true,
    isExpanded: false,
    isAnswerPlanOpen: false,
    phraseLabel: '3 phrases',
    planLabel: '3-step plan',
    quickStartPhrase: 'I can give a short update on that.',
  });

  assert.equal(closedSupport.title, 'Writing support');
  assert.equal(closedSupport.summaryLabel, 'Starter edit plan + 3-step plan');
  assert.equal(closedSupport.quickStartLabel, 'Quick starter');
  assert.equal(closedSupport.quickStartText, 'I can give a short update on that.');
  assert.equal(closedSupport.toggleLabel, 'More');
  assert.equal(closedSupport.toggleAccessibilityLabel, 'Show writing support');
  assert.ok(closedSupport.helperText.includes('Lesson 1 steps again'));

  const openSupport = createWritingSupportState({
    hasStarterEditPlan: true,
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

  const noStarterSupport = createWritingSupportState({
    isExpanded: false,
    isAnswerPlanOpen: false,
    phraseLabel: '3 phrases',
    planLabel: '3-step plan',
  });

  assert.equal(noStarterSupport.summaryLabel, '3 phrases + 3-step plan');
  assert.equal(noStarterSupport.quickStartText, 'Start with your own strongest first sentence.');
});

test('creates a locked session history preview for first-time progress users', async () => {
  const { createProgressEmptyState } = await import('../src/utils/progressEmptyState.ts');
  const emptyState = createProgressEmptyState({
    foundationTitle: 'Learn one clear sentence',
    hasCompletedFoundation: false,
    nextRoleplayTitle: 'Quest 1: Job Interview',
  });

  assert.equal(emptyState.eyebrow, 'Locked until first save');
  assert.equal(emptyState.progressLabel, '0/1 saved');
  assert.equal(emptyState.title, 'Session history starts after one save');
  assert.ok(emptyState.body.includes('feedback summary'));
  assert.equal(emptyState.unlockLabel, 'First unlock: history, XP and daily target progress');
  assert.equal(emptyState.action.target, 'foundation');
  assert.equal(emptyState.action.title, 'Learn one clear sentence');
  assert.equal(emptyState.action.ctaLabel, 'Continue today');
  assert.ok(emptyState.action.body.includes('shortest route'));
});

test('points the locked progress state to the first roleplay after foundation is done', async () => {
  const { createProgressEmptyState } = await import('../src/utils/progressEmptyState.ts');
  const emptyState = createProgressEmptyState({
    foundationTitle: 'Learn one clear sentence',
    hasCompletedFoundation: true,
    nextRoleplayTitle: 'Quest 1: Job Interview',
  });

  assert.equal(emptyState.action.target, 'roleplay');
  assert.equal(emptyState.action.title, 'Quest 1: Job Interview');
  assert.equal(emptyState.action.ctaLabel, 'Continue today');
  assert.ok(emptyState.action.body.includes('first guided save'));
});

test('keeps deeper progress insights locked until three saved sessions', async () => {
  const {
    createProgressMomentumUnlock,
    DETAILED_PROGRESS_UNLOCK_TARGET,
  } = await import('../src/utils/progressMomentumUnlock.ts');

  assert.equal(DETAILED_PROGRESS_UNLOCK_TARGET, 3);
  assert.equal(createProgressMomentumUnlock(0), null);
  assert.equal(createProgressMomentumUnlock(3), null);

  const firstSaveUnlock = createProgressMomentumUnlock(1);
  assert.equal(firstSaveUnlock.eyebrow, 'Unlock next');
  assert.equal(firstSaveUnlock.progressLabel, '1/3 saved');
  assert.equal(firstSaveUnlock.progressPercent, 33);
  assert.equal(firstSaveUnlock.title, '2 more saves unlock deeper wins');
  assert.ok(firstSaveUnlock.body.includes('one clear next step'));
  assert.deepEqual(firstSaveUnlock.items, [
    'Earlier saved coaching targets',
    'Skill trend and weekly rhythm',
    'Full correction queue',
  ]);

  const secondSaveUnlock = createProgressMomentumUnlock(2);
  assert.equal(secondSaveUnlock.progressLabel, '2/3 saved');
  assert.equal(secondSaveUnlock.progressPercent, 67);
  assert.equal(secondSaveUnlock.title, 'One more save unlocks deeper wins');
  assert.ok(secondSaveUnlock.body.includes('already live below'));
  assert.deepEqual(secondSaveUnlock.items, [
    'Skill trend and weekly rhythm',
    'Full correction queue',
  ]);
});

test('creates a compact earlier-save history for returning progress users', async () => {
  const { createProgressRecentSessions } = await import('../src/utils/progressRecentSessions.ts');

  assert.equal(createProgressRecentSessions([]), null);
  assert.equal(
    createProgressRecentSessions([
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
    ]),
    null,
  );

  const firstEarlierSave = createProgressRecentSessions([
    {
      id: 'meeting-practice-2',
      roleplayId: 'meeting-practice',
      roleplayTitle: 'Meeting Practice',
      completedAt: '2026-06-27T09:00:00.000Z',
      answerPreview: 'I shared the blocker and the next owner.',
      wordCount: 31,
      readinessLabel: 'Ready for feedback',
      feedbackSummary: 'Clear update with a useful next step.',
      nextFocusLabel: 'Structure 68',
      nextFocusText: 'Name the owner earlier so the update sounds more direct.',
      includedFollowUp: false,
      xpReward: 44,
    },
    {
      id: 'job-interview-1',
      roleplayId: 'job-interview',
      roleplayTitle: 'Job Interview',
      completedAt: '2026-06-26T10:00:00.000Z',
      answerPreview: 'I improved onboarding handoffs.',
      wordCount: 36,
      readinessLabel: 'Ready for feedback',
      feedbackSummary: 'Clear answer with useful detail.',
      nextFocusLabel: 'Vocabulary 62',
      nextFocusText: 'Add one stronger action verb and one business result.',
      includedFollowUp: true,
      xpReward: 50,
    },
  ]);

  assert.equal(firstEarlierSave.title, 'Keep your first win in play');
  assert.equal(firstEarlierSave.countLabel, '1 earlier save');
  assert.ok(firstEarlierSave.body.includes('second save'));
  assert.equal(firstEarlierSave.items.length, 1);
  assert.equal(firstEarlierSave.items[0].roleplayId, 'job-interview');
  assert.equal(firstEarlierSave.items[0].roleplayTitle, 'Job Interview');
  assert.equal(firstEarlierSave.items[0].replayLabel, 'Replay now');
  assert.equal(firstEarlierSave.footerLabel, null);

  const history = createProgressRecentSessions([
    {
      id: 'presentation-practice-3',
      roleplayId: 'presentation-practice',
      roleplayTitle: 'Presentation Practice',
      completedAt: '2026-06-28T12:00:00.000Z',
      answerPreview: 'I would connect the risk to the decision we need today.',
      wordCount: 42,
      readinessLabel: 'Ready for feedback',
      feedbackSummary: 'Strong business framing.',
      nextFocusLabel: 'Coach target',
      nextFocusText: 'Add one measurable outcome in the close.',
      includedFollowUp: true,
      xpReward: 58,
    },
    {
      id: 'meeting-practice-2',
      roleplayId: 'meeting-practice',
      roleplayTitle: 'Meeting Practice',
      completedAt: '2026-06-27T09:00:00.000Z',
      answerPreview: 'I shared the blocker and the next owner.',
      wordCount: 31,
      readinessLabel: 'Ready for feedback',
      feedbackSummary: 'Clear update with a useful next step.',
      nextFocusLabel: 'Structure 68',
      nextFocusText: 'Name the owner earlier so the update sounds more direct.',
      includedFollowUp: false,
      xpReward: 44,
    },
    {
      id: 'job-interview-1',
      roleplayId: 'job-interview',
      roleplayTitle: 'Job Interview',
      completedAt: '2026-06-26T10:00:00.000Z',
      answerPreview: 'I improved onboarding handoffs.',
      wordCount: 36,
      readinessLabel: 'Ready for feedback',
      feedbackSummary: 'Clear answer with useful detail.',
      nextFocusLabel: 'Vocabulary 62',
      nextFocusText: 'Add one stronger action verb and one business result.',
      includedFollowUp: true,
      xpReward: 50,
    },
    {
      id: 'sales-call-1',
      roleplayId: 'sales-call',
      roleplayTitle: 'Sales Call',
      completedAt: '2026-06-25T08:00:00.000Z',
      answerPreview: 'I would clarify the current cost of the problem.',
      wordCount: 28,
      readinessLabel: 'Ready for feedback',
      feedbackSummary: 'Calm objection handling.',
      xpReward: 40,
    },
    {
      id: 'workplace-small-talk-1',
      roleplayId: 'workplace-small-talk',
      roleplayTitle: 'Workplace Small Talk',
      completedAt: '2026-06-24T08:00:00.000Z',
      answerPreview: 'Nice to meet you, I work with the customer team.',
      wordCount: 24,
      readinessLabel: 'Ready for feedback',
      feedbackSummary: 'Friendly opening.',
      xpReward: 36,
    },
  ]);

  assert.equal(history.eyebrow, 'Recent saves');
  assert.equal(history.title, 'Earlier wins still count');
  assert.equal(history.countLabel, '3 earlier saves');
  assert.ok(history.body.includes('coaching target'));
  assert.equal(history.items.length, 3);
  assert.equal(history.items[0].roleplayTitle, 'Meeting Practice');
  assert.equal(history.items[0].roleplayId, 'meeting-practice');
  assert.ok(history.items[0].metaLabel.includes('31 words'));
  assert.equal(history.items[0].nextFocusLabel, 'Structure 68');
  assert.equal(history.items[0].xpLabel, '+44 XP');
  assert.ok(history.items[1].metaLabel.includes('36 words | Follow-up'));
  assert.equal(history.items[2].nextFocusLabel, 'Coach target');
  assert.equal(history.items[2].nextFocusText, 'Calm objection handling.');
  assert.equal(history.footerLabel, '1 older save still stored locally');
});

test('creates a guided next step for progress states', async () => {
  const { createProgressNextStepGuide } = await import('../src/utils/progressNextStep.ts');
  const practiceNow = new Date('2026-06-26T12:00:00.000Z');
  const firstTimeGuide = createProgressNextStepGuide({
    dailyTarget: 2,
    now: practiceNow,
    roleplays: practiceContent.roleplays,
    sessions: [],
  });

  assert.equal(firstTimeGuide.roleplayId, 'job-interview');
  assert.equal(firstTimeGuide.ctaLabel, 'Start Job Interview');
  assert.equal(firstTimeGuide.title, 'Save your first answer');
  assert.equal(firstTimeGuide.statusLabel, 'First save');
  assert.equal(firstTimeGuide.statusTone, 'info');
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
    now: practiceNow,
    roleplays: practiceContent.roleplays,
    sessions: oneSavedSession,
  });

  assert.equal(returningGuide.roleplayId, 'meeting-practice');
  assert.equal(returningGuide.title, '2 sprints left today');
  assert.equal(returningGuide.statusLabel, 'Guided path');
  assert.equal(returningGuide.statusTone, 'secondary');
  assert.ok(returningGuide.body.includes('Job Interview'));
  assert.ok(returningGuide.steps.some((step) => step.includes('Meeting Practice')));
  assert.equal(returningGuide.ctaLabel, 'Start Meeting Practice');

  const offPathGuide = createProgressNextStepGuide({
    dailyTarget: 3,
    now: practiceNow,
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
  assert.equal(offPathGuide.statusLabel, 'Back on path');
  assert.equal(offPathGuide.statusTone, 'accent');
  assert.ok(offPathGuide.body.includes('Return to Job Interview'));
  assert.ok(offPathGuide.steps.some((step) => step.includes('Return to Job Interview')));

  const completeGuide = createProgressNextStepGuide({
    dailyTarget: 1,
    now: practiceNow,
    roleplays: practiceContent.roleplays,
    sessions: oneSavedSession,
  });

  assert.equal(completeGuide.title, 'Daily target complete');
  assert.equal(completeGuide.ctaLabel, 'Start Meeting Practice');
  assert.equal(completeGuide.statusLabel, 'Target done');
  assert.equal(completeGuide.statusTone, 'success');
  assert.ok(completeGuide.body.includes('1/1 target'));
  assert.ok(completeGuide.steps.some((step) => step.includes('Meeting Practice')));

  const freshDayGuide = createProgressNextStepGuide({
    dailyTarget: 3,
    now: new Date('2026-06-27T12:00:00.000Z'),
    roleplays: practiceContent.roleplays,
    sessions: oneSavedSession,
  });

  assert.equal(freshDayGuide.title, 'Save 3 sprints today');
  assert.equal(freshDayGuide.statusLabel, 'Fresh day');
  assert.ok(freshDayGuide.body.includes('Start Meeting Practice today'));
});

test('creates an actionable mistake practice drill', async () => {
  const { createMistakePracticeDrill, createMistakePracticeStatus } = await import('../src/utils/mistakePracticeDrill.ts');
  const { createRoleplayWarmupCue } = await import('../src/utils/roleplayWarmupCue.ts');
  const interviewDrill = createMistakePracticeDrill(progressMock.mistakeBank);

  assert.equal(interviewDrill.roleplayId, 'job-interview');
  assert.equal(interviewDrill.ctaLabel, 'Practice Job Interview');
  assert.equal(interviewDrill.correctionLabel, 'Better English');
  assert.equal(interviewDrill.eyebrow, 'One correction drill');
  assert.equal(interviewDrill.repeatBadgeLabel, '1 quick repeat');
  assert.ok(interviewDrill.repeatInstruction.includes('same pattern'));
  assert.ok(interviewDrill.title.includes('Interview Structure'));
  assert.ok(interviewDrill.body.includes('Job Interview sprint'));
  assert.ok(interviewDrill.mistake.correction.includes('customer feedback analysis'));

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
  assert.ok(nextDrill.body.includes('Meeting Practice sprint'));

  const warmupCue = createRoleplayWarmupCue(interviewDrill.mistake);
  assert.equal(warmupCue.cueId, interviewDrill.mistake.id);
  assert.equal(warmupCue.eyebrow, 'Warm-up cue');
  assert.equal(warmupCue.badgeLabel, 'From Progress');
  assert.equal(warmupCue.correction, interviewDrill.mistake.correction);
  assert.equal(warmupCue.note, interviewDrill.mistake.note);

  const readyStatus = createMistakePracticeStatus(false);
  assert.equal(readyStatus.label, 'Ready to repeat');
  assert.equal(readyStatus.ctaLabel, 'Mark practiced');
  assert.ok(readyStatus.body.includes('clean repeat'));

  const practicedStatus = createMistakePracticeStatus(true);
  assert.equal(practicedStatus.label, 'Practice win');
  assert.equal(practicedStatus.ctaLabel, 'Practiced once');
  assert.ok(practicedStatus.body.includes('roleplay'));
});

test('adds saved sessions to local progress and daily mission', async () => {
  const { createDailyMission } = await import('../src/utils/gamification.ts');
  const { createLocalProgressStats } = await import('../src/utils/localProgress.ts');
  const practiceNow = new Date('2026-06-26T12:00:00.000Z');
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
  const localProgress = createLocalProgressStats(progressMock.summary, sessions, 1, { now: practiceNow });
  const mission = createDailyMission(progressMock.summary, sessions, 1, { now: practiceNow });

  assert.equal(localProgress.sessionsCompleted, progressMock.summary.sessionsCompleted + 1);
  assert.equal(localProgress.minutesPracticed, progressMock.summary.minutesPracticed + 5);
  assert.equal(localProgress.totalLocalXp, 55);
  assert.equal(mission.rewardLabel, '+55 XP');
  assert.equal(mission.xpToday, mission.xpGoal);

  const twoRoleplayMission = createDailyMission(progressMock.summary, sessions, 2, { now: practiceNow });
  const twoRoleplayProgress = createLocalProgressStats(progressMock.summary, sessions, 2, { now: practiceNow });

  assert.equal(twoRoleplayMission.title, 'Complete 2 career roleplays');
  assert.equal(twoRoleplayMission.xpGoal, 120);
  assert.equal(twoRoleplayProgress.xpGoal, 120);
  assert.equal(twoRoleplayProgress.targetSessionsCompleted, 1);
  assert.equal(twoRoleplayProgress.targetSessionsRemaining, 1);
  assert.equal(twoRoleplayProgress.targetCompletionPercent, 50);
  assert.ok(twoRoleplayMission.progressPercent < 100);

  const nextDayProgress = createLocalProgressStats(progressMock.summary, sessions, 2, {
    now: new Date('2026-06-27T12:00:00.000Z'),
  });

  assert.equal(nextDayProgress.targetSessionsCompleted, 0);
  assert.equal(nextDayProgress.targetSessionsRemaining, 2);
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

test('explains when the bonus follow-up turn is worth doing', async () => {
  const { createFollowUpReadinessCue } = await import('../src/utils/followUpReadinessCue.ts');

  const saveFirstCue = createFollowUpReadinessCue({
    focus: 'result',
    progressTitle: 'One more sprint after this',
    review: { wordCount: 24 },
  });

  assert.equal(saveFirstCue.tone, 'info');
  assert.equal(saveFirstCue.badgeLabel, 'Save first');
  assert.equal(saveFirstCue.title, 'Save stays the main win');
  assert.ok(saveFirstCue.body.includes('30 more seconds'));

  const deeperRepCue = createFollowUpReadinessCue({
    focus: 'next-step',
    progressTitle: 'One more sprint after this',
    review: { wordCount: 41 },
  });

  assert.equal(deeperRepCue.tone, 'success');
  assert.equal(deeperRepCue.badgeLabel, 'Worth doing');
  assert.equal(deeperRepCue.title, 'This adds a real follow-up rep');
  assert.ok(deeperRepCue.chipLine.includes('realistic second turn'));

  const bonusDayCue = createFollowUpReadinessCue({
    focus: 'confidence',
    progressTitle: 'Daily target already complete',
    review: { wordCount: 29 },
  });

  assert.equal(bonusDayCue.tone, 'success');
  assert.equal(bonusDayCue.badgeLabel, 'Worth doing');
  assert.equal(bonusDayCue.title, 'Good time for a deeper rep');
  assert.ok(bonusDayCue.body.includes("target is already done"));
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

test('creates a concrete Practice level payoff before save', async () => {
  const { createPracticeLevelPayoff } = await import('../src/utils/practiceLevelPayoff.ts');

  const closerPreview = createPracticeLevelPayoff({
    currentTotalXp: 218,
    xpReward: 48,
  });

  assert.deepEqual(closerPreview, {
    afterSaveLevelLabel: 'Level 2',
    afterSaveProgressLabel: '86/180 XP',
    afterSaveTotalXpLabel: '266 total XP',
    badgeLabel: '+48 XP',
    body: 'Save this sprint to move from 38/180 XP to 86/180 XP toward Level 3.',
    currentLevelLabel: 'Level 2',
    currentProgressLabel: '38/180 XP',
    currentTotalXpLabel: '218 total XP',
    progressLabel: '86/180 XP after save',
    progressPercent: 48,
    title: 'Move closer to Level 3',
  });

  const levelUpPreview = createPracticeLevelPayoff({
    currentTotalXp: 350,
    xpReward: 48,
  });

  assert.deepEqual(levelUpPreview, {
    afterSaveLevelLabel: 'Level 3',
    afterSaveProgressLabel: '38/180 XP',
    afterSaveTotalXpLabel: '398 total XP',
    badgeLabel: '+48 XP',
    body: 'Save this sprint to move from Level 2 at 170/180 XP to Level 3 at 38/180 XP.',
    currentLevelLabel: 'Level 2',
    currentProgressLabel: '170/180 XP',
    currentTotalXpLabel: '350 total XP',
    progressLabel: 'Level 3 unlocked',
    progressPercent: 100,
    title: 'Reach Level 3 with this save',
  });
});

test('creates one compact Practice after-save preview', async () => {
  const { createPracticeAfterSavePreview } = await import(
    '../src/utils/practiceAfterSavePreview.ts'
  );

  const firstUnlockPreview = createPracticeAfterSavePreview({
    isResumeMode: false,
    levelPayoff: {
      afterSaveLevelLabel: 'Level 2',
      afterSaveProgressLabel: '86/180 XP',
      afterSaveTotalXpLabel: '266 total XP',
      badgeLabel: '+48 XP',
      body: 'Save this sprint to move from 38/180 XP to 86/180 XP toward Level 3.',
      currentLevelLabel: 'Level 2',
      currentProgressLabel: '38/180 XP',
      currentTotalXpLabel: '218 total XP',
      progressLabel: '86/180 XP after save',
      progressPercent: 48,
      title: 'Move closer to Level 3',
    },
    recommendedPayoff: {
      badgeLabel: 'After save',
      body: 'Save Job Interview, then Meeting Practice becomes the next guided sprint.',
      eyebrow: 'Next unlock',
      iconLabel: '02',
      progressLabel: '0 of 5 complete',
      title: 'Meeting Practice unlocks',
    },
    targetPreview: {
      badgeLabel: 'After save 1/2',
      progressLabel: 'After save: 1/2 roleplays today',
      progressPercent: 50,
      title: 'One more sprint after this',
      tone: 'info',
    },
  });

  assert.deepEqual(firstUnlockPreview, {
    badgeLabel: '+48 XP',
    eyebrow: 'After this save',
    rows: [
      { label: 'Today', value: '1/2 roleplays today' },
      { label: 'Path', value: 'Meeting Practice unlocks' },
      { label: 'Level', value: '86/180 XP on Level 2' },
    ],
    title: 'Meeting Practice unlocks',
  });

  const resumeLevelUpPreview = createPracticeAfterSavePreview({
    isResumeMode: true,
    levelPayoff: {
      afterSaveLevelLabel: 'Level 3',
      afterSaveProgressLabel: '38/180 XP',
      afterSaveTotalXpLabel: '398 total XP',
      badgeLabel: '+48 XP',
      body: 'Save this sprint to move from Level 2 at 170/180 XP to Level 3 at 38/180 XP.',
      currentLevelLabel: 'Level 2',
      currentProgressLabel: '170/180 XP',
      currentTotalXpLabel: '350 total XP',
      progressLabel: 'Level 3 unlocked',
      progressPercent: 100,
      title: 'Reach Level 3 with this save',
    },
    recommendedPayoff: {
      badgeLabel: 'Draft first',
      body: 'Check the saved answer, save XP, then return to the guided path.',
      eyebrow: 'Stay focused',
      iconLabel: 'GO',
      progressLabel: 'Draft waiting',
      title: 'Finish this answer first',
    },
    targetPreview: {
      badgeLabel: 'After save 2/3',
      progressLabel: 'After save: 2/3 roleplays today',
      progressPercent: 67,
      title: 'One more sprint after this',
      tone: 'info',
    },
  });

  assert.deepEqual(resumeLevelUpPreview, {
    badgeLabel: '+48 XP',
    eyebrow: 'After this save',
    rows: [
      { label: 'Today', value: '2/3 roleplays today' },
      { label: 'Path', value: 'Guided path active again' },
      { label: 'Level', value: 'Level 3 unlocked' },
    ],
    title: 'Reach Level 3 with this save',
  });
});

test('creates a compact Home level rail state', async () => {
  const { createHomeLevelRail } = await import('../src/utils/homeLevelRail.ts');
  const { createLevelProgress } = await import('../src/utils/levelProgress.ts');

  assert.deepEqual(createHomeLevelRail(createLevelProgress(0)), {
    badgeLabel: 'Level 1',
    progressLabel: '0/180 XP',
    progressPercent: 0,
    remainingLabel: '180 XP left',
  });

  assert.deepEqual(createHomeLevelRail(createLevelProgress(218)), {
    badgeLabel: 'Level 2',
    progressLabel: '38/180 XP',
    progressPercent: 21,
    remainingLabel: '142 XP left',
  });
});

test('creates a level runway for the Progress screen', async () => {
  const { createLevelProgress } = await import('../src/utils/levelProgress.ts');
  const { createProgressLevelRunway } = await import('../src/utils/progressLevelRunway.ts');

  const firstSprintRunway = createProgressLevelRunway({
    dailyTarget: 2,
    levelProgress: createLevelProgress(218),
    targetSessionsCompleted: 0,
    targetSessionsRemaining: 2,
  });

  assert.equal(firstSprintRunway.badgeLabel, 'Level 2');
  assert.equal(firstSprintRunway.title, '142 XP to Level 3');
  assert.equal(firstSprintRunway.progressLabel, '38/180 XP');
  assert.equal(firstSprintRunway.progressPercent, 21);
  assert.equal(firstSprintRunway.targetLabel, '0/2 today');
  assert.equal(firstSprintRunway.totalXpLabel, '218 total XP');
  assert.ok(firstSprintRunway.body.includes('keep the streak active'));

  const finishingRunway = createProgressLevelRunway({
    dailyTarget: 3,
    levelProgress: createLevelProgress(275),
    targetSessionsCompleted: 2,
    targetSessionsRemaining: 1,
  });

  assert.equal(finishingRunway.badgeLabel, 'Level 2');
  assert.equal(finishingRunway.targetLabel, '2/3 today');
  assert.ok(finishingRunway.body.includes('completes the target'));

  const bonusRunway = createProgressLevelRunway({
    dailyTarget: 1,
    levelProgress: createLevelProgress(365),
    targetSessionsCompleted: 1,
    targetSessionsRemaining: 0,
  });

  assert.equal(bonusRunway.badgeLabel, 'Level 3');
  assert.equal(bonusRunway.targetLabel, '1/1 today');
  assert.ok(bonusRunway.body.includes('extra saved answer'));
});

test('creates a more motivational latest-win recap for Progress', async () => {
  const {
    createProgressLatestWinState,
    createProgressSpeakingFocusCue,
  } = await import('../src/utils/progressLatestWin.ts');

  const completedTargetWin = createProgressLatestWinState({
    isDailyTargetComplete: true,
    session: {
      feedbackSummary: 'Good structure. Add one stronger outcome line next time.',
      includedFollowUp: true,
      nextFocusLabel: 'Vocabulary 62',
      nextFocusText: 'Add one stronger result phrase before the follow-up.',
      readinessLabel: 'Ready for feedback',
      roleplayTitle: 'Meeting Practice',
      wordCount: 44,
      xpReward: 60,
    },
  });

  assert.equal(completedTargetWin.eyebrow, 'Review this win first');
  assert.equal(completedTargetWin.badgeLabel, 'Follow-up saved');
  assert.ok(completedTargetWin.body.includes("finished today's target"));
  assert.equal(completedTargetWin.coachLabel, 'Keep this correction');
  assert.equal(completedTargetWin.coachBadgeLabel, 'Vocabulary 62');
  assert.equal(
    completedTargetWin.coachText,
    'Add one stronger result phrase before the follow-up.',
  );
  assert.equal(completedTargetWin.recapLabel, 'Why it counts');
  assert.ok(completedTargetWin.recapText.includes('real workplace conversation'));
  assert.deepEqual(completedTargetWin.rewardRows, [
    { label: 'Today', value: 'Target complete, +60 XP' },
    { label: 'Practice', value: 'Two-turn workplace rep' },
    { label: 'Coach', value: 'Correction ready' },
  ]);

  const coreWin = createProgressLatestWinState({
    isDailyTargetComplete: false,
    session: {
      feedbackSummary: 'Good start. Add one result or next step to make it stronger.',
      includedFollowUp: false,
      nextFocusLabel: '',
      nextFocusText: '   ',
      readinessLabel: 'Good start',
      roleplayTitle: 'Job Interview',
      wordCount: 18,
      xpReward: 30,
    },
  });

  assert.equal(coreWin.eyebrow, 'Saved today');
  assert.equal(coreWin.badgeLabel, 'Core answer saved');
  assert.ok(coreWin.body.includes('next sprint'));
  assert.equal(coreWin.coachLabel, 'Coach recap');
  assert.equal(coreWin.coachBadgeLabel, 'Good start');
  assert.equal(
    coreWin.coachText,
    'Good start. Add one result or next step to make it stronger.',
  );
  assert.ok(coreWin.recapText.includes('streak, XP and coach history'));
  assert.deepEqual(coreWin.rewardRows, [
    { label: 'Today', value: '+30 XP banked' },
    { label: 'Practice', value: '18 words practiced' },
    { label: 'Coach', value: 'Recap saved' },
  ]);

  const activeFocusCue = createProgressSpeakingFocusCue({
    isDailyTargetComplete: false,
    session: {
      feedbackSummary: 'Good start. Add one measurable result before the final sentence.',
      nextFocusLabel: 'Structure 68',
      nextFocusText: 'Add one measurable result before the final sentence.',
      roleplayTitle: 'Job Interview',
    },
  });

  assert.equal(activeFocusCue?.eyebrow, "Today's speaking focus");
  assert.equal(activeFocusCue?.badgeLabel, 'Structure 68');
  assert.equal(
    activeFocusCue?.text,
    'Next: add one measurable result before the final sentence.',
  );
  assert.equal(activeFocusCue?.metaText, 'Use it in Job Interview.');

  const reviewFocusCue = createProgressSpeakingFocusCue({
    isDailyTargetComplete: true,
    session: {
      feedbackSummary: 'Clear structure. Next: use First, then explain the result.',
      nextFocusLabel: '   ',
      nextFocusText: '   ',
      roleplayTitle: 'Meeting Practice',
    },
  });

  assert.equal(reviewFocusCue?.eyebrow, 'Review before bonus');
  assert.equal(reviewFocusCue?.badgeLabel, 'Coach cue');
  assert.equal(reviewFocusCue?.text, 'Next: use First, then explain the result.');
  assert.equal(reviewFocusCue?.metaText, 'Repeat once, then stop or continue.');
});

test('creates a first-win return cue for the next day', async () => {
  const { createFirstWinReturnCue } = await import('../src/utils/firstWinReturnCue.ts');

  const completedTargetCue = createFirstWinReturnCue({
    ctaLabel: 'Start Meeting Practice',
    isDailyTargetComplete: true,
    streakDays: 5,
  });

  assert.equal(completedTargetCue.label, 'Return tomorrow');
  assert.equal(completedTargetCue.badgeLabel, '5 day streak');
  assert.equal(completedTargetCue.title, 'Start Meeting Practice first');
  assert.ok(completedTargetCue.body.includes("Today's target is complete."));
  assert.ok(completedTargetCue.body.includes('reuse today\'s correction'));

  const unfinishedTargetCue = createFirstWinReturnCue({
    ctaLabel: 'Replay Job Interview',
    isDailyTargetComplete: false,
    streakDays: 1,
  });

  assert.equal(unfinishedTargetCue.badgeLabel, '1 day streak');
  assert.equal(unfinishedTargetCue.title, 'Replay Job Interview first');
  assert.ok(unfinishedTargetCue.body.includes('If you stop here today'));
  assert.ok(unfinishedTargetCue.body.includes('Replay Job Interview tomorrow'));
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
  const meetingRoleplay = practiceContent.roleplays.find((roleplay) => roleplay.id === 'meeting-practice');
  assert.ok(meetingRoleplay);

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
  assert.equal(
    firstRunState.recommendedCard.focus,
    'Next sprint: save one answer to unlock Meeting Practice.',
  );
  assert.equal(
    firstRunState.recommendedCard.description,
    'Check it, earn XP, then open the next career step.',
  );
  assert.deepEqual(firstRunState.recommendedPayoff, {
    badgeLabel: 'After save',
    body: 'Save Job Interview, then Meeting Practice becomes the next guided sprint.',
    eyebrow: 'Next unlock',
    iconLabel: '02',
    progressLabel: '0 of 5 complete',
    title: 'Meeting Practice unlocks',
  });
  assert.equal(firstRunState.browseCards.length, 4);
  assert.equal(firstRunState.browseCards[0].categoryLabel, 'Later');
  assert.equal(firstRunState.browseLabel, '4 more roleplays');
  assert.equal(firstRunState.closedPreview.eyebrow, 'Optional later');
  assert.equal(firstRunState.closedPreview.title, '4 other roleplays stay hidden');
  assert.deepEqual(firstRunState.closedPreview.previewTitles, [
    'Meeting Practice',
    'Presentation Practice',
    'Sales Call',
  ]);
  assert.ok(firstRunState.closedPreview.body.includes('recommended sprint first'));
  assert.equal(firstRunState.runway?.title, 'After Job Interview');
  assert.equal(firstRunState.runway?.items.length, 3);
  assert.deepEqual(
    firstRunState.runway?.items.map((item) => item.statusLabel),
    ['Do now', 'Unlock next', 'Later'],
  );
  assert.ok(firstRunState.runway?.body.includes('unlock Meeting Practice'));

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
  assert.equal(
    activeState.recommendedCard.focus,
    'Next sprint: save one answer to unlock Sales Call.',
  );
  assert.equal(activeState.recommendedPayoff.title, 'Sales Call unlocks');
  assert.equal(activeState.recommendedPayoff.iconLabel, '04');
  assert.ok(activeState.recommendedPayoff.body.includes('Presentation Practice'));
  assert.equal(activeState.browseCards.find((card) => card.roleplayId === 'job-interview').categoryLabel, 'Completed');
  assert.equal(activeState.browseCards.find((card) => card.roleplayId === 'job-interview').ctaLabel, 'Practice again');
  assert.equal(activeState.browseCards.find((card) => card.roleplayId === 'sales-call').categoryLabel, 'Later');
  assert.deepEqual(
    activeState.runway?.items.map((item) => `${item.sequenceLabel}:${item.title}:${item.statusLabel}`),
    [
      '02:Meeting Practice:Done',
      '03:Presentation Practice:Do now',
      '04:Sales Call:Unlock next',
    ],
  );

  const resumeState = createPracticeLibraryState({
    draft: {
      draftAnswer: 'I led the handoff, aligned the blocker, and shared the next step with the team by Friday.',
      roleplayId: 'meeting-practice',
      updatedAt: '2026-06-29T08:00:00.000Z',
    },
    roleplays: practiceContent.roleplays,
    sessions: [],
  });

  assert.equal(resumeState.isResumeMode, true);
  assert.equal(resumeState.meta, 'Saved draft');
  assert.equal(resumeState.title, `Resume ${meetingRoleplay.title}`);
  assert.equal(resumeState.subtitle, `Saved 17 words for ${meetingRoleplay.title}. Finish it first.`);
  assert.equal(resumeState.recommendedCard.roleplayId, 'meeting-practice');
  assert.equal(resumeState.recommendedCard.categoryLabel, 'Resume');
  assert.equal(resumeState.recommendedCard.ctaLabel, 'Finish now');
  assert.equal(resumeState.recommendedCard.focus, 'Resume sprint: add one result or next step.');
  assert.ok(resumeState.recommendedCard.description.includes('Check it, save XP'));
  assert.deepEqual(resumeState.recommendedPayoff, {
    badgeLabel: 'Draft first',
    body: 'Check the saved answer, save XP, then return to the guided path.',
    eyebrow: 'Stay focused',
    iconLabel: 'GO',
    progressLabel: 'Draft waiting',
    title: 'Finish this answer first',
  });
  assert.equal(resumeState.browseCards.some((card) => card.roleplayId === 'meeting-practice'), false);
  assert.equal(resumeState.closedPreview.title, '4 other roleplays stay hidden');
  assert.deepEqual(resumeState.closedPreview.previewTitles, [
    'Job Interview',
    'Presentation Practice',
    'Sales Call',
  ]);
  assert.ok(resumeState.closedPreview.body.includes('saved draft first'));
  assert.equal(resumeState.runway, null);
});

test('creates a focused daily sprint cue for the Practice screen', async () => {
  const { createPracticeDailySprint } = await import('../src/utils/practiceDailySprint.ts');
  const practiceNow = new Date('2026-06-26T12:00:00.000Z');

  const firstSprint = createPracticeDailySprint({
    dailyTarget: 1,
    isResumeMode: false,
    nextUnlockTitle: 'Meeting Practice',
    now: practiceNow,
    recommendedRoleplayTitle: 'Job Interview',
    recommendedXpLabel: '+48 XP',
    sessions: [],
  });

  assert.equal(firstSprint.eyebrow, "Today's sprint");
  assert.equal(firstSprint.title, "Start today's practice");
  assert.equal(firstSprint.progressLabel, '0/1 saved today');
  assert.equal(firstSprint.statusLabel, 'Then Meeting Practice');
  assert.equal(firstSprint.statusTone, 'accent');
  assert.equal(firstSprint.afterSavePayoff, 'Target complete, Meeting Practice unlocks');
  assert.ok(firstSprint.body.includes('start your streak'));

  const almostDoneSprint = createPracticeDailySprint({
    dailyTarget: 2,
    isResumeMode: false,
    nextUnlockTitle: 'Sales Call',
    now: practiceNow,
    recommendedRoleplayTitle: 'Presentation Practice',
    recommendedXpLabel: '+32 XP',
    sessions: [{ completedAt: '2026-06-26T09:00:00.000Z' }],
  });

  assert.equal(almostDoneSprint.title, 'One more save finishes today');
  assert.equal(almostDoneSprint.progressLabel, '1/2 saved today');
  assert.equal(almostDoneSprint.statusLabel, 'Finish target');
  assert.equal(almostDoneSprint.statusTone, 'success');
  assert.equal(almostDoneSprint.afterSavePayoff, 'Target complete, Sales Call unlocks');
  assert.ok(almostDoneSprint.body.includes('2/2 today'));
  assert.ok(almostDoneSprint.body.includes('Sales Call'));

  const resumeSprint = createPracticeDailySprint({
    dailyTarget: 3,
    isResumeMode: true,
    nextUnlockTitle: null,
    now: practiceNow,
    recommendedRoleplayTitle: 'Meeting Practice',
    recommendedXpLabel: '+28 XP',
    sessions: [{ completedAt: '2026-06-26T09:00:00.000Z' }],
  });

  assert.equal(resumeSprint.eyebrow, 'Finish today');
  assert.equal(resumeSprint.title, 'Save Meeting Practice');
  assert.equal(resumeSprint.statusLabel, '2/3 after save');
  assert.equal(resumeSprint.statusTone, 'accent');
  assert.equal(resumeSprint.afterSavePayoff, '2/3 saved today');
  assert.ok(resumeSprint.body.includes('keep your streak alive'));

  const bonusSprint = createPracticeDailySprint({
    dailyTarget: 1,
    isResumeMode: false,
    nextUnlockTitle: 'Workplace Small Talk',
    now: practiceNow,
    recommendedRoleplayTitle: 'Sales Call',
    recommendedXpLabel: '+24 XP',
    sessions: [
      { completedAt: '2026-06-26T09:00:00.000Z' },
      { completedAt: '2026-06-26T11:00:00.000Z' },
    ],
  });

  assert.equal(bonusSprint.eyebrow, 'Target complete');
  assert.equal(bonusSprint.title, 'Extra practice available');
  assert.equal(bonusSprint.progressLabel, '1/1 saved today');
  assert.equal(bonusSprint.statusLabel, 'Bonus XP');
  assert.equal(bonusSprint.statusTone, 'success');
  assert.equal(bonusSprint.afterSavePayoff, 'Bonus XP, faster path to Workplace Small Talk');
  assert.ok(bonusSprint.body.includes('extra XP'));

  const freshDaySprint = createPracticeDailySprint({
    dailyTarget: 1,
    isResumeMode: false,
    nextUnlockTitle: 'Meeting Practice',
    now: new Date('2026-06-27T12:00:00.000Z'),
    recommendedRoleplayTitle: 'Job Interview',
    recommendedXpLabel: '+48 XP',
    sessions: [{ completedAt: '2026-06-26T09:00:00.000Z' }],
  });

  assert.equal(freshDaySprint.title, "Start today's practice");
  assert.equal(freshDaySprint.progressLabel, '0/1 saved today');
});

test('preserves the correct return screen for roleplay navigation', async () => {
  const { resolveRoleplayReturnScreen } = await import('../src/utils/roleplayReturnScreen.ts');

  assert.equal(
    resolveRoleplayReturnScreen({
      currentScreen: 'Practice',
      existingReturnScreen: 'Home',
    }),
    'Practice',
  );

  assert.equal(
    resolveRoleplayReturnScreen({
      currentScreen: 'Foundation',
      existingReturnScreen: 'Home',
    }),
    'Foundation',
  );

  assert.equal(
    resolveRoleplayReturnScreen({
      currentScreen: 'Roleplay',
      existingReturnScreen: 'Progress',
    }),
    'Progress',
  );
});

test('creates a compact practice runway around the active path step', async () => {
  const { createPracticeCareerPath } = await import('../src/utils/practiceCareerPath.ts');
  const { createPracticeRunway } = await import('../src/utils/practiceRunway.ts');

  const activePath = createPracticeCareerPath({
    roleplays: practiceContent.roleplays,
    sessions: [
      { roleplayId: 'meeting-practice' },
      { roleplayId: 'job-interview' },
    ],
  });
  const activeRunway = createPracticeRunway(activePath);

  assert.equal(activeRunway?.eyebrow, 'What unlocks next');
  assert.equal(activeRunway?.title, 'After Presentation Practice');
  assert.equal(activeRunway?.progressLabel, '2 of 5 complete');
  assert.deepEqual(
    activeRunway?.items.map((item) => item.state),
    ['done', 'active', 'locked'],
  );
  assert.ok(activeRunway?.body.includes('unlock Sales Call'));

  const completePath = createPracticeCareerPath({
    roleplays: practiceContent.roleplays,
    sessions: practiceContent.roleplays.map((roleplay) => ({ roleplayId: roleplay.id })),
  });
  const completeRunway = createPracticeRunway(completePath);

  assert.equal(completeRunway?.title, 'Full path complete');
  assert.equal(
    completeRunway?.items.find((item) => item.state === 'active')?.statusLabel,
    'Replay now',
  );
  assert.ok(completeRunway?.body.includes('Replay Meeting Practice'));
});

test('creates a concrete restored-draft cue for the roleplay resume state', async () => {
  const { createRoleplayResumeCue } = await import('../src/utils/roleplayResumeCue.ts');

  assert.deepEqual(
    createRoleplayResumeCue({
      isReadyForFeedback: false,
      readinessLabel: 'No answer yet',
      reviewNote: 'Write a first response before reviewing feedback.',
      wordCount: 0,
    }),
    {
      badgeLabel: '0 words',
      body: 'Write your first response now.',
    },
  );

  assert.deepEqual(
    createRoleplayResumeCue({
      isReadyForFeedback: false,
      readinessLabel: 'Needs more detail',
      reviewNote: 'Add one concrete action or example from work.',
      wordCount: 9,
    }),
    {
      badgeLabel: '9 words',
      body: 'Add one work example, then check.',
    },
  );

  assert.deepEqual(
    createRoleplayResumeCue({
      isReadyForFeedback: true,
      readinessLabel: 'Good start',
      reviewNote: 'Add a result, decision or next step to make the answer stronger.',
      wordCount: 17,
    }),
    {
      badgeLabel: '17 words',
      body: 'Add one result or next step.',
    },
  );

  assert.deepEqual(
    createRoleplayResumeCue({
      isReadyForFeedback: true,
      readinessLabel: 'Ready for feedback',
      reviewNote: 'Strong length for a short professional answer. Now review clarity and structure.',
      wordCount: 41,
    }),
    {
      badgeLabel: '41 words',
      body: 'Ready to check. Save XP next.',
    },
  );
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
