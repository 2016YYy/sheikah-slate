import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { MOCK_GUIDES } from '@/data/guides';

export default function GuideReaderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const guide = useMemo(() => MOCK_GUIDES.find((g) => g.id === id) || null, [id]);

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">这本手册似乎被弄丢了。</p>
        <button onClick={() => navigate('/guides')} className="text-primary hover:underline">返回攻略</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground text-sm mb-4 inline-flex items-center gap-1.5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 攻略手册
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/10 text-primary sheikah-glow">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{guide.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{guide.summary}</p>
          </div>
        </div>

        <div className="rune-divider mb-8" />

        <div className="space-y-8">
          {guide.content.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-bold text-primary mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-primary rotate-45" /> {section.title}
              </h2>
              {section.body.split('\n').filter((line) => line.trim()).map((line, i) => (
                <p key={i} className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                  {line.trim().startsWith('•') ? (
                    <span className="block pl-4 relative">
                      <span className="absolute left-0 text-primary">▸</span>
                      {line.trim().slice(1)}
                    </span>
                  ) : (
                    line.trim()
                  )}
                </p>
              ))}
            </section>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
