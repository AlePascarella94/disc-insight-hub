
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
          value={currentValue?.toString() || ""}
          onValueChange={(value) => onChange(parseInt(value, 10))}
        >
          {[0, 1, 2, 3, 4, 5].map((value) => (
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
                {value === 0 && "0"}
                {value === 1 && "1"}
                {value === 2 && "2"}
                {value === 3 && "3"}
                {value === 4 && "4"}
                {value === 5 && "5"}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Não me identifico</span>
          <span>Me identifico totalmente</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
