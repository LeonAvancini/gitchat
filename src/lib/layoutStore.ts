import { create } from 'zustand';

type Side = 'right' | 'left';

const STORAGE_KEY = 'gitchat-layout-side';

function readSide(): Side {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'left' ? 'left' : 'right';
  } catch {
    return 'right';
  }
}

function writeSide(side: Side): void {
  try {
    localStorage.setItem(STORAGE_KEY, side);
  } catch {
    // silently fail if storage is unavailable
  }
}

interface LayoutStore {
  side: Side;
  toggle: () => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  side: readSide(),
  toggle: () =>
    set((state) => {
      const next: Side = state.side === 'right' ? 'left' : 'right';
      writeSide(next);
      return { side: next };
    }),
}));
