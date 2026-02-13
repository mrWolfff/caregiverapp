import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { ElderProfile as ElderProfileType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {useNavigate} from "react-router-dom";

export default function ElderProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<ElderProfileType>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiService.getElderProfile();
        setProfile(data);
      } catch (error) {
        // Profile doesn't exist yet, use defaults
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (profile.id) {
        await apiService.updateElderProfile(profile);
      } else {
        await apiService.createElderProfile(profile);
      }
      toast({
        title: 'Perfil salvo',
        description: 'Seu perfil foi atualizado com sucesso.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar o perfil. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Meu Perfil</h1>
            <p className="text-muted-foreground">
              Complete seu perfil para ajudar os cuidadores a entenderem suas necessidades.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>Seus dados básicos de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={profile.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    placeholder="Rua Exemplo, 123"
                    value={profile.address}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="São Paulo"
                      value={profile.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      placeholder="SP"
                      value={profile.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contato de Emergência</CardTitle>
                <CardDescription>Alguém que possamos contatar em caso de emergência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Nome do Contato</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Maria Silva"
                    value={profile.emergencyContact}
                    onChange={(e) => updateField('emergencyContact', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Telefone do Contato</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="(11) 98888-8888"
                    value={profile.emergencyPhone}
                    onChange={(e) => updateField('emergencyPhone', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Perfil
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
