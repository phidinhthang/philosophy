import { useRouter } from 'next/router';

export const useGetId = () => {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : null;

  return id;
};
