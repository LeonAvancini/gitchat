import { motion } from 'framer-motion';
import { ChatStatus, type ChatStatus as ChatStatusType } from '../../types';
import styles from './Conversation.module.scss';

interface ThinkingIndicatorProps {
  status: ChatStatusType;
}

export function ThinkingIndicator({ status }: ThinkingIndicatorProps) {
  if (status === ChatStatus.Idle) return null;

  return (
    <motion.div
      className={styles.thinking}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <span className={styles.roleLabel}>gitchat</span>
      <div className={styles.thinkingContent}>
        {status === ChatStatus.Thinking ? (
          <span className={styles.thinkingText}>thinking</span>
        ) : (
          <span className={styles.typingDots}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className={styles.dot}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </span>
        )}
      </div>
    </motion.div>
  );
}
