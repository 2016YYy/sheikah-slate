import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Feather } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MOCK_GUIDES, Guide } from '@/data/guides';

const ICONS = [BookOpen, Feather, BookOpen, Feather, BookOpen, Feather];

export default function GuidesPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <header className="mb-8">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground text-sm mb-3 inline-flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">攻略手册</h1>
        <p className="text-muted-foreground text-sm mt-1.5">古代希卡科技整理的海拉鲁生存指南，共 {MOCK_GUIDES.length} 册。</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_GUIDES.map((guide: Guide, i: number) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.button
              key={guide.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              onClick={() => navigate(`/guides/${guide.id}`)}
              className="text-left rounded-xl border border-border/60 bg-card/50 p-5 hover:bg-card/80 hover:border-primary/40 transition-all group sheikah-glow hover:sheikah-glow-strong"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="text-[10px]">{guide.sections} 章节</Badge>
              </div>
              <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">{guide.title}</h2>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{guide.summary}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
