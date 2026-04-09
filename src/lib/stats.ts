import type { ContributionDay, ContributionStats } from '../types';

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function computeStats(days: ContributionDay[]): ContributionStats {
  const total = days.reduce((sum, d) => sum + d.count, 0);

  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const threeMonthStr = threeMonthsAgo.toISOString().split('T')[0];

  const recentDays = days.filter((d) => d.date >= threeMonthStr);
  const last3Months = recentDays.reduce((sum, d) => sum + d.count, 0);

  const weekdaySums = Array.from<number>({ length: 7 }).fill(0);
  const weekdayCounts = Array.from<number>({ length: 7 }).fill(0);

  let weekendTotal = 0;
  let weekdayTotal = 0;

  for (const d of days) {
    weekdaySums[d.weekday] += d.count;
    weekdayCounts[d.weekday] += 1;

    if (d.weekday === 0 || d.weekday === 6) {
      weekendTotal += d.count;
    } else {
      weekdayTotal += d.count;
    }
  }

  const weekdayAverages = weekdaySums.map((sum, i) =>
    weekdayCounts[i] > 0 ? sum / weekdayCounts[i] : 0,
  );

  let busiestDayIdx = 0;
  for (let i = 1; i < 7; i++) {
    if (weekdayAverages[i] > weekdayAverages[busiestDayIdx]) {
      busiestDayIdx = i;
    }
  }

  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;

  for (let i = days.length - 1; i >= 0; i--) {
    if (i === days.length - 1 && days[i].count > 0) {
      currentStreak = 1;
    } else if (i === days.length - 1) {
      currentStreak = 0;
    } else if (
      currentStreak > 0 &&
      i === days.length - 2 - (days.length - 2 - i) &&
      days[i].count > 0
    ) {
      // handled below
    }
  }

  currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  tempStreak = 0;
  for (const d of days) {
    if (d.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  const monthSums = Array.from<number>({ length: 12 }).fill(0);
  for (const d of days) {
    const m = new Date(d.date).getMonth();
    monthSums[m] += d.count;
  }
  let busiestMonthIdx = 0;
  for (let i = 1; i < 12; i++) {
    if (monthSums[i] > monthSums[busiestMonthIdx]) busiestMonthIdx = i;
  }

  return {
    totalContributions: total,
    last3MonthsContributions: last3Months,
    busiestDayOfWeek: WEEKDAY_NAMES[busiestDayIdx],
    busiestDayAverage: Math.round(weekdayAverages[busiestDayIdx] * 10) / 10,
    weekendContributions: weekendTotal,
    weekdayContributions: weekdayTotal,
    weekendPercentage: Math.round((weekendTotal / (total || 1)) * 100),
    longestStreak,
    currentStreak,
    busiestMonth: MONTH_NAMES[busiestMonthIdx],
    averageDaily: Math.round((total / (days.length || 1)) * 10) / 10,
  };
}
