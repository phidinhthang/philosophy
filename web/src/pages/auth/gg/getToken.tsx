import { useRouter } from 'next/router';

import { useEffect } from 'react';
import { withApollo } from '../../../lib/withApollo';
import { LoadingScreen } from '../../../ui/LoadingScreen';

function GetOAuthToken() {
  const router = useRouter();
  console.log(router.query);
  const refresh_token = router.query.refresh_token as string;

  useEffect(() => {
    if (refresh_token) {
      fetch(process.env.NEXT_PUBLIC_API_URL + '/get_refresh_token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token }),
      })
        .then((res) => {
          window.location.href = process.env.NEXT_PUBLIC_BASE_PATH!;
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      router.replace('/');
    }
  }, [refresh_token]);

  return <LoadingScreen />;
}

export default withApollo({})(GetOAuthToken);
