import React from 'react';
import {
  useMeQuery,
  useLogoutMutation,
  MeQuery,
  MeDocument,
} from '../generated/graphql';
import Link from 'next/link';
import { setAccessToken } from '../lib/accessToken';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';

interface Props {}

export const Header: React.FC<Props> = () => {
  const [logout] = useLogoutMutation({
    onCompleted: async () => {
      await client.cache.reset().then(() => {
        window.location.replace('http://localhost:3000/login');
        setAccessToken('');
      });
      client.onClearStore(async () => {});
    },
  });
  const client = useApolloClient();
  const data = client.readQuery<MeQuery>({ query: MeDocument });
  const router = useRouter();
  let body: any = null;

  if (data && data.me) {
    body = <div>you are logged in as: {data.me.name}</div>;
  } else {
    body = <div>not logged in</div>;
  }

  return (
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/register">
          <a>Register</a>
        </Link>{' '}
        |{' '}
        <Link href="/login">
          <a>Login</a>
        </Link>{' '}
        |{' '}
        <Link href="/bye">
          <a>bye</a>
        </Link>{' '}
        |{' '}
        <Link href="/auth">
          <a>auth</a>
        </Link>
        {data && data.me ? (
          <button
            onClick={async () => {
              await logout();
            }}
          >
            logout
          </button>
        ) : null}
      </nav>
      {body}
    </header>
  );
};
