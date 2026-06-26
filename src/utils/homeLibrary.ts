import type { PracticeSession, RoleplayId, RoleplayScenario } from '../types';

type HomeLibraryPreview = Pick<RoleplayScenario, 'category' | 'focus' | 'id' | 'targetLevel' | 'title'>;

export type HomeLibraryState = {
  body: string;
  meta: string;
  previewRoleplays: HomeLibraryPreview[];
  showRoleplayCards: boolean;
  title: string;
};

export function createHomeLibraryState(
  sessions: Pick<PracticeSession, 'id'>[],
  roleplays: HomeLibraryPreview[],
  guidedRoleplayId: RoleplayId,
): HomeLibraryState {
  if (sessions.length === 0) {
    return {
      body:
        'Save your first answer, then unlock more English workplace practice for meetings, presentations and sales conversations.',
      meta: 'Keep it simple',
      previewRoleplays: roleplays.filter((roleplay) => roleplay.id !== guidedRoleplayId).slice(0, 3),
      showRoleplayCards: false,
      title: 'What unlocks next',
    };
  }

  return {
    body: 'Choose another professional situation when you are ready.',
    meta: 'English MVP',
    previewRoleplays: roleplays.slice(0, 3),
    showRoleplayCards: true,
    title: 'Roleplay library',
  };
}
