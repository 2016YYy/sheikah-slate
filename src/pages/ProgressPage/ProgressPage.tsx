import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Map, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MOCK_WEAPONS } from '@/data/weapons';
import { MOCK_ARMORS } from '@/data/armors';
import { MOCK_SHRINES, MOCK_TOWERS, MOCK_MEMORIES } from '@/data/collect';
import { MOCK_MAIN_QUESTS, MOCK_SHRINE_QUESTS, MOCK_SIDE_QUESTS } from '@/data/quests';
import { MOCK_MONSTERS } from '@/data/monsters';
import { useProgress } from '@/hooks/use-progress';

const TOTAL_KOROK = 900;

export default function ProgressPage() {
  const navigate = useNavigate();
  const { progress } = useProgress();

  const sections = [
    {
      key: 'shrine',
      label: '神庙',
      icon: '◈',
      done: progress.completedShrines.length,
      total: MOCK_SHRINES.length,
      color: 'text-primary',
      detail: `${progress.completedShrines.length}/${MOCK_SHRINES.length}`,
    },
    {
      key: 'tower',
      label: '高塔',
      icon: '▲',
      done: progress.completedTowers.length,
      total: MOCK_TOWERS.length,
      color: 'text-accent',
      detail: `${progress.completedTowers.length}/${MOCK_TOWERS.length}`,
    },
    {
      key: 'memory',
      label: '回忆',
      icon: '✦',
      done: progress.unlockedMemories.length,
      total: MOCK_MEMORIES.length,
      color: 'text-warning',
      detail: `${progress.unlockedMemories.length}/${MOCK_MEMORIES.length}`,
    },
    {
      key: 'weapon',
      label: '武器',
      icon: '⚔',
      done: progress.collectedWeapons.length,
      total: MOCK_WEAPONS.length,
      color: 'text-primary',
      detail: `${progress.collectedWeapons.length}/${MOCK_WEAPONS.length}`,
    },
    {
      key: 'armor',
      label: '防具',
      icon: '🛡',
      done: progress.collectedArmors.length,
      total: MOCK_ARMORS.length,
      color: 'text-accent',
      detail: `${progress.collectedArmors.length}/${MOCK_ARMORS.length}`,
    },
    {
      key: 'monster',
      label: '怪物图鉴',
      icon: '☠',
      done: progress.defeatedMonsters.length,
      total: MOCK_MONSTERS.length,
      color: 'text-destructive',
      detail: `${progress.defeatedMonsters.length}/${MOCK_MONSTERS.length}`,
    },
    {
      key: 'main',
      label: '主线任务',
      icon: '★',
      done: progress.completedMainQuests.length,
      total: MOCK_MAIN_QUESTS.length,
      color: 'text-warning',
      detail: `${progress.completedMainQuests.length}/${MOCK_MAIN_QUESTS.length}`,
    },
    {
      key: 'shrineQuest',
      label: '神庙挑战',
      icon: '◆',
      done: progress.completedShrineQuests.length,
      total: MOCK_SHRINE_QUESTS.length,
      color: 'text-primary',
      detail: `${progress.completedShrineQuests.length}/${MOCK_SHRINE_QUESTS.length}`,
    },
    {
      key: 'side',
      label: '支线任务',
      icon: '●',
      done: progress.completedSideQuests.length,
      total: MOCK_SIDE_QUESTS.length,
      color: 'text-success',
      detail: `${progress.completedSideQuests.length}/${MOCK_SIDE_QUESTS.length}`,
    },
    {
      key: 'korok',
      label: '克洛格',
      icon: '🍃',
      done: progress.korokCount,
      total: TOTAL_KOROK,
      color: 'text-success',
      detail: `${progress.korokCount}/${TOTAL_KOROK}`,
    },
  ];

  const totalDone = sections.reduce((acc, s) => acc + s.done, 0);
  const totalAll = sections.reduce((acc, s) => acc + s.total, 0);
  const overallPct = Math.round((totalDone / totalAll) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <header className="mb-6">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground text-sm mb-3 inline-flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <Map className="w-6 h-6 text-primary" /> 收集进度
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">勇者之路，一步一个脚印。</p>
      </header>

      <Card className="border-border/60 bg-card/50 sheikah-glow mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(195 12% 22%)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="42" fill="none" stroke="hsl(185 85% 55%)" strokeWidth="10"
                  strokeLinecap="round" strokeDasharray={`${overallPct * 2.638} 264`}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.5))' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-primary">{overallPct}%</div>
                  <div className="text-[10px] text-muted-foreground">总进度</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold mb-1">海拉鲁探索完成度</h2>
              <p className="text-sm text-muted-foreground">已记录 {totalDone} / {totalAll} 项收集与任务</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="success">已完成 {totalDone}</Badge>
                <Badge variant="outline">剩余 {totalAll - totalDone}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {sections.map((s, i) => {
          const pct = Math.round((s.done / s.total) * 100);
          const complete = s.done >= s.total;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Card className={cn('border-border/60 bg-card/50', complete && 'border-success/40 bg-success/5')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className={cn('w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm', s.color)}>{s.icon}</span>
                    <span className="font-medium text-sm text-foreground flex-1">{s.label}</span>
                    {complete ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={pct} className="h-2 flex-1" />
                    <span className="font-display text-xs tabular-nums text-muted-foreground">{s.detail}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
