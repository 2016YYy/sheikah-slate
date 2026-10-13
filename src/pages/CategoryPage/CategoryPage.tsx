import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MOCK_WEAPONS, Weapon } from '@/data/weapons';
import { MOCK_ARMORS, Armor } from '@/data/armors';
import { MOCK_MONSTERS, Monster } from '@/data/monsters';
import { MOCK_RECIPES, Recipe, MOCK_MATERIALS, Material } from '@/data/food';
import { MOCK_SHRINES, Shrine } from '@/data/collect';
import { useProgress } from '@/hooks/use-progress';

const CATEGORY_META: Record<string, { title: string; description: string; tabs: string[]; filters: string[] | null }> = {
  weapons: {
    title: '武器图鉴',
    description: '海拉鲁大陆上的武器、弓与盾，记录它们的攻击力、耐久与特殊能力。',
    tabs: ['全部', '近战武器', '弓', '盾'],
    filters: ['全部', '剑', '枪', '斧', '大剑', '杖', '盾', '弓'],
  },
  armors: {
    title: '防具图鉴',
    description: '从古代勇者之服到各类头饰，探索每一件防具的防御力与套装效果。',
    tabs: ['全部', '头部', '上身', '下身', '套装'],
    filters: ['全部', '基础', '套装', '古代', '耐火', '耐寒', '潜行', '游泳', '其他'],
  },
  monsters: {
    title: '怪物图鉴',
    description: '海拉鲁大地上的魔物图鉴，记录生命值、掉落物与弱点。',
    tabs: ['全部', '波克布林', '蜥蜴战士', '莫力布林', '守护者', '人马', '其他'],
    filters: null,
  },
  food: {
    title: '料理食谱',
    description: '海拉鲁的料理配方，记录回复效果与特殊加成。',
    tabs: ['全部', '回复', '攻击', '防御', '速度', '耐性'],
    filters: ['全部', '回复', '攻击加成', '防御加成', '速度加成', '耐寒', '耐热', '耐电'],
  },
  materials: {
    title: '材料图鉴',
    description: '烹饪、强化与炼金所需的各类材料，记录来源与用途。',
    tabs: ['全部', '食材', '素材', '矿物', '昆虫', '蘑菇'],
    filters: null,
  },
  shrines: {
    title: '神庙探索',
    description: '海拉鲁全境 120 座神庙，记录试炼类型与所在地区。',
    tabs: ['全部', '已完成', '未完成'],
    filters: ['全部', '战斗试炼', '力之试炼', '祝福', '解谜', '其他'],
  },
};

type Item = { id: string; name: string; type?: string; region?: string; category?: string; effect?: string; description?: string };

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [tab, setTab] = useState('全部');
  const [filter, setFilter] = useState('全部');
  const [query, setQuery] = useState('');

  const meta = CATEGORY_META[category || ''];

  useEffect(() => {
    setTab('全部');
    setFilter('全部');
    setQuery('');
  }, [category]);

  const { items, total } = useMemo(() => {
    if (!category || !meta) return { items: [] as Item[], total: 0 };

    let list: Item[] = [];
    switch (category) {
      case 'weapons':
        list = MOCK_WEAPONS.map((w: Weapon) => ({
          id: w.id, name: w.name, type: w.subType || w.type, category: w.type,
          effect: w.special, description: `${w.atk} 攻击 · ${w.durability} 耐久`,
        }));
        break;
      case 'armors':
        list = MOCK_ARMORS.map((a: Armor) => ({
          id: a.id, name: a.name, type: a.slot, category: a.series || '基础',
          effect: a.effect, description: `${a.def} 防御`,
        }));
        break;
      case 'monsters':
        list = MOCK_MONSTERS.map((m: Monster) => ({
          id: m.id, name: m.name, type: m.kind, category: m.kind,
          effect: m.drop, description: `${m.hp} HP`,
        }));
        break;
      case 'food':
        list = MOCK_RECIPES.map((r: Recipe) => ({
          id: r.id, name: r.name, type: r.effect, category: r.effect,
          effect: r.effect, description: r.hearts ? `回复 ${r.hearts}` : r.bonus || '',
        }));
        break;
      case 'materials':
        list = MOCK_MATERIALS.map((m: Material) => ({
          id: m.id, name: m.name, type: m.kind, category: m.kind,
          effect: m.usage, description: m.source || '',
        }));
        break;
      case 'shrines':
        list = MOCK_SHRINES.map((s: Shrine) => ({
          id: s.id, name: s.name, type: s.trialType, category: s.trialType,
          effect: '', description: s.region,
        }));
        break;
    }

    if (tab !== '全部') {
      if (category === 'weapons') list = list.filter((i) => i.type === tab);
      else if (category === 'armors') list = list.filter((i) => (tab === '套装' ? i.category === '套装' : i.type === tab));
      else if (category === 'shrines') {
        list = list.filter((i) =>
          tab === '已完成'
            ? progress.completedShrines.includes(i.id)
            : tab === '未完成'
              ? !progress.completedShrines.includes(i.id)
              : true,
        );
      } else list = list.filter((i) => i.type === tab);
    }
    if (filter !== '全部') list = list.filter((i) => i.category === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q));
    }

    return { items: list, total: list.length };
  }, [category, tab, filter, query, progress, meta]);

  if (!category || !meta) {
    return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-muted-foreground">未知分类，勇者请返回。</div>;
  }

  const doneCount = (() => {
    if (category === 'weapons') return progress.collectedWeapons.length;
    if (category === 'armors') return progress.collectedArmors.length;
    if (category === 'shrines') return progress.completedShrines.length;
    return 0;
  })();

  const isCheckable = category === 'weapons' || category === 'armors' || category === 'shrines';

  const checkState = (item: Item): 'done' | 'todo' => {
    if (category === 'weapons') return progress.collectedWeapons.includes(item.id) ? 'done' : 'todo';
    if (category === 'armors') return progress.collectedArmors.includes(item.id) ? 'done' : 'todo';
    if (category === 'shrines') return progress.completedShrines.includes(item.id) ? 'done' : 'todo';
    return 'todo';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <header className="mb-6">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground text-sm mb-3 inline-flex items-center gap-1 transition-colors">
          <span aria-hidden>←</span> 返回
        </button>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{meta.title}</h1>
        <p className="text-muted-foreground text-sm mt-1.5 max-w-2xl">{meta.description}</p>
        {isCheckable && (
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="success" className="font-display">已获 {doneCount}</Badge>
            <Badge variant="outline" className="font-display">未获 {total - doneCount}</Badge>
          </div>
        )}
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索图鉴…"
          className="pl-9 bg-card/50 border-border/60 focus-visible:ring-primary/40"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {meta.tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all border',
              tab === t
                ? 'bg-primary/15 text-primary border-primary/40 font-medium'
                : 'text-muted-foreground border-border/50 hover:text-foreground hover:border-primary/25',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {meta.filters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {meta.filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs transition-all border',
                filter === f
                  ? 'bg-accent/15 text-accent border-accent/40'
                  : 'text-muted-foreground border-border/50 hover:text-foreground',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {items.map((item, i) => {
          const state = isCheckable ? checkState(item) : null;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
            >
              <button
                onClick={() => navigate(`/category/${category}/${item.id}`)}
                className={cn(
                  'w-full text-left rounded-xl border p-3.5 transition-all group relative',
                  state === 'done'
                    ? 'border-success/40 bg-success/5 hover:bg-success/10'
                    : 'border-border/60 bg-card/50 hover:bg-card/80 hover:border-primary/40',
                )}
              >
                {state === 'done' && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success text-xs">✓</span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <SheikahGlyph />
                  </div>
                  {item.type && <Badge variant="secondary" className="text-[10px] px-1.5">{item.type}</Badge>}
                </div>
                <h3 className="font-medium text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">{item.name}</h3>
                {item.description && (
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{item.description}</p>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">没有找到匹配的图鉴条目，勇者换个关键词试试。</div>
      )}
    </div>
  );
}

function SheikahGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path d="M12 2L22 7v10L12 22 2 17V7L12 2z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}
