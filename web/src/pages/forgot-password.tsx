import React, { useState } from 'react';
import { Wrapper } from '../ui/Wrapper';
import { useForm } from 'react-hook-form';
import { InputField } from '../ui/InputField';
import { Box, Button } from '@chakra-ui/react';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../lib/withApollo';

interface FormValues {
  email: string;
}

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values: FormValues) => {
    await forgotPassword({ variables: values });
    setComplete(true);
  };
  return (
    <Wrapper variant="small">
      {complete ? (
        <Box>if an account with that email exists, we sent you an email</Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            name="email"
            register={register as any}
            label="Email"
            type="email"
          />

          <Button mt={4} type="submit" isLoading={isSubmitting} variant="teal">
            forgot password
          </Button>
        </form>
      )}
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
