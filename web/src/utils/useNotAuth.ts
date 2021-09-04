import { useRouter } from 'next/router';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../lib/isServer';
// import { getPath } from './getPath';

export const useNotAuth = () => {
  console.log('not auth here');
  const { data, loading } = useMeQuery();
  if (data?.me !== null && !loading) {
    if (!isServer()) {
      const router = useRouter();
      router.replace('/');
    }
  }
};
