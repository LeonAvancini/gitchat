import { Profile } from './components/Profile';
import { Heatmap } from './components/Heatmap';
import { RepoStack } from './components/RepoStack';
import { Conversation } from './components/Conversation';
import { useLayoutStore } from './lib/layoutStore';
import styles from './App.module.scss';

function App() {
  const side = useLayoutStore((s) => s.side);
  const layoutClass = side === 'left' ? `${styles.layout} ${styles.reversed}` : styles.layout;

  return (
    <div className={layoutClass} key={side}>
      <main className={styles.editorial}>
        <Profile />
        <Heatmap />
        <RepoStack />
      </main>
      <Conversation />
    </div>
  );
}

export default App;
