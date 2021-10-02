import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { InputField } from './InputField';
import { useMeQuery, useAddEmailMutation } from '../generated/graphql';

interface FormValues {
  email: string;
}

export const AddEmail = () => {
  const { data } = useMeQuery();
  const [addEmail] = useAddEmailMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      email: data?.me?.email ?? '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    const response = await addEmail({ variables: { email: values.email } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField name="email" register={register as any} label="Email" />

      <Button
        disabled={isSubmitting}
        isLoading={isSubmitting}
        mt="3"
        type="submit"
        colorScheme="teal"
      >
        Add or Change
      </Button>
    </form>
  );
};
