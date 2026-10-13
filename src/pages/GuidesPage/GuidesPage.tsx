import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_GUIDES } from '@/data/guides';

const CATEGORY_COLORS: Record<string, string> = {
  新手开局: 'text-primary',
  生存机制: 'text-primary',
  探索解谜: 'text-accent',
  战斗进阶: 'text-destructive',
  资源赚钱: 'text-accent',
  'DLC 指南': 'text-primary',
};

export default function GuidesPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="md:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="font-display text-[10px] tracking-[0.3em] text-primary/70">GUIDES</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">新手指南</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {MOCK_GUIDES.map((guide, i) => {
          const color = CATEGORY_COLORS[guide.category] || 'text-primary';
          return (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <Card
                className="cursor-pointer border-border/60 bg-card/50 hover:bg-card/80 hover:border-primary/40 transition-all sheikah-glow group h-full"
                onClick={() => navigate(`/guides/${guide.id}`)}
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg bg-primary/10 ${color} group-hover:scale-110 transition-transform`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-display font-semibold text-base md:text-lg mb-1 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] h-4.5">{guide.category}</Badge>
                    <span className="text-[10px] text-muted-foreground font-display">
                      {guide.chapters.length} 章 · {Math.max(1, Math.round(guide.content.length / 300))} 分钟读完
                    </span>
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
