import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Search, User, FileText, ClipboardList, Briefcase } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const elderActions = [
    {
      title: 'Create Care Request',
      description: 'Post a new care request for caregivers to find',
      icon: PlusCircle,
      href: '/care-requests/new',
      primary: true,
    },
    {
      title: 'My Requests',
      description: 'View and manage your care requests',
      icon: ClipboardList,
      href: '/my-requests',
    },
    {
      title: 'My Profile',
      description: 'Update your profile information',
      icon: User,
      href: '/elder/profile',
    },
  ];

  const caregiverActions = [
    {
      title: 'Find Care Jobs',
      description: 'Browse available care requests in your area',
      icon: Search,
      href: '/care-requests',
      primary: true,
    },
    {
      title: 'My Applications',
      description: 'Track your care request applications',
      icon: Briefcase,
      href: '/care-requests',
    },
    {
      title: 'My Profile',
      description: 'Update your caregiver profile',
      icon: User,
      href: '/caregiver/profile',
    },
  ];

  const actions = user?.role === 'ELDER' ? elderActions : caregiverActions;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Welcome Section */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              {user?.role === 'ELDER'
                ? 'Manage your care requests and connect with caregivers.'
                : 'Find care opportunities and grow your caregiving career.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-3">
            {actions.map((action) => (
              <Card
                key={action.href}
                className={`group transition-all hover:shadow-card ${
                  action.primary ? 'border-primary/20 bg-primary/5' : ''
                }`}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      action.primary
                        ? 'gradient-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <action.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={action.primary ? 'default' : 'outline'}
                    className="w-full"
                    asChild
                  >
                    <Link to={action.href}>
                      {action.primary ? 'Get Started' : 'View'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Role-specific Tips */}
          <Card className="mt-8 bg-secondary/50 border-secondary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary-foreground" />
                Quick Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-foreground">
                {user?.role === 'ELDER'
                  ? 'Complete your profile to help caregivers understand your needs better. A detailed profile attracts more qualified caregivers!'
                  : 'Keep your profile updated with your latest skills and availability. Elders are more likely to choose caregivers with complete profiles.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
