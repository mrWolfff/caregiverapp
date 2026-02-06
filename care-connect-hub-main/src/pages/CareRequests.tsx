import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { apiService } from '@/services/api';
import { CareRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

export default function CareRequests() {
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', state: '' });

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getCareRequests(
        filters.city || filters.state ? filters : undefined
      );
      setRequests(data);
    } catch (error) {
      console.error('Failed to load care requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRequests();
  };

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Encontrar Oportunidades de Cuidado
            </h1>
            <p className="text-muted-foreground">
              Navegue pelos pedidos de cuidado abertos na sua área
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="Filtrar por cidade..."
                    value={filters.city}
                    onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    placeholder="Filtrar por estado..."
                    value={filters.state}
                    onChange={(e) => setFilters((prev) => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : requests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Nenhum pedido de cuidado encontrado. Tente ajustar seus filtros.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ city: '', state: '' });
                    loadRequests();
                  }}
                >
                  Limpar Filtros
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
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={request.status === 'OPEN' ? 'default' : 'secondary'}
                          >
                            {request.status === 'OPEN' ? 'ABERTO' : request.status}
                          </Badge>
                          {request.elderName && (
                            <span className="text-sm text-muted-foreground">
                              por {request.elderName}
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-1">
                          {request.description.substring(0, 60)}
                          {request.description.length > 60 ? '...' : ''}
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
                      <Button asChild>
                        <Link to={`/care-requests/${request.id}`}>Ver Detalhes</Link>
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
