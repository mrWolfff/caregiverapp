import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const careRequestSchema = z.object({
  description: z.string().min(20, 'Por favor, forneça uma descrição detalhada (pelo menos 20 caracteres)'),
  date: z.string().min(1, 'A data é obrigatória'),
  startTime: z.string().min(1, 'A hora de início é obrigatória'),
  endTime: z.string().min(1, 'A hora de término é obrigatória'),
  city: z.string().min(1, 'A cidade é obrigatória'),
  state: z.string().min(1, 'O estado é obrigatório'),
});

export default function CreateCareRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    city: '',
    state: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = careRequestSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const newRequest = await apiService.createCareRequest(formData);
      toast({
        title: 'Pedido de cuidado criado',
        description: 'Seu pedido de cuidado foi publicado com sucesso.',
      });
      navigate(`/care-requests/${newRequest.id}`);
    } catch (error) {
      if (error.status === 403) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/elder/profile');
      }
      toast({
        title: 'Erro',
        description: 'Falha ao criar o pedido de cuidado. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Criar Pedido de Cuidado
            </h1>
            <p className="text-muted-foreground">
              Descreva que tipo de cuidado você precisa e quando.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Detalhes do Cuidado
                </CardTitle>
                <CardDescription>
                  Descreva o tipo de cuidado necessário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Por favor, descreva o cuidado que você precisa. Inclua quaisquer requisitos específicos, condições de saúde a serem observadas ou instruções especiais..."
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={5}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Agendamento
                </CardTitle>
                <CardDescription>Quando você precisa de cuidado?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    min={minDate}
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className={errors.date ? 'border-destructive' : ''}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hora de Início
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => updateField('startTime', e.target.value)}
                      className={errors.startTime ? 'border-destructive' : ''}
                    />
                    {errors.startTime && (
                      <p className="text-sm text-destructive">{errors.startTime}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hora de Término
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => updateField('endTime', e.target.value)}
                      className={errors.endTime ? 'border-destructive' : ''}
                    />
                    {errors.endTime && (
                      <p className="text-sm text-destructive">{errors.endTime}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Localização
                </CardTitle>
                <CardDescription>Onde o cuidado é necessário?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="São Paulo"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      placeholder="SP"
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className={errors.state ? 'border-destructive' : ''}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Publicar Pedido de Cuidado'
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
