import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sword, Shirt, Mountain, ScrollText, Flame, Skull, Sparkles, Map, BookOpen, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MOCK_WEAPONS } from '@/data/weapons';
import { MOCK_ARMORS } from '@/data/armors';
import { MOCK_SHRINES, MOCK_TOWERS, MOCK_MEMORIES } from '@/data/collect';
import { MOCK_MAIN_QUESTS, MOCK_SHRINE_QUESTS, MOCK_SIDE_QUESTS } from '@/data/quests';
import { MOCK_MONSTERS } from '@/data/monsters';
import { MOCK_RECIPES, MOCK_MATERIALS } from '@/data/food';
import { useProgress } from '@/hooks/use-progress';

const CATEGORIES = [
  { key: 'weapons', label: '武器图鉴', icon: Sword, count: 131, color: 'text-primary', path: '/category/weapons' },
  { key: 'armors', label: '防具图鉴', icon: Shirt, count: 89, color: 'text-accent', path: '/category/armors' },
  { key: 'shrines', label: '神庙探索', icon: Mountain, count: 120, color: 'text-primary', path: '/category/shrines' },
  { key: 'materials', label: '材料图鉴', icon: Sparkles, count: 100, color: 'text-accent', path: '/category/materials' },
  { key: 'food', label: '料理食谱', icon: Flame, count: 94, color: 'text-accent', path: '/category/food' },
  { key: 'monsters', label: '怪物图鉴', icon: Skull, count: 68, color: 'text-destructive', path: '/category/monsters' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { progress, loaded } = useProgress();

  const totalShrines = MOCK_SHRINES.length;
  const doneShrines = progress.completedShrines.length;
  const shrinePct = Math.round((doneShrines / totalShrines) * 100);

  const totalWeapons = MOCK_WEAPONS.length;
  const doneWeapons = progress.collectedWeapons.length;
  const weaponPct = Math.round((doneWeapons / totalWeapons) * 100);

  const totalArmors = MOCK_ARMORS.length;
  const doneArmors = progress.collectedArmors.length;
  const armorPct = Math.round((doneArmors / totalArmors) * 100);

  const totalMain = MOCK_MAIN_QUESTS.length;
  const doneMain = progress.completedMainQuests.length;
  const totalShrineQ = MOCK_SHRINE_QUESTS.length;
  const doneShrineQ = progress.completedShrineQuests.length;
  const totalSide = MOCK_SIDE_QUESTS.length;
  const doneSide = progress.completedSideQuests.length;
  const totalQuests = totalMain + totalShrineQ + totalSide;
  const doneQuests = doneMain + doneShrineQ + doneSide;
  const questPct = Math.round((doneQuests / totalQuests) * 100);

  const memoryPct = MOCK_MEMORIES.length > 0 ? Math.round((progress.unlockedMemories.length / MOCK_MEMORIES.length) * 100) : 0;
  const towerPct = MOCK_TOWERS.length > 0 ? Math.round((progress.completedTowers.length / MOCK_TOWERS.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center py-4 md:py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary/90 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-display tracking-wider">SHEIKAH SLATE v1.0.0</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-wide mb-3">海拉鲁图鉴数据库</h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">武器 · 防具 · 神庙 · 任务 · 料理 · 怪物 — 塞尔达传说：旷野之息全资源离线查阅工具</p>
        <button
          onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-card/50 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors group"
        >
          <Search className="w-4 h-4" />
          <span>搜索图鉴...</span>
          <kbd className="ml-2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border/60 bg-muted/50 text-[10px] font-display">
            ⌘K
          </kbd>
        </button>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="border-border/60 bg-card/50 backdrop-blur sheikah-glow">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2"><Map className="w-5 h-5 text-primary" />收集进度</h2>
              <Badge variant="outline" className="font-display text-xs">{loaded ? `${doneShrines + doneWeapons + doneArmors + doneQuests}` : '...'} 项已完成</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ProgressItem label="神庙" current={doneShrines} total={totalShrines} pct={shrinePct} onClick={() => navigate('/category/shrines')} />
              <ProgressItem label="武器" current={doneWeapons} total={totalWeapons} pct={weaponPct} onClick={() => navigate('/category/weapons')} />
              <ProgressItem label="防具" current={doneArmors} total={totalArmors} pct={armorPct} onClick={() => navigate('/category/armors')} />
              <ProgressItem label="任务" current={doneQuests} total={totalQuests} pct={questPct} onClick={() => navigate('/quests')} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/40">
              <MiniStat label="高塔" current={progress.completedTowers.length} total={MOCK_TOWERS.length} pct={towerPct} />
              <MiniStat label="回忆" current={progress.unlockedMemories.length} total={MOCK_MEMORIES.length} pct={memoryPct} />
              <MiniStat label="克洛格" current={progress.korokCount} total={900} pct={Math.round((progress.korokCount / 900) * 100)} />
              <MiniStat label="怪物" current={progress.defeatedMonsters.length} total={MOCK_MONSTERS.length} pct={Math.round((progress.defeatedMonsters.length / MOCK_MONSTERS.length) * 100)} />
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" />图鉴分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 + i * 0.05 }} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <Card className="cursor-pointer border-border/60 bg-card/50 hover:bg-card/80 hover:border-primary/40 transition-all group sheikah-glow hover:sheikah-glow-strong" onClick={() => navigate(cat.path)}>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-lg bg-primary/10 ${cat.color} group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5" /></div>
                      <span className="font-display text-xs text-muted-foreground">{cat.count}</span>
                    </div>
                    <h3 className="font-medium text-foreground text-sm md:text-base">{cat.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">点击查看详情</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer border-border/60 bg-card/50 hover:bg-card/80 hover:border-accent/40 transition-all sheikah-glow" onClick={() => navigate('/quests')}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-accent/15 text-accent"><ScrollText className="w-5 h-5" /></div>
              <div><h3 className="font-semibold">任务攻略</h3><p className="text-xs text-muted-foreground">主线 {totalMain} · 神庙挑战 {totalShrineQ} · 支线 {totalSide}</p></div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground"><span>已完成 {doneQuests}/{totalQuests}</span><Progress value={questPct} className="flex-1 h-1.5" /><span className="font-display text-accent">{questPct}%</span></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer border-border/60 bg-card/50 hover:bg-card/80 hover:border-primary/40 transition-all sheikah-glow" onClick={() => navigate('/guides')}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary"><BookOpen className="w-5 h-5" /></div>
              <div><h3 className="font-semibold">新手指南</h3><p className="text-xs text-muted-foreground">6 册生存手册 · 新手到进阶</p></div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">从开局生存到战斗进阶，从资源收集到DLC攻略，结构化展示新手必备知识。</p>
          </CardContent>
        </Card>
      </motion.section>

      <div className="rune-divider" />
    </div>
  );
}

function ProgressItem({ label, current, total, pct, onClick }: { label: string; current: number; total: number; pct: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        <span className="font-display text-xs text-primary">{pct}%</span>
      </div>
      <Progress value={pct} className="h-2 group-hover:shadow-[0_0_8px_rgba(34_211_238_/_0.3)] transition-shadow" />
      <div className="flex items-center justify-between mt-1.5"><span className="font-display text-sm font-semibold tabular-nums">{current}<span className="text-muted-foreground text-xs font-normal">/{total}</span></span></div>
    </button>
  );
}

function MiniStat({ label, current, total, pct }: { label: string; current: number; total: number; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">{label}</span><span className="font-display text-[11px] tabular-nums text-muted-foreground">{pct}%</span></div>
      <Progress value={pct} className="h-1" />
      <div className="text-[11px] text-muted-foreground mt-1 font-display tabular-nums">{current}/{total}</div>
    </div>
  );
}