import { useRouter } from 'next/router';
import { useState } from 'react';
import cloneDeep from 'clone-deep';
import {
  useGetQuestionsQuery,
  useCheckAnswerMutation,
  useSaveCompleteMutation,
  MeDocument,
  MeQuery,
  GetAllExercisesQuery,
  GetAllExercisesDocument,
  ExerciseSnippetFragmentDoc,
  GetTopUsersDocument,
  GetTopUsersQuery,
  useMeQuery,
} from '../generated/graphql';
import { floating } from '../lib/floating';
import { useDisclosure } from '@chakra-ui/hooks';

export const useQuiz = () => {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(0);
  const [isChoose, setIsChoose] = useState<string>();
  const [correct, setCorrect] = useState<boolean>();
  const [corrects, setCorrects] = useState<number>(0);
  const [checked, setChecked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: meData } = useMeQuery();
  const { data, loading } = useGetQuestionsQuery({
    variables: { id: router.query.id as string },
    fetchPolicy: 'no-cache',
  });
  const [checkAnswer, { loading: isSubmming }] = useCheckAnswerMutation({
    fetchPolicy: 'no-cache',
  });
  const [saveComplete, { loading: isSaving }] = useSaveCompleteMutation({
    fetchPolicy: 'no-cache',
  });
  const resetState = () => {
    setTotalScore(0);
    setCurrent(0);
    setComplete(0);
    setIsChoose('');
    setCorrect(undefined);
    setCorrects(0);
    setChecked(false);
  };
  const onCheckAnswer = async () => {
    const a = await checkAnswer({
      variables: {
        questionId: data?.getQuestions[current].id!,
        answerId: isChoose!,
      },
      update: (cache, { data }) => {
        const meCache = cache.readQuery<MeQuery>({
          query: MeDocument,
        });

        if (!meCache?.me) router.push('/');
        const meDraft = cloneDeep(meCache!.me);

        meDraft!.score = meDraft!.score + (data?.checkAnswer.score ?? 0);

        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: meDraft,
          },
        });

        const topUsersCache = cache.readQuery<GetTopUsersQuery>({
          query: GetTopUsersDocument,
        });

        if (!topUsersCache?.getTopUsers.length) return;

        const topUsersDraft = cloneDeep(topUsersCache.getTopUsers);
        topUsersDraft.forEach((user) => {
          if (user.id === meDraft?.id) {
            user.score += data?.checkAnswer.score ?? 0;
          }
        });

        cache.writeQuery<GetTopUsersQuery>({
          query: GetTopUsersDocument,
          data: {
            getTopUsers: topUsersDraft,
          },
        });
      },
    });

    if (a.data?.checkAnswer.isCorrect === true) {
      setCorrects((c) => c + 1);
      floating({ number: 5, duration: 6, repeat: '1' });
    } else if (a.data?.checkAnswer.isCorrect === false) {
      floating({ number: 5, duration: 6, repeat: '1', content: '😢' });
    }
    if (a.data?.checkAnswer) {
      setScore(a.data.checkAnswer.score);
      setTotalScore((total) => total + a.data!.checkAnswer.score);
      setTimeout(() => {
        setScore(0);
      }, 1000);
    }
    setCorrect(a.data?.checkAnswer.isCorrect);
    setComplete((c) => c + 1);
    setChecked(true);
  };

  const onSaveComplete = async () => {
    if (current === data?.getQuestions.length! - 1) {
      const data = await saveComplete({
        variables: {
          input: { corrects, exerciseId: router.query.id as string },
        },
        update(cache, { data }) {
          if (data?.saveComplete) {
            const exercises = cache.readQuery<GetAllExercisesQuery>({
              query: GetAllExercisesDocument,
            });
            const exercise = exercises?.getAllExercises.exercises?.find(
              (exercise) => {
                return exercise.id === router.query.id;
              },
            );
            console.log(meData);
            if (!meData?.me) {
              return router.push('/');
            }
            cache.writeQuery({
              query: MeDocument,
              data: {
                me: {
                  ...meData!.me!,
                  completes: [
                    ...(meData!.me?.completes || []),
                    { __typename: 'Complete', exercise: exercise, corrects },
                  ],
                },
              },
            });
          }
        },
      });

      const floatElements = document.getElementsByClassName('float-container');
      const floats = [].slice.call(floatElements);
      floats.forEach((f) => {
        (f as any).remove();
      });
      onOpen();
    } else {
      const floatElements = document.getElementsByClassName('float-container');
      const floats = [].slice.call(floatElements);
      floats.forEach((f) => {
        (f as any).remove();
      });
      setCurrent((curr) => curr + 1);
      setChecked(false);
      setCorrect(undefined);
      setIsChoose(undefined);
    }
  };

  return {
    data,
    loading,
    complete,
    current,
    isChoose,
    correct,
    checked,
    isSubmming,
    setIsChoose,
    onCheckAnswer,
    onSaveComplete,
    resetState,
    score,
    totalScore,
    isOpen,
    onOpen,
    onClose,
  };
};
