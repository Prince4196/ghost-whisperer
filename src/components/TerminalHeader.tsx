import { Ghost, Terminal, Skull } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'DASHBOARD', icon: Terminal },
  { path: '/vault', label: 'GHOST_VAULT', icon: Ghost },
];

export function TerminalHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ghost-border bg-ghost-darker/95 backdrop-blur supports-[backdrop-filter]:bg-ghost-darker/80">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center gap-2 mr-8 group">
          <div className="relative">
            <Skull className="h-6 w-6 text-primary transition-all group-hover:scale-110" />
            <div className="absolute inset-0 blur-md bg-primary/30 group-hover:bg-primary/50 transition-all" />
          </div>
          <span className="font-mono font-bold text-primary glow-text text-lg tracking-tight">
            GHOST://PROJECT
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-mono transition-all rounded-sm",
                  isActive
                    ? "bg-ghost-surface text-primary border border-ghost-border shadow-[0_0_10px_hsl(120_100%_50%_/_0.3)]"
                    : "text-muted-foreground hover:text-primary hover:bg-ghost-surface/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>SYSTEM_ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
