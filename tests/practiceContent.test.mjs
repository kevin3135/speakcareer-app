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
  const answer = 'In my previous role, I coordinated customer feedback reviews and helped the team prioritize product improvements.';
  const review = summarizePracticeAnswer(answer);
  const feedbackResult = createRuleBasedFeedback(roleplay, answer, review);
  const session = createPracticeSession({
    answer,
    feedback: feedbackResult.feedback,
    review,
    roleplay,
    xpReward: feedbackResult.xpReward,
    completedAt: new Date('2026-06-26T10:00:00.000Z'),
  });

  assert.equal(session.roleplayTitle, 'Job Interview');
  assert.equal(session.roleplayId, 'job-interview');
  assert.equal(session.wordCount, review.wordCount);
  assert.ok(session.answerPreview.includes('customer feedback'));
  assert.equal(session.xpReward, feedbackResult.xpReward);
  assert.equal(session.feedbackSummary, feedbackResult.feedback.summary);
  assert.equal(session.completedAt, '2026-06-26T10:00:00.000Z');
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

test('adapts follow-up prompts to the first answer weakness', async () => {
  const { summarizePracticeAnswer } = await import('../src/utils/answerReview.ts');
  const { createAdaptiveFollowUpPrompt } = await import('../src/utils/followUpPrompt.ts');
  const roleplay = practiceContent.roleplays[0];

  const vagueAnswer = 'I worked with the team and helped on different tasks during the project.';
  const vaguePrompt = createAdaptiveFollowUpPrompt(roleplay, vagueAnswer, summarizePracticeAnswer(vagueAnswer));

  assert.equal(vaguePrompt.focus, 'result');
  assert.ok(vaguePrompt.prompt.includes('result') || vaguePrompt.prompt.includes('impact'));

  const strongAnswer = [
    'In my previous role, I led a customer feedback project with my team.',
    'First, I grouped issues by priority.',
    'As a result, we reduced repeat complaints by 20%.',
  ].join(' ');
  const strongPrompt = createAdaptiveFollowUpPrompt(roleplay, strongAnswer, summarizePracticeAnswer(strongAnswer));

  assert.equal(strongPrompt.focus, 'next-step');
  assert.equal(strongPrompt.prompt, roleplay.followUpPrompts[0]);
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

test('formats the five-minute focus timer', async () => {
  const { FOCUS_SESSION_SECONDS, formatFocusTime } = await import('../src/utils/focusTimer.ts');

  assert.equal(FOCUS_SESSION_SECONDS, 300);
  assert.equal(formatFocusTime(300), '5:00');
  assert.equal(formatFocusTime(61), '1:01');
  assert.equal(formatFocusTime(-20), '0:00');
});
