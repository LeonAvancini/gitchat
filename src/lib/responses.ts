import type { ContributionStats } from '../types';

type ResponseGenerator = (stats: ContributionStats) => string;

interface QueryPattern {
  patterns: RegExp[];
  response: ResponseGenerator;
}

const queryBank: QueryPattern[] = [
  {
    patterns: [/last\s*(3|three)\s*months?/i, /recent\s*activity/i, /lately/i],
    response: (s) =>
      `Over the last 3 months, this profile logged ${s.last3MonthsContributions.toLocaleString()} contributions. ` +
      `That works out to roughly ${Math.round(s.last3MonthsContributions / 90)} per day on average. ` +
      (s.last3MonthsContributions > s.totalContributions * 0.3
        ? `That's a strong recent pace — above the yearly average of ${s.averageDaily}/day.`
        : `Compared to the yearly average of ${s.averageDaily}/day, things have slowed down a bit.`),
  },
  {
    patterns: [/busiest\s*day/i, /most\s*active\s*day/i, /which\s*day/i],
    response: (s) =>
      `${s.busiestDayOfWeek} is the standout, averaging ${s.busiestDayAverage} contributions per occurrence. ` +
      `There's a clear pattern here — mid-week energy tends to be highest, then it tapers toward the weekend.`,
  },
  {
    patterns: [/weekend/i, /saturday|sunday/i, /weekday\s*vs/i],
    response: (s) =>
      `Weekend contributions total ${s.weekendContributions.toLocaleString()} — that's about ${s.weekendPercentage}% of all activity. ` +
      (s.weekendPercentage > 25
        ? `That's notable. This person clearly doesn't stop on Saturdays.`
        : s.weekendPercentage > 15
          ? `A moderate weekend presence — they work when inspired but don't grind through rest days.`
          : `Weekends are mostly quiet. This looks like someone with healthy boundaries.`),
  },
  {
    patterns: [/streak/i, /consecutive/i, /in\s*a\s*row/i],
    response: (s) =>
      `The longest streak on record is ${s.longestStreak} consecutive days. ` +
      (s.currentStreak > 0
        ? `Right now they're on a ${s.currentStreak}-day streak and counting.`
        : `The current streak has been broken — the most recent day shows no activity.`) +
      (s.longestStreak > 30
        ? ` ${s.longestStreak} days straight is serious commitment.`
        : ` Not an extreme marathon, but consistency matters more than streaks.`),
  },
  {
    patterns: [/overview/i, /summary/i, /tell\s*me\s*about/i, /who\s*is/i, /general/i],
    response: (s) =>
      `This year shows ${s.totalContributions.toLocaleString()} total contributions — an average of ${s.averageDaily} per day. ` +
      `${s.busiestMonth} was the peak month. ${s.busiestDayOfWeek}s tend to be the most active day. ` +
      `The longest streak hit ${s.longestStreak} days. ` +
      `About ${s.weekendPercentage}% of activity happens on weekends.`,
  },
  {
    patterns: [/month/i, /peak\s*month/i, /busiest\s*month/i],
    response: (s) =>
      `${s.busiestMonth} was the most active month by total contribution count. ` +
      `It's worth noting that contribution volume can spike from bursts of open-source work, ` +
      `conference-driven motivation, or just the natural rhythm of a project cycle.`,
  },
  {
    patterns: [/total/i, /how\s*many/i, /count/i, /number/i],
    response: (s) =>
      `${s.totalContributions.toLocaleString()} contributions over the past year. ` +
      `That breaks down to ${s.averageDaily} per day, ${Math.round(s.averageDaily * 7)} per week, ` +
      `and roughly ${Math.round(s.totalContributions / 12).toLocaleString()} per month.`,
  },
];

const fallbackResponses: ResponseGenerator[] = [
  (s) =>
    `I can tell you about this profile's activity patterns. There are ${s.totalContributions.toLocaleString()} contributions to explore. ` +
    `Try asking about streaks, weekend habits, or which day of the week is busiest.`,
  (s) =>
    `Not sure I caught that. Here's something though: the longest streak is ${s.longestStreak} days, ` +
    `and ${s.busiestDayOfWeek} is statistically the most productive day. What else would you like to know?`,
];

// First-match wins: walks the query bank in order and returns
// the response for the first regex that matches. Falls back to
// a random generic reply if nothing matches.
export function generateResponse(query: string, stats: ContributionStats): string {
  for (const entry of queryBank) {
    for (const pattern of entry.patterns) {
      if (pattern.test(query)) {
        return entry.response(stats);
      }
    }
  }

  const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  return fallback(stats);
}
