import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Search, User, FileText, ClipboardList, Briefcase, Calendar, Clock, MapPin, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { apiService } from '@/services/api';
import { CareRequest, CareApplication } from '@/types';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentRequests, setRecentRequests] = useState<CareRequest[]>([]);
  const [recentApplications, setRecentApplications] = useState<CareApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        if (user?.role === 'ELDER') {
          const requests = await apiService.getMyRequests();
          // Filter requests with status ASSIGNED or just recent ones
          setRecentRequests(requests.filter(r => r.status === 'ASSIGNED').slice(0, 3));
        } else if (user?.role === 'CAREGIVER') {
          const apps = await apiService.getMyApplications();
          // Filter apps with status ACCEPTED or just recent ones
          setRecentApplications(apps.filter(a => a.status === 'ACCEPTED').slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const elderActions = [
    {
      title: 'Criar Pedido de Cuidado',
      description: 'Publique um novo pedido para cuidadores encontrarem',
      icon: PlusCircle,
      href: '/care-requests/new',
      primary: true,
    },
    {
      title: 'Meus Pedidos',
      description: 'Visualize e gerencie seus pedidos de cuidado',
      icon: ClipboardList,
      href: '/my-requests',
    },
    {
      title: 'Meu Perfil',
      description: 'Atualize suas informações de perfil',
      icon: User,
      href: '/elder/profile',
    },
  ];

  const caregiverActions = [
    {
      title: 'Buscar Vagas',
      description: 'Veja os pedidos de cuidado disponíveis na sua área',
      icon: Search,
      href: '/care-requests',
      primary: true,
    },
    {
      title: 'Minhas Candidaturas',
      description: 'Acompanhe suas candidaturas a pedidos de cuidado',
      icon: Briefcase,
      href: '/care-requests',
    },
    {
      title: 'Meu Perfil',
      description: 'Atualize seu perfil de cuidador',
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
              Bem-vindo de volta, {user?.firstName}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              {user?.role === 'ELDER'
                ? 'Gerencie seus pedidos de cuidado e conecte-se com cuidadores.'
                : 'Encontre oportunidades de cuidado e cresça sua carreira.'}
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
                      {action.primary ? 'Começar' : 'Visualizar'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent/Active Activities */}
          {user?.role === 'ELDER' && recentRequests.length > 0 && (
            <div className="mt-12 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold">Solicitações Ativas (Aceitas)</h2>
                <Button variant="ghost" asChild>
                  <Link to="/my-requests" className="flex items-center gap-1">
                    Ver todos <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4">
                {recentRequests.map((request) => (
                  <Card key={request.id} className="border-primary/20 hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" /> Aceito
                            </Badge>
                          </div>
                          <CardTitle className="text-lg line-clamp-1">
                            {request.description}
                          </CardTitle>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/care-requests/${request.id}`}>Detalhes</Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(request.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTime(request.startTime)} - {formatTime(request.endTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.city}, {request.state}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {user?.role === 'CAREGIVER' && recentApplications.length > 0 && (
            <div className="mt-12 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold">Candidaturas Aceitas</h2>
                <Button variant="ghost" asChild>
                  <Link to="/care-requests" className="flex items-center gap-1">
                    Ver todos <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4">
                {recentApplications.map((app) => (
                  <Card key={app.id} className="border-primary/20 hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" /> Aceita
                            </Badge>
                          </div>
                          <CardTitle className="text-lg line-clamp-1">
                            {app.caregiverName ? `Candidatura de ${app.caregiverName}` : `Candidatura ${app.id.substring(0, 8)}`}
                          </CardTitle>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/care-requests/${app.careRequestId}`}>Detalhes</Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Aplicado em: {new Date(app.appliedAt).toLocaleDateString('pt-BR')}
                        </div>
                        {app.message && (
                          <div className="w-full mt-1 text-xs italic line-clamp-1">
                            "{app.message}"
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Role-specific Tips */}
          <Card className="mt-8 bg-secondary/50 border-secondary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary-foreground" />
                Dica Rápida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-foreground">
                {user?.role === 'ELDER'
                  ? 'Complete seu perfil para ajudar os cuidadores a entenderem melhor suas necessidades. Um perfil detalhado atrai cuidadores mais qualificados!'
                  : 'Mantenha seu perfil atualizado com suas últimas habilidades e disponibilidade. Os idosos têm mais probabilidade de escolher cuidadores com perfis completos.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
