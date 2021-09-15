import { useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { getPath } from './getPath';
import { isServer } from '../lib/isServer';
export const useIsAuth = () => {
  console.log('here');
  useMeQuery();
  const router = useRouter();
  if (!isServer()) {
    const { data, loading } = useMeQuery();
    if (data?.me || loading) {
    } else {
      router.replace(getPath() + `login?next=${router.pathname}`);
    }
  }
};
