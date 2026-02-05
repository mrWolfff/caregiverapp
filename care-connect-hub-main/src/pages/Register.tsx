import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types';
import { Heart, Loader2, Mail, Lock, User, Users } from 'lucide-react';
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório').max(50),
  lastName: z.string().min(1, 'Sobrenome é obrigatório').max(50),
  email: z.string().email('Por favor, insira um e-mail válido'),
  password: z.string().min(6, 'Senha deve possuir ao menos 6 caracteres'),
});

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ELDER' as UserRole,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao cadastrar. Por favor, tente novamente!');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-warm items-center justify-center p-12">
        <div className="max-w-md text-accent-foreground text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Comece sua carreira de cuidador hoje
          </h2>
          <p className="text-accent-foreground/80 text-lg">
            Se você precisa de cuidados ou deseja oferecê-los, estamos aqui para ajudar você a se conectar.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="p-2 rounded-lg gradient-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl">CuidadorConnect</span>
            </Link>
            <h1 className="text-3xl font-heading font-bold text-foreground">Create your account</h1>
            <p className="mt-2 text-muted-foreground">Join our caring community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-3">
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('role', 'ELDER')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'ELDER'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <User className={`h-6 w-6 mx-auto mb-2 ${formData.role === 'ELDER' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${formData.role === 'ELDER' ? 'text-primary' : 'text-foreground'}`}>
                    Looking for Care
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => updateField('role', 'CAREGIVER')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'CAREGIVER'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Users className={`h-6 w-6 mx-auto mb-2 ${formData.role === 'CAREGIVER' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${formData.role === 'CAREGIVER' ? 'text-primary' : 'text-foreground'}`}>
                    Caregiver
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
