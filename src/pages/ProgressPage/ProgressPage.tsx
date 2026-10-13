import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Map, Sword, Shirt, Mountain, Flame, Skull, ScrollText, RotateCcw, Minus, Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { MOCK_WEAPONS } from '@/data/weapons';
import { MOCK_ARMORS } from '@/data/armors';
import { MOCK_SHRINES, MOCK_TOWERS, MOCK_MEMORIES } from '@/data/collect';
import { MOCK_MAIN_QUESTS, MOCK_SHRINE_QUESTS, MOCK_SIDE_QUESTS } from '@/data/quests';
import { MOCK_MONSTERS } from '@/data/monsters';
import { MOCK_MATERIALS, MOCK_RECIPES } from '@/data/food';
import { useProgress } from '@/hooks/use-progress';
import { cn } from '@/lib/utils';

export default function ProgressPage() {
  const navigate = useNavigate();
  const { progress, resetAll, setKorokCount, loaded } = useProgress();
  const [onlyRemaining, setOnlyRemaining] = useState(false);

  const categories = useMemo(() => {
    return [
      {
        key: 'weapons',
        label: '武器',
        icon: Sword,
        current: progress.collectedWeapons.length,
        total: MOCK_WEAPONS.length,
        path: '/category/weapons',
      },
      {
        key: 'armors',
        label: '防具',
        icon: Shirt,
        current: progress.collectedArmors.length,
        total: MOCK_ARMORS.length,
        path: '/category/armors',
      },
      {
        key: 'shrines',
        label: '神庙',
        icon: Mountain,
        current: progress.completedShrines.length,
        total: MOCK_SHRINES.length,
        path: '/category/shrines',
      },
      {
        key: 'towers',
        label: '高塔',
        icon: Map,
        current: progress.completedTowers.length,
        total: MOCK_TOWERS.length,
        path: '/category/shrines',
      },
      {
        key: 'memories',
        label: '回忆',
        icon: ScrollText,
        current: progress.unlockedMemories.length,
        total: MOCK_MEMORIES.length,
        path: '/category/shrines',
      },
      {
        key: 'monsters',
        label: '怪物',
        icon: Skull,
        current: progress.defeatedMonsters.length,
        total: MOCK_MONSTERS.length,
        path: '/category/monsters',
      },
      {
        key: 'materials',
        label: '材料',
        icon: ScrollText,
        current: progress.collectedMaterials.length,
        total: MOCK_MATERIALS.length,
        path: '/category/materials',
      },
      {
        key: 'food',
        label: '料理',
        icon: Flame,
        current: progress.collectedRecipes.length,
        total: MOCK_RECIPES.length,
        path: '/category/food',
      },
    ];
  }, [progress]);

  const questCategories = useMemo(() => {
    return [
      {
        key: 'main',
        label: '主线任务',
        current: progress.completedMainQuests.length,
        total: MOCK_MAIN_QUESTS.length,
      },
      {
        key: 'shrine',
        label: '神庙挑战',
        current: progress.completedShrineQuests.length,
        total: MOCK_SHRINE_QUESTS.length,
      },
      {
        key: 'side',
        label: '支线任务',
        current: progress.completedSideQuests.length,
        total: MOCK_SIDE_QUESTS.length,
      },
    ];
  }, [progress]);

  const totalDone = useMemo(() => {
    return (
      progress.collectedWeapons.length +
      progress.collectedArmors.length +
      progress.completedShrines.length +
      progress.completedTowers.length +
      progress.unlockedMemories.length +
      progress.defeatedMonsters.length +
      progress.collectedMaterials.length +
      progress.collectedRecipes.length +
      progress.completedMainQuests.length +
      progress.completedShrineQuests.length +
      progress.completedSideQuests.length +
      progress.korokCount
    );
  }, [progress]);

  const totalPossible = useMemo(() => {
    return (
      MOCK_WEAPONS.length +
      MOCK_ARMORS.length +
      MOCK_SHRINES.length +
      MOCK_TOWERS.length +
      MOCK_MEMORIES.length +
      MOCK_MONSTERS.length +
      MOCK_MATERIALS.length +
      MOCK_RECIPES.length +
      MOCK_MAIN_QUESTS.length +
      MOCK_SHRINE_QUESTS.length +
      MOCK_SIDE_QUESTS.length +
      900
    );
  }, []);

  const overallPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-display text-[10px] tracking-[0.3em] text-primary/70">PROGRESS</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">收集进度</h1>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <RotateCcw className="w-4 h-4 mr-1.5" /> 重置
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">确认重置进度？</AlertDialogTitle>
              <AlertDialogDescription>
                所有打勾记录、收藏与克洛格计数将被清空，且无法恢复。确定要重置吗？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={resetAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                确认重置
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="border-border/60 bg-card/50 sheikah-glow mb-5">
        <CardContent className="p-6 flex items-center gap-6">
          <RingProgress pct={overallPct} size={110} stroke={9} />
          <div>
            <h2 className="font-display text-lg font-semibold mb-1">总体完成度</h2>
            <p className="text-sm text-muted-foreground">
              {loaded ? (
                <>
                  已完成 <span className="font-display font-bold text-foreground tabular-nums">{totalDone}</span> / {totalPossible} 项收集要素
                </>
              ) : '加载中...'}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Label htmlFor="only-remaining" className="text-xs text-muted-foreground cursor-pointer">
                只看未完成
              </Label>
              <Switch id="only-remaining" checked={onlyRemaining} onCheckedChange={setOnlyRemaining} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50 mb-5">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" /> 图鉴进度
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories
            .filter((c) => !onlyRemaining || c.current < c.total)
            .map((cat) => {
              const pct = cat.total > 0 ? Math.round((cat.current / cat.total) * 100) : 0;
              const Icon = cat.icon;
              const done = cat.current === cat.total;
              return (
                <div
                  key={cat.key}
                  className="cursor-pointer group p-3 rounded-lg hover:bg-card transition-colors border border-transparent hover:border-border/40"
                  onClick={() => navigate(cat.path)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn('p-2 rounded-md bg-primary/10 text-primary', done && 'bg-success/15 text-success')}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{cat.label}</span>
                      <span className="font-display text-sm tabular-nums">
                        <span className={done ? 'text-success' : 'text-foreground'}>{cat.current}</span>
                        <span className="text-muted-foreground text-xs">/{cat.total}</span>
                      </span>
                    </div>
                  </div>
                  <Progress value={pct} className={cn('h-2', done && 'bg-muted')} />
                </div>
              );
            })}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50 mb-5">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-accent" /> 任务进度
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {questCategories
            .filter((c) => !onlyRemaining || c.current < c.total)
            .map((cat) => {
              const pct = cat.total > 0 ? Math.round((cat.current / cat.total) * 100) : 0;
              const done = cat.current === cat.total;
              return (
                <div key={cat.key} className="group p-3 rounded-lg hover:bg-card transition-colors border border-transparent hover:border-border/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{cat.label}</span>
                    <span className="font-display text-sm tabular-nums">
                      <span className={done ? 'text-success' : 'text-foreground'}>{cat.current}</span>
                      <span className="text-muted-foreground text-xs">/{cat.total}</span>
                    </span>
                  </div>
                  <Progress value={pct} className={cn('h-1.5', done && 'bg-muted')} />
                </div>
              );
            })}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm font-medium mb-1">克洛格果实（呀哈哈）</div>
            <div className="text-xs text-muted-foreground">全海拉鲁共 900 个呀哈哈</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="icon" onClick={() => setKorokCount(Math.max(0, progress.korokCount - 10))} aria-label="减10">
              <Minus className="w-4 h-4" />
            </Button>
            <div className="w-20 text-center">
              <span className="font-display text-lg font-bold tabular-nums">{progress.korokCount}</span>
              <span className="text-muted-foreground text-xs">/900</span>
            </div>
            <Button variant="secondary" size="icon" onClick={() => setKorokCount(Math.min(900, progress.korokCount + 10))} aria-label="加10">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Progress value={Math.round((progress.korokCount / 900) * 100)} className="w-full h-1.5" />
        </CardContent>
      </Card>
    </div>
  );
}

function RingProgress({ pct, size = 120, stroke = 8 }: { pct: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(195 12% 22%)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(185 85% 55%)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.4))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold tabular-nums">{pct}%</span>
      </div>
    </div>
  );
}
