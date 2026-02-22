import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// Mock data for courses
const COURSES = [
  {
    id: 1,
    title: 'Fundamentos do Cuidado Pessoal',
    skill: 'Cuidado Pessoal',
    duration: '2h',
    lessons: 5,
    description: 'Aprenda as melhores práticas para auxiliar idosos na higiene e cuidados diários.',
  },
  {
    id: 2,
    title: 'Nutrição e Preparo de Refeições para Idosos',
    skill: 'Preparo de Refeições',
    duration: '3h',
    lessons: 8,
    description: 'Como preparar refeições nutritivas e adaptadas às necessidades dietéticas comuns na terceira idade.',
  },
  {
    id: 3,
    title: 'Segurança na Administração de Medicamentos',
    skill: 'Administração de Medicamentos',
    duration: '1.5h',
    lessons: 4,
    description: 'Protocolos de segurança, horários e como evitar erros comuns na medicação.',
  },
  {
    id: 4,
    title: 'Técnicas de Transferência e Mobilidade',
    skill: 'Auxílio na Mobilidade',
    duration: '4h',
    lessons: 10,
    description: 'Como auxiliar na movimentação e transferência de forma segura para o idoso e para o cuidador.',
  },
  {
    id: 5,
    title: 'Comunicação e Companhia',
    skill: 'Companhia',
    duration: '2h',
    lessons: 6,
    description: 'Desenvolva habilidades de escuta ativa e atividades recreativas para o bem-estar mental.',
  },
  {
    id: 6,
    title: 'Cuidado Especializado em Demência e Alzheimer',
    skill: 'Cuidado para Demência',
    duration: '6h',
    lessons: 15,
    description: 'Estratégias avançadas para lidar com comportamentos desafiadores e garantir qualidade de vida.',
  },
  {
    id: 7,
    title: 'Primeiros Socorros para Idosos',
    skill: 'Primeiros Socorros/RCP',
    duration: '5h',
    lessons: 12,
    description: 'Curso certificado de primeiros socorros focado em emergências comuns na terceira idade.',
  },
];

export default function Education() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Educação e Treinamento
          </h1>
          <p className="text-muted-foreground">
            Aprimore suas habilidades e ofereça o melhor cuidado possível através dos nossos cursos especializados.
          </p>
        </div>

        <div className="space-y-12">
          {SKILL_OPTIONS.map((skill) => {
            const skillCourses = COURSES.filter(course => course.skill === skill);
            
            return (
              <section key={skill} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-foreground">{skill}</h2>
                  <Badge variant="outline" className="bg-primary/5">
                    {skillCourses.length} {skillCourses.length === 1 ? 'Curso' : 'Cursos'}
                  </Badge>
                </div>
                
                {skillCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillCourses.map((course) => (
                      <Card key={course.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                              Curso
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {course.duration}
                            </div>
                          </div>
                          <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-2">
                            {course.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <BookOpen className="h-4 w-4 mr-1 text-primary" />
                              {course.lessons} aulas
                            </div>
                            <Button size="sm">Iniciar</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground text-sm italic">
                        Novos cursos para {skill} em breve.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>
            );
          })}
        </div>

        <div className="mt-16 bg-primary/5 rounded-2xl p-8 border border-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Seu Progresso</h3>
              <p className="text-muted-foreground">
                Ao concluir cursos, suas habilidades serão validadas e aparecerão com um selo de verificação no seu perfil público, aumentando suas chances de contratação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
