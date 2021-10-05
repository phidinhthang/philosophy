import { useRouter } from 'next/router';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../lib/isServer';
import { LoadingScreen } from '../ui/LoadingScreen';
// import { getPath } from './getPath';

export const useNotAuth = () => {
  console.log('not auth here');
  const { data, loading } = useMeQuery();

  const router = useRouter();

  console.log(data?.me);
  if (data?.me && !loading) {
    if (!isServer()) {
      router.replace('/');
    }
  }
  if (loading) return <LoadingScreen />;
};
