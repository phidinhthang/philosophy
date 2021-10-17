import { ExerciseInput } from '../resolvers/inputs';
import { ExerciseError } from '../types';

export const validateExerciseInput = (
  input: ExerciseInput,
): { hasError: boolean; errors: ExerciseError } => {
  let errors: ExerciseError;
  let hasError = false;
  if (!input.title) {
    errors = { title: 'Không được bỏ trống.', questions: [] };
    hasError = true;
  } else {
    errors = { title: undefined, questions: [] };
  }

  input.questions?.forEach((q, index) => {
    if (!q.title) {
      errors.questions?.push({
        title: 'Không được bỏ trống.',
        answers: [],
      });
      hasError = true;
    } else {
      errors.questions?.push({ title: undefined, answers: [] });
    }
    q.answers?.forEach((a) => {
      if (!a.text) {
        errors.questions[index].answers?.push({
          text: 'Không được bỏ trống.',
        });
        hasError = true;
      } else {
        errors.questions[index].answers.push({ text: undefined });
      }
      const corrects = q.answers?.filter((a) => a.isCorrect);
      if (corrects?.length !== 1) {
        errors.questions[index].isCorrect =
          'Chỉ được chọn một câu trả lời đúng.';
        hasError = true;
      } else {
        errors.questions[index].isCorrect = undefined;
      }
    });
  });

  return { hasError, errors };
};
