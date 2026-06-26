import type { PracticeSession, RoleplayScenario } from '../types';

type HomeQuestRoleplay = Pick<RoleplayScenario, 'category' | 'id' | 'title'>;

type QuestNodeStatus = 'active' | 'done' | 'locked';

export type HomeQuestNode = {
  body: string;
  id: string;
  status: QuestNodeStatus;
  tag: string;
  title: string;
};

type HomeQuestPathInput = {
  previewRoleplays: HomeQuestRoleplay[];
  recommendedRoleplay: HomeQuestRoleplay;
  sessions: Pick<PracticeSession, 'id'>[];
};

export type HomeQuestPath = {
  meta: string;
  nodes: HomeQuestNode[];
  title: string;
};

export function createHomeQuestPath({
  previewRoleplays,
  recommendedRoleplay,
  sessions,
}: HomeQuestPathInput): HomeQuestPath {
  const hasSavedPractice = sessions.length > 0;
  const nextRoleplay =
    previewRoleplays.find((roleplay) => roleplay.id !== recommendedRoleplay.id) ??
    previewRoleplays[0] ??
    recommendedRoleplay;

  return {
    meta: hasSavedPractice ? 'Next quest ready' : 'Start simple',
    title: 'Career path',
    nodes: [
      {
        body: hasSavedPractice
          ? 'Your first answer is saved. Keep the streak alive with one more work situation.'
          : 'Write one short answer and save it to unlock the next work situation.',
        id: 'daily-quest',
        status: hasSavedPractice ? 'done' : 'active',
        tag: hasSavedPractice ? 'Done' : 'Now',
        title: hasSavedPractice ? 'First quest complete' : recommendedRoleplay.title,
      },
      {
        body: hasSavedPractice
          ? `Practice ${nextRoleplay.category.toLowerCase()} English in a short guided sprint.`
          : 'Finish today\'s quest first so the app stays focused.',
        id: 'next-roleplay',
        status: hasSavedPractice ? 'active' : 'locked',
        tag: hasSavedPractice ? 'Next' : 'Locked',
        title: nextRoleplay.title,
      },
      {
        body: 'Come back tomorrow for another 5-minute sprint and more XP.',
        id: 'streak-builder',
        status: 'locked',
        tag: '+XP',
        title: 'Build the streak',
      },
    ],
  };
}
