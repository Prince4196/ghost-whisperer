import { useState } from 'react';
import { Search, Filter, Ghost, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/ProjectCard';
import { TerminalHeader } from '@/components/TerminalHeader';
import { GhostParticles } from '@/components/GhostParticles';
import { mockProjects } from '@/lib/mockData';
import { cn } from '@/lib/utils';

type SortField = 'health' | 'age' | 'stars' | 'expiry';
type FilterStatus = 'all' | 'available' | 'expired';

const GhostVault = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('health');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filteredProjects = mockProjects
    .filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = filterStatus === 'all' ||
        (filterStatus === 'expired' && project.status === 'expired') ||
        (filterStatus === 'available' && project.status !== 'expired');

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'health':
          comparison = b.healthScore.total - a.healthScore.total;
          break;
        case 'age':
          comparison = b.createdAt.getTime() - a.createdAt.getTime();
          break;
        case 'stars':
          comparison = b.stars - a.stars;
          break;
        case 'expiry':
          comparison = a.expiryDate.getTime() - b.expiryDate.getTime();
          break;
      }
      return sortAsc ? -comparison : comparison;
    });

  const expiredCount = mockProjects.filter(p => p.status === 'expired').length;

  return (
    <div className="min-h-screen bg-background relative">
      <GhostParticles />
      <TerminalHeader />

      <main className="container py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-mono text-primary glow-text mb-2">
            {'>'} GHOST_VAULT
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Browse the repository of ghosted projects. Find one to resurrect.
          </p>
        </div>

        {/* Controls */}
        <Card variant="terminal" className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects, languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-ghost-darker border border-ghost-border rounded-sm text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_10px_hsl(120_100%_50%_/_0.3)] transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {(['all', 'expired', 'available'] as FilterStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="uppercase text-xs"
                >
                  {status}
                  {status === 'expired' && (
                    <Badge variant="ghost" className="ml-1 px-1">
                      {expiredCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="bg-ghost-darker border border-ghost-border rounded-sm px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              >
                <option value="health">SORT: HEALTH</option>
                <option value="age">SORT: AGE</option>
                <option value="stars">SORT: STARS</option>
                <option value="expiry">SORT: EXPIRY</option>
              </select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortAsc(!sortAsc)}
                className="h-9 w-9"
              >
                {sortAsc ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </Card>

        {/* Results count */}
        <div className="mb-4 text-xs font-mono text-muted-foreground">
          FOUND: {filteredProjects.length} GHOST(S)
          {filterStatus === 'expired' && ' • READY_TO_HAUNT'}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card variant="terminal" className="p-12 text-center">
            <Ghost className="h-16 w-16 text-ghost-green-dim mx-auto mb-4 animate-float" />
            <p className="text-muted-foreground font-mono">
              NO_GHOSTS_FOUND
            </p>
            <p className="text-xs text-ghost-green-dim font-mono mt-2">
              Try adjusting your search or filters
            </p>
          </Card>
        )}

        {/* Phantom License Footer */}
        <footer className="py-8 border-t border-ghost-border mt-12">
          <div className="text-center space-y-2">
            <p className="text-xs font-mono text-muted-foreground">
              All ghosted projects are Campus Public Goods under the{' '}
              <span className="text-primary">MIT License</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default GhostVault;
