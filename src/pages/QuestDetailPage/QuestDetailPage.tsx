import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, MapPin, ScrollText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MOCK_MAIN_QUESTS, MOCK_SHRINE_QUESTS, MOCK_SIDE_QUESTS } from '@/data/quests';
import { useProgress } from '@/hooks/use-progress';
import { cn } from '@/lib/utils';

export default function QuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isCollected, toggleItem, loaded } = useProgress();

  const quest =
    MOCK_MAIN_QUESTS.find((q) => String(q.id) === id) ||
    MOCK_SHRINE_QUESTS.find((q) => String(q.id) === id) ||
    MOCK_SIDE_QUESTS.find((q) => String(q.id) === id);

  if (!quest) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">未找到该任务</p>
        <Button onClick={() => navigate(-1)} variant="secondary">
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回
        </Button>
      </div>
    );
  }

  const progressField =
    quest.type === '主线' ? 'completedMainQuests'
      : quest.type === '神庙挑战' ? 'completedShrineQuests'
        : 'completedSideQuests';
  const completed = loaded && isCollected(progressField as any, String(quest.id));

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-xs text-muted-foreground font-display tracking-wider">QUEST DETAIL</div>
      </div>

      <Card className="border-border/60 bg-card/50 sheikah-glow mb-4">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
              <ScrollText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className="text-xs">{quest.type}</Badge>
                {completed && (
                  <Badge className="bg-success/20 text-success-foreground border-success/30 text-xs">
                    <Check className="w-3 h-3 mr-1" /> 已完成
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">
                {quest.name}
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-4">
            {quest.description || (quest as any).hint || ''}
          </p>

          <Button
            onClick={() => toggleItem(progressField as any, String(quest.id))}
            variant={completed ? 'secondary' : 'default'}
            size="sm"
          >
            <Check className="w-4 h-4 mr-1.5" />
            {completed ? '已完成' : '标记完成'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-border/60 bg-card/50">
          <CardContent className="p-5 md:p-6">
            <h2 className="font-display text-lg font-semibold mb-4 text-primary">完成步骤</h2>
            {quest.steps && quest.steps.length > 0 ? (
              <ol className="space-y-3">
                {quest.steps.map((step: string, i: number) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 font-display tabular-nums">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground/90 leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">暂无详细步骤，请参考任务描述。</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50 h-fit">
          <CardContent className="p-5">
            <h3 className="font-display text-sm font-semibold mb-3 text-muted-foreground tracking-wider">任务信息</h3>
            <div className="space-y-3 text-sm">
              {quest.region && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground/90">{quest.region}</span>
                </div>
              )}
              {(quest as any).npc && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-foreground/90">{(quest as any).npc}</span>
                </div>
              )}
              <Separator className="my-2" />
              {quest.reward ? (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">任务奖励</div>
                  <div className="text-accent">{quest.reward}</div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">暂无奖励信息</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {quest.note && (
        <div className={cn('mt-4 p-4 rounded-md bg-primary/5 border border-primary/20')}>
          <div className="text-xs text-primary/80 font-display tracking-wider mb-1">备注</div>
          <p className="text-sm text-foreground/90 leading-relaxed">{quest.note}</p>
        </div>
      )}
    </div>
  );
}
