import React from 'react';
import Head from 'next/head';
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
    <>
      <Head>
        <title>Đăng ký</title>
        <meta property="og:title" content="Đăng ký" key="title" />
      </Head>
      <Wrapper variant="small">
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            name="username"
            placeholder="Tên..."
            label="Tên tài khoản"
            register={registerForm as any}
            error={errors.username}
          />
          <Box mt={4}>
            <InputField
              name="firstName"
              placeholder="Họ và tên đệm"
              label="Họ và tên đệm"
              register={registerForm as any}
              error={errors.firstName}
            />
            <InputField
              name="lastName"
              placeholder="Tên của bạn"
              label="Tên của bạn"
              register={registerForm as any}
              error={errors.lastName}
            />
          </Box>
          <Box mt={4}>
            <InputField
              name="password"
              placeholder="Mật khẩu"
              label="Mật khẩu"
              type="password"
              register={registerForm as any}
              error={errors.password}
            />
          </Box>
          <Box mt={4}>
            <NextLink href="/login">
              <Link>Đăng nhập ở đây</Link>
            </NextLink>
          </Box>
          <Button
            mt={4}
            type="submit"
            isLoading={isSubmitting}
            colorScheme="teal"
            isFullWidth={true}
          >
            Đăng ký
          </Button>
        </form>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(Register);
