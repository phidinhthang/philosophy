import * as React from 'react';
import { useDisclosure, Button, Text, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputField } from './InputField';
import { useChangePasswordMutation } from '../generated/graphql';
import * as yup from 'yup';

interface FormValues {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = yup.object({
  password: yup.string().required('Required'),
  newPassword: yup.string().required('Required'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Must match'),
});

const useYupValidationResolver = (schema: typeof validationSchema) => {
  return React.useCallback(
    async (data) => {
      try {
        const values = await schema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors: any) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        };
      }
    },
    [schema],
  );
};

export const ChangePassword = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [changePassword] = useChangePasswordMutation();
  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      password: '',
      newPassword: '',
    },
    resolver,
  });
  const onSubmit = async (values: FormValues) => {
    try {
      const { data, errors } = await changePassword({
        variables: {
          newPassword: values.newPassword,
          password: values.password,
        },
        errorPolicy: 'none',
      });
      if (!data || errors?.length) {
        setErrorMessage('C?? l???i x???y ra.');
        setSuccessMessage('');
        return;
      }
      setErrorMessage('');
      setSuccessMessage('Thay ?????i th??nh c??ng.');
    } catch (err: any) {
      setError('password', { message: err.message });
    }
  };
  return (
    <>
      <Button mb="4" onClick={onToggle}>
        ?????i m???t kh???u
      </Button>
      {isOpen && (
        <>
          {(errorMessage || successMessage) && (
            <Text color={errorMessage ? 'red.300' : 'green.300'}>
              {errorMessage ? errorMessage : successMessage}
            </Text>
          )}
          <Box mb="2" />
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: 24 }}>
            <InputField
              label="M???t kh???u hi???n t???i"
              name="password"
              register={register as any}
              error={errors.password}
              disabled={isSubmitting}
              type="password"
            />
            <InputField
              label="M???t kh???u m???i"
              name="newPassword"
              register={register as any}
              error={errors.newPassword}
              disabled={isSubmitting}
              type="password"
            />
            <InputField
              label="Nh???p l???i m???t kh???u m???i"
              name="confirmPassword"
              register={register as any}
              error={errors.confirmPassword}
              disabled={isSubmitting}
              type="password"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              mt="4"
            >
              Ok
            </Button>
          </form>
        </>
      )}
    </>
  );
};
