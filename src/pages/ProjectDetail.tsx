import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Ghost, Clock, Star, GitBranch, ExternalLink, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HealthBar } from '@/components/HealthBar';
import { LineageTree } from '@/components/LineageTree';
import { TerminalHeader } from '@/components/TerminalHeader';
import { GhostParticles } from '@/components/GhostParticles';
import { mockProjects } from '@/lib/mockData';
import { getGhostAge, getTimeUntilExpiry, getHealthColor } from '@/lib/healthScore';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <div className="container py-16 text-center">
          <Ghost className="h-20 w-20 text-ghost-green-dim mx-auto mb-4 animate-float" />
          <h1 className="text-2xl font-mono text-primary mb-2">PROJECT_NOT_FOUND</h1>
          <p className="text-muted-foreground font-mono text-sm mb-6">
            This ghost has vanished into the void...
          </p>
          <Button variant="terminal" asChild>
            <Link to="/vault">
              <ArrowLeft className="mr-2 h-4 w-4" />
              RETURN_TO_VAULT
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isExpired = project.status === 'expired';
  const timeLeft = getTimeUntilExpiry(project.expiryDate);
  const ghostAge = getGhostAge(project.createdAt);
  const healthColor = getHealthColor(project.healthScore.total);

  return (
    <div className="min-h-screen bg-background relative">
      <GhostParticles />
      <TerminalHeader />

      <main className="container py-8 relative z-10">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/vault">
            <ArrowLeft className="mr-2 h-4 w-4" />
            BACK_TO_VAULT
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card variant="terminal" className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 scanlines pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold font-mono text-primary glow-text">
                      {project.title}
                    </h1>
                    <Badge variant="generation">Gen {project.generation}</Badge>
                  </div>
                  <p className="text-muted-foreground font-mono text-sm">
                    {project.description}
                  </p>
                </div>

                {isExpired ? (
                  <Button variant="haunt" size="lg">
                    <Ghost className="mr-2 h-5 w-5" />
                    HAUNT_THIS_PROJECT
                  </Button>
                ) : (
                  <Button variant="terminal" size="lg" disabled>
                    <Clock className="mr-2 h-5 w-5" />
                    SWITCH_ACTIVE
                  </Button>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">GHOST</span>
                  <p className="text-primary truncate">{project.ghostName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">AGE</span>
                  <p className="text-foreground">{ghostAge}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">STARS</span>
                  <p className="text-foreground flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {project.stars}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">HAUNTERS</span>
                  <p className="text-foreground flex items-center gap-1">
                    <GitBranch className="h-3 w-3" />
                    {project.haunters.length}
                  </p>
                </div>
              </div>

              {/* Languages */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.languages.map((lang) => (
                  <Badge key={lang} variant="ghost">
                    {lang}
                  </Badge>
                ))}
              </div>

              {/* Repo Link */}
              <div className="mt-4 pt-4 border-t border-ghost-border">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {project.repoUrl}
                </a>
              </div>
            </Card>

            {/* Health Score Breakdown */}
            <Card variant="terminal" className="p-6">
              <h2 className="text-lg font-mono font-bold text-primary mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: healthColor }} />
                PULSE_ANALYSIS
              </h2>

              <div className="space-y-4">
                <HealthBar score={project.healthScore.total} size="lg" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {[
                    { label: 'DOCS', value: project.healthScore.documentation, max: 35 },
                    { label: 'STRUCTURE', value: project.healthScore.structure, max: 25 },
                    { label: 'FRESHNESS', value: project.healthScore.freshness, max: 20 },
                    { label: 'STABILITY', value: project.healthScore.stability, max: 20 },
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className="text-foreground">{metric.value}/{metric.max}</span>
                      </div>
                      <div className="h-1.5 bg-ghost-darker rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(metric.value / metric.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-ghost-border">
                  <span className="text-sm font-mono text-muted-foreground">STATUS:</span>
                  <Badge 
                    variant="health" 
                    style={{ borderColor: healthColor, color: healthColor }}
                  >
                    {project.healthScore.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Ghost Log */}
            <Card variant="terminal" className="p-6">
              <h2 className="text-lg font-mono font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                GHOST_LOG
              </h2>

              <div className="bg-ghost-darker border border-ghost-border rounded-sm p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 pb-3 border-b border-ghost-border">
                  <Ghost className="h-3 w-3" />
                  <span>Final transmission from {project.ghostName}</span>
                </div>
                <p className="text-sm font-mono text-foreground whitespace-pre-wrap">
                  {project.ghostLog}
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dead Man's Switch */}
            <Card variant="terminal" className={`p-6 ${isExpired ? 'border-destructive/50' : ''}`}>
              <h3 className="text-sm font-mono text-muted-foreground mb-4 flex items-center gap-2">
                {isExpired && <AlertTriangle className="h-4 w-4 text-destructive" />}
                DEAD_MANS_SWITCH
              </h3>

              <div className={`text-center py-6 rounded-sm border ${
                isExpired 
                  ? 'border-destructive/50 bg-destructive/10' 
                  : 'border-ghost-border bg-ghost-darker'
              }`}>
                <p className={`text-3xl font-bold font-mono ${
                  isExpired ? 'text-destructive' : 'text-primary glow-text'
                }`}>
                  {timeLeft}
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-2">
                  {isExpired ? 'SWITCH_EXPIRED • HAUNT_ENABLED' : 'UNTIL_EXPIRY'}
                </p>
              </div>

              {!isExpired && (
                <p className="text-xs text-muted-foreground font-mono mt-4 text-center">
                  Owner must check-in before expiry or project unlocks for haunting
                </p>
              )}
            </Card>

            {/* Lineage Tree */}
            <LineageTree project={project} />

            {/* Phantom License */}
            <Card variant="ghost" className="p-4">
              <p className="text-xs font-mono text-muted-foreground text-center">
                This project is a{' '}
                <span className="text-primary">Campus Public Good</span>{' '}
                under the MIT License
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
