import { CustomError } from '../generated/graphql';

export const toErrorMap = (errors: CustomError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
