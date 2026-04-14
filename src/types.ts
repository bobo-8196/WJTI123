export interface Score {
  E?: number;
  I?: number;
  S?: number;
  N?: number;
  T?: number;
  F?: number;
  J?: number;
  P?: number;
}

export interface Option {
  text: string;
  score: Score;
}

export interface Question {
  text: string;
  options: Option[];
}

export interface Result {
  title: string;
  link: string;
  quote: string;
  desc: string;
}

export type MBTIType = string; // e.g., "ENFP"
