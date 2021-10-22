import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  GetAllExercisesDocument,
  GetAllExercisesQuery,
  GetAllSavedExerciseDocument,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ChevronDownIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { LoadingScreen } from '../ui/LoadingScreen';
import cloneDeep from 'clone-deep';
import { EditDeleteExerciseButtons } from '../ui/EditDeleteExerciseButton';
import { UpvoteSection } from '../ui/UpvoteSection';

const HomePage = () => {
  const router = useRouter();
  if (router.query) useIsAuth();
  const { data, error, loading, fetchMore, variables } =
    useGetAllExercisesQuery({
      variables: { limit: 8 },
      notifyOnNetworkStatusChange: true,
    });
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
        <LoadingScreen />
      ) : (
        <>
          <Stack spacing={8} marginBottom={16}>
            {data?.getAllExercises?.exercises?.map((e, index) => {
              if (!e) return e;
              const done = meData?.me?.completes?.find(
                (c) => c.exercise.id === e.id,
              );
              let text = '';
              if (done) {
                text = `Hoàn thành ${done.corrects as number} / ${e.length}`;
              } else {
                text = `${e.length} Câu hỏi`;
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
                  <UpvoteSection exercise={e} />
                  <Box
                    flex={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <NextLink href="/quizzes/[id]" as={`/quizzes/${e.id}`}>
                        <Link>
                          <Heading fontSize="large">{e.title}</Heading>
                        </Link>
                      </NextLink>
                      <Text mt={5}>Tạo bởi {e.creator.name}</Text>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text mr="4">{text}</Text>
                      <Box ml="4">
                        <EditDeleteExerciseButtons
                          id={e.id}
                          creatorId={e.creator.id}
                        />
                      </Box>
                      <Menu>
                        <MenuButton as={Button}>
                          <ChevronDownIcon />
                        </MenuButton>
                        <MenuList>
                          <MenuItem>
                            <Button
                              isFullWidth
                              isLoading={isSaving && targeted === e.id}
                              disabled={isSaving && targeted === e.id}
                              onClick={() => {
                                setTargeted(e.id);
                                saveExercise({
                                  variables: { exerciseId: e.id },
                                  update: (cache, { data }) => {
                                    const cachedExercises =
                                      cache.readQuery<GetAllExercisesQuery>({
                                        query: GetAllExercisesDocument,
                                      });

                                    let exerciseDraft = cloneDeep(
                                      cachedExercises?.getAllExercises,
                                    );
                                    let haveFound = false;
                                    exerciseDraft?.exercises?.forEach(
                                      (exercise) => {
                                        if (exercise.id === e.id) {
                                          exercise.saved = !exercise.saved;
                                          haveFound = true;
                                        }
                                      },
                                    );

                                    if (haveFound) {
                                      cache.writeQuery<GetAllExercisesQuery>({
                                        query: GetAllExercisesDocument,
                                        data: {
                                          getAllExercises: {
                                            exercises: exerciseDraft?.exercises,
                                            hasMore: exerciseDraft!.hasMore,
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
                              <Button
                                isFullWidth
                                display="flex"
                                justifyContent="space-between"
                              >
                                {e.saved ? 'Bỏ lưu' : 'Lưu'}
                                {e.saved ? <DeleteIcon /> : <AddIcon />}
                              </Button>
                            </Button>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Box>
                  </Box>
                </Flex>
              );
            })}
          </Stack>
          {data?.getAllExercises.hasMore ? (
            <Box display="flex" justifyContent="center" mb="8">
              <Button
                isLoading={loading}
                isDisabled={loading}
                onClick={() => {
                  fetchMore({
                    variables: {
                      limit: variables?.limit,
                      cursor:
                        data.getAllExercises?.exercises?.[
                          data.getAllExercises.exercises?.length - 1
                        ].createdAt,
                    },
                  });
                }}
                borderWidth={2}
                borderColor={useColorModeValue('gray.300', undefined)}
              >
                Xem thêm
              </Button>
            </Box>
          ) : null}
        </>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: false })(HomePage);
