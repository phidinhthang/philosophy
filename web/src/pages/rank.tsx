import { Stack, Flex, Box, Text, Avatar } from '@chakra-ui/react';
import { useGetTopUsersQuery } from '../generated/graphql';
import { Layout } from '../layouts/Layout';
import { withApollo } from '../lib/withApollo';

interface RankItemProps {
  name: string;
  score: number;
  avatarUrl?: string;
  id: string;
}

const AVATAR_URL_PLACEHOLDER =
  'https://avatars.dicebear.com/api/croodles-neutral/';

const RankItem = ({
  name,
  score,
  avatarUrl,
  id,
}: RankItemProps): React.ReactElement => {
  return (
    <Flex justifyContent="space-between">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Avatar
          src={
            avatarUrl ? avatarUrl : `${AVATAR_URL_PLACEHOLDER + `${id}.svg`}`
          }
        />
        <Text ml="3">{name}</Text>
      </Box>
      <Box display="flex" alignItems="center">
        <Text>{score}</Text>
      </Box>
    </Flex>
  );
};

const RankPage = () => {
  const { data, error, loading } = useGetTopUsersQuery();

  if (loading) return <div>loading...</div>;

  if (error) return <div>Co loi...</div>;

  if (!data) {
    console.log('no data');
    return null;
  }
  return (
    <Layout variant="small">
      <Stack spacing={8}>
        {[...data!.getTopUsers]
          .sort((a, b) => b.score - a.score)
          .map((user) => (
            <RankItem
              score={user.score}
              name={user.name}
              key={user.id}
              avatarUrl={user.avatarUrl as string | undefined}
              id={user.id}
            />
          ))}
      </Stack>
    </Layout>
  );
};

export default withApollo()(RankPage);
