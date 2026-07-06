export type ProfilePrivacyCue = {
  badgeLabel: string;
  body: string;
  items: {
    body: string;
    title: string;
  }[];
  title: string;
};

export function createProfilePrivacyCue(): ProfilePrivacyCue {
  return {
    badgeLabel: 'On this device',
    body: 'Practice freely while SpeakCareer is in preview. No account is needed to build your English habit.',
    items: [
      {
        body: 'Your saved practice stays in this app preview.',
        title: 'Saved here',
      },
      {
        body: 'Start practicing without signup or profile setup.',
        title: 'No account',
      },
    ],
    title: 'Practice stays yours',
  };
}
