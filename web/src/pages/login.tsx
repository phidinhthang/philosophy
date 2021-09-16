import React from 'react';
import { Box, Button, Link, Flex } from '@chakra-ui/react';
import { Wrapper } from '../ui/Wrapper';
import { InputField } from '../ui/InputField';
import { useLoginMutation, MeQuery, MeDocument } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { withApollo } from '../lib/withApollo';
import { useNotAuth } from '../utils/useNotAuth';
import { useForm } from 'react-hook-form';

interface FormValues {
  username: string;
  password: string;
}

const LoginPage: React.FC<{}> = ({}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  console.log('errors', errors);

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    if (values.username) setIsSubmitting(true);
    const response = await login({
      variables: { name: values.username, password: values.password },
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: 'Query',
            me: data?.login.user,
          },
        });
      },
    });
    setIsSubmitting(false);
    if (response.data?.login.errors) {
      response.data.login.errors.forEach((error) => {
        setError(error.field as keyof FormValues, { message: error.message });
      });
    }
  };

  useNotAuth();
  const [login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="username"
          placeholder="username"
          label="Username"
          register={register as any}
          error={errors.username}
        />
        <Box mt={4}>
          <InputField
            name="password"
            placeholder="password"
            label="Password"
            type="password"
            register={register as any}
            error={errors.password}
          />
        </Box>
        <Flex mt={2} justifyContent="space-between">
          <NextLink href="/register">
            <Link>register</Link>
          </NextLink>
          <NextLink href="/">
            <Link ml="auto">forgot password ?</Link>
          </NextLink>
        </Flex>
        <Button
          mt={4}
          type="submit"
          isLoading={isSubmitting}
          colorScheme="teal"
        >
          login
        </Button>
      </form>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(LoginPage);
