import { ChecklistRow, ChecklistAnswer } from "@/types/disc";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface ChecklistCardProps {
  row: ChecklistRow;
  answers: ChecklistAnswer[];
  onChange: (rowId: number, selectedTypes: ("D" | "C" | "S" | "I")[]) => void;
}

const ChecklistCard = ({ row, answers, onChange }: ChecklistCardProps) => {
  const currentAnswer = answers.find(a => a.rowId === row.id);
  const selectedTypes = currentAnswer?.selectedTypes || [];

  const handleCheckboxChange = (type: "D" | "C" | "S" | "I", checked: boolean) => {
    let newSelectedTypes: ("D" | "C" | "S" | "I")[];
    
    if (checked) {
      newSelectedTypes = [...selectedTypes, type];
    } else {
      newSelectedTypes = selectedTypes.filter(t => t !== type);
    }
    
    onChange(row.id, newSelectedTypes);
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

  return (
    <Card className="w-full mb-3">
      <CardContent className="p-4">
        <div className="grid grid-cols-4 gap-4">
          {(["D", "C", "S", "I"] as const).map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`row-${row.id}-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => handleCheckboxChange(type, checked as boolean)}
                className="flex-shrink-0"
              />
              <label 
                htmlFor={`row-${row.id}-${type}`}
                className={`text-sm cursor-pointer leading-tight ${getColumnColor(type)}`}
              >
                {row.options[type]}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistCard;