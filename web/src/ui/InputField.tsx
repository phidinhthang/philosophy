import React, { InputHTMLAttributes } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Textarea } from '@chakra-ui/textarea';
import { FieldError } from 'react-hook-form';
import { UseFormRegister } from '../types/registerForm';
import { Text } from '@chakra-ui/layout';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
  register?: UseFormRegister<{ [Key: string]: any }>;
  error?: FieldError;
  // message?: string;
};

export const InputField: React.FC<InputFieldProps> = React.memo(
  ({ label, textarea, size: _, register, name, error, ...props }) => {
    let InputOrTextarea = Input;
    const errorMessage = error?.message
      ? error.message
      : error
      ? error
      : undefined;
    if (textarea) {
      (InputOrTextarea as any) = Textarea;
    }
    const Field = register ? (
      <>
        <InputOrTextarea {...props} {...register(name)} id={name} />
        {errorMessage ? <Text color="red.500">{errorMessage}</Text> : null}
      </>
    ) : (
      <InputOrTextarea {...props} />
    );
    console.log(error);
    return (
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        {Field}
      </FormControl>
    );
  },
);
