export interface FormValues {
  title: string;
  questions: {
    title: string;
    correct: number | boolean | undefined;
    answers: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}
