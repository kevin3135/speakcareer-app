export type FirstPathCoachCue = {
  label: string;
  message: string;
};

type CreateFirstPathCoachCueInput = {
  coachNote: string;
  firstLessonTitle: string;
  firstQuestTitle: string;
  levelLabel: string;
};

export function createFirstPathCoachCue({
  coachNote,
  firstLessonTitle,
  firstQuestTitle,
  levelLabel,
}: CreateFirstPathCoachCueInput): FirstPathCoachCue {
  const nextQuestTitleShort = firstQuestTitle.replace(/^Quest \d+:\s*/, '');

  return {
    label: `${levelLabel} path coach`,
    message: `We start with ${firstLessonTitle}, then move into ${nextQuestTitleShort}. ${coachNote}`,
  };
}
