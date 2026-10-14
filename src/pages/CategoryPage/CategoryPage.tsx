import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Check, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MOCK_WEAPONS } from '@/data/weapons';
import { MOCK_ARMORS } from '@/data/armors';
import { MOCK_SHRINES, MOCK_TOWERS, MOCK_MEMORIES } from '@/data/collect';
import { MOCK_MONSTERS } from '@/data/monsters';
import { MOCK_MATERIALS, MOCK_RECIPES } from '@/data/food';
import { useProgress } from '@/hooks/use-progress';
import { cn } from '@/lib/utils';

type CategoryKey = 'weapons' | 'armors' | 'shrines' | 'monsters' | 'materials' | 'food';

const CATEGORY_CONFIG: Record<
  CategoryKey,
  { title: string; subtitle: string; progressField: string; detailPath: string }
> = {
  weapons: { title: '武器图鉴', subtitle: 'WEAPONS', progressField: 'collectedWeapons', detailPath: '/detail/weapons' },
  armors: { title: '防具图鉴', subtitle: 'ARMORS', progressField: 'collectedArmors', detailPath: '/detail/armors' },
  shrines: { title: '神庙探索', subtitle: 'SHRINES & TOWERS', progressField: 'completedShrines', detailPath: '/detail/shrines' },
  monsters: { title: '怪物图鉴', subtitle: 'MONSTERS', progressField: 'defeatedMonsters', detailPath: '/detail/monsters' },
  materials: { title: '材料图鉴', subtitle: 'MATERIALS', progressField: 'collectedMaterials', detailPath: '/detail/materials' },
  food: { title: '料理食谱', subtitle: 'RECIPES', progressField: 'collectedRecipes', detailPath: '/detail/food' },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const cat = (category || 'weapons') as CategoryKey;
  const config = CATEGORY_CONFIG[cat];
  const { isCollected, toggleItem, progress, loaded } = useProgress();

  const [keyword, setKeyword] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // all / obtained / remaining
  const [subTab, setSubTab] = useState(getDefaultSubTab(cat));
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const { items, typeOptions, primaryField } = useMemo(() => {
    if (cat === 'weapons') {
      const types = [...new Set(MOCK_WEAPONS.map((w) => w.type))];
      return { items: MOCK_WEAPONS, typeOptions: types, primaryField: 'type' };
    }
    if (cat === 'armors') {
      const sets = [...new Set(MOCK_ARMORS.map((a) => a.set))];
      return { items: MOCK_ARMORS, typeOptions: sets, primaryField: 'set' };
    }
    if (cat === 'shrines') {
      if (subTab === 'shrines') {
        const regions = [...new Set(MOCK_SHRINES.map((s) => s.region))];
        return { items: MOCK_SHRINES, typeOptions: regions, primaryField: 'region' };
      }
      if (subTab === 'towers') {
        const regions = [...new Set(MOCK_TOWERS.map((t) => t.region))];
        return { items: MOCK_TOWERS, typeOptions: regions, primaryField: 'region' };
      }
      if (subTab === 'memories') {
        return { items: MOCK_MEMORIES, typeOptions: [], primaryField: 'name' };
      }
      return { items: [], typeOptions: [], primaryField: '' };
    }
    if (cat === 'monsters') {
      const types = [...new Set(MOCK_MONSTERS.map((m) => m.type))];
      return { items: MOCK_MONSTERS, typeOptions: types, primaryField: 'type' };
    }
    if (cat === 'materials') {
      const types = [...new Set(MOCK_MATERIALS.map((m) => m.type))];
      return { items: MOCK_MATERIALS, typeOptions: types, primaryField: 'type' };
    }
    if (cat === 'food') {
      const types = [...new Set(MOCK_RECIPES.map((r) => r.type))];
      return { items: MOCK_RECIPES, typeOptions: types, primaryField: 'type' };
    }
    return { items: [], typeOptions: [], primaryField: '' };
  }, [cat, subTab]);

  const filtered = useMemo(() => {
    let result = [...items];
    const kw = keyword.trim().toLowerCase();
    if (kw) {
      result = result.filter((item: any) =>
        item.name.toLowerCase().includes(kw) ||
        (item.type && item.type.toLowerCase().includes(kw)) ||
        (item.set && item.set.toLowerCase().includes(kw)) ||
        (item.region && item.region.toLowerCase().includes(kw)),
      );
    }
    if (typeFilter.length > 0) {
      result = result.filter((item: any) => {
        const val = primaryField === 'set' ? item.set : item.type || item.region;
        return typeFilter.includes(val);
      });
    }
    if (filterTab === 'obtained') {
      const field = getProgressField(cat, subTab);
      result = result.filter((item: any) => isCollected(field as any, String(item.id)));
    }
    if (filterTab === 'remaining') {
      const field = getProgressField(cat, subTab);
      result = result.filter((item: any) => !isCollected(field as any, String(item.id)));
    }
    return result;
  }, [items, keyword, typeFilter, filterTab, cat, subTab, isCollected, primaryField]);

  const progressField = getProgressField(cat, subTab);
  const progressArr = (progress as any)[progressField] as string[];
  const totalCount = items.length;
  const doneCount = progressArr.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const toggleType = (type: string) => {
    setTypeFilter((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="md:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="font-display text-[10px] tracking-[0.3em] text-primary/70">{config.subtitle}</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">{config.title}</h1>
        </div>
        <div className="ml-auto text-right">
          <div className="font-display text-xl font-bold tabular-nums">
            {loaded ? doneCount : '-'}
            <span className="text-muted-foreground text-sm font-normal">/{totalCount}</span>
          </div>
          <div className="text-xs text-muted-foreground">收集进度 {pct}%</div>
        </div>
      </div>

      {cat === 'shrines' && (
        <Tabs value={subTab} onValueChange={setSubTab} className="mb-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="shrines">神庙 ({MOCK_SHRINES.length})</TabsTrigger>
            <TabsTrigger value="towers">高塔 ({MOCK_TOWERS.length})</TabsTrigger>
            <TabsTrigger value="memories">回忆 ({MOCK_MEMORIES.length})</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input type="search" placeholder={`搜索${config.title}...`} value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-9 bg-card/50" />
          {keyword && (
            <button onClick={() => setKeyword('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground" aria-label="清除">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {typeOptions.length > 0 && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" className="shrink-0">
                <Filter className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-l-border">
              <SheetHeader>
                <SheetTitle className="font-display">筛选分类</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground mb-2 h-7" onClick={() => setTypeFilter([])}>
                  清除全部
                </Button>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-2 pr-4">
                    {typeOptions.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer py-1">
                        <Checkbox checked={typeFilter.includes(type)} onCheckedChange={() => toggleType(type)} />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="flex items-center gap-1 mb-4">
        {['all', 'obtained', 'remaining'].map((t) => (
          <button key={t} onClick={() => setFilterTab(t)} className={cn('px-3 py-1.5 text-xs rounded-md font-medium transition-colors', filterTab === t ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-card/50 text-muted-foreground border border-border/40 hover:text-foreground')}>
            {t === 'all' ? '全部' : t === 'obtained' ? '已获' : '未获'}
          </button>
        ))}
        {typeFilter.length > 0 && (
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <span>{typeFilter.length} 个筛选</span>
            <button onClick={() => setTypeFilter([])} className="text-primary hover:underline">清除</button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground mb-3 font-display">共 {filtered.length} 项</div>

      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 md:gap-3">
          {filtered.map((item: any, i: number) => {
            const collected = isCollected(progressField as any, String(item.id));
            const typeLabel = item.type || item.set || item.region || '';
            const statValue = getStatValue(item, cat, subTab);

            return (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2, delay: Math.min(i * 0.01, 0.3) }} whileHover={{ y: -2, transition: { duration: 0.15 } }}>
                <Card className={cn('cursor-pointer border-border/50 bg-card/50 overflow-hidden transition-all relative group', collected ? 'border-success/30 bg-success/[0.04]' : 'hover:border-primary/40 hover:bg-card/80')} onClick={() => navigate(`${config.detailPath}/${item.id}`)}>
                  <CardContent className="p-2.5 md:p-3">
                    <button onClick={(e) => { e.stopPropagation(); toggleItem(progressField as any, String(item.id)); }} className={cn('absolute top-1.5 right-1.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all z-10', collected ? 'bg-success border-success text-success-foreground' : 'border-border/60 bg-card/80 opacity-0 group-hover:opacity-100 hover:border-primary/60')} aria-label={collected ? '取消收集' : '标记收集'}>
                      <Check className="w-3 h-3" />
                    </button>
                    <div className="aspect-square rounded-md bg-muted/30 flex items-center justify-center mb-2 relative overflow-hidden">
                      <ItemIcon item={item} category={cat} />
                      {collected && (
                        <div className="absolute inset-0 bg-success/10 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-success/20 border border-success/50 flex items-center justify-center">
                            <Check className="w-4 h-4 text-success" />
                          </div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xs md:text-sm font-medium truncate mb-0.5">{item.name}</h3>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="truncate">{typeLabel}</span>
                      {statValue && <span className="font-display tabular-nums shrink-0 ml-1 text-primary/80">{statValue}</span>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>没有找到匹配的结果</p>
        </div>
      )}
    </div>
  );
}

function getDefaultSubTab(cat: CategoryKey): string {
  if (cat === 'shrines') return 'shrines';
  return '';
}

function getProgressField(cat: CategoryKey, subTab: string): string {
  if (cat === 'shrines') {
    if (subTab === 'towers') return 'completedTowers';
    if (subTab === 'memories') return 'unlockedMemories';
    return 'completedShrines';
  }
  return CATEGORY_CONFIG[cat].progressField;
}

function getStatValue(item: any, cat: CategoryKey, subTab: string): string | number | null {
  if (cat === 'weapons') return item.atk ?? item.guard ?? null;
  if (cat === 'armors') return item.def ? `${item.def}防` : null;
  if (cat === 'shrines' && subTab === 'shrines') return item.trial ?? null;
  if (cat === 'monsters') return item.hp ?? null;
  if (cat === 'materials') return item.rarity ?? null;
  if (cat === 'food') return null;
  return null;
}

function ItemIcon({ item, category }: { item: any; category: CategoryKey }) {
  if (category === 'weapons') {
    return (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-primary/60">
        <path d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    );
  }
  if (category === 'armors') {
    return (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-accent/70">
        <path d="M12 8 L20 4 L28 8 L28 16 L32 22 L28 32 L20 36 L12 32 L8 22 L12 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.4" />
      </svg>
    );
  }
  if (category === 'shrines') {
    return (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-primary/70">
        <path d="M20 6 L32 14 L32 26 L20 34 L8 26 L8 14 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 12 L20 28 M14 20 L26 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (category === 'monsters') {
    return (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-destructive/60">
        <circle cx="20" cy="18" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="16" r="1.5" fill="currentColor" />
        <circle cx="23" cy="16" r="1.5" fill="currentColor" />
        <path d="M14 28 Q20 32 26 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (category === 'materials') {
    return (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-accent/60">
        <path d="M20 8 L32 16 L32 28 L20 36 L8 28 L8 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="5" fill="currentColor" opacity="0.3" />
      </svg>
    );
  }
  if (category === 'food') {
    return (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-accent/70">
        <path d="M12 18 Q20 14 28 18 L28 26 Q20 30 12 26 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 18 L16 26 M24 18 L24 26" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <path d="M20 10 Q22 13 20 16 Q18 13 20 10" fill="currentColor" opacity="0.5" />
      </svg>
    );
  }
  return null;
}