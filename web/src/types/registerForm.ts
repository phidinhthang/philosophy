import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegisterReturn,
} from 'react-hook-form';

export type UseFormRegister<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  name: TFieldName,
  options?: RegisterOptions<TFieldValues, TFieldName>,
) => UseFormRegisterReturn;
