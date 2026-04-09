import { motion } from 'framer-motion';
import { mockProfile } from '../../data/profile';
import styles from './Profile.module.scss';

const statEntries: Array<{ label: string; value: string }> = [
  { label: 'Repos', value: mockProfile.stats.repositories.toString() },
  { label: 'Followers', value: mockProfile.stats.followers.toLocaleString() },
  { label: 'Following', value: mockProfile.stats.following.toLocaleString() },
  { label: 'Stars', value: mockProfile.stats.stars.toLocaleString() },
];

export function Profile() {
  const nameParts = mockProfile.displayName.split('\n');

  return (
    <header className={styles.profile}>
      <div className={styles.nameBlock}>
        {nameParts.map((part, i) => (
          <motion.span
            key={i}
            className={styles.displayName}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {part}
          </motion.span>
        ))}
      </div>

      <motion.div
        className={styles.meta}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className={styles.identity}>
          <img
            src={mockProfile.avatarUrl}
            alt={mockProfile.displayName.replace('\n', ' ')}
            className={styles.avatar}
          />
          <div className={styles.handle}>
            <span className={styles.username}>@{mockProfile.username}</span>
            <span className={styles.location}>{mockProfile.location}</span>
          </div>
        </div>

        <p className={styles.bio}>{mockProfile.bio}</p>

        <div className={styles.stats}>
          {statEntries.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </header>
  );
}
