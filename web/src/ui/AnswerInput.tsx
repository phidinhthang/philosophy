import { Box } from '@chakra-ui/layout';
import React, { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { InputField } from './InputField';

type AnswerInputProps = InputHTMLAttributes<HTMLInputElement> & {
  inputName: string;
  label: string;
  // radioName: string;
  name: string;
  register: UseFormRegister<{ [Key: string]: any }>;
};

export const AnswerInput: React.FC<AnswerInputProps> = ({
  inputName,
  label,
  name,
  size: _,
  value,
  register,
  ...props
}) => {
  return (
    <>
      <InputField name={inputName} label={label} register={register} />
      <Box>
        <input
          // as={Button}
          // {...field}
          value={value}
          type="radio"
          {...register(name)}
        />
      </Box>
    </>
  );
};
