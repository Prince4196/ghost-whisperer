import { useState, useEffect } from 'react';
import { Search, Ghost, Skull, Activity, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TerminalHeader } from '@/components/TerminalHeader';
import { GhostParticles } from '@/components/GhostParticles';
import { cn } from '@/lib/utils';
import { ProjectCard } from '@/components/ProjectCard';
import { collection, getDocs, query, orderBy, where, onSnapshot, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSearchParams } from 'react-router-dom';

interface FirestoreProject {
  id: string;
  title: string;
  githubUrl: string;
  ghostLog: string;
  healthScore: number;
  vitalityScore: number;
  status: string;
  creator: string;
  timestamp: Date;
  creatorGhostName: string;
  expiryDate: Date;
  createdAt: Date;
  lastCheckIn: Date;
  deadManSwitchMonths: number;
  repoInfo: {
    owner: string;
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
  };
}

const GhostVault = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Seeking Successors' | 'Active' | 'Progress Report'>('All');
  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Set up real-time listener for projects
    const projectsCollection = collection(db, 'projects');
    
    const unsubscribe = onSnapshot(
      projectsCollection,
      (snapshot) => {
        const projectsList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            githubUrl: data.githubUrl,
            ghostLog: data.ghostLog,
            healthScore: data.healthScore || 0,
            vitalityScore: data.vitalityScore || 0,
            status: data.status || 'Seeking',
            creator: data.creator || 'GhostUser',
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
            creatorGhostName: data.creatorGhostName,
            expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate() : new Date(),
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            lastCheckIn: data.lastCheckIn?.toDate ? data.lastCheckIn.toDate() : new Date(),
            deadManSwitchMonths: data.deadManSwitchMonths,
            repoInfo: data.repoInfo,
          };
        });
        
        setProjects(projectsList);
        setLoading(false);
        
        // If there's a refresh parameter, remove it from the URL after loading
        if (searchParams.get('refresh')) {
          window.history.replaceState({}, '', '/ghost-vault');
        }
      },
      (err) => {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setLoading(false);
      }
    );
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  // Filter projects based on the selected filter
  const getFilteredProjects = () => {
    let filtered = projects;
    
    // Apply status filter if not 'All'
    if (filter !== 'All') {
      filtered = filtered.filter(project => project.status === filter);
    }
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.repoInfo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort by vitalityScore (or healthScore as fallback) descending
    return filtered.sort((a, b) => {
      const scoreA = a.vitalityScore || a.healthScore || 0;
      const scoreB = b.vitalityScore || b.healthScore || 0;
      return scoreB - scoreA;
    });
  };

  const filteredProjects = getFilteredProjects();



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

        {/* Tab Navigation */}
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

            {/* Tab Filters */}
            <div className="flex gap-2">
                {(['All', 'Seeking Successors', 'Active', 'Progress Report'] as const).map((filterOption) => {
                const count = projects.filter(p => filterOption === 'All' || p.status === filterOption).length;
                
                return (
                  <Button
                    key={filterOption}
                    variant={filter === filterOption ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(filterOption)}
                    className="uppercase text-xs flex items-center gap-1"
                  >
                    {filterOption === 'Seeking Successors' ? <Skull className="h-4 w-4" /> :
                     filterOption === 'Active' ? <Activity className="h-4 w-4" /> :
                     filterOption === 'Progress Report' ? <FileText className="h-4 w-4" /> :
                     <Ghost className="h-4 w-4" />}
                    {filterOption}
                    <span className="ml-1">({count})</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Results count */}
        <div className="mb-4 text-xs font-mono text-muted-foreground">
          FOUND: {filteredProjects.length} GHOST(S)
        </div>

        {/* Projects Grid */}
        {loading ? (
          <Card variant="terminal" className="p-12 text-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-mono text-lg">
                SEARCHING_THE_VAULT...
              </p>
            </div>
          </Card>
        ) : error ? (
          <Card variant="terminal" className="p-12 text-center">
            <p className="text-destructive font-mono">
              {error}
            </p>
            <p className="text-muted-foreground font-mono text-sm mt-2">
              Please try refreshing the page
            </p>
          </Card>
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card variant="terminal" className="p-12 text-center">
            <Ghost className="h-16 w-16 text-ghost-green-dim mx-auto mb-4 animate-float" />
            <p className="text-muted-foreground font-mono">
              THE_VAULT_IS_CURRENTLY_EMPTY
            </p>
            <p className="text-xs text-ghost-green-dim font-mono mt-2">
              BE_THE_FIRST_TO_GHOST_A_PROJECT!
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
