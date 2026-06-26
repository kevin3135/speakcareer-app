export type MainScreen = 'Home' | 'Practice' | 'Roleplay' | 'Progress' | 'Profile';

export type DailyPracticeTarget = 1 | 2 | 3;

export type RoleplayId =
  | 'job-interview'
  | 'meeting-practice'
  | 'presentation-practice'
  | 'sales-call'
  | 'workplace-small-talk';

export type ScoreKey = 'clarity' | 'confidence' | 'structure' | 'vocabulary';

export type FeedbackScore = {
  label: string;
  value: number;
};

export type AIFeedback = {
  summary: string;
  strengths: string[];
  improvements: string[];
  suggestedRewrite: string;
  scores: FeedbackScore[];
};

export type RoleplayPromptVariantFeedbackGuidance = {
  summaryHint: string;
  strengthFocus: string;
  improvementFocus: string;
  suggestedRewrite: string;
};

export type PracticeModule = {
  id: string;
  title: string;
  outcome: string;
  minutes: number;
  level: string;
  drills: string[];
};

export type RoleplayCategory =
  | 'Interview'
  | 'Meeting'
  | 'Presentation'
  | 'Sales'
  | 'Small Talk';

export type RoleplayPromptVariant = {
  id: string;
  title: string;
  openingLine: string;
  userGoal: string;
  coachingNote: string;
  suggestedPhrases?: string[];
  feedbackGuidance?: RoleplayPromptVariantFeedbackGuidance;
};

export type RoleplayScenario = {
  id: RoleplayId;
  title: string;
  category: RoleplayCategory;
  focus: string;
  targetLanguage: 'English';
  targetLevel: string;
  durationMinutes: number;
  description: string;
  workplaceContext: string;
  userGoal: string;
  aiPersona: string;
  openingLine: string;
  promptVariants?: RoleplayPromptVariant[];
  suggestedPhrases: string[];
  followUpPrompts: string[];
  feedback: AIFeedback;
};

export type PracticeContent = {
  positioning: string;
  firstTargetLanguage: 'English';
  plannedLanguages: string[];
  practiceModules: PracticeModule[];
  roleplays: RoleplayScenario[];
};

export type ProgressSummary = {
  sessionsCompleted: number;
  minutesPracticed: number;
  currentStreakDays: number;
  confidenceScore: number;
  clarityScore: number;
  nextFocus: string;
};

export type MistakeItem = {
  id: string;
  category: string;
  original: string;
  correction: string;
  note: string;
  priority: 'High' | 'Medium' | 'Low';
};

export type ProgressData = {
  summary: ProgressSummary;
  mistakeBank: MistakeItem[];
};

export type PracticeSession = {
  id: string;
  roleplayId: RoleplayId;
  roleplayTitle: string;
  completedAt: string;
  answerPreview: string;
  wordCount: number;
  readinessLabel: string;
  feedbackSummary: string;
  xpReward: number;
};
