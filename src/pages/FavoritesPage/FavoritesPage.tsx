import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_WEAPONS } from '@/data/weapons';
import { MOCK_ARMORS } from '@/data/armors';
import { MOCK_SHRINES, MOCK_TOWERS, MOCK_MEMORIES } from '@/data/collect';
import { MOCK_MONSTERS } from '@/data/monsters';
import { MOCK_MATERIALS, MOCK_RECIPES } from '@/data/food';
import { useProgress } from '@/hooks/use-progress';

const CATEGORY_META: Record<
  string,
  { label: string; detailPath: string; data: readonly any[]; progressField: string; valueKey: string }
> = {
  weapons: { label: '武器', detailPath: '/detail/weapons', data: MOCK_WEAPONS, progressField: 'collectedWeapons', valueKey: 'atk' },
  armors: { label: '防具', detailPath: '/detail/armors', data: MOCK_ARMORS, progressField: 'collectedArmors', valueKey: 'def' },
  shrines: { label: '神庙', detailPath: '/detail/shrines', data: MOCK_SHRINES, progressField: 'completedShrines', valueKey: 'region' },
  monsters: { label: '怪物', detailPath: '/detail/monsters', data: MOCK_MONSTERS, progressField: 'defeatedMonsters', valueKey: 'hp' },
  materials: { label: '材料', detailPath: '/detail/materials', data: MOCK_MATERIALS, progressField: 'collectedMaterials', valueKey: 'rarity' },
  food: { label: '料理', detailPath: '/detail/food', data: MOCK_RECIPES, progressField: 'collectedRecipes', valueKey: 'effect' },
};

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { progress, toggleFavorite, isFavorite } = useProgress();
  const [tab, setTab] = useState('all');

  const favoriteItems = useMemo(() => {
    return progress.favorites
      .map((f) => {
        const meta = CATEGORY_META[f.category];
        if (!meta) return null;
        const item = meta.data.find((d) => String(d.id) === f.id);
        if (!item) return null;
        return { category: f.category, item, meta };
      })
      .filter(Boolean) as { category: string; item: any; meta: any }[];
  }, [progress.favorites]);

  const filtered = useMemo(() => {
    if (tab === 'all') return favoriteItems;
    return favoriteItems.filter((f) => f.category === tab);
  }, [favoriteItems, tab]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="md:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="font-display text-[10px] tracking-[0.3em] text-accent/80">FAVORITES</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">我的收藏</h1>
        </div>
        <div className="ml-auto text-right">
          <div className="font-display text-xl font-bold tabular-nums">
            {favoriteItems.length}
          </div>
          <div className="text-xs text-muted-foreground">已收藏</div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList className="w-full overflow-x-auto flex">
          <TabsTrigger value="all">全部 ({favoriteItems.length})</TabsTrigger>
          {Object.keys(CATEGORY_META).map((key) => {
            const count = favoriteItems.filter((f) => f.category === key).length;
            if (count === 0) return null;
            return (
              <TabsTrigger key={key} value={key}>
                {CATEGORY_META[key].label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="mb-2">还没有收藏任何条目</p>
          <p className="text-sm mb-6">在条目详情页点击心形图标即可收藏</p>
          <Button variant="secondary" onClick={() => navigate('/category/weapons')}>
            去逛逛图鉴
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 md:gap-3">
          {filtered.map(({ category, item, meta }: any, i: number) => (
            <motion.div
              key={`${category}-${item.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
            >
              <Card
                className="cursor-pointer border-border/50 bg-card/50 hover:bg-card/80 hover:border-accent/40 transition-all group relative"
                onClick={() => navigate(`${meta.detailPath}/${item.id}`)}
              >
                <CardContent className="p-2.5 md:p-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(category, String(item.id));
                    }}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent z-10"
                    aria-label="取消收藏"
                  >
                    <Heart className="w-3 h-3 fill-current" />
                  </button>
                  <div className="aspect-square rounded-md bg-muted/30 flex items-center justify-center mb-2">
                    <FavoriteIcon category={category} />
                  </div>
                  <h3 className="text-xs md:text-sm font-medium truncate mb-0.5">{item.name}</h3>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <Badge variant="outline" className="text-[9px] h-4">
                      {meta.label}
                    </Badge>
                    {item[meta.valueKey] && (
                      <span className="font-display tabular-nums text-accent/80">
                        {item[meta.valueKey]}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="text-center text-xs text-muted-foreground mt-6">
          <BookOpen className="w-4 h-4 inline mr-1 opacity-50" />
          收藏数据保存在本地浏览器中
        </div>
      )}
    </div>
  );
}

function FavoriteIcon({ category }: { category: string }) {
  if (category === 'weapons') {
    return (
      <svg viewBox="0 0 40 40" className="w-9 h-9 text-primary/60">
        <path d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    );
  }
  if (category === 'armors') {
    return (
      <svg viewBox="0 0 40 40" className="w-9 h-9 text-accent/70">
        <path d="M12 8 L20 4 L28 8 L28 16 L32 22 L28 32 L20 36 L12 32 L8 22 L12 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (category === 'shrines') {
    return (
      <svg viewBox="0 0 40 40" className="w-9 h-9 text-primary/70">
        <path d="M20 6 L32 14 L32 26 L20 34 L8 26 L8 14 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 12 L20 28 M14 20 L26 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (category === 'monsters') {
    return (
      <svg viewBox="0 0 40 40" className="w-9 h-9 text-destructive/60">
        <circle cx="20" cy="18" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="16" r="1.5" fill="currentColor" />
        <circle cx="23" cy="16" r="1.5" fill="currentColor" />
        <path d="M14 28 Q20 32 26 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (category === 'materials') {
    return (
      <svg viewBox="0 0 40 40" className="w-9 h-9 text-accent/60">
        <path d="M20 8 L32 16 L32 28 L20 36 L8 28 L8 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="5" fill="currentColor" opacity="0.3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9 text-accent/70">
      <path d="M12 18 Q20 14 28 18 L28 26 Q20 30 12 26 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
