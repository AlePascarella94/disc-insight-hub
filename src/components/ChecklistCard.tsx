import { ChecklistRow, ChecklistAnswer } from "@/types/disc";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ChecklistCardProps {
  row: ChecklistRow;
  answers: ChecklistAnswer[];
  onChange: (rowId: number, values: { D: number | null; C: number | null; S: number | null; I: number | null }) => void;
}

const ChecklistCard = ({ row, answers, onChange }: ChecklistCardProps) => {
  const currentAnswer = answers.find(a => a.rowId === row.id);
  const values = currentAnswer?.values || { D: null, C: null, S: null, I: null };
  const { toast } = useToast();

  const handleInputChange = (type: "D" | "C" | "S" | "I", value: string) => {
    const numValue = value === "" ? null : parseInt(value, 10);
    
    // Validate input
    if (numValue !== null && (numValue < 1 || numValue > 4)) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um número de 1 a 4.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicates in the same row
    const newValues = { ...values, [type]: numValue };
    const usedNumbers = Object.values(newValues).filter(v => v !== null);
    const hasDuplicates = usedNumbers.length !== new Set(usedNumbers).size;

    if (hasDuplicates && numValue !== null) {
      toast({
        title: "Número já usado",
        description: "Cada número de 1 a 4 só pode ser usado uma vez por linha.",
        variant: "destructive"
      });
      return;
    }

    onChange(row.id, newValues);
  };

  const getColumnColor = (type: "D" | "C" | "S" | "I") => {
    switch(type) {
      case "D": return "text-red-700 font-medium";
      case "C": return "text-blue-700 font-medium"; 
      case "S": return "text-green-700 font-medium";
      case "I": return "text-yellow-700 font-medium";
      default: return "";
    }
  };

  const getColumnTitle = (type: "D" | "C" | "S" | "I") => {
    switch(type) {
      case "D": return "Dominante";
      case "C": return "Analítico"; 
      case "S": return "Estável";
      case "I": return "Influente";
      default: return "";
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-4 gap-4">
          {(["D", "C", "S", "I"] as const).map((type) => (
            <div key={type} className="space-y-2">
              <div className="space-y-1">
                {row.options[type].map((characteristic, index) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    {characteristic}
                  </p>
                ))}
              </div>
              <Input
                type="number"
                min="1"
                max="4"
                value={values[type] || ""}
                onChange={(e) => handleInputChange(type, e.target.value)}
                className="w-16 h-16 text-center text-lg font-bold"
                placeholder=""
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistCard;