import { useRef, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../lib/store';
import { useLayoutStore } from '../../lib/layoutStore';
import { ChatStatus } from '../../types';
import { MessageEntry } from './MessageEntry';
import { ThinkingIndicator } from './ThinkingIndicator';
import styles from './Conversation.module.scss';

const MOBILE_BREAKPOINT = 960;

export function Conversation() {
  const { messages, status, suggestions, sendMessage } = useChatStore();
  const { side, toggle } = useLayoutStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    if (window.innerWidth <= MOBILE_BREAKPOINT && messages.length > 1) {
      asideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || status !== ChatStatus.Idle) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleSuggestion = (query: string) => {
    if (status !== ChatStatus.Idle) return;
    sendMessage(query);
  };

  const asideClass =
    side === 'left' ? `${styles.conversation} ${styles.onLeft}` : styles.conversation;

  const swapLabel = side === 'right' ? 'Move chat to left' : 'Move chat to right';

  return (
    <aside className={asideClass} ref={asideRef}>
      <div className={styles.header}>
        <span className={styles.sectionLabel}>Conversation</span>
        <div className={styles.swapWrapper}>
          <button
            type="button"
            className={styles.swapButton}
            onClick={toggle}
            aria-label={swapLabel}
          >
            {side === 'right' ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 7H2M5 3.5L1.5 7 5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 7h8M9 3.5l3.5 3.5L9 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          {side === 'right' && <span className={styles.swapTooltip}>{swapLabel}</span>}
        </div>
      </div>

      <div className={styles.stream} ref={scrollRef}>
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <MessageEntry key={msg.id} message={msg} index={i} />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          <ThinkingIndicator status={status} />
        </AnimatePresence>
      </div>

      {suggestions.length > 0 && status === ChatStatus.Idle && (
        <div className={styles.suggestions}>
          {suggestions.map((s) => (
            <button
              key={s.id}
              className={styles.suggestionChip}
              onClick={() => handleSuggestion(s.query)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <form className={styles.inputBar} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this profile..."
          disabled={status !== ChatStatus.Idle}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!input.trim() || status !== ChatStatus.Idle}
          aria-label="Send message"
        >
          &uarr;
        </button>
      </form>
    </aside>
  );
}
