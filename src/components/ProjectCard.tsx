import { Ghost, Clock, GitBranch, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HealthBar } from '@/components/HealthBar';
import { getGhostAge, getTimeUntilExpiry } from '@/lib/healthScore';
import type { Project } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isExpired = project.status === 'expired';
  const timeLeft = getTimeUntilExpiry(project.expiryDate);
  const ghostAge = getGhostAge(project.createdAt);

  return (
    <Card 
      variant="terminal" 
      className={cn(
        "relative overflow-hidden group",
        isExpired && "border-destructive/50"
      )}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-primary font-mono text-lg truncate group-hover:glow-text transition-all">
              {project.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground line-clamp-2 text-xs">
              {project.description}
            </CardDescription>
          </div>
          <Badge variant="generation" className="shrink-0">
            Gen {project.generation}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Health Score */}
        <HealthBar score={project.healthScore.total} />

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Ghost className="h-3 w-3" />
            <span className="truncate">{project.ghostName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Star className="h-3 w-3" />
            <span>{project.stars} stars</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{ghostAge}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <GitBranch className="h-3 w-3" />
            <span>{project.haunters.length} haunters</span>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1">
          {project.languages.map((lang) => (
            <Badge key={lang} variant="ghost" className="text-[10px]">
              {lang}
            </Badge>
          ))}
        </div>

        {/* Timer */}
        <div className={cn(
          "flex items-center justify-between p-2 rounded-sm border text-xs font-mono",
          isExpired 
            ? "border-destructive/50 bg-destructive/10 text-destructive" 
            : "border-ghost-border bg-ghost-darker text-muted-foreground"
        )}>
          <span>DEAD_MANS_SWITCH:</span>
          <span className={cn(
            "font-bold",
            isExpired ? "text-destructive" : "text-primary"
          )}>
            {timeLeft}
          </span>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant={isExpired ? "haunt" : "terminal"}
          size="sm"
          className="flex-1"
          disabled={!isExpired}
          asChild={isExpired}
        >
          {isExpired ? (
            <Link to={`/project/${project.id}`}>
              <Ghost className="h-4 w-4 mr-1" />
              HAUNT
            </Link>
          ) : (
            <>
              <Clock className="h-4 w-4 mr-1" />
              LOCKED
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/project/${project.id}`}>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
