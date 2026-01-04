import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HealthBar } from '@/components/HealthBar';
import { Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    githubUrl?: string;
    ghostLog?: string;
    description?: string;
    ghostName?: string;
    creatorGhostName?: string;
    healthScore?: {
      total?: number;
      documentation?: number;
      structure?: number;
      freshness?: number;
      stability?: number;
    } | number;
    vitalityScore?: number;
    status: string;
    creator?: string;
    creatorEmail?: string;
    creatorRealName?: string;
    timestamp?: Date;
    expiryDate?: Date;
    createdAt?: Date;
    lastCheckIn?: Date;
    deadManSwitchMonths?: number;
    repoInfo?: {
      owner?: string;
      name?: string;
      description?: string;
      stars?: number;
      forks?: number;
      language?: string;
    };
  };
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  // Determine badge color based on status
  const getStatusColor = () => {
    switch (project.status) {
      case 'Seeking Successors':
        return 'bg-destructive/20 text-destructive border-destructive';
      case 'Active':
        return 'bg-primary/20 text-primary border-primary';
      case 'Progress Report':
        return 'bg-success/20 text-success border-success';
      default:
        return 'bg-muted text-foreground border-muted';
    }
  };

  const getStatusLabel = () => {
    switch (project.status) {
      case 'Seeking Successors':
        return 'DEMOGORGON';
      case 'Active':
        return 'ACTIVE';
      case 'Progress Report':
        return 'RESCUED';
      default:
        return project.status;
    }
  };

  const getScoreValue = () => {
    if (project.vitalityScore !== undefined) {
      return project.vitalityScore;
    }
    
    if (typeof project.healthScore === 'number') {
      return project.healthScore;
    }
    
    if (project.healthScore && typeof project.healthScore === 'object' && 'total' in project.healthScore) {
      return project.healthScore.total || 0;
    }
    
    return 0;
  };
  
  return (
    <Link to={`/project/${project.id}`} className="block">
      <Card variant="terminal" className="p-4 group hover:shadow-[0_0_20px_hsl(0_85%_52%_/_0.4)] transition-all cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-stranger font-bold text-primary text-lg truncate">
            {project.title}
          </h3>
          <Badge 
            variant="outline" 
            className={`${getStatusColor()} uppercase text-xs px-2 py-1 font-mono`}
          >
            {getStatusLabel()}
          </Badge>
        </div>
        
        <p className="text-muted-foreground font-mono text-sm mb-4 line-clamp-2">
          {project.repoInfo?.description || project.description}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
            <span>POWER: {getScoreValue()}%</span>
            <span>{project.repoInfo?.stars} STARS</span>
          </div>
          <HealthBar score={getScoreValue()} showLabel={false} size="sm" />
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {project.repoInfo?.language && (
            <Badge 
              variant="outline" 
              className="text-xs font-mono border-ghost-border text-muted-foreground"
            >
              {project.repoInfo.language}
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-ghost-green-dim" />
            <span className="text-xs font-mono text-ghost-green-dim truncate">
              {project.creatorRealName || project.creator || project.creatorGhostName || project.ghostName}
            </span>
          </div>
          
          {project.status === 'Seeking Successors' && (
            <Button 
              variant="terminal" 
              size="sm" 
              className="text-xs font-mono"
            >
              OPEN_GATE
            </Button>
          )}
        </div>
      </Card>
    </Link>
  );
};