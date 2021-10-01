import Head from 'next/head';
import { Box, Heading, Stack, Text, Button } from '@chakra-ui/react';
import ProgressBar from '@ramonak/react-progress-bar';
import CountUp from 'react-countup';
import React, { useState } from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { withApollo } from '../../lib/withApollo';
import { QuizOption } from '../../ui/QuizOption';
import { Wrapper } from '../../ui/Wrapper';
import styled from '@emotion/styled';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { BackButton } from '../../ui/BackButton';

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
          // justifyContent: 'space-between',
          height: window.innerHeight - 100,
        }}
      >
        <WrapperAlert color={useColorModeValue('white', 'black')}>
          {alert}
        </WrapperAlert>
        <Box
          w="full"
          position="relative"
          display="flex"
          justifyContent="flex-end"
          height="15px"
          alignItems="center"
          mb="12"
          mt="8"
        >
          <Box w="10" position="absolute" left="0" zIndex="1000">
            <BackButton />
          </Box>
          <ProgressBar
            completed={Math.round(
              (complete / data?.getQuestions.length!) * 100,
            )}
            isLabelVisible={false}
            height={'15px'}
            margin="0 0 0 60px"
            width={`${800 - 60}px`}
          />
        </Box>
        <Heading mb="5" flexGrow={1}>
          {data!.getQuestions[current].title}
        </Heading>

        {score === 0 ? null : (
          <Box w="20">
            <Text
              className="fadeoutup"
              fontSize="x-large"
              background="transparent"
              w="20"
            >
              {score > 0 ? `+ ${score}` : `- ${score}`}
            </Text>
          </Box>
        )}
        <Box>
          <Text fontWeight="semibold" fontSize="x-large">
            <CountUp
              // preserveValue={true}
              start={totalScore - score}
              end={totalScore}
              delay={0.1}
              redraw={true}
              duration={2}
            />
          </Text>
          <Stack my="4">
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
        </Box>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(Question);
