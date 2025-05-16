
export interface Question {
  id: number;
  text: string;
  type: "D" | "I" | "S" | "C";
}

export interface Answer {
  questionId: number;
  value: number;
  type: "D" | "I" | "S" | "C";
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
