import { useColorModeValue } from '@chakra-ui/color-mode';
import {
  Stack,
  Flex,
  Box,
  Button,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { cloneDeep } from 'lodash';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  useMeQuery,
  useSaveExerciseMutation,
  GetAllExercisesQuery,
  GetAllExercisesDocument,
  useGetAllSavedExerciseQuery,
  GetAllSavedExerciseQuery,
  GetAllSavedExerciseDocument,
} from '../generated/graphql';
import { Layout } from '../layouts/Layout';
import { withApollo } from '../lib/withApollo';

const SavedPage = () => {
  const router = useRouter();
  const { data, error, loading } = useGetAllSavedExerciseQuery({
    fetchPolicy: 'network-only',
  });
  const { data: meData } = useMeQuery();
  const [targeted, setTargeted] = React.useState<string>('');
  const [saveExercise, { loading: isSaving, data: saveExerciseData }] =
    useSaveExerciseMutation();
  return (
    <Layout>
      <Head>
        <title>Đã lưu</title>
        <meta property="og:title" content="Đã lưu" key="title" />
      </Head>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.getAllSavedExercise!.map((e, index) => {
            if (!e) return e;
            const done = meData?.me?.completes?.find(
              (c) => c.exercise.id === e.id,
            );
            let text = '';
            if (done) {
              text = `finished ${done.corrects as number} / ${e.length}`;
            } else {
              text = `${e.length} question`;
            }
            return (
              <Flex
                boxShadow="md"
                key={e.id || index}
                p={5}
                borderWidth="1px"
                backgroundColor={
                  done ? useColorModeValue('cyan.100', '#242424') : undefined
                }
              >
                <Box
                  flex={1}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <NextLink href="/quizzes/[id]" as={`/quizzes/${e.id}`}>
                    <Link>
                      <Heading fontSize="large">{e.title}</Heading>
                    </Link>
                  </NextLink>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text mr="4">{text}</Text>
                    <Button
                      isLoading={isSaving && targeted === e.id}
                      disabled={isSaving && targeted === e.id}
                      onClick={() => {
                        setTargeted(e.id);
                        saveExercise({
                          variables: { exerciseId: e.id },
                          update: (cache, { data }) => {
                            if (!data?.saveExercise) return;
                            const updatedExercises =
                              cache.readQuery<GetAllExercisesQuery>({
                                query: GetAllExercisesDocument,
                              });

                            const draft = cloneDeep(
                              updatedExercises?.getAllExercises,
                            );
                            let foundChange = false;
                            draft?.exercises!.forEach((d) => {
                              if (d.id === e.id) {
                                d.saved = false;
                                foundChange = true;
                              }
                            });

                            if (foundChange) {
                              cache.writeQuery<GetAllExercisesQuery>({
                                query: GetAllExercisesDocument,
                                // @ts-ignore
                                data: {
                                  getAllExercises: {
                                    exercises: draft?.exercises,
                                    hasMore: draft?.hasMore,
                                  },
                                },
                                overwrite: true,
                              });
                            }
                          },
                          refetchQueries: [GetAllSavedExerciseDocument],
                        }).then(() => setTargeted(''));
                      }}
                    >
                      {<DeleteIcon />}
                    </Button>
                  </Box>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      )}
    </Layout>
  );
};

export default withApollo()(SavedPage);
