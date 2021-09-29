import React from 'react';
import Head from 'next/head';
import { Box, Button, Link, Flex } from '@chakra-ui/react';
import { Wrapper } from '../ui/Wrapper';
import { InputField } from '../ui/InputField';
import { useLoginMutation, MeQuery, MeDocument } from '../generated/graphql';
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
    <>
      <Head>
        <title>Đăng nhập</title>
        <meta property="og:title" content="Đăng nhập" key="title" />
      </Head>
      <Wrapper variant="small">
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            name="username"
            placeholder="Tên..."
            label="Tên tài khoản"
            register={register as any}
            error={errors.username}
          />
          <Box mt={4}>
            <InputField
              name="password"
              placeholder="Mật khẩu..."
              label="Mật khẩu"
              type="password"
              register={register as any}
              error={errors.password}
            />
          </Box>
          <Flex mt={2} justifyContent="space-between">
            <NextLink href="/register">
              <Link>Bấm vào đây để đăng ký</Link>
            </NextLink>
            <NextLink href="/">
              <Link ml="auto">Quên mật khẩu ?</Link>
            </NextLink>
          </Flex>
          <Button
            mt={4}
            type="submit"
            isLoading={isSubmitting}
            colorScheme="teal"
          >
            Đăng nhập
          </Button>
          <div>
            <Button
              as={Link}
              colorScheme="teal"
              href={process.env.NEXT_PUBLIC_API_URL + '/auth/google'}
            >
              Đăng nhập bằng Google
            </Button>
          </div>
        </form>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: true })(LoginPage);
