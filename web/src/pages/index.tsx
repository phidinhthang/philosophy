import React from 'react';
import { useGetAllExercisesQuery, useMeQuery } from '../generated/graphql';
import { Layout } from '../layouts/Layout';
import { withApollo } from '../lib/withApollo';
import { useIsAuth } from '../utils/useIsAuth';
import { Box, Flex, Heading, Link, Stack, Text } from '@chakra-ui/layout';
import NextLink from 'next/link';

const HomePage = () => {
  useIsAuth();
  const { data, error, loading } = useGetAllExercisesQuery();
  const { data: meData } = useMeQuery();
  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }
  return (
    <Layout>
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
                key={e.id || index}
                p={5}
                borderWidth="1px"
                backgroundColor={done ? 'green.100' : undefined}
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
                  <Text>{text}</Text>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(HomePage);
