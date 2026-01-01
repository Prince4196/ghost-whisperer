import { Progress } from '@/components/ui/progress';
import { getHealthColor } from '@/lib/healthScore';
import { cn } from '@/lib/utils';

interface HealthBarProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function HealthBar({ score, showLabel = true, size = 'md', className }: HealthBarProps) {
  const color = getHealthColor(score);
  
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-muted-foreground">PULSE</span>
          <span style={{ color }} className="font-bold">
            {score}/100
          </span>
        </div>
      )}
      <Progress
        value={score}
        className={cn("bg-ghost-darker border border-ghost-border/50", heights[size])}
        glowColor={color}
      />
    </div>
  );
}
