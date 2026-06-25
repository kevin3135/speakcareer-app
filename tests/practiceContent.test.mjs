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

  assert.deepEqual(titles, [
    'Job Interview',
    'Meeting Practice',
    'Presentation Practice',
    'Sales Call',
    'Workplace Small Talk',
  ]);
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
