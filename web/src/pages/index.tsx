import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  ExerciseResponse,
  GetAllExercisesDocument,
  GetAllExercisesQuery,
  useGetAllExercisesQuery,
  useMeQuery,
  useSaveExerciseMutation,
} from '../generated/graphql';
import { Layout } from '../layouts/Layout';
import { withApollo } from '../lib/withApollo';
import { useIsAuth } from '../utils/useIsAuth';
import {
  Box,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  Button,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useColorModeValue } from '@chakra-ui/color-mode';
import cloneDeep from 'clone-deep';

const HomePage = () => {
  const router = useRouter();
  if (router.query) useIsAuth();
  const { data, error, loading } = useGetAllExercisesQuery();
  const { data: meData } = useMeQuery();
  const [targeted, setTargeted] = React.useState<string>('');
  const [saveExercise, { loading: isSaving, data: saveExerciseData }] =
    useSaveExerciseMutation();
  if (!loading && !data) {
    return (
      <div>
        <div>Có lỗi xảy ra. Vui lòng thử lại.</div>
        <div>{error?.message}</div>
      </div>
    );
  }
  return (
    <Layout>
      <Head>
        <title>Trang chủ</title>
        <meta property="og:title" content="Trang chủ" key="title" />
      </Head>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.getAllExercises.map((e, index) => {
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
                            const updatedExercises =
                              cache.readQuery<GetAllExercisesQuery>({
                                query: GetAllExercisesDocument,
                              });

                            const draft = cloneDeep(
                              updatedExercises?.getAllExercises,
                            );
                            let foundChange = false;
                            draft?.forEach((d) => {
                              if (d.id === e.id) {
                                d.saved = !d.saved;
                                foundChange = true;
                              }
                            });

                            if (foundChange) {
                              cache.writeQuery<GetAllExercisesQuery>({
                                query: GetAllExercisesDocument,
                                // @ts-ignore
                                data: { getAllExercises: draft },
                              });
                            }
                          },
                        }).then(() => setTargeted(''));
                      }}
                    >
                      {e.saved ? <DeleteIcon /> : <AddIcon />}
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

export default withApollo({ ssr: false })(HomePage);
