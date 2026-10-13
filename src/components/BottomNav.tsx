import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Sword, Shirt, Map, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: '图鉴', icon: BookOpen, end: true },
  { path: '/category/weapons', label: '武器', icon: Sword },
  { path: '/category/armors', label: '防具', icon: Shirt },
  { path: '/progress', label: '进度', icon: Map },
  { path: '/favorites', label: '收藏', icon: Bookmark },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border/60 bg-background/90 backdrop-blur-md">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.end
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon
                className={cn('w-5 h-5 transition-all', isActive && 'drop-shadow-[0_0_6px_rgba(34_211_238_/_0.5)]')}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
