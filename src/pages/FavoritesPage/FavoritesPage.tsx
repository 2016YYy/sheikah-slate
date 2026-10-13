import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';
import { MOCK_WEAPONS } from '@/data/weapons';
import { MOCK_ARMORS } from '@/data/armors';
import { MOCK_MONSTERS } from '@/data/monsters';
import { MOCK_RECIPES, MOCK_MATERIALS } from '@/data/food';
import { MOCK_SHRINES } from '@/data/collect';

type FavItem = { id: string; name: string; category: string; label: string; sub?: string };

const REGISTRY: Record<string, { list: readonly any[]; label: string }> = {
  weapons: { list: MOCK_WEAPONS, label: '武器' },
  armors: { list: MOCK_ARMORS, label: '防具' },
  monsters: { list: MOCK_MONSTERS, label: '怪物' },
  food: { list: MOCK_RECIPES, label: '料理' },
  materials: { list: MOCK_MATERIALS, label: '材料' },
  shrines: { list: MOCK_SHRINES, label: '神庙' },
};

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const items = useMemo(() => {
    const result: FavItem[] = [];
    for (const key of favorites) {
      const [cat, id] = key.split('/');
      const reg = REGISTRY[cat];
      if (!reg) continue;
      const entry = reg.list.find((x: any) => x.id === id);
      if (entry) {
        result.push({
          id,
          category: cat,
          label: reg.label,
          name: entry.name,
          sub: entry.type || entry.kind || entry.trialType || '',
        });
      }
    }
    return result;
  }, [favorites]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <header className="mb-6">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground text-sm mb-3 inline-flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">我的收藏</h1>
          <Badge variant="outline" className="font-display">{items.length}</Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-1.5">收藏的图鉴条目都会保存在这里。</p>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">还没有收藏任何条目，去图鉴里逛逛吧。</p>
          <button onClick={() => navigate('/')} className="text-primary text-sm mt-2 hover:underline">前往图鉴</button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={`${item.category}/${item.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
            >
              <div className="rounded-xl border border-border/60 bg-card/50 hover:bg-card/80 transition-all group">
                <button
                  onClick={() => navigate(`/category/${item.category}/${item.id}`)}
                  className="w-full text-left p-4 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path d="M12 2L22 7v10L12 22 2 17V7L12 2z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">{item.label}</Badge>
                      {item.sub && <span className="text-[11px] text-muted-foreground truncate">{item.sub}</span>}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => toggleFavorite(`${item.category}/${item.id}`)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  aria-label="取消收藏"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
