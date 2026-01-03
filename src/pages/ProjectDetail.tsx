import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Ghost, Clock, Star, GitBranch, ExternalLink, FileText, AlertTriangle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HealthBar } from '@/components/HealthBar';
import { LineageTree } from '@/components/LineageTree';
import { TerminalHeader } from '@/components/TerminalHeader';
import { GhostParticles } from '@/components/GhostParticles';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserRealName, getCurrentUserEmail } from '@/lib/authService';
import { getGhostAge, getTimeUntilExpiry, getHealthColor } from '@/lib/healthScore';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
        
        const projectDocRef = doc(db, 'projects', id);
        const projectDoc = await getDoc(projectDocRef);
        
        if (projectDoc.exists()) {
          const data = projectDoc.data();
          setProject({
            id: projectDoc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate() : new Date(),
            lastCheckIn: data.lastCheckIn?.toDate ? data.lastCheckIn.toDate() : new Date(),
          });
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <div className="container py-16 text-center">
          <Ghost className="h-20 w-20 text-ghost-green-dim mx-auto mb-4 animate-float" />
          <h1 className="text-2xl font-mono text-primary mb-2">PROJECT_NOT_FOUND</h1>
          <p className="text-muted-foreground font-mono text-sm mb-6">
            {error}
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

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <div className="container py-16 text-center">
          <div className="flex flex-col items-center">
            <Ghost className="h-20 w-20 text-ghost-green-dim mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-mono text-primary mb-2">LOADING_PROJECT...</h1>
            <p className="text-muted-foreground font-mono text-sm">Scanning the ghost vault</p>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = new Date() > project.expiryDate;
  const timeLeft = getTimeUntilExpiry(project.expiryDate);
  const ghostAge = getGhostAge(project.createdAt);
  const healthColor = getHealthColor(project.vitalityScore || project.healthScore?.total || 0);
  
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [interestAnswers, setInterestAnswers] = useState({
    reason: '',
    experience: '',
    portfolio: ''
  });
  
  const handleInterestSubmit = async () => {
    try {
      const juniorName = await getCurrentUserRealName();
      const juniorEmail = await getCurrentUserEmail();
      
      if (!juniorName || !juniorEmail) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit interest in this project",
          variant: "destructive",
        });
        return;
      }
      
      // Create application in the applications collection
      const applicationData = {
        projectId: id,
        projectName: project.title,
        seniorName: project.creator,
        seniorEmail: project.creatorEmail,
        juniorName,
        juniorEmail,
        reason: interestAnswers.reason,
        skills: interestAnswers.experience,
        portfolio: interestAnswers.portfolio,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await addDoc(collection(db, 'applications'), applicationData);
      
      toast({
        title: "Interest Submitted!",
        description: "Your interest application has been submitted to the project senior.",
      });
      
      // Reset form and close it
      setInterestAnswers({ reason: '', experience: '', portfolio: '' });
      setShowInterestForm(false);
    } catch (err) {
      console.error('Error submitting interest:', err);
      toast({
        title: "Error",
        description: "Failed to submit interest application",
        variant: "destructive",
      });
    }
  };

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

                {!showInterestForm ? (
                  <Button variant="haunt" size="lg" onClick={() => setShowInterestForm(true)}>
                    <User className="mr-2 h-5 w-5" />
                    EXPRESSION_OF_INTEREST
                  </Button>
                ) : (
                  <div className="space-y-3 w-full max-w-md">
                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1 block">Why do you want to work on this project?</label>
                      <textarea
                        value={interestAnswers.reason}
                        onChange={(e) => setInterestAnswers({...interestAnswers, reason: e.target.value})}
                        className="w-full p-2 bg-ghost-darker border border-ghost-border rounded-sm text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        rows={3}
                        placeholder="Explain your interest..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1 block">What are your key skills (Tech Stack)?</label>
                      <input
                        type="text"
                        value={interestAnswers.experience}
                        onChange={(e) => setInterestAnswers({...interestAnswers, experience: e.target.value})}
                        className="w-full p-2 bg-ghost-darker border border-ghost-border rounded-sm text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        placeholder="React, Node, Python..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1 block">Provide your LinkedIn or Portfolio link</label>
                      <input
                        type="text"
                        value={interestAnswers.portfolio}
                        onChange={(e) => setInterestAnswers({...interestAnswers, portfolio: e.target.value})}
                        className="w-full p-2 bg-ghost-darker border border-ghost-border rounded-sm text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowInterestForm(false)}>
                        CANCEL
                      </Button>
                      <Button variant="default" size="sm" onClick={handleInterestSubmit}>
                        SUBMIT_APPLICATION
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">SENIOR</span>
                  <p className="text-primary truncate">{project.creator}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">AGE</span>
                  <p className="text-foreground">{ghostAge}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">STARS</span>
                  <p className="text-foreground flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {project.repoInfo?.stars || project.stars || 0}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">INTERESTED</span>
                  <p className="text-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {project.interested_juniors?.length || 0}
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
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {project.githubUrl}
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
                <HealthBar score={project.vitalityScore || project.healthScore?.total || 0} size="lg" />

                <div className="text-center py-6">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute w-32 h-32 rounded-full border-4 border-ghost-green-dim/20"></div>
                    <div className="absolute w-28 h-28 rounded-full border-4 border-ghost-green-dim/40"></div>
                    <div className="absolute w-24 h-24 rounded-full border-4 border-ghost-green-dim/60"></div>
                    <div className="text-3xl font-bold font-mono text-primary">
                      {project.vitalityScore || project.healthScore?.total || 0}%
                    </div>
                  </div>
                  <p className="text-sm font-mono text-muted-foreground mt-2">VITALITY PULSE</p>
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
                  <span>Project Notes from {project.creator}</span>
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
