import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { CaregiverProfile as CaregiverProfileType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, User, Briefcase, MapPin, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SKILL_OPTIONS = [
  'Cuidado Pessoal',
  'Preparo de Refeições',
  'Administração de Medicamentos',
  'Auxílio na Mobilidade',
  'Companhia',
  'Limpeza Leve',
  'Transporte',
  'Cuidado para Demência',
  'Suporte em Fisioterapia',
  'Primeiros Socorros/RCP',
];

export default function CaregiverProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<CaregiverProfileType>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    yearsOfExperience: 0,
    hourlyRate: 0,
    availableFrom: '09:00',
    availableTo: '17:00',
    city: '',
    state: '',
    skills: [],
    phone: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiService.getCaregiverProfile();
        setProfile(data);
      } catch (error) {
        // Profile doesn't exist yet
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
        await apiService.updateCaregiverProfile(profile);
      } else {
        await apiService.createCaregiverProfile(profile);
      }
      toast({
        title: 'Perfil salvo',
        description: 'Seu perfil foi atualizado com sucesso.',
      });
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

  const updateField = (field: string, value: string | number | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = profile.skills || [];
    if (currentSkills.includes(skill)) {
      updateField('skills', currentSkills.filter((s) => s !== skill));
    } else {
      updateField('skills', [...currentSkills, skill]);
    }
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
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Perfil do Cuidador</h1>
            <p className="text-muted-foreground">
              Um perfil completo ajuda os idosos a encontrarem e confiarem em você.
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
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    placeholder="Conte aos idosos sobre você, sua experiência e por que você ama cuidar de pessoas..."
                    value={profile.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Experience & Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Experiência e Valores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Anos de Experiência</Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      value={profile.yearsOfExperience}
                      onChange={(e) => updateField('yearsOfExperience', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Valor por Hora (R$)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      step="0.5"
                      value={profile.hourlyRate}
                      onChange={(e) => updateField('hourlyRate', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="availableFrom">Disponível de</Label>
                    <Input
                      id="availableFrom"
                      type="time"
                      value={profile.availableFrom}
                      onChange={(e) => updateField('availableFrom', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availableTo">Disponível até</Label>
                    <Input
                      id="availableTo"
                      type="time"
                      value={profile.availableTo}
                      onChange={(e) => updateField('availableTo', e.target.value)}
                      required
                    />
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
                <CardDescription>Onde você está disponível para trabalhar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Habilidades</CardTitle>
                <CardDescription>Selecione os serviços que você pode oferecer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => {
                    const isSelected = profile.skills?.includes(skill);
                    return (
                      <Badge
                        key={skill}
                        variant={isSelected ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all ${
                          isSelected ? '' : 'hover:bg-primary/10'
                        }`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                        {isSelected && <X className="h-3 w-3 ml-1" />}
                      </Badge>
                    );
                  })}
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
