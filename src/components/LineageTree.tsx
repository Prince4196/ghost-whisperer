import { Ghost, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Project } from '@/lib/mockData';

interface LineageTreeProps {
  project: Project;
}

export function LineageTree({ project }: LineageTreeProps) {
  const allHaunters = [
    { ghostName: project.ghostName, hauntedAt: project.createdAt, isOriginal: true },
    ...project.haunters.map(h => ({ ...h, isOriginal: false })),
  ];

  return (
    <Card variant="terminal" className="p-4">
      <h3 className="text-sm font-mono text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
        <Ghost className="h-4 w-4" />
        PROJECT_LINEAGE
      </h3>

      <div className="space-y-0">
        {allHaunters.map((haunter, index) => (
          <div key={index} className="relative">
            {/* Connector line */}
            {index > 0 && (
              <div className="absolute left-4 -top-4 w-px h-4 bg-ghost-border" />
            )}
            
            <div className="flex items-start gap-3">
              {/* Node */}
              <div className={`
                relative w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0
                ${haunter.isOriginal 
                  ? 'border-primary bg-primary/20' 
                  : 'border-ghost-border bg-ghost-darker'
                }
              `}>
                <Ghost className={`h-4 w-4 ${haunter.isOriginal ? 'text-primary' : 'text-muted-foreground'}`} />
                {haunter.isOriginal && (
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pb-6">
                <p className={`font-mono text-sm ${haunter.isOriginal ? 'text-primary' : 'text-foreground'}`}>
                  {haunter.ghostName}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {haunter.isOriginal ? 'ORIGINAL_GHOST' : 'HAUNTER'} • {haunter.hauntedAt.toLocaleDateString()}
                </p>
              </div>

              {/* Generation badge */}
              <span className="text-xs font-mono text-ghost-green-dim">
                G{index + 1}
              </span>
            </div>

            {/* Arrow to next */}
            {index < allHaunters.length - 1 && (
              <div className="absolute left-4 bottom-1 transform -translate-x-1/2">
                <ArrowDown className="h-3 w-3 text-ghost-border" />
              </div>
            )}
          </div>
        ))}
      </div>

      {allHaunters.length === 1 && (
        <p className="text-xs text-muted-foreground font-mono text-center mt-4 border-t border-ghost-border pt-4">
          NO_HAUNTERS_YET • AWAITING_RESURRECTION
        </p>
      )}
    </Card>
  );
}
