import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = '__zelda_companion_progress';

export interface IProgress {
  completedShrines: string[];
  collectedWeapons: string[];
  collectedArmors: string[];
  collectedMaterials: string[];
  collectedRecipes: string[];
  defeatedMonsters: string[];
  unlockedMemories: string[];
  completedTowers: string[];
  completedMainQuests: string[];
  completedShrineQuests: string[];
  completedSideQuests: string[];
  korokCount: number;
  favorites: { category: string; id: string }[];
  updatedAt: number;
}

const DEFAULT_PROGRESS: IProgress = {
  completedShrines: [],
  collectedWeapons: [],
  collectedArmors: [],
  collectedMaterials: [],
  collectedRecipes: [],
  defeatedMonsters: [],
  unlockedMemories: [],
  completedTowers: [],
  completedMainQuests: [],
  completedShrineQuests: [],
  completedSideQuests: [],
  korokCount: 0,
  favorites: [],
  updatedAt: 0,
};

export function useProgress() {
  const [progress, setProgress] = useState<IProgress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setProgress({ ...DEFAULT_PROGRESS, ...parsed });
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const save = useCallback((next: IProgress) => {
    const withTs = { ...next, updatedAt: Date.now() };
    setProgress(withTs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withTs));
    } catch {
      // ignore
    }
  }, []);

  const toggleItem = useCallback(
    (field: keyof Omit<IProgress, 'korokCount' | 'favorites' | 'updatedAt'>, id: string) => {
      const arr = progress[field] as string[];
      const exists = arr.includes(id);
      save({
        ...progress,
        [field]: exists ? arr.filter((x) => x !== id) : [...arr, id],
      });
    },
    [progress, save],
  );

  const isCollected = useCallback(
    (field: keyof Omit<IProgress, 'korokCount' | 'favorites' | 'updatedAt'>, id: string) => {
      return (progress[field] as string[]).includes(id);
    },
    [progress],
  );

  const toggleFavorite = useCallback(
    (category: string, id: string) => {
      const exists = progress.favorites.some((f) => f.category === category && f.id === id);
      save({
        ...progress,
        favorites: exists
          ? progress.favorites.filter((f) => !(f.category === category && f.id === id))
          : [...progress.favorites, { category, id }],
      });
    },
    [progress, save],
  );

  const isFavorite = useCallback(
    (category: string, id: string) => {
      return progress.favorites.some((f) => f.category === category && f.id === id);
    },
    [progress.favorites],
  );

  const setKorokCount = useCallback(
    (n: number) => {
      save({ ...progress, korokCount: Math.max(0, Math.min(900, Math.floor(n))) });
    },
    [progress, save],
  );

  const resetAll = useCallback(() => {
    save({ ...DEFAULT_PROGRESS });
  }, [save]);

  return {
    progress,
    loaded,
    toggleItem,
    isCollected,
    toggleFavorite,
    isFavorite,
    setKorokCount,
    resetAll,
  };
}
