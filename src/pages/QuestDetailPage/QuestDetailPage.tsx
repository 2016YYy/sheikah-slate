import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plus, ScrollText, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MOCK_MAIN_QUESTS, MOCK_SHRINE_QUESTS, MOCK_SIDE_QUESTS, Quest } from '@/data/quests';
import { useProgress } from '@/hooks/use-progress';

export default function QuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { progress, toggleQuest } = useProgress();

  const quest = useMemo(() => {
    if (!id) return null;
    return [...MOCK_MAIN_QUESTS, ...MOCK_SHRINE_QUESTS, ...MOCK_SIDE_QUESTS].find((q: Quest) => q.id === id) || null;
  }, [id]);

  if (!quest) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">没有找到这个任务，勇者可能记错了。</p>
        <Button variant="outline" onClick={() => navigate('/quests')}>返回任务</Button>
      </div>
    );
  }

  const any = quest as any;
  const done = progress.completedMainQuests.includes(quest.id) || progress.completedShrineQuests.includes(quest.id) || progress.completedSideQuests.includes(quest.id);
  const section = MOCK_MAIN_QUESTS.includes(quest) ? '主线' : MOCK_SHRINE_QUESTS.includes(quest) ? '神庙挑战' : '支线';

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground text-sm mb-4 inline-flex items-center gap-1.5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 任务攻略
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-start gap-3 mb-5">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', done ? 'bg-success/20 text-success' : 'bg-primary/10 text-primary')}>
            {done ? <Check className="w-6 h-6" /> : <ScrollText className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground leading-tight">{quest.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant={section === '主线' ? 'default' : section === '神庙挑战' ? 'success' : 'outline'}>{section}</Badge>
              {any.giver && (
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <User className="w-3 h-3" /> {any.giver}
                </span>
              )}
              {any.location && (
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {any.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {any.objective && (
          <div className="rounded-lg border border-border/40 bg-card/40 p-4 mb-4">
            <h3 className="text-sm font-semibold text-primary mb-2">任务目标</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{any.objective}</p>
          </div>
        )}

        {any.hint && (
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 mb-4">
            <h3 className="text-sm font-semibold text-accent mb-2">攻略提示</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{any.hint}</p>
          </div>
        )}

        {any.reward && (
          <div className="rounded-lg border border-border/40 bg-card/40 p-4 mb-6">
            <h3 className="text-sm font-semibold text-primary mb-2">任务奖励</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{any.reward}</p>
          </div>
        )}

        <Button
          variant={done ? 'default' : 'outline'}
          className={cn('w-full', done && 'bg-success hover:bg-success/90 text-success-foreground')}
          onClick={() => toggleQuest(quest.id)}
        >
          {done ? <><Check className="w-4 h-4" /> 已完成</> : <><Plus className="w-4 h-4" /> 标记完成</>}
        </Button>
      </motion.div>
    </div>
  );
}
