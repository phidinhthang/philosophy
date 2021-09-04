import { useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { getPath } from './getPath';
import { isServer } from '../lib/isServer';
export const useIsAuth = () => {
  console.log('here');
  const { data, error, loading } = useMeQuery();
  if ((error || !data?.me) && !loading) {
    if (!isServer() && !data?.me) {
      const router = useRouter();
      router.replace(getPath() + `login?next=${router.pathname}`);
    }
  }
  return { data };
};
