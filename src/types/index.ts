export interface Profile {
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  location: string;
  company: string;
  joinedYear: number;
  stats: ProfileStats;
}

export interface ProfileStats {
  repositories: number;
  followers: number;
  following: number;
  stars: number;
}

export interface ContributionDay {
  date: string; // ISO date YYYY-MM-DD
  count: number;
  level: ContributionLevel;
  weekday: number; // 0=Sun ... 6=Sat
}

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface WeekColumn {
  days: ContributionDay[];
  weekIndex: number;
}

export const ChatRole = {
  User: 'user',
  Assistant: 'assistant',
} as const;

export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
}

export const ChatStatus = {
  Idle: 'idle',
  Thinking: 'thinking',
  Typing: 'typing',
} as const;

export type ChatStatus = (typeof ChatStatus)[keyof typeof ChatStatus];

export interface ContributionStats {
  totalContributions: number;
  last3MonthsContributions: number;
  busiestDayOfWeek: string;
  busiestDayAverage: number;
  weekendContributions: number;
  weekdayContributions: number;
  weekendPercentage: number;
  longestStreak: number;
  currentStreak: number;
  busiestMonth: string;
  averageDaily: number;
}

export interface SuggestedQuestion {
  id: string;
  label: string;
  query: string;
}

export interface Repository {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  isArchived: boolean;
}
