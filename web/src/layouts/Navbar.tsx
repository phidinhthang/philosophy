import React from 'react';
import {
  Box,
  Link,
  Flex,
  Button,
  Heading,
  Text,
  Image,
  useColorMode,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { setAccessToken } from '../lib/accessToken';

interface NavbarProps {}

const AVATAR_URL_PLACEHOLDER =
  'https://avatars.dicebear.com/api/croodles-neutral/';

export const NavBar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const { toggleColorMode } = useColorMode();
  const [logout, { loading: logoutFetching }] = useLogoutMutation({
    onCompleted: async () => {
      setAccessToken('');
      await apolloClient.clearStore();

      router.replace('/login');
    },
  });
  const { data, loading } = useMeQuery();

  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={2}>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <Text>{data.me.score}</Text>
        <NextLink href="/create-exercise">
          <Button as={Link} mr={4}>
            create
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.name}</Box>
        <Button onClick={toggleColorMode}>change</Button>
        <img
          style={{
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            backgroundColor: 'white',
          }}
          src={
            data.me.avatarUrl
              ? data.me.avatarUrl
              : `${AVATAR_URL_PLACEHOLDER}${data.me.id}.svg`
          }
        />
        <Button
          onClick={async () => {
            await logout();
          }}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>
              <Image style={{ width: 50, height: 50 }} src="/logo.png" />
            </Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
