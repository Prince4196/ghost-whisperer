import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { TerminalHeader } from '@/components/TerminalHeader';
import { AshParticles } from '@/components/AshParticles';
import { Radio, Loader2 } from 'lucide-react';
import { submitProject } from '@/lib/projectService';
import { useToast } from '@/hooks/use-toast';

const GhostSubmission = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [ghostLog, setGhostLog] = useState('');
  const [deadManSwitch, setDeadManSwitch] = useState('3');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { toast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Submit the project
      const result = await submitProject({
        title: projectTitle,
        githubUrl,
        ghostLog,
        deadManSwitch: parseInt(deadManSwitch)
      });
      
      if (result.success) {
        toast({
          title: 'Project Sent to the Void!',
          description: result.message,
          duration: 5000,
        });
        // Redirect to vault with a refresh flag to force data reload
        navigate('/vault?refresh=true');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error submitting project:', err);
      setError('Failed to open the Gate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AshParticles />
      <TerminalHeader />
      
      <main className="container py-8 relative z-10">
        <Card variant="terminal" className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Radio className="h-8 w-8 text-primary neon-drop-shadow" />
              <CardTitle className="text-2xl font-stranger">ENTER_THE_VOID</CardTitle>
            </div>
            <CardDescription className="font-mono text-muted-foreground">
              Send your project to the Upside Down. Set a Dead Man's Switch to keep the signal alive.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/20 border border-destructive rounded-sm font-mono text-destructive text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-mono text-sm text-primary">PROJECT_CODENAME</label>
                <Input
                  type="text"
                  placeholder="Enter project codename"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="bg-ghost-darker border-ghost-border font-mono text-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-mono text-sm text-primary">GITHUB_COORDINATES</label>
                <Input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="bg-ghost-darker border-ghost-border font-mono text-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-mono text-sm text-primary">SURVIVAL_LOG</label>
                <Textarea
                  placeholder="Leave survival notes, warnings, or important intel for future rescuers..."
                  value={ghostLog}
                  onChange={(e) => setGhostLog(e.target.value)}
                  className="bg-ghost-darker border-ghost-border font-mono text-primary min-h-[120px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-mono text-sm text-primary">DEAD_MAN_SWITCH</label>
                <select
                  value={deadManSwitch}
                  onChange={(e) => setDeadManSwitch(e.target.value)}
                  className="w-full bg-ghost-darker border border-ghost-border rounded-sm p-2 font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="3">3 MONTHS</option>
                  <option value="6">6 MONTHS</option>
                  <option value="12">12 MONTHS</option>
                </select>
              </div>
              
              <Button 
                type="submit" 
                variant="haunt" 
                size="xl" 
                className="w-full font-mono"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    OPENING_THE_GATE...
                  </>
                ) : (
                  'ENTER THE VOID'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default GhostSubmission;