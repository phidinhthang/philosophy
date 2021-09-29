import { useRouter } from 'next/router';

import { useEffect } from 'react';

export default function () {
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

  return <div>loading...</div>;
}
