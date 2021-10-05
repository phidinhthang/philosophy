import { useMeQuery } from '../generated/graphql';
import { LoadingScreen } from '../ui/LoadingScreen';
import { useRouter } from 'next/router';
import { getPath } from './getPath';
import { isServer } from '../lib/isServer';
export const useIsAuth = () => {
  console.log('here');
  const { loading } = useMeQuery();
  const router = useRouter();
  if (!isServer()) {
    const { data, loading } = useMeQuery();
    if (data?.me || loading) {
    } else {
      router.replace(getPath() + `login?next=${router.pathname}`);
    }
  }
  if (loading) return <LoadingScreen />;
};
