import Head from 'next/head';
import { Button } from '@chakra-ui/button';
import { Box, Heading, Stack, Text } from '@chakra-ui/layout';
import ProgressBar from '@ramonak/react-progress-bar';
import React, { useState } from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { withApollo } from '../../lib/withApollo';
import { QuizOption } from '../../ui/QuizOption';
import { Wrapper } from '../../ui/Wrapper';
import styled from '@emotion/styled';
import { useColorModeValue } from '@chakra-ui/color-mode';

const WrapperAlert = styled('div')`
  & a.btn.btn-lg.btn-primary {
    padding: 8px 20px;
    border-radius: 8px;
    color: ${(props: { color: string }) => props.color} !important;
  }

  & a.btn.btn-lg.btn-primary:hover {
    background-color: #eee;
  }
`;

const Question = () => {
  const {
    checked,
    data,
    isChoose,
    setIsChoose,
    loading,
    complete,
    correct,
    current,
    isSubmming,
    onCheckAnswer,
    onSaveComplete,
    alert,
    score,
    totalScore,
  } = useQuiz();
  if (!loading && !data) return <div>an error has occur</div>;
  if (!data && loading) return <div>loading ...</div>;
  return (
    <>
      <Head>
        <title>Câu hỏi</title>
        <meta property="og:title" content="Câu hỏi" key="title" />
      </Head>
      <Wrapper
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: window.innerHeight - 100,
        }}
      >
        <WrapperAlert color={useColorModeValue('white', 'black')}>
          {alert}
        </WrapperAlert>
        <ProgressBar
          completed={Math.round((complete / data?.getQuestions.length!) * 100)}
          isLabelVisible={false}
          height={'15px'}
        />
        <Heading>{data!.getQuestions[current].title}</Heading>
        {score === 0 ? null : (
          <p className="fadeoutup" style={{ fontSize: 24 }}>
            {score > 0 ? `+ ${score}` : `- ${score}`}
          </p>
        )}
        <Text>{totalScore}</Text>
        <Stack>
          {data!.getQuestions[current].answers.map((a) => (
            <QuizOption
              key={a.id}
              isChoose={isChoose === a.id}
              isCorrect={correct}
              isSubmited={checked}
              isLoading={isSubmming}
              onClick={(e) => setIsChoose(a.id)}
            >
              {a.text}
            </QuizOption>
          ))}
        </Stack>
        <Box display="flex" justifyContent="flex-end">
          <Button ml="auto" mr="4" onClick={onCheckAnswer} disabled={checked}>
            Kiểm tra
          </Button>

          <Button disabled={!checked} onClick={onSaveComplete}>
            {current === data?.getQuestions.length! - 1
              ? 'Hoàn thành'
              : 'Câu tiếp'}
          </Button>
        </Box>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(Question);
