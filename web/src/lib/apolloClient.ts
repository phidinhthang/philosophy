import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import { NextPageContext } from 'next';
import { getAccessToken, setAccessToken } from './accessToken';
import { isServer } from './isServer';

export const apolloClient = (
  _: NextPageContext | undefined,
  serverAccessToken: string = '',
) => {
  const httpLink = new HttpLink({
    uri:
      (isServer() ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL) +
      '/graphql',
    credentials: 'include',
    fetch,
  });

  const refreshLink = new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const token = getAccessToken();
      if (!token) {
        return true;
      }

      try {
        const { exp } = jwtDecode(token) as { exp: number };
        if (Date.now() >= exp * 1000) {
          return false;
        } else {
          return true;
        }
      } catch {
        return false;
      }
    },
    fetchAccessToken: () => {
      return fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || process.env.API_URL
        }/refresh_token`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
    },
    handleFetch: (accessToken) => {
      setAccessToken(accessToken);
    },
    handleError: (err) => {
      console.warn('your refresh token is invalid. Try to relogin');
      console.error(err);
    },
  });

  const authLink = setContext((_request, { headers }) => {
    const token = isServer() ? serverAccessToken : getAccessToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `bearer ${token}` : '',
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log('graphqlErrors ', graphQLErrors);
    console.log('networkError ', networkError);
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([refreshLink, authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
  });
};
