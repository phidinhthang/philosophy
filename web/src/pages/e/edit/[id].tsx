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
import gql from 'graphql-tag';
import { InputFieldFormik } from '../../../ui/InputFieldFormik';

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
          console.log(values);
          await updateExercise({
            variables: { id: id!, title: values.title },
            update: (cache) => {
              cache.writeFragment({
                id: 'ExerciseField:' + id,
                fragment: gql`
                  fragment updateExerciseFieldTitle on ExerciseField {
                    title
                  }
                `,
                data: {
                  title: values.title,
                },
              });
              cache.writeFragment({
                id: 'Exercise:' + id,
                fragment: gql`
                  fragment updateExerciseTitle on Exercise {
                    title
                  }
                `,
                data: {
                  title: values.title,
                },
              });
            },
          });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFieldFormik name="title" placeholder="title" label="Title" />
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
