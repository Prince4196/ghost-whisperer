import { Ghost, Skull, Clock, Activity, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { TerminalText } from '@/components/TerminalText';
import { GhostParticles } from '@/components/GhostParticles';
import { TerminalHeader } from '@/components/TerminalHeader';
import { platformStats } from '@/lib/mockData';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <GhostParticles />
      <TerminalHeader />

      <main className="container py-8 relative z-10">
        {/* Hero Section */}
        <section className="py-16 text-center space-y-6">
          <div className="relative inline-block">
            <Skull className="h-20 w-20 text-primary mx-auto animate-float" />
            <div className="absolute inset-0 blur-2xl bg-primary/30 animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-mono">
            <span className="text-primary glow-text mr-2">GHOST</span>
            <span className="text-primary glow-text">PROJECT</span>
          </h1>

          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground font-mono text-sm md:text-base">
              <TerminalText 
                text="> Campus Legacy Salvage Yard. Where abandoned code finds new life." 
                typingSpeed={30}
              />
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button variant="haunt" size="xl" asChild>
              <Link to="/ghost-vault">
                <Ghost className="mr-2 h-5 w-5" />
                ENTER_VAULT
              </Link>
            </Button>
            <Button variant="terminal" size="xl" asChild>
              <Link to="/ghost-submission">
                <Zap className="mr-2 h-5 w-5" />
                GHOST_A_PROJECT
              </Link>
            </Button>
          </div>
        </section>

        {/* Terminal Stats Section */}
        <section className="py-8">
          <Card variant="terminal" className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 scanlines pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-6 border-b border-ghost-border pb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <span className="text-xs font-mono text-muted-foreground ml-2">
                GHOST_TERMINAL v2.0.4 — LIVE_STATS
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard
                icon={Ghost}
                label="RESURRECTED"
                value={platformStats.projectsResurrected}
                subtext="projects saved"
              />
              <StatCard
                icon={Clock}
                label="AWAITING"
                value={platformStats.ghostsAwaiting}
                subtext="need haunters"
              />
              <StatCard
                icon={Users}
                label="HAUNTERS"
                value={platformStats.totalHaunters}
                subtext="active devs"
              />
              <StatCard
                icon={Zap}
                label="SWITCHES"
                value={platformStats.activeSwitches}
                subtext="ticking down"
              />
              <StatCard
                icon={Activity}
                label="AVG_PULSE"
                value={`${platformStats.averageHealthScore}%`}
                subtext="health score"
              />
              <StatCard
                icon={Skull}
                label="OLDEST"
                value={platformStats.oldestGhost}
                subtext="still haunting"
              />
            </div>
          </Card>
        </section>

        {/* How It Works */}
        <section className="py-12">
          <h2 className="text-2xl font-mono font-bold text-primary mb-8 text-center glow-text">
            {'>'} HOW_IT_WORKS
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'GHOST_YOUR_CODE',
                description: 'Link your GitHub repo and set a Dead Man\'s Switch timer. Your project enters the vault.',
                icon: Ghost,
              },
              {
                step: '02',
                title: 'CHECK_IN_OR_LOSE',
                description: 'Miss your check-in deadline? Your project unlocks for the community to resurrect.',
                icon: Clock,
              },
              {
                step: '03',
                title: 'HAUNT_AND_BUILD',
                description: 'Find an expired project, claim it, and continue the legacy. Your name joins the lineage.',
                icon: Zap,
              },
            ].map((item) => (
              <Card key={item.step} variant="terminal" className="p-6 group">
                <div className="flex items-start gap-4">
                  <div className="text-3xl font-bold text-ghost-green-dim font-mono group-hover:text-primary transition-colors">
                    {item.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-mono font-semibold text-primary flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Phantom License Footer */}
        <footer className="py-8 border-t border-ghost-border mt-12">
          <div className="text-center space-y-2">
            <p className="text-xs font-mono text-muted-foreground">
              All ghosted projects are Campus Public Goods under the{' '}
              <span className="text-primary">MIT License</span>
            </p>
            <p className="text-xs font-mono text-ghost-green-dim">
              GHOST://PROJECT © 2024 • Built by the phantoms, for the phantoms
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
