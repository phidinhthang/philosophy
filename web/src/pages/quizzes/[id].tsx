import Head from 'next/head';
import {
  Box,
  Heading,
  Stack,
  Text,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import ProgressBar from '@ramonak/react-progress-bar';
import CountUp from 'react-countup';
import { LoadingScreen } from '../../ui/LoadingScreen';
import React, { useState } from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { withApollo } from '../../lib/withApollo';
import { QuizOption } from '../../ui/QuizOption';
import { Wrapper } from '../../ui/Wrapper';
import styled from '@emotion/styled';
import { BackButton } from '../../ui/BackButton';
import { useGetRandomExerciseQuery } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { useIsAuth } from '../../utils/useIsAuth';

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
    resetState,
    isOpen,
    onClose,
    onOpen,
    score,
    totalScore,
    error,
  } = useQuiz();
  useIsAuth();
  const router = useRouter();

  console.log('router ', router.query.id);
  const { data: nextExerciseData } = useGetRandomExerciseQuery({
    variables: {
      currentId: typeof router.query.id === 'string' ? router.query.id : '',
    },
  });
  console.log('error detect', error);
  if (error) {
    router.replace('/404');
    return <LoadingScreen />;
  }
  if (!data && loading) return <LoadingScreen />;
  if (!loading && !data) return <div>có lỗi xảy ra </div>;
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
        {/* <WrapperAlert color={useColorModeValue('black', 'black')}>
          {alert}
        </WrapperAlert> */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Hoàn thành</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize="20">
                {totalScore > 0 ? `+${totalScore}` : `${totalScore}`} điểm
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  router.replace('/').then(() => onClose());
                }}
              >
                Trở lại trang chủ
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => {
                  const nextId = nextExerciseData?.getRandomExercise;
                  console.log('nextId', nextId);
                  if (nextId) {
                    router.push(`/quizzes/${nextId}`).then(() => {
                      resetState();
                      onClose();
                    });
                  } else {
                    router.push('/');
                  }
                }}
              >
                Bài khác
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
          <Box marginLeft="66px" flexGrow={1}>
            <ProgressBar
              completed={Math.round(
                (complete / data?.getQuestions.length!) * 100,
              )}
              isLabelVisible={false}
              height={'15px'}
              width="100%"
            />
          </Box>
        </Box>
        <Heading mb="5" flexGrow={1}>
          {data!.getQuestions?.[current]?.title}
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
