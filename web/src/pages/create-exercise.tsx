import { Box, Button } from '@chakra-ui/react';
import { Text, VStack } from '@chakra-ui/layout';
import { useForm, useFieldArray } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { withApollo } from '../lib/withApollo';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../ui/InputField';
import { Layout } from '../layouts/Layout';
import {
  GetAllExercisesDocument,
  useCreateExerciseMutation,
} from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import cloneDeep from 'clone-deep';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { AnswerInput } from '../ui/AnswerInput';
import { FormValues } from '../types/formValues';
import { create4EmptyAnswerField } from '../utils/create4EmptyAnswer';

const CreatePostPage: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createExercise] = useCreateExerciseMutation();
  const [isSubmitting, setSubmitting] = React.useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    watch,
    control,
  } = useForm({
    defaultValues: {
      title: '',
      questions: [
        {
          title: '',
          correct: -1 as number | undefined | boolean,
          answers: create4EmptyAnswerField(),
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });
  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const newQuestions = values.questions.map((q) => {
      const newAnswers = q.answers.map((a, index) => {
        return { ...a, isCorrect: (q.correct == index) as boolean };
      });
      const newQ = { title: q.title, answers: newAnswers };
      return newQ;
    });
    const newValues = { title: values.title, questions: newQuestions };
    const { data } = await createExercise({
      variables: { input: newValues },
      update: (cache, { data }) => {
        if (data?.createExercise?.exercise) {
          const existingsExercise = cache.readQuery({
            query: GetAllExercisesDocument,
          });
          cache.writeQuery({
            query: GetAllExercisesDocument,
            data: {
              getAllExercises: [
                {
                  __typename: 'Exercise',
                  id: data.createExercise.exercise.id!,
                  title: data.createExercise.exercise.title!,
                  length: data.createExercise.exercise.length!,
                },
                //@ts-ignore
                ...cloneDeep(existingsExercise!.getAllExercises!),
              ],
            },
          });
        }
      },
    });
    if (data?.createExercise?.hasError === false) {
      router.push('/');
    }
    console.log(data?.createExercise?.errors);
    if (data?.createExercise?.hasError) {
      setError('title', {
        message: data.createExercise.errors?.title as string,
        type: 'manual',
      });
      data.createExercise.errors?.questions?.forEach((q, index) => {
        setError(`questions.${index}.title`, {
          message: q.title as string,
          type: 'manual',
        });
        setError(`questions.${index}.correct`, {
          message: q.isCorrect as string,
          type: 'manual',
        });
        q.answers?.forEach((a, a_index) => {
          setError(`questions.${index}.answers.${a_index}.text`, {
            message: a.text as string,
            type: 'manual',
          });
        });
      });
    }
    console.log('errors', errors);
    setSubmitting(false);
  };

  console.log('errors', errors);
  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Tiêu đề"
          placeholder="Tiêu đề"
          name="title"
          register={register as any}
        />
        <ErrorMessage
          name="title"
          errors={errors}
          render={({ message }) => {
            console.log('fdaksjfkads ', errors, message);
            return <Text color="red.500">{message}</Text>;
          }}
        />

        <VStack width="full">
          {fields && fields.length > 0 ? (
            fields.map((q, index) => (
              <Box key={index} width="full" pl="4">
                <InputField
                  label={`Tên câu hỏi thứ ${index + 1}`}
                  name={`questions.${index}.title`}
                  register={register as any}
                  placeholder="Viết ở đây..."
                />

                <ErrorMessage
                  name={`questions.${index}.title`}
                  errors={errors}
                  render={({ message }) => {
                    return <Text color="red.500">{message}</Text>;
                  }}
                />
                <ErrorMessage
                  name={`questions.${index}.correct`}
                  errors={errors}
                  render={({ message }) => (
                    <Text color="red.500">{message}</Text>
                  )}
                />
                <Box m="4">
                  {q.answers.map((a, a_index) => (
                    <>
                      <AnswerInput
                        label={`Nội dung câu trả lời ${a_index + 1}`}
                        name={`questions.${index}.correct`}
                        inputName={`questions.${index}.answers.${a_index}.text`}
                        value={a_index}
                        register={register}
                      />
                      <ErrorMessage
                        name={`questions.${index}.answers.${a_index}.text`}
                        errors={errors}
                        render={({ message }) => {
                          return <Text color="red.500">{message}</Text>;
                        }}
                      />
                    </>
                  ))}
                </Box>
                <Box m="2">
                  <Button type="button" onClick={() => remove(index)} mr="4">
                    <CloseIcon />
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      append({
                        title: '',
                        correct: '' as unknown as number,
                        answers: create4EmptyAnswerField(),
                      })
                    }
                  >
                    <AddIcon />
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Button
              type="button"
              onClick={() =>
                append({
                  title: '',
                  correct: '' as unknown as number,
                  answers: create4EmptyAnswerField(),
                })
              }
            >
              Thêm câu hỏi
            </Button>
          )}
          <Box>
            <Button type="submit" isLoading={isSubmitting}>
              Tạo
            </Button>
          </Box>
        </VStack>
      </form>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePostPage);
