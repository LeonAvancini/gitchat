import { motion } from 'framer-motion';
import { mockRepos } from '../../data/repos';
import { useChatStore } from '../../lib/store';
import type { Repository } from '../../types';
import styles from './RepoStack.module.scss';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  Rust: '#dea584',
  Go: '#00add8',
  Python: '#3572a5',
  Shell: '#89e051',
};

const BAR_LEVELS = ['var(--bar-l4)', 'var(--bar-l3)', 'var(--bar-l2)', 'var(--bar-l1)'];

const sorted = [...mockRepos].sort((a, b) => b.stars - a.stars);
const maxStars = sorted[0]?.stars ?? 1;

export function RepoStack() {
  const narrateRepo = useChatStore((s) => s.narrateRepo);

  const handleClick = (repo: Repository) => {
    narrateRepo(repo);
  };

  return (
    <section className={styles.repoStack}>
      <div className={styles.header}>
        <span className={styles.count}>{sorted.length} repositories</span>
        <span className={styles.sort}>by stars</span>
      </div>

      <div className={styles.bars}>
        {sorted.map((repo, i) => {
          const widthPct = Math.max((repo.stars / maxStars) * 100, 12);
          const barColor = BAR_LEVELS[i % BAR_LEVELS.length];

          return (
            <motion.div
              key={repo.name}
              className={styles.row}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className={styles.bar}
                style={{ width: `${widthPct}%`, backgroundColor: barColor }}
                onClick={() => handleClick(repo)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleClick(repo);
                }}
                aria-label={`${repo.name} — ${repo.stars} stars`}
              >
                <span className={styles.repoName}>{repo.name}</span>
              </div>

              <div className={styles.meta}>
                <span
                  className={styles.langDot}
                  style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? '#8b8b8b' }}
                />
                <span className={styles.langName}>{repo.language}</span>
                <span className={styles.stars}>★ {repo.stars.toLocaleString()}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
