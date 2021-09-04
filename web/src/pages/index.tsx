import React from 'react';
import { useGetAllExercisesQuery, useMeQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { withApollo } from '../lib/withApollo';
import { useIsAuth } from '../utils/useIsAuth';
import { Box, Flex, Heading, Link, Stack, Text } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { AnswerInput } from '../ui/AnswerInput';

const HomePage = () => {
  useIsAuth();
  const { data, error, loading } = useGetAllExercisesQuery();

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
          {data!.getAllExercises.map((e) => (
            <Flex key={e.id} p={5} borderWidth="1px">
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
                <Text>{e.length} question</Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {/* <AnswerInput label="hello" name="hello" /> */}
    </Layout>
  );
};

export default withApollo({ ssr: true })(HomePage);
