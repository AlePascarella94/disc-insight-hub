
import { DISCScores } from "@/types/disc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DISCSummaryProps {
  scores: DISCScores;
}

const DISCSummary = ({ scores }: DISCSummaryProps) => {
  // Normalize scores to percentages
  const maxPossibleScore = 25; // 5 questions per type, max score 5 per question
  const normalizedScores = {
    D: (scores.D / maxPossibleScore) * 100,
    I: (scores.I / maxPossibleScore) * 100,
    S: (scores.S / maxPossibleScore) * 100,
    C: (scores.C / maxPossibleScore) * 100,
  };

  // Find dominant trait
  const dominantTrait = Object.entries(normalizedScores).reduce(
    (max, [trait, score]) => (score > max.score ? { trait, score } : max),
    { trait: "", score: 0 }
  );

  return (
    <Card className="w-full max-w-md mx-auto mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Seu Perfil DISC</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">D - Dominância</span>
            <span>{Math.round(normalizedScores.D)}%</span>
          </div>
          <Progress 
            value={normalizedScores.D} 
            className="h-2.5" 
            indicatorClassName="bg-disc-red"
          />
          <p className="text-sm text-muted-foreground">
            Foco em resultados, assertividade e desafios.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">I - Influência</span>
            <span>{Math.round(normalizedScores.I)}%</span>
          </div>
          <Progress 
            value={normalizedScores.I} 
            className="h-2.5" 
            indicatorClassName="bg-disc-yellow"
          />
          <p className="text-sm text-muted-foreground">
            Foco em relacionamentos, comunicação e entusiasmo.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">S - Estabilidade</span>
            <span>{Math.round(normalizedScores.S)}%</span>
          </div>
          <Progress 
            value={normalizedScores.S} 
            className="h-2.5" 
            indicatorClassName="bg-disc-green"
          />
          <p className="text-sm text-muted-foreground">
            Foco em cooperação, paciência e consistência.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">C - Conformidade</span>
            <span>{Math.round(normalizedScores.C)}%</span>
          </div>
          <Progress 
            value={normalizedScores.C} 
            className="h-2.5" 
            indicatorClassName="bg-disc-blue"
          />
          <p className="text-sm text-muted-foreground">
            Foco em qualidade, análise e precisão.
          </p>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-lg font-medium">
            Seu traço dominante é:{" "}
            <span className={`font-bold ${
              dominantTrait.trait === "D" ? "text-disc-red" :
              dominantTrait.trait === "I" ? "text-disc-yellow" :
              dominantTrait.trait === "S" ? "text-disc-green" :
              "text-disc-blue"
            }`}>
              {dominantTrait.trait === "D" && "Dominância"}
              {dominantTrait.trait === "I" && "Influência"}
              {dominantTrait.trait === "S" && "Estabilidade"}
              {dominantTrait.trait === "C" && "Conformidade"}
            </span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Preencha o formulário para receber sua análise completa.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DISCSummary;
