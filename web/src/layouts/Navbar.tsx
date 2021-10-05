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
  useColorModeValue,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import NextLink from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { setAccessToken } from '../lib/accessToken';
import { useMediaQuery } from 'react-responsive';

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
  const isDesktop = useMediaQuery({
    query: '(min-width: 480px)',
  });
  const { data, loading } = useMeQuery();
  const bg = useColorModeValue('#1DA1F2', 'purple.900');
  const isLightMode = useColorModeValue(true, false);
  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Đăng nhập</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={2}>Đăng ký</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <Text mr="4" fontWeight="bold">
          {data.me.score} Điểm
        </Text>
        <Box
          style={{
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            backgroundColor: 'white',
          }}
          mr="1"
        >
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
          {loading && <Skeleton circle={true} height={40} width={40} />}
        </Box>
        <Menu
          menuButton={
            <MenuButton>
              <ChevronDownIcon fontSize="3xl" />
            </MenuButton>
          }
          menuStyles={{
            marginTop: 15,
            marginRight: 15,
          }}
        >
          <Box mr={2} textAlign="center" my="2" fontWeight="bold">
            {data.me.name}
          </Box>
          {isDesktop && (
            <MenuItem>
              <NextLink href="/profile">
                <Button w="full">Xem thông tin</Button>
              </NextLink>
            </MenuItem>
          )}
          <MenuItem>
            <NextLink href="/create-exercise">
              <Button w="full">Thêm bài học</Button>
            </NextLink>
          </MenuItem>
          <MenuItem>
            <Button w="full" onClick={toggleColorMode}>
              {isLightMode ? <MoonIcon /> : <SunIcon />}
            </Button>
          </MenuItem>
          {isDesktop && (
            <MenuItem>
              <NextLink href="/saved">
                <Button w="full">Đã lưu</Button>
              </NextLink>
            </MenuItem>
          )}
          <MenuItem>
            <Button
              w="full"
              onClick={async () => {
                await logout();
              }}
            >
              Đăng xuất
            </Button>
          </MenuItem>
        </Menu>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg={bg} p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <NextLink href="/">
            <Link>
              <Heading>
                <Image style={{ width: 50, height: 50 }} src="/logo.png" />
              </Heading>
            </Link>
          </NextLink>
          <NextLink href="/rank">
            <Button as={Link} ml="4">
              BXH
            </Button>
          </NextLink>
        </Box>

        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
