
export interface Question {
  id: number;
  text: string;
  type: "D" | "I" | "S" | "C";
}

export interface ChecklistRow {
  id: number;
  options: {
    D: string[];
    C: string[];
    S: string[];
    I: string[];
  };
}

export interface Answer {
  questionId: number;
  value: number;
  type: "D" | "I" | "S" | "C";
}

export interface ChecklistAnswer {
  rowId: number;
  values: {
    D: number | null;
    C: number | null;
    S: number | null;
    I: number | null;
  };
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
