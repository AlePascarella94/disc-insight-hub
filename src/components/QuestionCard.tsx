
import { Question } from "@/types/disc";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionCardProps {
  question: Question;
  onChange: (value: number) => void;
  currentValue: number | null;
}

const QuestionCard = ({ question, onChange, currentValue }: QuestionCardProps) => {
  return (
    <Card className="w-full mb-6 animate-fade-in">
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">{question.text}</h3>
        </div>
        <RadioGroup 
          className="flex space-x-1 sm:space-x-2 justify-between"
          value={currentValue?.toString()}
          onValueChange={(value) => onChange(parseInt(value, 10))}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="flex flex-col items-center space-y-1">
              <RadioGroupItem 
                id={`q${question.id}-${value}`} 
                value={value.toString()} 
                className="cursor-pointer"
              />
              <Label 
                htmlFor={`q${question.id}-${value}`} 
                className="text-xs sm:text-sm cursor-pointer"
              >
                {value === 1 && "Discordo totalmente"}
                {value === 2 && "Discordo"}
                {value === 3 && "Neutro"}
                {value === 4 && "Concordo"}
                {value === 5 && "Concordo totalmente"}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
