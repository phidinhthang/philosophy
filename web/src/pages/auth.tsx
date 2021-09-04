import Link from 'next/link';
import { withApollo } from '../lib/withApollo';
import { useIsAuth } from '../utils/useIsAuth';

const AuthPage = () => {
  const { data } = useIsAuth();
  if (!data) return <p>loading...</p>;

  return (
    <>
      <h1>{data.me?.name}</h1>
      <Link href="/">
        <a>home</a>
      </Link>
    </>
  );
};

export default withApollo({ ssr: true })(AuthPage);
