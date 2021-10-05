import React from 'react';
import { Box, Text, Avatar, CircularProgress } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  useGetScoreOfWeekQuery,
  useGetUserInfoQuery,
  useMeQuery,
} from '../generated/graphql';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

export const CompareScoreChart = ({ id }: { id: string }) => {
  const { loading, data } = useGetScoreOfWeekQuery({ errorPolicy: 'ignore' });
  const { data: meData } = useMeQuery();
  let datasets: any;
  const {
    data: dataUser,
    error,
    loading: userLoading,
  } = useGetUserInfoQuery({
    errorPolicy: 'ignore',
    variables: {
      id,
    },
  });

  if (userLoading || loading)
    return (
      <Box
        width="full"
        height="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt="4"
      >
        <CircularProgress isIndeterminate color="blue.300" />
      </Box>
    );
  if (error || !dataUser?.getUserInfo) return <p>error</p>;

  if (!data || !meData) {
    datasets = [
      {
        label: '',
        data: dataUser!.getUserInfo?.scorePerDay
          ?.map((i) => i)
          .sort((a, b) => +a.day - +b.day)
          .map((s) => s.score) as number[],
        fill: false,
        borderColor: 'rgba(54, 162, 235, 0.8)',
      },
    ];
  } else if (meData!.me?.id === dataUser.getUserInfo.id) {
    datasets = [
      {
        label: 'Bạn',
        data: dataUser!.getUserInfo?.scorePerDay
          ?.map((i) => i)
          .sort((a, b) => +a.day - +b.day)
          .map((s) => s.score) as number[],
        fill: false,
        borderColor: 'rgba(54, 162, 235, 0.8)',
      },
    ];
  } else {
    datasets = [
      {
        label: 'Bạn',
        data: data!.getScoreOfWeek
          .map((i) => i)
          .sort((a, b) => +a.day - +b.day)
          .map((s) => s.score),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 0.8)',
      },
      {
        label: dataUser!.getUserInfo.name,
        data: dataUser!.getUserInfo?.scorePerDay
          ?.map((i) => i)
          .sort((a, b) => +a.day - +b.day)
          .map((s) => s.score) as number[],
        fill: false,
        borderColor: 'rgba(54, 162, 235, 0.8)',
      },
    ];
  }
  return (
    <Box mt="10">
      <Box display="flex" flexDirection="column" alignItems="center" mb="6">
        <Text mb="4">{dataUser.getUserInfo.name}</Text>
        <Avatar src={dataUser.getUserInfo.avatarUrl as string | undefined} />
      </Box>
      {
        <Line
          data={{
            labels: dataUser!.getUserInfo?.scorePerDay
              ?.map((s) => s.day)
              .map((day) => +day)
              .sort((a, b) => a - b)
              .map((day) => new Date(day - 86400001).getDay())
              .map((d) => {
                console.log(d);
                return dayjs().day(d).format('dddd');
              }),
            datasets: datasets,
          }}
          // options={{ maintainAspectRatio: false }}
        />
      }
    </Box>
  );
};
