import { Button } from '@chakra-ui/button';
import { Box, Heading, Stack, Text } from '@chakra-ui/layout';
import ProgressBar from '@ramonak/react-progress-bar';
import React, { useState } from 'react';
import { useQuiz } from '../../hooks/quiz';
import { withApollo } from '../../lib/withApollo';
import { QuizOption } from '../../ui/QuizOption';
import { Wrapper } from '../../ui/Wrapper';

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
    <Wrapper
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: window.innerHeight - 100,
      }}
    >
      {alert}
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
          submit
        </Button>

        <Button disabled={!checked} onClick={onSaveComplete}>
          {current === data?.getQuestions.length! - 1 ? 'save' : 'go next'}
        </Button>
      </Box>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(Question);
