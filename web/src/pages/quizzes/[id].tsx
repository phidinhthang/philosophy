import { Button } from '@chakra-ui/button';
import { Box, Heading, Stack } from '@chakra-ui/layout';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  useCheckAnswerMutation,
  useGetQuestionsQuery,
} from '../../generated/graphql';
import { withApollo } from '../../lib/withApollo';
import { QuizOption } from '../../ui/QuizOption';
import { Wrapper } from '../../ui/Wrapper';

const Question = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isChoose, setIsChoose] = useState<string>();
  const [correct, setCorrect] = useState<boolean>();
  const [checked, setChecked] = useState(false);
  const { data, loading } = useGetQuestionsQuery({
    variables: { id: router.query.id as string },
  });
  const [checkAnswer, { loading: isSubmming }] = useCheckAnswerMutation();
  if (!loading && !data) return <div>an error has occur</div>;
  if (!data && loading) return <div>loading ...</div>;
  return (
    <Wrapper>
      <Heading mb="64">{data!.getQuestions[current].title}</Heading>
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
        <Button
          ml="auto"
          mr="4"
          onClick={async () => {
            const a = await checkAnswer({
              variables: {
                questionId: data?.getQuestions[current].id!,
                answerId: isChoose!,
              },
            });
            console.log(a);
            setCorrect(a.data?.checkAnswer);
            setChecked(true);
          }}
        >
          submit
        </Button>

        <Button
          disabled={!checked}
          onClick={() => {
            if (current === data?.getQuestions.length! - 1) return;
            setCurrent((curr) => curr + 1);
            setChecked(false);
            setCorrect(undefined);
            setIsChoose(undefined);
          }}
        >
          go next
        </Button>
      </Box>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(Question);
