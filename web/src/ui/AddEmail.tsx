import { useForm } from 'react-hook-form';
import React from 'react';
import { Button } from '@chakra-ui/react';
import { InputField } from './InputField';
import { useMeQuery, useAddEmailMutation } from '../generated/graphql';
import { validateEmail } from '../utils/validateEmail';

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
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      email: data?.me?.email ?? '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!validateEmail(values.email)) {
      setError('email', { message: 'Định dạng email không hợp lệ.' });
    }
    const response = await addEmail({ variables: { email: values.email } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        name="email"
        register={register as any}
        label="Email"
        error={errors.email}
      />

      <Button
        disabled={isSubmitting}
        isLoading={isSubmitting}
        mt="3"
        type="submit"
        colorScheme="teal"
      >
        {data?.me?.email ? 'Đổi email' : 'Thêm email'}
      </Button>
    </form>
  );
};
