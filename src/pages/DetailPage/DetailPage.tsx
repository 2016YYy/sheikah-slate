import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { MOCK_WEAPONS } from '@/data/weapons';
import { MOCK_ARMORS } from '@/data/armors';
import { MOCK_SHRINES, MOCK_TOWERS, MOCK_MEMORIES } from '@/data/collect';
import { MOCK_MONSTERS } from '@/data/monsters';
import { MOCK_MATERIALS, MOCK_RECIPES } from '@/data/food';
import { useProgress } from '@/hooks/use-progress';
import { cn } from '@/lib/utils';

type CategoryKey = 'weapons' | 'armors' | 'shrines' | 'monsters' | 'materials' | 'food';

export default function DetailPage() {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const cat = category as CategoryKey;
  const { isCollected, toggleItem, isFavorite, toggleFavorite, loaded } = useProgress();

  const { item, progressField, label } = getItemData(cat, id || '') as any;

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">未找到该条目</p>
        <Button onClick={() => navigate(-1)} variant="secondary">
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回
        </Button>
      </div>
    );
  }

  const collected = loaded && isCollected(progressField as any, String(item.id));
  const favorited = loaded && isFavorite(cat, String(item.id));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: item.name, text: `希卡石板 - ${item.name}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制到剪贴板');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-xs text-muted-foreground font-display tracking-wider">
          {label.toUpperCase()}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleShare} aria-label="分享">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => toggleFavorite(cat, String(item.id))} aria-label={favorited ? '取消收藏' : '收藏'} className={favorited ? 'text-accent' : ''}>
            <Heart className={cn('w-4 h-4', favorited && 'fill-current')} />
          </Button>
        </div>
      </div>

      <Card className="border-border/60 bg-card/50 sheikah-glow mb-4">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4 md:gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center shrink-0">
              <DetailIcon category={cat} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className="text-xs font-display">{getTypeLabel(item, cat)}</Badge>
                {collected && <Badge className="bg-success/20 text-success-foreground border-success/30 text-xs"><Check className="w-3 h-3 mr-1" /> 已收集</Badge>}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-2 tracking-wide">{item.name}</h1>
              <p className="text-muted-foreground text-sm md:text-base">{getSubtitle(item, cat)}</p>
              <div className="mt-4 flex items-center gap-3">
                <Button onClick={() => toggleItem(progressField as any, String(item.id))} className={collected ? '' : 'bg-primary hover:bg-primary/90'} variant={collected ? 'secondary' : 'default'} size="sm">
                  <Check className="w-4 h-4 mr-1.5" />
                  {collected ? '已收集' : '标记收集'}
                </Button>
                <StatRow item={item} cat={cat} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-border/60 bg-card/50">
          <CardContent className="p-5 md:p-6">
            <h2 className="font-display text-lg font-semibold mb-4 text-primary">详细信息</h2>
            <ScrollArea className="h-auto">
              <div className="space-y-4">
                {renderDetailField('特殊效果', item.special || item.effect || item.trial || '—')}
                {renderDetailField('套装加成', item.bonus, cat === 'armors')}
                {renderDetailField('攻击力', item.atk ? `${item.atk}` : '—', cat === 'weapons')}
                {renderDetailField('防御力', item.def ? `${item.def}` : '—', cat === 'armors')}
                {renderDetailField('耐久度', item.dur, cat === 'weapons')}
                {renderDetailField('生命值', item.hp, cat === 'monsters')}
                {renderDetailField('稀有度', item.rarity, cat === 'materials')}
                {renderDetailField('所在地区', item.region, cat === 'shrines')}
                {renderDetailField('奖励', item.reward, cat === 'shrines')}
                {renderDetailField('获取方式', item.obtain || '—')}
                {renderDetailField('升级材料', item.upgrade, cat === 'armors' || cat === 'weapons')}
                {renderDetailField('触发提示', item.hint, cat === 'shrines' && !!item.hint)}
                {item.note && (
                  <div className="mt-4 p-4 rounded-md bg-primary/5 border border-primary/20">
                    <div className="text-xs text-primary/80 font-display tracking-wider mb-1">备注</div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{item.note}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50 h-fit">
          <CardContent className="p-5">
            <h3 className="font-display text-sm font-semibold mb-3 text-muted-foreground tracking-wider">快速信息</h3>
            <div className="space-y-3 text-sm">
              <InfoItem label="分类" value={getTypeLabel(item, cat)} />
              <InfoItem label="收集状态" value={collected ? '已收集' : '未收集'} valueClass={collected ? 'text-success' : 'text-muted-foreground'} />
              <InfoItem label="收藏" value={favorited ? '已收藏' : '未收藏'} valueClass={favorited ? 'text-accent' : 'text-muted-foreground'} />
              <Separator className="my-3" />
              <InfoItem label="ID" value={`#${String(item.id).padStart(3, '0')}`} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getItemData(cat: CategoryKey, id: string) {
  if (cat === 'weapons') {
    const item = MOCK_WEAPONS.find((w) => String(w.id) === id);
    return { item, progressField: 'collectedWeapons', label: '武器图鉴' };
  }
  if (cat === 'armors') {
    const item = MOCK_ARMORS.find((a) => String(a.id) === id);
    return { item, progressField: 'collectedArmors', label: '防具图鉴' };
  }
  if (cat === 'shrines') {
    const item = MOCK_SHRINES.find((s) => String(s.id) === id) || MOCK_TOWERS.find((t) => String(t.id) === id) || MOCK_MEMORIES.find((m) => String(m.id) === id);
    return { item, progressField: 'completedShrines', label: '神庙探索' };
  }
  if (cat === 'monsters') {
    const item = MOCK_MONSTERS.find((m) => String(m.id) === id);
    return { item, progressField: 'defeatedMonsters', label: '怪物图鉴' };
  }
  if (cat === 'materials') {
    const item = MOCK_MATERIALS.find((m) => String(m.id) === id);
    return { item, progressField: 'collectedMaterials', label: '材料图鉴' };
  }
  if (cat === 'food') {
    const item = MOCK_RECIPES.find((r) => String(r.id) === id);
    return { item, progressField: 'collectedRecipes', label: '料理食谱' };
  }
  return { item: null, progressField: '', label: '' };
}

function getTypeLabel(item: any, cat: CategoryKey): string {
  return item.type || item.set || item.region || '—';
}

function getSubtitle(item: any, cat: CategoryKey): string {
  if (cat === 'weapons') return item.special || `攻击力 ${item.atk} · 耐久 ${item.dur}`;
  if (cat === 'armors') return item.effect || `基础防御 ${item.def}`;
  if (cat === 'shrines') return item.trial || item.hint || item.region || '';
  if (cat === 'monsters') return `HP ${item.hp || '—'} · ${item.type || ''}`;
  if (cat === 'materials') return item.rarity || item.type || '';
  if (cat === 'food') return item.effect || item.type || '';
  return '';
}

function renderDetailField(label: string, value: string | number | undefined, show: boolean = true) {
  if (!show || value === undefined || value === null || value === '') return null;
  return (
    <div className="flex gap-4">
      <div className="w-24 shrink-0 text-sm text-muted-foreground pt-0.5">{label}</div>
      <div className="flex-1 text-sm text-foreground/90 leading-relaxed">{String(value)}</div>
    </div>
  );
}

function InfoItem({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={`font-medium text-sm ${valueClass || ''}`}>{value}</span>
    </div>
  );
}

function StatRow({ item, cat }: { item: any; cat: CategoryKey }) {
  if (cat === 'weapons') {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="text-center"><div className="font-display text-lg font-bold text-accent tabular-nums">{item.atk || '—'}</div><div className="text-[10px] text-muted-foreground">攻击</div></div>
        <div className="w-px h-8 bg-border/50" />
        <div className="text-center"><div className="font-display text-lg font-bold text-primary tabular-nums">{item.dur || '—'}</div><div className="text-[10px] text-muted-foreground">耐久</div></div>
      </div>
    );
  }
  if (cat === 'armors') {
    return (
      <div className="text-center"><div className="font-display text-2xl font-bold text-accent tabular-nums">{item.def}</div><div className="text-[10px] text-muted-foreground">基础防御</div></div>
    );
  }
  return null;
}

function DetailIcon({ category }: { category: CategoryKey }) {
  if (category === 'weapons') {
    return (
      <svg viewBox="0 0 40 40" className="w-12 h-12 text-primary/70">
        <path d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.4" />
      </svg>
    );
  }
  if (category === 'armors') {
    return (
      <svg viewBox="0 0 40 40" className="w-12 h-12 text-accent/70">
        <path d="M12 8 L20 4 L28 8 L28 16 L32 22 L28 32 L20 36 L12 32 L8 22 L12 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.3" />
      </svg>
    );
  }
  if (category === 'shrines') {
    return (
      <svg viewBox="0 0 40 40" className="w-12 h-12 text-primary/70">
        <path d="M20 6 L32 14 L32 26 L20 34 L8 26 L8 14 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 12 L20 28 M14 20 L26 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (category === 'monsters') {
    return (
      <svg viewBox="0 0 40 40" className="w-12 h-12 text-destructive/60">
        <circle cx="20" cy="18" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
        <circle cx="24" cy="16" r="2" fill="currentColor" />
        <path d="M13 28 Q20 34 27 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (category === 'materials') {
    return (
      <svg viewBox="0 0 40 40" className="w-12 h-12 text-accent/60">
        <path d="M20 8 L32 16 L32 28 L20 36 L8 28 L8 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="6" fill="currentColor" opacity="0.25" />
      </svg>
    );
  }
  if (category === 'food') {
    return (
      <svg viewBox="0 0 40 40" className="w-12 h-12 text-accent/70">
        <path d="M12 18 Q20 14 28 18 L28 26 Q20 30 12 26 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 10 Q22 13 20 16 Q18 13 20 10" fill="currentColor" opacity="0.5" />
      </svg>
    );
  }
  return null;
}