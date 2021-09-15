import React from 'react';
import { Box, Button, Link } from '@chakra-ui/react';
import { Wrapper } from '../ui/Wrapper';
import { InputField } from '../ui/InputField';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { withApollo } from '../lib/withApollo';
import { useNotAuth } from '../utils/useNotAuth';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';

interface registerProps {}
interface FormValues {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

const Register: React.FC<registerProps> = ({}) => {
  useNotAuth();
  const router = useRouter();
  const {
    register: registerForm,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      password: '',
    },
  });
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [register] = useRegisterMutation();

  const onSubmit = async (values: FormValues) => {
    const { username: name, ...rest } = values;
    setSubmitting(true);
    const response = await register({
      variables: { name, ...rest },
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: 'Query',
            me: data?.register.user,
          },
        });
      },
    });
    if (response.data?.register.errors) {
      response.data.register.errors.forEach((error) => {
        setError(error.field as keyof FormValues, { message: error.message });
      });
      setSubmitting(false);
    }
  };
  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="username"
          placeholder="username"
          label="Username"
          register={registerForm as any}
          error={errors.username}
        />
        <Box mt={4}>
          <InputField
            name="firstName"
            placeholder="first Name"
            label="first name"
            register={registerForm as any}
            error={errors.firstName}
          />
          <InputField
            name="lastName"
            placeholder="last name"
            label="Last name"
            register={registerForm as any}
            error={errors.lastName}
          />
        </Box>
        <Box mt={4}>
          <InputField
            name="password"
            placeholder="password"
            label="Password"
            type="password"
            register={registerForm as any}
            error={errors.password}
          />
        </Box>
        <Box mt={4}>
          <NextLink href="/login">
            <Link>login</Link>
          </NextLink>
        </Box>
        <Button
          mt={4}
          type="submit"
          isLoading={isSubmitting}
          colorScheme="teal"
        >
          register
        </Button>
      </form>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(Register);
