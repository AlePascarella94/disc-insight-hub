
export interface Question {
  id: number;
  text: string;
  type: "D" | "I" | "S" | "C";
}

export interface ChecklistRow {
  id: number;
  options: {
    D: string;
    C: string;
    S: string;
    I: string;
  };
}

export interface Answer {
  questionId: number;
  value: number;
  type: "D" | "I" | "S" | "C";
}

export interface ChecklistAnswer {
  rowId: number;
  selectedTypes: ("D" | "C" | "S" | "I")[];
}

export interface ContactInfo {
  name: string;
  whatsapp: string;
}

export interface DISCScores {
  D: number;
  I: number;
  S: number;
  C: number;
}
