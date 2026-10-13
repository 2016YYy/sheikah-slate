import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ScrollText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MOCK_MAIN_QUESTS, MOCK_SHRINE_QUESTS, MOCK_SIDE_QUESTS, Quest } from '@/data/quests';
import { useProgress } from '@/hooks/use-progress';

const SECTIONS = [
  { key: 'main', label: '主线任务', data: MOCK_MAIN_QUESTS },
  { key: 'shrine', label: '神庙挑战', data: MOCK_SHRINE_QUESTS },
  { key: 'side', label: '支线任务', data: MOCK_SIDE_QUESTS },
];

export default function QuestsPage() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [query, setQuery] = useState('');
  const [onlyTodo, setOnlyTodo] = useState(false);

  const isDone = (q: Quest) => progress.completedMainQuests.includes(q.id) || progress.completedShrineQuests.includes(q.id) || progress.completedSideQuests.includes(q.id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SECTIONS.map((s) => ({
      ...s,
      items: s.data.filter((item: Quest) => {
        if (onlyTodo && isDone(item)) return false;
        if (q && !(item.title.toLowerCase().includes(q) || (item.giver || '').toLowerCase().includes(q) || (item.location || '').toLowerCase().includes(q))) return false;
        return true;
      }),
    }));
  }, [query, onlyTodo, progress]);

  const totalAll = SECTIONS.reduce((acc, s) => acc + s.data.length, 0);
  const doneAll = SECTIONS.reduce((acc, s) => acc + s.data.filter((item: Quest) => isDone(item)).length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <header className="mb-6">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground text-sm mb-3 inline-flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">任务攻略</h1>
          <Badge variant="outline" className="font-display">{doneAll}/{totalAll} 已完成</Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-1.5">海拉鲁的勇者之路，从这些委托开始。</p>
      </header>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索任务、委托人或地点…"
            className="pl-9 bg-card/50 border-border/60"
          />
        </div>
        <button
          onClick={() => setOnlyTodo(!onlyTodo)}
          className={cn(
            'px-4 py-2 rounded-lg border text-sm transition-all whitespace-nowrap',
            onlyTodo ? 'bg-primary/15 text-primary border-primary/40' : 'text-muted-foreground border-border/50 hover:text-foreground',
          )}
        >
          {onlyTodo ? '✓ 只看未完成' : '只看未完成'}
        </button>
      </div>

      <div className="space-y-8">
        {filtered.map((section) => (
          <section key={section.key}>
            <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-primary" /> {section.label}
              <span className="text-xs text-muted-foreground font-normal">{section.items.length}</span>
            </h2>
            <div className="grid gap-2.5">
              {section.items.map((q: Quest, i: number) => {
                const done = isDone(q);
                return (
                  <motion.button
                    key={q.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                    onClick={() => navigate(`/quests/${q.id}`)}
                    className={cn(
                      'flex items-center gap-3 text-left rounded-xl border p-4 transition-all group',
                      done ? 'border-success/40 bg-success/5' : 'border-border/60 bg-card/50 hover:bg-card/80 hover:border-primary/40',
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', done ? 'bg-success/20 text-success' : 'bg-primary/10 text-primary')}>
                      {done ? '✓' : '✦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{q.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                        {q.giver && <span>{q.giver}</span>}
                        {q.location && <span>· {q.location}</span>}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{section.label.replace('任务', '')}</Badge>
                  </motion.button>
                );
              })}
              {section.items.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">没有匹配的任务。</p>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
