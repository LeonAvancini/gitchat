import type { ContributionDay, Repository } from '../types';

type CommentaryPool = readonly string[];

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function dayName(day: ContributionDay): string {
  return WEEKDAY_NAMES[day.weekday];
}

function formattedDate(day: ContributionDay): string {
  return new Date(day.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
}

const zeroPool: CommentaryPool = [
  'Absolute silence on {date}. Not a single commit. Either a vacation or a very long lunch.',
  '{date} — zero contributions. Rest is part of the craft. Or maybe the Wi-Fi was down.',
  "Nothing on {date}. Blank canvas energy. Sometimes the best code is the code you don't write.",
  '{day} the {date} was a ghost town. No commits, no PRs, no regrets.',
  'A perfect zero on {date}. Bold move. Respectable, even.',
];

const lowPool: CommentaryPool = [
  '{count} commit{s} on {date}. A quiet {day} — just enough to keep the streak alive.',
  '{date}: {count} contribution{s}. Light touch. Surgical precision or gentle procrastination? Hard to tell.',
  'Just {count} on {date}. Sometimes a single well-placed fix is worth more than a hundred.',
  '{count} commit{s} that {day}. The kind of day where you fix one bug and call it wisdom.',
  'A modest {count} on {date}. Not every day needs to be a marathon.',
];

const mediumPool: CommentaryPool = [
  '{count} contributions on {date}. A solid {day} — focused and productive.',
  "{date} brought {count} commits. That's the kind of steady output that ships products.",
  '{count} on a {day}. Good rhythm. This is what sustainable engineering looks like.',
  'A healthy {count} contributions on {date}. Not showing off, just getting it done.',
  '{date}: {count} commits. Somewhere between "in the zone" and "fueled by coffee."',
];

const highPool: CommentaryPool = [
  '{count} contributions on {date}. Someone was locked in. Headphones on, world off.',
  "{date} — {count} commits. That's not a workday, that's a statement.",
  "{count} on a single {day}. That's the kind of energy that makes reviewers nervous.",
  'An intense {count} contributions on {date}. Keyboard probably needed therapy after.',
  '{date}: {count} commits dropped. The git log reads like a novel that day.',
];

const extremePool: CommentaryPool = [
  '{count} contributions on {date}. This is not normal. This is caffeine-driven art.',
  "{date} — {count} commits. At this point, it's not coding, it's a performance piece.",
  '{count} on {date}. Legend behavior. The commit graph literally bows.',
  'An absurd {count} contributions on a single {day}. Someone woke up and chose violence (against bugs).',
  '{date}: {count} commits. Somewhere, a CI pipeline is still recovering.',
];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function interpolate(template: string, day: ContributionDay): string {
  return template
    .replace(/\{date\}/g, formattedDate(day))
    .replace(/\{day\}/g, dayName(day))
    .replace(/\{count\}/g, day.count.toString())
    .replace(/\{s\}/g, day.count === 1 ? '' : 's');
}

function getPool(count: number): CommentaryPool {
  if (count === 0) return zeroPool;
  if (count <= 3) return lowPool;
  if (count <= 7) return mediumPool;
  if (count <= 12) return highPool;
  return extremePool;
}

export function generateCommentary(day: ContributionDay): string {
  const pool = getPool(day.count);
  const template = pickRandom(pool);
  return interpolate(template, day);
}

// --- Repo descriptions ---

const repoDescriptionTemplates: CommentaryPool = [
  '{name} — {description}. Written in {lang} with {stars} stars and {forks} forks. Last updated {date}.',
  'A {lang} repo: {name}. {description}. {stars} stars, {forks} forks, updated {date}.',
  '{name}: {description}. Built in {lang}, starred {stars} times. Most recent activity on {date}.',
];

function formatRepoDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function generateRepoCommentary(repo: Repository): string {
  const template = pickRandom(repoDescriptionTemplates);
  return template
    .replace(/\{name\}/g, repo.name)
    .replace(/\{description\}/g, repo.description)
    .replace(/\{stars\}/g, repo.stars.toLocaleString())
    .replace(/\{forks\}/g, repo.forks.toLocaleString())
    .replace(/\{lang\}/g, repo.language)
    .replace(/\{date\}/g, formatRepoDate(repo.updatedAt));
}
