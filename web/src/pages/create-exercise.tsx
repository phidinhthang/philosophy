import { Box, Button } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/layout';
import { FieldArray, Form, Formik } from 'formik';
import { v4 } from 'uuid';
import { withApollo } from '../lib/withApollo';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../ui/InputField';
import { Layout } from '../components/Layout';
import {
  GetAllExercisesDocument,
  GetAllExercisesQuery,
  useCreateExerciseMutation,
} from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { AnswerInput } from '../ui/AnswerInput';

const create4EmptyAnswerField = () => {
  const emptyAnswerField: {
    text: string;
    isCorrect: boolean;
  } = {
    text: '',
    isCorrect: '' as unknown as boolean,
  };

  return [
    { ...emptyAnswerField },
    { ...emptyAnswerField },
    { ...emptyAnswerField },
    { ...emptyAnswerField },
  ];
};

const emptyAnswerField = {
  id: '',
  text: '',
  isCorrect: '',
};

const CreatePostPage: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createExercise] = useCreateExerciseMutation();

  return (
    <Layout>
      <Formik
        initialValues={{
          title: '',
          questions: [
            {
              title: '',
              correct: -1 as number | undefined | boolean,
              answers: create4EmptyAnswerField(),
            },
          ],
        }}
        onSubmit={async (values) => {
          const newQuestions = values.questions.map((q) => {
            const newAnswers = q.answers.map((a, index) => {
              // a.isCorrect = (q.correct === index) as boolean;
              return { ...a, isCorrect: (q.correct == index) as boolean };
            });
            const newQ = { title: q.title, answers: newAnswers };
            return newQ;
          });
          const newValues = { title: values.title, questions: newQuestions };
          console.log(newValues);
          const { errors } = await createExercise({
            variables: { input: newValues },
            update: (cache, { data }) => {
              cache.evict({ fieldName: 'getAllExercises:{}' });
            },
          });
          if (!errors) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <InputField label="Title" placeholder="Title" name="title" />
            <FieldArray
              name="questions"
              render={(helpers) => (
                <VStack width="full">
                  {values.questions && values.questions.length > 0 ? (
                    values.questions.map((q, index) => (
                      <Box key={index} width="full" pl="4">
                        <InputField
                          label={`Question ${index + 1} title`}
                          name={`questions.${index}.title`}
                          placeholder="write title"
                          value={q.title}
                        />
                        <Box m="4">
                          {q.answers.map((a, a_index) => (
                            <AnswerInput
                              label={`answer ${a_index}`}
                              name={`questions.${index}.correct`}
                              inputName={`questions.${index}.answers.${a_index}.text`}
                              value={a_index}
                            />
                          ))}
                        </Box>
                        <Box m="2">
                          <Button
                            type="button"
                            onClick={() => helpers.remove(index)}
                            mr="4"
                          >
                            <CloseIcon />
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              helpers.insert(index, {
                                title: '',
                                correct: '',
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
                        helpers.push({
                          title: '',
                          correct: '',
                          answers: create4EmptyAnswerField(),
                        })
                      }
                    >
                      Add a question
                    </Button>
                  )}
                  <Box>
                    <Button type="submit" isLoading={isSubmitting}>
                      Submit
                    </Button>
                  </Box>
                </VStack>
              )}
            />
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: true })(CreatePostPage);
