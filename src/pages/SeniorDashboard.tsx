import { useState, useEffect } from 'react';
import { Mail, ExternalLink, CheckCircle, Clock, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TerminalHeader } from '@/components/TerminalHeader';
import { GhostParticles } from '@/components/GhostParticles';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserEmail } from '@/lib/authService';

interface Application {
  id: string;
  projectId: string;
  projectName: string;
  seniorName: string;
  seniorEmail: string;
  juniorName: string;
  juniorEmail: string;
  reason: string;
  experience?: string;
  skills?: string;
  portfolio?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const SeniorDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const seniorEmail = await getCurrentUserEmail();
        if (!seniorEmail) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access your dashboard",
            variant: "destructive",
          });
          return;
        }

        // Get applications for projects owned by this senior
        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('seniorEmail', '==', seniorEmail));
        
        const querySnapshot = await getDocs(q);
        const appsList: Application[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          appsList.push({
            id: doc.id,
            projectId: data.projectId,
            projectName: data.projectName,
            seniorName: data.seniorName,
            seniorEmail: data.seniorEmail,
            juniorName: data.juniorName,
            juniorEmail: data.juniorEmail,
            reason: data.reason,
            experience: data.experience,
            skills: data.skills,
            portfolio: data.portfolio,
            status: data.status,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
          });
        });

        setApplications(appsList);
      } catch (err) {
        console.error('Error fetching applications:', err);
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleApprove = async (applicationId: string) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, {
        status: 'approved',
        updatedAt: new Date()
      });

      // Update the local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: 'approved' } : app
      ));

      toast({
        title: "Application Approved!",
        description: "The junior will be notified and you can now connect with them.",
      });
    } catch (err) {
      console.error('Error approving application:', err);
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, {
        status: 'rejected',
        updatedAt: new Date()
      });

      // Update the local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: 'rejected' } : app
      ));

      toast({
        title: "Application Rejected",
        description: "The junior will be notified of your decision.",
      });
    } catch (err) {
      console.error('Error rejecting application:', err);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success/20 text-success border-success';
      case 'rejected':
        return 'bg-destructive/20 text-destructive border-destructive';
      case 'pending':
      default:
        return 'bg-primary/20 text-primary border-primary';
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <GhostParticles />
      <TerminalHeader />

      <main className="container py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-mono text-primary glow-text mb-2">
            {'>'} SENIOR_DASHBOARD
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Manage applications from juniors interested in your projects.
          </p>
        </div>

        {/* Tab Navigation */}
        <Card variant="terminal" className="p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="uppercase text-xs"
              >
                {tab === 'all' ? 'ALL_APPLICATIONS' : 
                 tab === 'pending' ? 'PENDING' : 
                 tab === 'approved' ? 'APPROVED' : 
                 'REJECTED'}
                <span className="ml-1">
                  ({applications.filter(a => tab === 'all' || a.status === tab).length})
                </span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Applications List */}
        {loading ? (
          <Card variant="terminal" className="p-12 text-center">
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-mono text-lg">
                LOADING_APPLICATIONS...
              </p>
            </div>
          </Card>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} variant="terminal" className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-mono font-bold text-primary text-lg">
                      {application.projectName}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      Application from: {application.juniorName}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(application.status)} uppercase text-xs px-2 py-1 font-mono`}
                  >
                    {application.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-xs font-mono text-muted-foreground mb-1">WHY INTERESTED</h4>
                    <p className="text-sm font-mono text-foreground">
                      {application.reason}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-muted-foreground mb-1">SKILLS</h4>
                    <p className="text-sm font-mono text-foreground">
                      {application.skills || application.experience}
                    </p>
                  </div>
                </div>

                {application.portfolio && (
                  <div className="mb-4">
                    <h4 className="text-xs font-mono text-muted-foreground mb-1">PORTFOLIO/LINKEDIN</h4>
                    <a
                      href={application.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-mono text-primary hover:underline"
                    >
                      {application.portfolio}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-ghost-green-dim" />
                    <span className="text-xs font-mono text-ghost-green-dim">
                      {application.juniorEmail}
                    </span>
                  </div>

                  {application.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(application.id)}
                        className="text-xs font-mono"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        REJECT
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(application.id)}
                        className="text-xs font-mono"
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        APPROVE & CONNECT
                      </Button>
                    </div>
                  )}

                  {application.status === 'approved' && (
                    <Button
                      variant="default"
                      size="sm"
                      className="text-xs font-mono"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      CONNECT_NOW
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="terminal" className="p-12 text-center">
            <User className="h-16 w-16 text-ghost-green-dim mx-auto mb-4 animate-float" />
            <p className="text-muted-foreground font-mono">
              NO_APPLICATIONS_YET
            </p>
            <p className="text-xs text-ghost-green-dim font-mono mt-2">
              When juniors express interest in your projects, they will appear here.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SeniorDashboard;