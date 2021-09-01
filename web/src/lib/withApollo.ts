import { useApollo } from './useApollo';
import { apolloClient } from './apolloClient';

export const withApollo = useApollo(apolloClient);
