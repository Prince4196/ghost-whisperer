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
import { Ghost, Loader2 } from 'lucide-react';
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
          title: 'Project Ghosted Successfully!',
          description: result.message,
          duration: 5000,
        });
        // Redirect to success page or vault
        navigate('/vault');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error submitting project:', err);
      setError('Failed to submit project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <TerminalHeader />
      
      <main className="container py-8 relative z-10">
        <Card variant="terminal" className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Ghost className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-mono">GHOST_A_PROJECT</CardTitle>
            </div>
            <CardDescription className="font-mono text-muted-foreground">
              Submit your project to the vault. Set a Dead Man's Switch timer to keep it alive.
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
                <label className="font-mono text-sm text-primary">PROJECT_TITLE</label>
                <Input
                  type="text"
                  placeholder="Enter project title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="bg-ghost-darker border-ghost-border font-mono text-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-mono text-sm text-primary">GITHUB_REPOSITORY_URL</label>
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
                <label className="font-mono text-sm text-primary">GHOST_LOG</label>
                <Textarea
                  placeholder="Leave handover notes, tips, or important information for future maintainers..."
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
                variant="terminal" 
                size="xl" 
                className="w-full font-mono"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    SCANNING_REPOSITORY...
                  </>
                ) : (
                  'GHOST_PROJECT'
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