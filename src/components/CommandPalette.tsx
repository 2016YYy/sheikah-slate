import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { Search, Sword, Shirt, Mountain, Skull, Sparkles, Flame, ScrollText, ArrowRight } from 'lucide-react';
import { MOCK_WEAPONS } from '@/data/weapons';
import { MOCK_ARMORS } from '@/data/armors';
import { MOCK_SHRINES } from '@/data/collect';
import { MOCK_MONSTERS } from '@/data/monsters';
import { MOCK_MATERIALS, MOCK_RECIPES } from '@/data/food';
import { MOCK_MAIN_QUESTS, MOCK_SHRINE_QUESTS, MOCK_SIDE_QUESTS } from '@/data/quests';

interface SearchItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  path: string;
  icon: typeof Sword;
}

const CATEGORY_META = {
  weapons: { label: '武器', icon: Sword, path: '/detail/weapons' },
  armors: { label: '防具', icon: Shirt, path: '/detail/armors' },
  shrines: { label: '神庙', icon: Mountain, path: '/detail/shrines' },
  monsters: { label: '怪物', icon: Skull, path: '/detail/monsters' },
  materials: { label: '材料', icon: Sparkles, path: '/detail/materials' },
  food: { label: '料理', icon: Flame, path: '/detail/food' },
  main: { label: '主线任务', icon: ScrollText, path: '/quests' },
  shrine_quest: { label: '神庙挑战', icon: ScrollText, path: '/quests' },
  side: { label: '支线任务', icon: ScrollText, path: '/quests' },
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // 构建搜索索引
  const searchIndex = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];
    MOCK_WEAPONS.forEach((w) =>
      items.push({
        id: `w-${w.id}`,
        name: w.name,
        category: 'weapons',
        categoryLabel: CATEGORY_META.weapons.label,
        path: `${CATEGORY_META.weapons.path}/${w.id}`,
        icon: CATEGORY_META.weapons.icon,
      }),
    );
    MOCK_ARMORS.forEach((a) =>
      items.push({
        id: `a-${a.id}`,
        name: a.name,
        category: 'armors',
        categoryLabel: CATEGORY_META.armors.label,
        path: `${CATEGORY_META.armors.path}/${a.id}`,
        icon: CATEGORY_META.armors.icon,
      }),
    );
    MOCK_SHRINES.forEach((s) =>
      items.push({
        id: `s-${s.id}`,
        name: s.name,
        category: 'shrines',
        categoryLabel: CATEGORY_META.shrines.label,
        path: `${CATEGORY_META.shrines.path}/${s.id}`,
        icon: CATEGORY_META.shrines.icon,
      }),
    );
    MOCK_MONSTERS.forEach((m) =>
      items.push({
        id: `m-${m.id}`,
        name: m.name,
        category: 'monsters',
        categoryLabel: CATEGORY_META.monsters.label,
        path: `${CATEGORY_META.monsters.path}/${m.id}`,
        icon: CATEGORY_META.monsters.icon,
      }),
    );
    MOCK_MATERIALS.forEach((mat) =>
      items.push({
        id: `mat-${mat.id}`,
        name: mat.name,
        category: 'materials',
        categoryLabel: CATEGORY_META.materials.label,
        path: `${CATEGORY_META.materials.path}/${mat.id}`,
        icon: CATEGORY_META.materials.icon,
      }),
    );
    MOCK_RECIPES.forEach((r) =>
      items.push({
        id: `r-${r.id}`,
        name: r.name,
        category: 'food',
        categoryLabel: CATEGORY_META.food.label,
        path: `${CATEGORY_META.food.path}/${r.id}`,
        icon: CATEGORY_META.food.icon,
      }),
    );
    MOCK_MAIN_QUESTS.forEach((q) =>
      items.push({
        id: `mq-${q.id}`,
        name: q.name,
        category: 'main',
        categoryLabel: CATEGORY_META.main.label,
        path: `${CATEGORY_META.main.path}/${q.id}`,
        icon: CATEGORY_META.main.icon,
      }),
    );
    MOCK_SHRINE_QUESTS.forEach((q) =>
      items.push({
        id: `sq-${q.id}`,
        name: q.name,
        category: 'shrine_quest',
        categoryLabel: CATEGORY_META.shrine_quest.label,
        path: `${CATEGORY_META.shrine_quest.path}/${q.id}`,
        icon: CATEGORY_META.shrine_quest.icon,
      }),
    );
    MOCK_SIDE_QUESTS.forEach((q) =>
      items.push({
        id: `side-${q.id}`,
        name: q.name,
        category: 'side',
        categoryLabel: CATEGORY_META.side.label,
        path: `${CATEGORY_META.side.path}/${q.id}`,
        icon: CATEGORY_META.side.icon,
      }),
    );
    return items;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 50);
    return searchIndex
      .filter((item) => item.name.toLowerCase().includes(q))
      .slice(0, 50);
  }, [query, searchIndex]);

  // 快捷键：Cmd/Ctrl + K，或监听自定义事件
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const openHandler = () => setOpen(true);
    window.addEventListener('keydown', handler);
    window.addEventListener('open-command-palette', openHandler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('open-command-palette', openHandler);
    };
  }, []);

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="全局搜索"
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <Command className="relative w-full max-w-xl bg-card border border-border/60 rounded-xl shadow-2xl sheikah-glow overflow-hidden">
        <div className="flex items-center border-b border-border/40 px-4">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="搜索武器、防具、神庙、任务、料理..."
            className="flex-1 bg-transparent border-0 outline-none px-3 py-3.5 text-sm placeholder:text-muted-foreground text-foreground"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/60 bg-muted/50 text-[10px] text-muted-foreground font-display">
            ESC
          </kbd>
        </div>
        <Command.List className="max-h-[50vh] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
            没有找到匹配的结果
          </Command.Empty>
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <Command.Item
                key={item.id}
                value={`${item.name} ${item.categoryLabel}`}
                onSelect={() => handleSelect(item.path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-primary/70" />
                </div>
                <span className="flex-1 truncate">{item.name}</span>
                <span className="text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                  {item.categoryLabel}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
              </Command.Item>
            );
          })}
        </Command.List>
        <div className="flex items-center justify-between border-t border-border/40 px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-border/60 bg-muted/50 font-display">↑</kbd>
              <kbd className="px-1 py-0.5 rounded border border-border/60 bg-muted/50 font-display">↓</kbd>
              导航
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-border/60 bg-muted/50 font-display">↵</kbd>
              选择
            </span>
          </span>
          <span>共 {searchIndex.length} 条数据</span>
        </div>
      </Command>
    </Command.Dialog>
  );
}
