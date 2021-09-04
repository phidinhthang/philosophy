import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';

export type WithApolloOptions = {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  apolloState: NormalizedCacheObject;
};

export type ContextWithApolloOptions = AppContext & {
  ctx: { apolloClient: WithApolloOptions['apolloClient'] };
} & NextPageContext &
  WithApolloOptions;

export type ApolloClientParam =
  | ApolloClient<NormalizedCacheObject>
  | ((
      ctx?: NextPageContext,
      serverAccessToken?: string,
    ) => ApolloClient<NormalizedCacheObject>);
