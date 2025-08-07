import { useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import ChecklistCard from "@/components/ChecklistCard";
import ProgressBar from "@/components/ProgressBar";
import { questions } from "@/data/questions";
import { checklistRows } from "@/data/checklistRows";
import { Answer, ContactInfo, DISCScores, ChecklistAnswer } from "@/types/disc";
import ContactForm from "@/components/ContactForm";
import ThankYou from "@/components/ThankYou";
import DISCSummary from "@/components/DISCSummary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

enum Step {
  Intro,
  Questions,
  Results,
  ThankYou
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Intro);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [checklistAnswers, setChecklistAnswers] = useState<ChecklistAnswer[]>([]);
  const [discScores, setDiscScores] = useState<DISCScores>({ D: 0, I: 0, S: 0, C: 0 });
  const { toast } = useToast();

  const handleStartTest = () => {
    setCurrentStep(Step.Questions);
  };

  const handleAnswerChange = (value: number) => {
    const question = questions[currentQuestionIndex];
    const existingAnswerIndex = answers.findIndex(a => a.questionId === question.id);
    
    if (existingAnswerIndex !== -1) {
      // Update existing answer
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = {
        questionId: question.id,
        value,
        type: question.type
      };
      setAnswers(updatedAnswers);
    } else {
      // Add new answer
      setAnswers([
        ...answers,
        {
          questionId: question.id,
          value,
          type: question.type
        }
      ]);
    }
  };

  const handleChecklistAnswerChange = (rowId: number, values: { D: number | null; C: number | null; S: number | null; I: number | null }) => {
    const existingAnswerIndex = checklistAnswers.findIndex(a => a.rowId === rowId);
    
    if (existingAnswerIndex !== -1) {
      // Update existing answer
      const updatedAnswers = [...checklistAnswers];
      updatedAnswers[existingAnswerIndex] = {
        rowId,
        values
      };
      setChecklistAnswers(updatedAnswers);
    } else {
      // Add new answer
      setChecklistAnswers([
        ...checklistAnswers,
        {
          rowId,
          values
        }
      ]);
    }
  };

  const getCurrentAnswer = () => {
    const question = questions[currentQuestionIndex];
    const answer = answers.find(a => a.questionId === question.id);
    return answer ? answer.value : null;
  };

  const handleNext = () => {
    // Calculate DISC scores from checklist
    const scores: DISCScores = { D: 0, I: 0, S: 0, C: 0 };
    
    checklistAnswers.forEach(answer => {
      Object.entries(answer.values).forEach(([type, value]) => {
        if (value !== null) {
          scores[type as keyof DISCScores] += value;
        }
      });
    });
    
    setDiscScores(scores);
    setCurrentStep(Step.Results);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleContactSubmit = (contactInfo: ContactInfo) => {
    // In a real app, here you would send the data to your backend
    console.log("Contact Info:", contactInfo);
    console.log("DISC Scores:", discScores);
    
    // Move to thank you page
    setCurrentStep(Step.ThankYou);
  };

  return (
    <Layout>
      {currentStep === Step.Intro && (
        <div className="hero-bg flex items-center justify-center px-4 -mx-4 -mt-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="animate-fade-in-up">
              <div className="mb-8">
                <h1 className="text-xl md:text-2xl font-light tracking-wide mb-2 hero-text">
                  THALITA VALENTIM
                </h1>
                <div className="w-24 h-0.5 bg-white/60 mx-auto mb-6"></div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight hero-text mb-6">
                  Descubra seu perfil comportamental{" "}
                  <span className="block text-white/90">com o DISC</span>
                </h2>
                <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 max-w-3xl mx-auto hero-text">
                  Avaliação gratuita para você entender suas características comportamentais 
                  e potencializar seu desenvolvimento pessoal e profissional.
                </p>
              </div>
              
              <div className="mb-12">
                <Button 
                  onClick={handleStartTest} 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  INICIAR AVALIAÇÃO GRATUITA
                </Button>
                <p className="text-sm mt-4 text-white/80">(Sem sair de casa - 100% online)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === Step.Intro && (
        <div className="max-w-6xl mx-auto mt-16 space-y-16">
          {/* About DISC Section */}
          <div className="text-center animate-fade-in-up">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
              O que é a metodologia DISC?
            </h3>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              O DISC é uma ferramenta poderosa que analisa o comportamento humano em quatro diferentes dimensões, 
              proporcionando autoconhecimento e clareza sobre seus padrões comportamentais.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="animate-scale-in border-2 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold group-hover:scale-110 transition-transform">
                    D
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-red-600">Dominante</h4>
                  <p className="text-sm text-muted-foreground">
                    Foco em resultados, assertividade e tomada de decisões rápidas.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="animate-scale-in border-2 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold group-hover:scale-110 transition-transform">
                    I
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-yellow-600">Influente</h4>
                  <p className="text-sm text-muted-foreground">
                    Foco em relacionamentos, comunicação e capacidade de persuasão.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="animate-scale-in border-2 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold group-hover:scale-110 transition-transform">
                    S
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-green-600">Estável</h4>
                  <p className="text-sm text-muted-foreground">
                    Foco em cooperação, paciência e construção de confiança.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="animate-scale-in border-2 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold group-hover:scale-110 transition-transform">
                    C
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-blue-600">Analítico</h4>
                  <p className="text-sm text-muted-foreground">
                    Foco em qualidade, análise detalhada e precisão.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-secondary/30 rounded-2xl p-8 md:p-12 animate-fade-in-up">
            <h3 className="text-3xl font-bold text-center mb-8 text-primary">Como funciona a avaliação?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h4 className="font-semibold mb-2">Marque suas características</h4>
                <p className="text-sm text-muted-foreground">
                  Selecione as palavras que mais se identificam com você
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h4 className="font-semibold mb-2">Veja seu perfil</h4>
                <p className="text-sm text-muted-foreground">
                  Receba um resumo imediato do seu perfil DISC
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h4 className="font-semibold mb-2">Deixe seus dados</h4>
                <p className="text-sm text-muted-foreground">
                  Nome e WhatsApp para recebermos o contato
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h4 className="font-semibold mb-2">Análise detalhada</h4>
                <p className="text-sm text-muted-foreground">
                  Receba uma análise completa via WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-16 animate-fade-in-up">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Pronto para se conhecer melhor?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comece agora sua jornada de autoconhecimento com nossa avaliação gratuita e descubra 
              como potencializar seus pontos fortes.
            </p>
            <Button 
              onClick={handleStartTest} 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              COMEÇAR AVALIAÇÃO AGORA
            </Button>
          </div>
        </div>
      )}

      {currentStep === Step.Questions && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">TESTE E GUIA DE PERFIS DISC</h2>
            <p className="text-muted-foreground">
              Preencha as lacunas abaixo com números de 1 a 4, na HORIZONTAL, sendo: 1 o que menos se identifica e 4 o que mais se identifica.
            </p>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-4 gap-4 mb-4 font-bold text-center">
            <div className="text-red-700">Dominante</div>
            <div className="text-blue-700">Analítico</div>
            <div className="text-green-700">Estável</div>
            <div className="text-yellow-700">Influente</div>
          </div>

          {/* Checklist Rows */}
          <div className="space-y-2 mb-8">
            {checklistRows.map((row) => (
              <ChecklistCard
                key={row.id}
                row={row}
                answers={checklistAnswers}
                onChange={handleChecklistAnswerChange}
              />
            ))}
          </div>

          {/* Totals Section */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="border-2 border-red-200 p-4 text-center">
              <div className="text-red-700 font-bold text-lg">Total Dominante</div>
              <div className="text-2xl font-bold text-red-700">
                {checklistAnswers.reduce((sum, answer) => 
                  sum + (answer.values.D || 0), 0)}
              </div>
            </div>
            <div className="border-2 border-blue-200 p-4 text-center">
              <div className="text-blue-700 font-bold text-lg">Total Analítico</div>
              <div className="text-2xl font-bold text-blue-700">
                {checklistAnswers.reduce((sum, answer) => 
                  sum + (answer.values.C || 0), 0)}
              </div>
            </div>
            <div className="border-2 border-green-200 p-4 text-center">
              <div className="text-green-700 font-bold text-lg">Total Estável</div>
              <div className="text-2xl font-bold text-green-700">
                {checklistAnswers.reduce((sum, answer) => 
                  sum + (answer.values.S || 0), 0)}
              </div>
            </div>
            <div className="border-2 border-yellow-200 p-4 text-center">
              <div className="text-yellow-700 font-bold text-lg">Total Influente</div>
              <div className="text-2xl font-bold text-yellow-700">
                {checklistAnswers.reduce((sum, answer) => 
                  sum + (answer.values.I || 0), 0)}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button onClick={handleNext} size="lg">
              Ver Meus Resultados
            </Button>
          </div>
        </div>
      )}

      {currentStep === Step.Results && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Seus Resultados</h2>
          
          <DISCSummary scores={discScores} />
          
          <ContactForm onSubmit={handleContactSubmit} scores={discScores} />
        </div>
      )}

      {currentStep === Step.ThankYou && (
        <ThankYou />
      )}
    </Layout>
  );
};

export default Index;
