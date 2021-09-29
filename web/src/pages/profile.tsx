import { Box, Stack } from '@chakra-ui/layout';
import Head from 'next/head';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Layout } from '../layouts/Layout';
import { useGetScoreOfWeekQuery } from '../generated/graphql';
import { withApollo } from '../lib/withApollo';
import { AvatarInfo } from '../ui/AvatarInfo';
import { ScoreChart } from '../ui/ScoreChart';
import { useIsAuth } from '../utils/useIsAuth';
import { ChangeInfo } from '../ui/ChangeInfo';

dayjs.locale('vi');

function Profile() {
  useIsAuth();
  const { data, loading, error } = useGetScoreOfWeekQuery();
  if (loading) return <p>Đang load...</p>;
  if (error) {
    console.log('get score ', error);
    return <p>Có lỗi xảy ra.</p>;
  }
  if (!data) return <p>Không có dữ liệu.</p>;
  const score = data.getScoreOfWeek
    .map((i) => i)
    .sort((a, b) => +a.day - +b.day)
    .map((s) => s.score);
  const day = data.getScoreOfWeek
    .map((s) => s.day)
    .map((day) => +day)
    .sort((a, b) => a - b)
    .map((day) => new Date(day - 86400001).getDay())
    .map((d) => {
      console.log(d);
      return dayjs().day(d).format('dddd');
    });
  return (
    <Layout variant="regular">
      <Head>
        <title>Tài khoản</title>
        <meta property="og:title" content="Tài khoản" key="title" />
      </Head>
      <Stack direction={['column', 'row']} alignItems="flex-start">
        <Box flexGrow={2} maxWidth={['95%', '40%']} marginX="auto">
          <AvatarInfo />
          <ScoreChart data={score} labels={day} />
        </Box>
        <Box width="full" maxWidth={['95%', '55%']} marginX="auto" flexGrow={3}>
          <ChangeInfo />
        </Box>
      </Stack>
    </Layout>
  );
}

export default withApollo({ ssr: true })(Profile);
