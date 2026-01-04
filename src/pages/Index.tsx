import { useState } from 'react';
import { Radio, Bike, Clock, Activity, Users, Zap, Dices } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { TerminalText } from '@/components/TerminalText';
import { AshParticles } from '@/components/AshParticles';
import { TerminalHeader } from '@/components/TerminalHeader';
import { ChristmasLightsTitle } from '@/components/ChristmasLightsTitle';
import { UpsideDownToggle } from '@/components/UpsideDownToggle';
import { platformStats } from '@/lib/mockData';

const Index = () => {
  const [isUpsideDown, setIsUpsideDown] = useState(false);

  return (
    <motion.div 
      className={`min-h-screen bg-background relative ${isUpsideDown ? 'upside-down-mode' : ''}`}
      animate={{ 
        rotate: isUpsideDown ? 180 : 0,
        filter: isUpsideDown ? 'grayscale(100%) contrast(150%)' : 'none'
      }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <AshParticles />
      <TerminalHeader />

      <main className="container py-8 relative z-10">
        {/* Hero Section */}
        <section className="py-16 text-center space-y-6">
          <div className="relative inline-block">
            <Bike className="h-20 w-20 text-primary mx-auto animate-float neon-drop-shadow" />
            <div className="absolute inset-0 blur-2xl bg-primary/30 animate-pulse" />
          </div>

          <div className="space-y-2">
            <ChristmasLightsTitle 
              text="STRANGER CODE" 
              className="text-4xl md:text-6xl font-bold"
            />
            <h2 className="text-xl md:text-2xl font-stranger text-muted-foreground">
              The Upside Down of Abandoned Projects
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground font-mono text-sm md:text-base">
              <TerminalText 
                text="> Hawkins Lab for Code Resurrection. Where abandoned projects escape the void." 
                typingSpeed={30}
              />
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-4 flex-wrap">
            <Button variant="haunt" size="xl" asChild>
              <Link to="/vault">
                <Zap className="mr-2 h-5 w-5" />
                OPEN THE GATE
              </Link>
            </Button>
            <Button variant="terminal" size="xl" asChild>
              <Link to="/ghost-submission">
                <Radio className="mr-2 h-5 w-5" />
                SEND TO THE VOID
              </Link>
            </Button>
            <UpsideDownToggle 
              isUpsideDown={isUpsideDown} 
              onToggle={setIsUpsideDown} 
            />
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
                HAWKINS_LAB v11.0 — GATE_ANOMALIES
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard
                icon={Zap}
                label="RESCUED"
                value={platformStats.projectsResurrected}
                subtext="from the void"
              />
              <StatCard
                icon={Clock}
                label="IN_LIMBO"
                value={platformStats.ghostsAwaiting}
                subtext="need The Party"
              />
              <StatCard
                icon={Users}
                label="THE_PARTY"
                value={platformStats.totalHaunters}
                subtext="active devs"
              />
              <StatCard
                icon={Radio}
                label="SIGNALS"
                value={platformStats.activeSwitches}
                subtext="broadcasting"
              />
              <StatCard
                icon={Activity}
                label="POWER_LVL"
                value={`${platformStats.averageHealthScore}%`}
                subtext="avg vitality"
              />
              <StatCard
                icon={Dices}
                label="VETERAN"
                value={platformStats.oldestGhost}
                subtext="longest survival"
              />
            </div>
          </Card>
        </section>

        {/* How It Works */}
        <section className="py-12">
          <h2 className="text-2xl font-stranger font-bold text-primary mb-8 text-center glow-text">
            {'>'} SURVIVAL_PROTOCOL
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'ENTER_THE_VOID',
                description: 'Link your GitHub repo and set a Dead Man\'s Switch. Your project enters the Upside Down.',
                icon: Radio,
              },
              {
                step: '02',
                title: 'SIGNAL_OR_VANISH',
                description: 'Miss your check-in deadline? Your project becomes a Gate Anomaly for The Party to rescue.',
                icon: Clock,
              },
              {
                step: '03',
                title: 'RESCUE_MISSION',
                description: 'Find a lost project, claim it with telekinesis, and continue the legacy. Join The Party.',
                icon: Zap,
              },
            ].map((item) => (
              <Card key={item.step} variant="terminal" className="p-6 group">
                <div className="flex items-start gap-4">
                  <div className="text-3xl font-bold text-ghost-green-dim font-mono group-hover:text-primary transition-colors">
                    {item.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-stranger font-semibold text-primary flex items-center gap-2">
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

        {/* Footer with Quote */}
        <footer className="py-8 border-t border-ghost-border mt-12">
          <div className="text-center space-y-4">
            <p className="text-lg font-stranger text-muted-foreground italic">
              "Friends don't lie."
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              All rescued projects are Campus Public Goods under the{' '}
              <span className="text-primary">MIT License</span>
            </p>
            <p className="text-xs font-mono text-ghost-green-dim">
              STRANGER://CODE © 1983 • Built by The Party, for The Party
            </p>
          </div>
        </footer>
      </main>
    </motion.div>
  );
};

export default Index;