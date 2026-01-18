export type ChallengeType = 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'SIGN_RECOGNITION';

export interface Challenge {
  id: string;
  type: ChallengeType;
  question: string;
  image?: string;
  options?: string[];
  answer: string;
  text?: string;
}

export interface Lesson {
  id: string;
  name: string;
  challenges: Challenge[];
}

export interface Curriculum {
  lessons: Lesson[];
}