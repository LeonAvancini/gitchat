import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { contributionWeeks, contributionDays } from '../../data/contributions';
import { computeStats } from '../../lib/stats';
import { useChatStore } from '../../lib/store';
import type { ContributionDay } from '../../types';
import styles from './Heatmap.module.scss';

const stats = computeStats(contributionDays);

const CELL_SIZE = 15;
const CELL_GAP = 4;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const GRID_ROWS = 7;
const MONTH_LABELS_HEIGHT = 24;

const LEVEL_CLASSES: Record<number, string> = {
  0: styles.level0,
  1: styles.level1,
  2: styles.level2,
  3: styles.level3,
  4: styles.level4,
};

function getMonthLabels(): Array<{ label: string; x: number }> {
  const months: Array<{ label: string; x: number }> = [];
  let lastMonth = -1;

  for (const week of contributionWeeks) {
    const firstDay = week.days[0];
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      const monthName = new Date(firstDay.date).toLocaleString('en', { month: 'short' });
      months.push({ label: monthName, x: week.weekIndex * CELL_STEP });
    }
  }

  return months;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function Heatmap() {
  const [tooltip, setTooltip] = useState<{ day: ContributionDay; x: number; y: number } | null>(
    null,
  );
  const sectionRef = useRef<HTMLElement>(null);
  const narrateDay = useChatStore((s) => s.narrateDay);

  const handleClick = useCallback(
    (_e: React.MouseEvent, day: ContributionDay) => {
      narrateDay(day);
    },
    [narrateDay],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent, day: ContributionDay) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    setTooltip({
      day,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const svgWidth = contributionWeeks.length * CELL_STEP;
  const svgHeight = GRID_ROWS * CELL_STEP + MONTH_LABELS_HEIGHT;
  const monthLabels = getMonthLabels();

  return (
    <section className={styles.heatmap} ref={sectionRef}>
      <div className={styles.header}>
        <span className={styles.total}>
          {stats.totalContributions.toLocaleString()} contributions
        </span>
        <span className={styles.period}>in the last year</span>
      </div>

      <div className={styles.graphWrapper}>
        <svg
          className={styles.graph}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          role="img"
          aria-label="Contribution heatmap"
        >
          {monthLabels.map((m, i) => (
            <text key={i} x={m.x} y={12} className={styles.monthLabel}>
              {m.label}
            </text>
          ))}

          {contributionWeeks.map((week) =>
            week.days.map((day) => (
              <motion.rect
                key={day.date}
                x={week.weekIndex * CELL_STEP}
                y={day.weekday * CELL_STEP + MONTH_LABELS_HEIGHT}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={2}
                className={`${LEVEL_CLASSES[day.level]} ${styles.cell}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: week.weekIndex * 0.008 + day.weekday * 0.005,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseMove={(e) => handleMouseMove(e, day)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => handleClick(e, day)}
              />
            )),
          )}
        </svg>
      </div>

      {tooltip && (
        <div
          className={styles.tooltip}
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <span className={styles.tooltipCount}>
            {tooltip.day.count === 0
              ? 'No contributions'
              : `${tooltip.day.count} contribution${tooltip.day.count !== 1 ? 's' : ''}`}
          </span>
          <span className={styles.tooltipDate}>{formatDate(tooltip.day.date)}</span>
        </div>
      )}

      <div className={styles.legend}>
        <p className={styles.legendDescription}>
          Each cell is one day. Darker shades mean more contributions — commits, pull requests,
          reviews, and issues.
        </p>
        <div className={styles.legendScale}>
          {(
            [
              { level: 0, label: '0' },
              { level: 1, label: '1–3' },
              { level: 2, label: '4–7' },
              { level: 3, label: '8–12' },
              { level: 4, label: '13+' },
            ] as const
          ).map((tier) => (
            <div key={tier.level} className={styles.legendTier}>
              <span className={`${styles.legendCell} ${LEVEL_CLASSES[tier.level]}`} />
              <span className={styles.legendTierLabel}>{tier.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
