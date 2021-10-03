import React, { useState } from 'react';
import { NextPage } from 'next';
import { Wrapper } from '../../ui/Wrapper';
import { useForm } from 'react-hook-form';
import { toErrorMap } from '../../utils/toErrorMap';
import { InputField } from '../../ui/InputField';
import { Box, Button, Link, Flex } from '@chakra-ui/react';
import {
  useResetPasswordMutation,
  MeDocument,
  MeQuery,
} from '../../generated/graphql';
import { useRouter } from 'next/router';
import { withApollo } from '../../lib/withApollo';
import NextLink from 'next/link';

interface FormValues {
  newPassword: string;
}

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();
  const [tokenError, setTokenError] = useState('');
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      newPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    console.log(router.query);
    const response = await resetPassword({
      variables: {
        newPassword: values.newPassword,
        token: typeof router.query.token === 'string' ? router.query.token : '',
      },
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: 'Query',
            me: data?.resetPassword.user,
          },
        });
      },
    });

    if (response.data?.resetPassword.errors) {
      const errorMap = toErrorMap(response.data.resetPassword.errors);
      if ('token' in errorMap) {
        setTokenError(errorMap.token);
      }
      Object.entries(errorMap).forEach(([field, message]) => {
        setError(field as any, { message });
      });
    } else if (response.data?.resetPassword.user) {
      router.push('/');
    }
  };

  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="newPassword"
          register={register as any}
          label="New Password"
          type="password"
          error={errors.newPassword}
        />

        {tokenError ? (
          <Flex>
            <Box mr={2} style={{ color: 'red' }}>
              {tokenError}
            </Box>
            <NextLink href="/forgot-password">
              <Link>Bấm vào đây để nhận được đường link mới.</Link>
            </NextLink>
          </Flex>
        ) : null}
        <Button
          mt={4}
          type="submit"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          colorScheme="teal"
        >
          Đổi mật khẩu
        </Button>
      </form>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
