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
        <Box>
          Nếu tài khoản cùng với email vừa nhập của bạn tồn tại, kiểm tra email
          của bạn.
        </Box>
      ) : (
        <>
          <Box>
            Nhập email của bạn. Chúng tôi sẽ giúp bạn nhận lại mật khẩu với
            email đó.
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              name="email"
              register={register as any}
              label="Email"
              type="email"
            />

            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variant="teal"
            >
              Xác nhận
            </Button>
          </form>
        </>
      )}
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
