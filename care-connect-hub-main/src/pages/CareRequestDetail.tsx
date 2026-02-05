import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { CareRequest, CareApplication } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Loader2,
  MapPin,
  Calendar,
  Clock,
  User,
  Send,
  CheckCircle,
  ArrowLeft,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CareRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [request, setRequest] = useState<CareRequest | null>(null);
  const [applications, setApplications] = useState<CareApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const requestData = await apiService.getCareRequest(id);
        setRequest(requestData);

        // If user is elder and owns this request, load applications
        if (user?.role === 'ELDER') {
          try {
            const apps = await apiService.getApplicationsForRequest(id);
            setApplications(apps);
          } catch (error) {
            // May not have applications or not authorized
          }
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load care request.',
          variant: 'destructive',
        });
        navigate('/care-requests');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, user?.role]);

  const handleApply = async () => {
    if (!id) return;

    setIsApplying(true);
    try {
      await apiService.applyToCareRequest(id, applicationMessage);
      toast({
        title: 'Application sent!',
        description: 'The elder will review your application.',
      });
      setDialogOpen(false);
      setApplicationMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply. You may have already applied.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleAccept = async (applicationId: string) => {
    if (!id) return;

    setAcceptingId(applicationId);
    try {
      await apiService.acceptApplication(id, applicationId);
      toast({
        title: 'Caregiver accepted!',
        description: 'The caregiver has been notified.',
      });
      // Reload the request to see updated status
      const requestData = await apiService.getCareRequest(id);
      setRequest(requestData);
      const apps = await apiService.getApplicationsForRequest(id);
      setApplications(apps);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept caregiver.',
        variant: 'destructive',
      });
    } finally {
      setAcceptingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!request) {
    return null;
  }

  const isElderOwner = user?.role === 'ELDER';
  const canApply = user?.role === 'CAREGIVER' && request.status === 'OPEN';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Main Request Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        request.status === 'OPEN'
                          ? 'default'
                          : request.status === 'ASSIGNED'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">Care Request Details</CardTitle>
                  {request.elderName && (
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <User className="h-4 w-4" />
                      Posted by {request.elderName}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Schedule & Location */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </div>
                  <p className="font-medium">{formatDate(request.date)}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    Time
                  </div>
                  <p className="font-medium">
                    {formatTime(request.startTime)} - {formatTime(request.endTime)}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <p className="font-medium">
                  {request.city}, {request.state}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>

              {/* Apply Button for Caregivers */}
              {canApply && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Apply for this Care Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply for Care Request</DialogTitle>
                      <DialogDescription>
                        Introduce yourself to the elder
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="message">Message (optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell the elder why you're a great fit for this care request..."
                          value={applicationMessage}
                          onChange={(e) => setApplicationMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleApply} disabled={isApplying}>
                        {isApplying ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Application
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          {/* Applications Section (Elder only) */}
          {isElderOwner && (
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-bold">
                Applications ({applications.length})
              </h2>

              {applications.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No applications yet. Caregivers will appear here when they apply.
                  </CardContent>
                </Card>
              ) : (
                applications.map((app) => (
                  <Card key={app.id} className={app.status === 'ACCEPTED' ? 'border-success' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            {app.caregiverName}
                            {app.status === 'ACCEPTED' && (
                              <Badge variant="default" className="bg-success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accepted
                              </Badge>
                            )}
                          </CardTitle>
                          {(app.yearsOfExperience || app.hourlyRate) && (
                            <CardDescription className="flex items-center gap-4 mt-1">
                              {app.yearsOfExperience && (
                                <span className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4" />
                                  {app.yearsOfExperience} years exp.
                                </span>
                              )}
                              {app.hourlyRate && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  ${app.hourlyRate}/hr
                                </span>
                              )}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {app.caregiverBio && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {app.caregiverBio}
                        </p>
                      )}
                      {app.message && (
                        <div className="p-3 rounded-lg bg-muted/50 mb-4">
                          <p className="text-sm italic">"{app.message}"</p>
                        </div>
                      )}
                      {request.status === 'OPEN' && app.status === 'PENDING' && (
                        <Button
                          onClick={() => handleAccept(app.id)}
                          disabled={!!acceptingId}
                          variant="success"
                        >
                          {acceptingId === app.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Accepting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept Caregiver
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
