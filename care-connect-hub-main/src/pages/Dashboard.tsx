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
