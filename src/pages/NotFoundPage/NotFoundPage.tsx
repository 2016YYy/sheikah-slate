import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-16 h-16 mx-auto mb-6 text-primary opacity-80">
          <svg viewBox="0 0 80 96" className="w-16 h-16">
            <path d="M40 4L76 24v48L40 92 4 72V24L40 4z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="40" cy="48" r="9" fill="currentColor" opacity="0.7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">404</h1>
        <p className="text-muted-foreground mb-8">这片区域的地图还未被点亮，勇者请原路返回。</p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" /> 回到首页
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
