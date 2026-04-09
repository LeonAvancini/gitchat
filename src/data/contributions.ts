import type { ContributionDay, ContributionLevel, WeekColumn } from '../types';

// Fake "random" that always returns the same sequence for a given seed,
// so the heatmap data looks natural but stays identical across refreshes.
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function getContributionLevel(count: number): ContributionLevel {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 7) return 2;
  if (count <= 12) return 3;
  return 4;
}

export function generateContributions(): ContributionDay[] {
  const rand = seededRandom(42);
  const days: ContributionDay[] = [];

  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);

  const startDay = start.getDay();
  if (startDay !== 0) {
    start.setDate(start.getDate() - startDay);
  }

  const current = new Date(start);

  while (current <= today) {
    const weekday = current.getDay();
    const month = current.getMonth();
    const r = rand();

    let baseProb: number;
    let maxCount: number;

    const isWeekend = weekday === 0 || weekday === 6;

    if (isWeekend) {
      baseProb = 0.3;
      maxCount = 6;
    } else if (weekday === 2 || weekday === 3) {
      baseProb = 0.75;
      maxCount = 18;
    } else {
      baseProb = 0.6;
      maxCount = 14;
    }

    if (month >= 9 && month <= 11) {
      baseProb *= 1.2;
      maxCount = Math.ceil(maxCount * 1.3);
    }

    if (month === 7) {
      baseProb *= 0.4;
      maxCount = Math.ceil(maxCount * 0.3);
    }

    const dayOfMonth = current.getDate();
    if (dayOfMonth >= 1 && dayOfMonth <= 5) {
      baseProb *= 1.15;
    }

    let count = 0;
    if (r < Math.min(baseProb, 1)) {
      const intensity = rand();
      count = Math.ceil(intensity * maxCount);
    }

    const vacationStart = new Date(today.getFullYear(), 6, 15);
    const vacationEnd = new Date(today.getFullYear(), 6, 28);
    if (current >= vacationStart && current <= vacationEnd) {
      count = rand() < 0.1 ? 1 : 0;
    }

    days.push({
      date: current.toISOString().split('T')[0],
      count,
      level: getContributionLevel(count),
      weekday,
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function groupIntoWeeks(days: ContributionDay[]): WeekColumn[] {
  const weeks: WeekColumn[] = [];
  let currentWeek: ContributionDay[] = [];

  for (const day of days) {
    currentWeek.push(day);
    if (day.weekday === 6) {
      weeks.push({ days: currentWeek, weekIndex: weeks.length });
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push({ days: currentWeek, weekIndex: weeks.length });
  }

  return weeks;
}

export const contributionDays = generateContributions();
export const contributionWeeks = groupIntoWeeks(contributionDays);
