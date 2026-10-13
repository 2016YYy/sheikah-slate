import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <svg viewBox="0 0 32 36" className="w-16 h-18 mb-6 text-primary/40">
        <path d="M16 0L31 9v18L16 36 1 27V9L16 0z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="18" r="4" fill="currentColor" opacity="0.4" />
      </svg>
      <h1 className="font-display text-4xl font-bold mb-3">404</h1>
      <p className="text-muted-foreground mb-6">这片区域尚未被希卡石板记录</p>
      <div className="flex gap-3">
        <Button onClick={() => navigate('/')}>回到首页</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>返回上一页</Button>
      </div>
    </div>
  );
}
