import { motion } from 'framer-motion';
import { ChatRole, type ChatMessage } from '../../types';
import styles from './Conversation.module.scss';

interface MessageEntryProps {
  message: ChatMessage;
  index: number;
}

export function MessageEntry({ message, index }: MessageEntryProps) {
  return (
    <motion.article
      className={`${styles.entry} ${styles[message.role]}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className={styles.roleLabel}>{message.role === ChatRole.Assistant ? 'gitchat' : 'you'}</span>
      <p className={styles.content}>{message.content}</p>
    </motion.article>
  );
}
