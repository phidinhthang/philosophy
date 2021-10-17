import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../../layouts/Layout';
import { InputField } from '../../../ui/InputField';
import { useForm } from 'react-hook-form';
import {
  useExerciseQuery,
  useUpdateExerciseMutation,
} from '../../../generated/graphql';
import { useGetId } from '../../../utils/useGetId';
import { withApollo } from '../../../lib/withApollo';

const EditExercise = () => {
  const router = useRouter();
  const id = useGetId();
  const { data, loading } = useExerciseQuery({
    skip: id === null,
    variables: {
      id: id!,
    },
  });

  const [updateExercise] = useUpdateExerciseMutation();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.exercise) {
    return (
      <Layout>
        <Box>could not find exercise</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.exercise.title }}
        onSubmit={async (values) => {
          await updateExercise({ variables: { id: id!, title: values.title } });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              update exercise
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditExercise);
