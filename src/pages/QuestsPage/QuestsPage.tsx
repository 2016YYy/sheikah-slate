import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Check, X, ArrowLeft, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MOCK_MAIN_QUESTS, MOCK_SHRINE_QUESTS, MOCK_SIDE_QUESTS } from '@/data/quests';
import { useProgress } from '@/hooks/use-progress';
import { cn } from '@/lib/utils';

type QuestTab = 'main' | 'shrine' | 'side';

export default function QuestsPage() {
  const navigate = useNavigate();
  const { isCollected, toggleItem, progress, loaded } = useProgress();

  const [tab, setTab] = useState<QuestTab>('main');
  const [keyword, setKeyword] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [regionFilter, setRegionFilter] = useState<string[]>([]);

  const { items, regions, progressField } = useMemo(() => {
    if (tab === 'main') {
      const regions = [...new Set(MOCK_MAIN_QUESTS.map((q) => q.region || '海拉鲁').filter(Boolean))];
      return { items: MOCK_MAIN_QUESTS, regions, progressField: 'completedMainQuests' };
    }
    if (tab === 'shrine') {
      const regions = [...new Set(MOCK_SHRINE_QUESTS.map((q) => q.region || '').filter(Boolean))];
      return { items: MOCK_SHRINE_QUESTS, regions, progressField: 'completedShrineQuests' };
    }
    const regions = [...new Set(MOCK_SIDE_QUESTS.map((q) => q.region || '').filter(Boolean))];
    return { items: MOCK_SIDE_QUESTS, regions, progressField: 'completedSideQuests' };
  }, [tab]);

  const filtered = useMemo(() => {
    let result = [...items];
    const kw = keyword.trim().toLowerCase();
    if (kw) {
      result = result.filter((q: any) =>
        q.name.toLowerCase().includes(kw) ||
        (q.description && q.description.toLowerCase().includes(kw)) ||
        (q.npc && q.npc.toLowerCase().includes(kw)),
      );
    }
    if (regionFilter.length > 0) {
      result = result.filter((q: any) => regionFilter.includes(q.region || '海拉鲁'));
    }
    if (filterTab === 'obtained') {
      result = result.filter((q: any) => isCollected(progressField as any, String(q.id)));
    }
    if (filterTab === 'remaining') {
      result = result.filter((q: any) => !isCollected(progressField as any, String(q.id)));
    }
    return result;
  }, [items, keyword, regionFilter, filterTab, progressField, isCollected]);

  const totalCount = items.length;
  const doneCount = (progress as any)[progressField]?.length || 0;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const toggleRegion = (region: string) => {
    setRegionFilter((prev) => (prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]));
  };

  const tabs = [
    { key: 'main', label: '主线', count: MOCK_MAIN_QUESTS.length },
    { key: 'shrine', label: '神庙挑战', count: MOCK_SHRINE_QUESTS.length },
    { key: 'side', label: '支线', count: MOCK_SIDE_QUESTS.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="md:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="font-display text-[10px] tracking-[0.3em] text-primary/70">QUESTS</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">任务攻略</h1>
        </div>
        <div className="ml-auto text-right">
          <div className="font-display text-xl font-bold tabular-nums">
            {loaded ? doneCount : '-'}
            <span className="text-muted-foreground text-sm font-normal">/{totalCount}</span>
          </div>
          <div className="text-xs text-muted-foreground">{pct}%</div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as QuestTab)} className="mb-4">
        <TabsList className="w-full grid grid-cols-3">
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label} ({t.count})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="搜索任务..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-9 bg-card/50"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label="清除"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {regions.length > 0 && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" className="shrink-0">
                <Filter className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-l-border">
              <SheetHeader>
                <SheetTitle className="font-display">筛选地区</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground mb-2 h-7" onClick={() => setRegionFilter([])}>
                  清除全部
                </Button>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-2 pr-4">
                    {regions.map((region) => (
                      <label key={region} className="flex items-center gap-2 cursor-pointer py-1">
                        <Checkbox checked={regionFilter.includes(region)} onCheckedChange={() => toggleRegion(region)} />
                        <span className="text-sm">{region}</span>
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
          <button
            key={t}
            onClick={() => setFilterTab(t)}
            className={cn(
              'px-3 py-1.5 text-xs rounded-md font-medium transition-colors',
              filterTab === t
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-card/50 text-muted-foreground border border-border/40 hover:text-foreground',
            )}
          >
            {t === 'all' ? '全部' : t === 'obtained' ? '已完成' : '未完成'}
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground mb-3 font-display">共 {filtered.length} 项</div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-2.5">
          {filtered.map((quest: any, i: number) => {
            const completed = isCollected(progressField as any, String(quest.id));
            return (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
              >
                <Card
                  className={cn(
                    'cursor-pointer border-border/50 bg-card/50 transition-all relative group',
                    completed ? 'border-success/30 bg-success/[0.04]' : 'hover:border-primary/40 hover:bg-card/80',
                  )}
                  onClick={() => navigate(`/quests/${quest.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItem(progressField as any, String(quest.id));
                        }}
                        className={cn(
                          'mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0',
                          completed
                            ? 'bg-success border-success text-success-foreground'
                            : 'border-border/60 hover:border-primary/60',
                        )}
                        aria-label={completed ? '取消完成' : '标记完成'}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn('font-medium text-sm', completed && 'text-muted-foreground line-through decoration-success/50')}>
                          {quest.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {quest.description || quest.hint || '—'}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {quest.region && (
                            <Badge variant="outline" className="text-[10px] h-4">
                              {quest.region}
                            </Badge>
                          )}
                          {quest.npc && (
                            <Badge variant="secondary" className="text-[10px] h-4">
                              {quest.npc}
                            </Badge>
                          )}
                          {quest.reward && (
                            <span className="text-[10px] text-accent/80">奖励：{quest.reward}</span>
                          )}
                        </div>
                      </div>
                      <ScrollText className="w-4 h-4 text-muted-foreground/50 mt-1 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <ScrollText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>没有找到匹配的任务</p>
        </div>
      )}
    </div>
  );
}
