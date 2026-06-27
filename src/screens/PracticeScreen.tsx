import { GradientHero, RoleplayCard, ScreenContainer, SectionHeader } from '../components/ui';
import { practiceContent } from '../data/content';
import type { PracticeSession, RoleplayId, RoleplayScenario } from '../types';

type PracticeScreenProps = {
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  sessions: PracticeSession[];
};

type PracticeCategory = {
  description: string;
  difficulty: string;
  focus: string;
  id: string;
  roleplayId: RoleplayId;
  time: string;
  title: string;
  xp: string;
};

function toCategory(roleplay: RoleplayScenario): PracticeCategory {
  const categoryTitles: Record<RoleplayId, string> = {
    'job-interview': 'Job Interview',
    'meeting-practice': 'Meetings',
    'presentation-practice': 'Presentations',
    'sales-call': 'Sales Calls',
    'workplace-small-talk': 'Workplace Small Talk',
  };

  return {
    description: roleplay.description,
    difficulty: roleplay.targetLevel,
    focus: roleplay.focus,
    id: roleplay.id,
    roleplayId: roleplay.id,
    time: `${roleplay.durationMinutes} min`,
    title: categoryTitles[roleplay.id],
    xp: `+${roleplay.durationMinutes * 4} XP`,
  };
}

export function PracticeScreen({ onOpenRoleplay, sessions }: PracticeScreenProps) {
  const completedIds = new Set(sessions.map((session) => session.roleplayId));
  const categories: PracticeCategory[] = [
    ...practiceContent.roleplays.map(toCategory),
    {
      description: 'Practice structured answers for future speaking exams with career topics.',
      difficulty: 'B1-B2',
      focus: 'Answer clearly under time pressure',
      id: 'exam-speaking',
      roleplayId: 'presentation-practice',
      time: '10 min',
      title: 'Exam Speaking',
      xp: '+40 XP',
    },
  ];

  return (
    <ScreenContainer
      overline="Practice library"
      subtitle="Pick a career category when you want extra practice. The main path still guides your day."
      title="Choose a skill"
    >
      <GradientHero
        overline="Career categories"
        subtitle="Interview, meetings, presentations, sales and small talk are ready as guided mock roleplays."
        title={`${completedIds.size}/${practiceContent.roleplays.length} core skills started`}
        tone="purple"
      />

      <SectionHeader
        subtitle="Beautiful cards, short sessions, clear XP."
        title="Practice categories"
      />

      {categories.map((category) => (
        <RoleplayCard
          category={completedIds.has(category.roleplayId) ? 'Started' : 'New'}
          ctaLabel={completedIds.has(category.roleplayId) ? 'Practice again' : 'Start'}
          description={category.description}
          difficulty={category.difficulty}
          focus={category.focus}
          key={category.id}
          onPress={() => onOpenRoleplay(category.roleplayId)}
          time={category.time}
          title={category.title}
          xp={category.xp}
        />
      ))}
    </ScreenContainer>
  );
}
