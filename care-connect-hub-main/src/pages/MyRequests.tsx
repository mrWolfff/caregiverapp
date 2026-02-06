import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { apiService } from '@/services/api';
import { CareRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Clock, ArrowRight, PlusCircle, FileText } from 'lucide-react';

export default function MyRequests() {
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await apiService.getMyRequests();
        setRequests(data);
      } catch (error) {
        console.error('Failed to load requests:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRequests();
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'default';
      case 'ASSIGNED':
        return 'secondary';
      case 'COMPLETED':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Meus Pedidos de Cuidado
              </h1>
              <p className="text-muted-foreground">
                Gerencie seus pedidos de cuidado publicados
              </p>
            </div>
            <Button asChild>
              <Link to="/care-requests/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Pedido
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : requests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum pedido ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Crie seu primeiro pedido de cuidado para encontrar um cuidador.
                </p>
                <Button asChild>
                  <Link to="/care-requests/new">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Criar Pedido de Cuidado
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card
                  key={request.id}
                  className="group hover:shadow-card transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(request.status)}>
                            {request.status === 'OPEN' ? 'ABERTO' : 
                             request.status === 'ASSIGNED' ? 'ATRIBUÍDO' : 
                             request.status === 'COMPLETED' ? 'CONCLUÍDO' : request.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                          {request.description.substring(0, 100)}
                          {request.description.length > 100 ? '...' : ''}
                        </CardTitle>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/care-requests/${request.id}`}>
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {request.city}, {request.state}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(request.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(request.startTime)} - {formatTime(request.endTime)}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" asChild>
                        <Link to={`/care-requests/${request.id}`}>
                          Ver Detalhes e Candidaturas
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
