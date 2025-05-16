
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import { questions } from "@/data/questions";
import { Answer, ContactInfo, DISCScores } from "@/types/disc";
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

  const getCurrentAnswer = () => {
    const question = questions[currentQuestionIndex];
    const answer = answers.find(a => a.questionId === question.id);
    return answer ? answer.value : null;
  };

  const handleNext = () => {
    if (getCurrentAnswer() === null) {
      toast({
        title: "Resposta necessária",
        description: "Por favor, selecione uma resposta antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate DISC scores
      const scores: DISCScores = { D: 0, I: 0, S: 0, C: 0 };
      
      answers.forEach(answer => {
        scores[answer.type] += answer.value;
      });
      
      setDiscScores(scores);
      setCurrentStep(Step.Results);
    }
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
        <div className="max-w-3xl mx-auto">
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Avaliação de Perfil Comportamental DISC</CardTitle>
              <CardDescription className="text-lg mt-2">
                Descubra seu perfil comportamental e potencialize seu desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                O DISC é uma metodologia que analisa o comportamento humano em quatro diferentes dimensões:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <h3 className="font-bold text-disc-red">D - Dominante</h3>
                  <p className="text-sm mt-1">Foco em resultados, assertividade e tomada de decisões.</p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <h3 className="font-bold text-disc-yellow">I - Influente</h3>
                  <p className="text-sm mt-1">Foco em relacionamentos, comunicação e persuasão.</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="font-bold text-disc-green">S - Estável</h3>
                  <p className="text-sm mt-1">Foco em cooperação, paciência e confiabilidade.</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-disc-blue">C - Analítico</h3>
                  <p className="text-sm mt-1">Foco em qualidade, análise e precisão.</p>
                </div>
              </div>
              
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="font-medium mb-2">Como funciona:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Responda a 20 perguntas sobre suas preferências comportamentais</li>
                  <li>Veja um resumo do seu perfil DISC</li>
                  <li>Deixe seus dados de contato</li>
                  <li>Receba uma análise detalhada por WhatsApp</li>
                </ol>
              </div>
              
              <div className="text-center pt-4">
                <Button onClick={handleStartTest} size="lg">
                  Iniciar Avaliação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === Step.Questions && (
        <div className="max-w-2xl mx-auto">
          <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
          
          <QuestionCard 
            question={questions[currentQuestionIndex]} 
            onChange={handleAnswerChange}
            currentValue={getCurrentAnswer()}
          />
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>
            <Button onClick={handleNext}>
              {currentQuestionIndex < questions.length - 1 ? "Próxima" : "Finalizar"}
            </Button>
          </div>
        </div>
      )}

      {currentStep === Step.Results && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Seus Resultados</h2>
          
          <DISCSummary scores={discScores} />
          
          <ContactForm onSubmit={handleContactSubmit} />
        </div>
      )}

      {currentStep === Step.ThankYou && (
        <ThankYou />
      )}
    </Layout>
  );
};

export default Index;
