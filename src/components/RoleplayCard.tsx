import { RoleplayCard as UIRoleplayCard } from './ui';
import type { RoleplayScenario } from '../types';

type RoleplayCardProps = {
  roleplay: RoleplayScenario;
  onPress: () => void;
};

export function RoleplayCard({ roleplay, onPress }: RoleplayCardProps) {
  return (
    <UIRoleplayCard
      category={roleplay.category}
      description={roleplay.description}
      difficulty={roleplay.targetLevel}
      focus={roleplay.focus}
      onPress={onPress}
      time={`${roleplay.durationMinutes} min`}
      title={roleplay.title}
      xp={`+${roleplay.durationMinutes * 4} XP`}
    />
  );
}
