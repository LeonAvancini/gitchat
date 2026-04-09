import { create } from 'zustand';
import {
  ChatRole,
  ChatStatus,
  type ChatMessage,
  type ContributionDay,
  type Repository,
  type SuggestedQuestion,
} from '../types';
import { contributionDays } from '../data/contributions';
import { computeStats } from './stats';
import { generateResponse } from './responses';
import { generateCommentary, generateRepoCommentary } from './commentary';

// Pre-computed once at module load — every response shares the same snapshot.
const stats = computeStats(contributionDays);

interface ChatStore {
  messages: ChatMessage[];
  status: ChatStatus;
  suggestions: SuggestedQuestion[];
  sendMessage: (content: string) => void;
  narrateDay: (day: ContributionDay) => void;
  narrateRepo: (repo: Repository) => void;
}

const defaultSuggestions: SuggestedQuestion[] = [
  { id: 'overview', label: 'Profile overview', query: 'Give me an overview of this profile' },
  { id: 'streak', label: 'Longest streak', query: 'What is the longest contribution streak?' },
  { id: 'weekend', label: 'Weekend habits', query: 'How active are they on weekends?' },
  { id: 'busiest', label: 'Busiest day', query: 'Which day of the week is busiest?' },
  { id: 'recent', label: 'Last 3 months', query: 'How has activity been in the last 3 months?' },
];

// Module-scoped so IDs stay unique across store resets.
let messageCounter = 0;

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  messageCounter++;
  return {
    id: `msg-${messageCounter}-${Date.now()}`,
    role,
    content,
    timestamp: Date.now(),
  };
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    createMessage(
      ChatRole.Assistant,
      `Welcome to gitchat. You can ask me about this profile's contribution activity, ` +
        `click any day on the heatmap for a quick take, or tap a repo bar to see its details. ` +
        `Try the suggestions below to get started.`,
    ),
  ],
  status: ChatStatus.Idle,
  suggestions: defaultSuggestions,

  sendMessage: (content: string) => {
    const userMsg = createMessage(ChatRole.User, content);

    set((state) => ({
      messages: [...state.messages, userMsg],
      status: ChatStatus.Thinking,
      suggestions: [],
    }));

    // Two-phase delay: "thinking" pause → "typing" pause → response.
    // Randomised durations prevent a mechanical feel.
    setTimeout(
      () => {
        set({ status: ChatStatus.Typing });

        setTimeout(
          () => {
            const response = generateResponse(content, stats);
            const assistantMsg = createMessage(ChatRole.Assistant, response);

            set((state) => ({
              messages: [...state.messages, assistantMsg],
              status: ChatStatus.Idle,
              suggestions: get().suggestions.length === 0 ? defaultSuggestions : get().suggestions,
            }));
          },
          800 + Math.random() * 600,
        );
      },
      500 + Math.random() * 400,
    );
  },

  // Heatmap click → playful/witty tone (see commentary.ts).
  narrateDay: (day: ContributionDay) => {
    // Drop the event if a response is already in flight.
    if (get().status !== ChatStatus.Idle) return;

    set({ status: ChatStatus.Thinking, suggestions: [] });

    setTimeout(
      () => {
        set({ status: ChatStatus.Typing });

        setTimeout(
          () => {
            const commentary = generateCommentary(day);
            const msg = createMessage(ChatRole.Assistant, commentary);

            set((state) => ({
              messages: [...state.messages, msg],
              status: ChatStatus.Idle,
              suggestions: defaultSuggestions,
            }));
          },
          400 + Math.random() * 400,
        );
      },
      300 + Math.random() * 200,
    );
  },

  // Repo bar click → formal/informative tone (see commentary.ts).
  narrateRepo: (repo: Repository) => {
    if (get().status !== ChatStatus.Idle) return;

    set({ status: ChatStatus.Thinking, suggestions: [] });

    setTimeout(
      () => {
        set({ status: ChatStatus.Typing });

        setTimeout(
          () => {
            const commentary = generateRepoCommentary(repo);
            const msg = createMessage(ChatRole.Assistant, commentary);

            set((state) => ({
              messages: [...state.messages, msg],
              status: ChatStatus.Idle,
              suggestions: defaultSuggestions,
            }));
          },
          400 + Math.random() * 400,
        );
      },
      300 + Math.random() * 200,
    );
  },
}));
