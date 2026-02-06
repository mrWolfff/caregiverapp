import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Shield, Users, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import {APP_CONFIG} from "@/lib/utils.ts";

export default function Index() {
  const features = [
    {
      icon: Shield,
      title: 'Cuidadores de Confiança',
      description: 'Todos os cuidadores são verificados e passam por checagem de antecedentes para sua tranquilidade.',
    },
    {
      icon: Users,
      title: 'Combinação Perfeita',
      description: 'Encontre cuidadores que correspondam às suas necessidades específicas, horários e localização.',
    },
    {
      icon: Clock,
      title: 'Agendamento Flexível',
      description: 'Reserve cuidados quando precisar, desde algumas horas até suporte contínuo.',
    },
  ];

  const steps = [
    { step: 1, title: 'Crie seu Perfil', description: 'Conte-nos sobre suas necessidades de cuidado ou sua experiência como cuidador.' },
    { step: 2, title: 'Publique ou Encontre Vagas', description: 'Idosos postam necessidades de cuidado; cuidadores buscam oportunidades.' },
    { step: 3, title: 'Conecte-se e Cuide', description: 'Revise candidaturas, aceite matches e comece o atendimento.' },
  ];

  return (
      <Layout>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 gradient-primary opacity-5" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
                <Heart className="h-4 w-4" />
                Cuidado Compassivo, Conectado
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
                Encontre cuidadores de confiança na sua{' '}
                <span className="text-primary">Comunidade</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                A {APP_CONFIG.appName} une famílias que buscam cuidados de qualidade a cuidadores dedicados prontos para ajudar. Simples, seguro e humano.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-base">
                  <Link to="/register">
                    Começar Agora
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base">
                  <Link to="/login">Entrar</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Por que escolher o {APP_CONFIG.appName}?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tornamos a busca por cuidados de qualidade simples e livre de estresse.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature) => (
                  <Card key={feature.title} className="text-center group hover:shadow-card transition-all">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <feature.icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Como Funciona
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Começar é fácil. Siga estes passos simples.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((item, index) => (
                  <div key={item.step} className="relative">
                    {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                    )}
                    <div className="relative text-center">
                      <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground relative z-10">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-heading font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto overflow-hidden">
              <div className="grid md:grid-cols-2">
                <CardContent className="p-8 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
                    Pronto para Começar?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Junte-se a milhares de famílias e cuidadores que já se conectaram através do {APP_CONFIG.appName}.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {['Criação de conta gratuita', 'Sem compromisso obrigatório', 'Encontre cuidado na sua região'].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-success" />
                          {item}
                        </li>
                    ))}
                  </ul>
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Criar Conta Gratuita
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
                <div className="gradient-primary hidden md:flex items-center justify-center p-12">
                  <div className="text-center text-primary-foreground">
                    <Heart className="h-16 w-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-medium opacity-90">
                      Cuidando de quem é mais importante para você
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg gradient-primary">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold">{APP_CONFIG.appName}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {APP_CONFIG.appName}. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </Layout>
  );
}