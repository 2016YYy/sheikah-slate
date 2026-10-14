import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MOCK_GUIDES } from '@/data/guides';
import { cn } from '@/lib/utils';

export default function GuideReaderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const guide = MOCK_GUIDES.find((g) => String(g.id) === id);
  const [activeChapter, setActiveChapter] = useState(0);

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">未找到该攻略</p>
        <Button onClick={() => navigate(-1)} variant="secondary"><ArrowLeft className="w-4 h-4 mr-2" /> 返回</Button>
      </div>
    );
  }

  const chapter = guide.chapters[activeChapter];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
        <Badge variant="outline" className="text-xs">{guide.category}</Badge>
        <div className="ml-auto">
          <Sheet>
            <SheetTrigger asChild><Button variant="secondary" size="sm"><List className="w-4 h-4 mr-1.5" /> 目录</Button></SheetTrigger>
            <SheetContent side="right" className="w-72 border-l-border">
              <SheetHeader><SheetTitle className="font-display text-base">目录</SheetTitle></SheetHeader>
              <ScrollArea className="h-[70vh] mt-2">
                <div className="space-y-1 pr-2">
                  {guide.chapters.map((c: any, i: number) => (
                    <button key={i} onClick={() => setActiveChapter(i)} className={cn('w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors', activeChapter === i ? 'bg-primary/15 text-primary font-medium' : 'text-muted-foreground hover:bg-card hover:text-foreground')}>
                      {i + 1}. {c.title}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Card className="border-border/60 bg-card/50 sheikah-glow mb-4">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary"><BookOpen className="w-5 h-5" /></div>
            <div><h1 className="font-display text-xl md:text-2xl font-bold tracking-wide">{guide.title}</h1><p className="text-xs text-muted-foreground mt-1">{guide.chapters.length} 章 · {Math.max(1, Math.round(guide.content.length / 300))} 分钟读完</p></div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{guide.description}</p>
        </CardContent>
      </Card>

      {chapter && (
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-6 md:p-8">
            <h2 className="font-display text-lg md:text-xl font-semibold text-primary mb-4">{activeChapter + 1}. {chapter.title}</h2>
            <div className="prose prose-sheikah max-w-none">
              {chapter.content.split('\n').map((line: string, i: number) => {
                if (!line.trim()) return <div key={i} className="h-3" />;
                if (line.startsWith('- ')) return <ul key={i}><li>{renderInline(line.slice(2))}</li></ul>;
                if (/^\d+\./.test(line)) return <ol key={i} start={parseInt(line, 10)}><li>{renderInline(line.replace(/^\d+\.\s*/, ''))}</li></ol>;
                if (line.startsWith('**')) return <p key={i}><strong>{renderInline(line.replace(/\*\*/g, ''))}</strong></p>;
                return <p key={i}>{renderInline(line)}</p>;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mt-4 gap-3">
        <Button variant="secondary" disabled={activeChapter === 0} onClick={() => setActiveChapter((c) => Math.max(0, c - 1))}>上一章</Button>
        <span className="text-xs text-muted-foreground font-display tabular-nums">{activeChapter + 1} / {guide.chapters.length}</span>
        <Button disabled={activeChapter === guide.chapters.length - 1} onClick={() => setActiveChapter((c) => Math.min(guide.chapters.length - 1, c + 1))}>下一章</Button>
      </div>
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|「[^」]+」)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('「') && part.endsWith('」')) return <span key={i} className="text-primary font-medium">{part}</span>;
    return <span key={i}>{part}</span>;
  });
}