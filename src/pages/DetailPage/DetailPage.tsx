import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plus, Minus, Heart, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MOCK_WEAPONS, Weapon } from '@/data/weapons';
import { MOCK_ARMORS, Armor } from '@/data/armors';
import { MOCK_MONSTERS, Monster } from '@/data/monsters';
import { MOCK_RECIPES, Recipe, MOCK_MATERIALS, Material } from '@/data/food';
import { MOCK_SHRINES, Shrine } from '@/data/collect';
import { useProgress } from '@/hooks/use-progress';
import { useFavorites } from '@/hooks/use-favorites';

export default function DetailPage() {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const { progress, toggleCollect, toggleShrine } = useProgress();
  const { favorites, toggleFavorite } = useFavorites();
  const [expand, setExpand] = useState(false);

  const item = useMemo(() => {
    if (!category || !id) return null;
    switch (category) {
      case 'weapons': return MOCK_WEAPONS.find((w: Weapon) => w.id === id) || null;
      case 'armors': return MOCK_ARMORS.find((a: Armor) => a.id === id) || null;
      case 'monsters': return MOCK_MONSTERS.find((m: Monster) => m.id === id) || null;
      case 'food': return MOCK_RECIPES.find((r: Recipe) => r.id === id) || null;
      case 'materials': return MOCK_MATERIALS.find((m: Material) => m.id === id) || null;
      case 'shrines': return MOCK_SHRINES.find((s: Shrine) => s.id === id) || null;
      default: return null;
    }
  }, [category, id]);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">没有找到这条记录，勇者可能迷路了。</p>
        <Button variant="outline" onClick={() => navigate('/')}>返回图鉴</Button>
      </div>
    );
  }

  const meta: Record<string, { label: string; title: string; icon: typeof Flame }> = {
    weapons: { label: '武器图鉴', title: '武器详情', icon: Flame },
    armors: { label: '防具图鉴', title: '防具详情', icon: Flame },
    monsters: { label: '怪物图鉴', title: '怪物详情', icon: Flame },
    food: { label: '料理食谱', title: '料理详情', icon: Flame },
    materials: { label: '材料图鉴', title: '材料详情', icon: Flame },
    shrines: { label: '神庙探索', title: '神庙详情', icon: Flame },
  };
  const m = meta[category || ''] || meta.weapons;

  const isShrine = category === 'shrines';
  const done = isShrine ? progress.completedShrines.includes(id!) : progress.collectedWeapons.includes(id!) || progress.collectedArmors.includes(id!) || progress.defeatedMonsters.includes(id!) || progress.cookedRecipes.includes(id!);
  const fav = favorites.includes(`${category}/${id}`);
  const any = item as any;

  const fields = isShrine
    ? [
        { label: '所在地区', value: any.region },
        { label: '试炼类型', value: any.trialType },
        { label: '推荐等级', value: any.recommendedLevel || '—' },
        { label: '奖励', value: any.reward || '—' },
      ]
    : category === 'weapons'
      ? [
          { label: '类型', value: any.type },
          { label: '攻击力', value: any.atk !== undefined ? `${any.atk}` : '—' },
          { label: '耐久', value: any.durability !== undefined ? `${any.durability}` : '—' },
          { label: '特殊能力', value: any.special || '—' },
          { label: '获取方式', value: any.source || '—' },
        ]
      : category === 'armors'
        ? [
            { label: '部位', value: any.slot },
            { label: '防御力', value: any.def !== undefined ? `${any.def}` : '—' },
            { label: '效果', value: any.effect || '—' },
            { label: '套装', value: any.series || '—' },
            { label: '获取方式', value: any.source || '—' },
          ]
        : category === 'monsters'
          ? [
              { label: '种类', value: any.kind },
              { label: '生命值', value: any.hp !== undefined ? `${any.hp}` : '—' },
              { label: '掉落物', value: any.drop || '—' },
              { label: '弱点', value: any.weakness || '—' },
              { label: '出没地点', value: any.location || '—' },
            ]
          : category === 'food'
            ? [
                { label: '效果', value: any.effect },
                { label: '回复', value: any.hearts !== undefined ? `${any.hearts} 心` : '—' },
                { label: '加成', value: any.bonus || '—' },
                { label: '所需材料', value: (any.ingredients || []).join('、') || '—' },
                { label: '售价', value: any.price !== undefined ? `${any.price} 卢比` : '—' },
              ]
            : category === 'materials'
              ? [
                  { label: '种类', value: any.kind },
                  { label: '用途', value: any.usage || '—' },
                  { label: '来源', value: any.source || '—' },
                  { label: '售价', value: any.price !== undefined ? `${any.price} 卢比` : '—' },
                ]
              : [];

  const desc = any.description || any.effect || any.special || any.usage || '';

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground text-sm mb-4 inline-flex items-center gap-1.5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {m.label}
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-start gap-4 md:gap-6 mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 sheikah-glow">
            <svg viewBox="0 0 40 44" className="w-10 h-11 md:w-12 md:h-13">
              <path d="M20 2L38 12v20L20 42 2 32V12L20 2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="20" cy="22" r="5" fill="currentColor" opacity="0.9" />
              <circle cx="20" cy="22" r="8.5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{any.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="secondary">{m.title}</Badge>
              {isShrine && <Badge variant="success">{any.trialType}</Badge>}
              {!isShrine && any.type && <Badge variant="outline">{any.type}</Badge>}
            </div>
          </div>
        </div>

        <div className="grid gap-3 mb-6">
          {fields.map((f) => (
            <div key={f.label} className="flex items-start justify-between gap-4 rounded-lg border border-border/40 bg-card/40 px-4 py-3">
              <span className="text-sm text-muted-foreground shrink-0">{f.label}</span>
              <span className={cn('text-sm text-right', f.value === '—' ? 'text-muted-foreground/60' : 'text-foreground')}>{f.value || '—'}</span>
            </div>
          ))}
        </div>

        {desc && (
          <div className="rounded-lg border border-border/40 bg-card/40 p-4 mb-6">
            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1.5">
              <m.icon className="w-4 h-4" /> 描述
            </h3>
            <p className={cn('text-sm text-muted-foreground leading-relaxed', !expand && 'line-clamp-4')}>{desc}</p>
            {desc.length > 120 && (
              <button onClick={() => setExpand(!expand)} className="text-xs text-primary mt-2 hover:underline">
                {expand ? '收起' : '展开全部'}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            variant={done ? 'default' : 'outline'}
            className={cn('flex-1', done && 'bg-success hover:bg-success/90 text-success-foreground')}
            onClick={() => (isShrine ? toggleShrine(id!) : toggleCollect(category!, id!))}
          >
            {done ? <><Check className="w-4 h-4" /> 已记录</> : <><Plus className="w-4 h-4" /> 标记完成</>}
          </Button>
          <Button
            variant={fav ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => toggleFavorite(`${category}/${id}`)}
            className={fav ? 'text-accent' : 'text-muted-foreground'}
            aria-label="收藏"
          >
            <Heart className={cn('w-4 h-4', fav && 'fill-current')} />
          </Button>
        </div>

        {!isShrine && (any.ingredients || []).length > 0 && (
          <div className="mt-6 rounded-lg border border-border/40 bg-card/40 p-4">
            <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> 所需材料
            </h3>
            <div className="flex flex-wrap gap-2">
              {(any.ingredients || []).map((ing: string) => (
                <Badge key={ing} variant="secondary">{ing}</Badge>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
