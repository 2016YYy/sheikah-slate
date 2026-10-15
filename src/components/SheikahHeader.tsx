import { Link, useLocation } from 'react-router-dom';
import { Info, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SheikahHeader({ topOffset = 0 }: { topOffset?: number }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const openSearch = () => {
    window.dispatchEvent(new Event('open-command-palette'));
  };

  return (
    <header
      className="sticky z-50 w-full bg-background/85 backdrop-blur-md border-b border-border/40 transition-all duration-300"
      style={{ top: topOffset }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-9 flex items-center justify-center">
            <svg viewBox="0 0 32 36" className="w-8 h-9 text-primary drop-shadow-[0_0_8px_rgba(34_211_238_/_0.5)]">
              <path
                d="M16 0L31 9v18L16 36 1 27V9L16 0z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="group-hover:opacity-80 transition-opacity"
              />
              <circle cx="16" cy="18" r="4" fill="currentColor" opacity="0.9" />
              <circle cx="16" cy="18" r="7" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-bold tracking-wider text-foreground">希卡石板</span>
            <span className="font-display text-[10px] tracking-[0.25em] text-primary/80">SHEIKAH SLATE</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" label="首页" isActive={isHome} />
          <NavLink to="/category/weapons" label="武器" isActive={location.pathname.startsWith('/category/weapons')} />
          <NavLink to="/category/armors" label="防具" isActive={location.pathname.startsWith('/category/armors')} />
          <NavLink to="/category/shrines" label="神庙" isActive={location.pathname.startsWith('/category/shrines')} />
          <NavLink to="/quests" label="任务" isActive={location.pathname.startsWith('/quests')} />
          <NavLink to="/guides" label="攻略" isActive={location.pathname.startsWith('/guides')} />
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={openSearch} aria-label="搜索">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex" asChild>
            <Link to="/about" aria-label="关于">
              <Info className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, label, isActive }: { to: string; label: string; isActive: boolean }) {
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full drop-shadow-[0_0_6px_rgba(34_211_238_/_0.6)]" />
      )}
    </Link>
  );
}
