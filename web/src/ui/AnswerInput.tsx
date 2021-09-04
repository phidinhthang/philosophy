import { Button } from '@chakra-ui/button';
import { Checkbox } from '@chakra-ui/checkbox';
import { Box } from '@chakra-ui/layout';
import { Radio } from '@chakra-ui/radio';
import { Field, useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';
import { InputField } from './InputField';

type AnswerInputProps = InputHTMLAttributes<HTMLInputElement> & {
  inputName: string;
  label: string;
  // radioName: string;
  name: string;
};

export const AnswerInput: React.FC<AnswerInputProps> = ({
  inputName,
  label,
  size: _,
  value,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <>
      <InputField
        name={inputName}
        label={label}
        placeholder="write answer here"
      />
      <Box>
        <input
          // as={Button}
          {...field}
          type="radio"
          name={field.name}
          value={value}
          // multiple={false}
        />
      </Box>
    </>
  );
};
