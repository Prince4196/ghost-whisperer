import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
}

export function StatCard({ icon: Icon, label, value, subtext }: StatCardProps) {
  return (
    <Card variant="terminal" className="relative overflow-hidden group">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p className="text-3xl font-bold text-primary glow-text font-mono">
              {value}
            </p>
            {subtext && (
              <p className="text-xs text-muted-foreground font-mono">
                {subtext}
              </p>
            )}
          </div>
          <div className="relative">
            <Icon className="h-8 w-8 text-ghost-green-dim group-hover:text-primary transition-colors" />
            <div className="absolute inset-0 blur-lg bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
      
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />
      </div>
    </Card>
  );
}
