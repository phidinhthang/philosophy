import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Link, Flex } from '@chakra-ui/react';
import { Wrapper } from '../ui/Wrapper';
import { InputField } from '../ui/InputField';
import { useLoginMutation, MeQuery, MeDocument } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { withApollo } from '../lib/withApollo';
import { useNotAuth } from '../utils/useNotAuth';

const LoginPage: React.FC<{}> = ({}) => {
  const router = useRouter();
  useNotAuth();
  const [login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
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
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
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
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(LoginPage);
