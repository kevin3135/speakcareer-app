import practiceContentJson from './practiceContent.json';
import progressMockJson from './progressMock.json';
import type { PracticeContent, ProgressData, RoleplayId } from '../types';

export const practiceContent = practiceContentJson as PracticeContent;
export const progressData = progressMockJson as ProgressData;

export function getRoleplayById(roleplayId: RoleplayId) {
  return practiceContent.roleplays.find((roleplay) => roleplay.id === roleplayId) ?? practiceContent.roleplays[0];
}
