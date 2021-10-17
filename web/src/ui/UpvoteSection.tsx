import React, { useState } from 'react';
import { Flex, IconButton } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  ExerciseFieldSnippetFragment,
  ExerciseSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from '../generated/graphql';
import gql from 'graphql-tag';
import { ApolloCache } from '@apollo/client';

interface UpvoteSectionProps {
  exercise: ExerciseFieldSnippetFragment;
}

const updateAfterVote = (
  value: number,
  exerciseId: string,
  cache: ApolloCache<VoteMutation>,
) => {
  const data = cache.readFragment<{
    exerciseId: string;
    points: number;
    voteStatus: number | null;
  }>({
    id: 'ExerciseField:' + exerciseId,
    fragment: gql`
      fragment _ on ExerciseField {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) return;
  }
  console.log('data ', data);
  const newPoints =
    (data?.points as number) + (!data?.voteStatus ? 1 : 2) * value;
  console.log(newPoints);
  cache.writeFragment({
    id: 'ExerciseField:' + exerciseId,
    fragment: gql`
      fragment ___ on ExerciseField {
        points
        voteStatus
      }
    `,
    data: { points: newPoints, voteStatus: value },
  });
};

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ exercise }) => {
  const [loadingState, setLoadingState] = useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading');
  const [vote] = useVoteMutation();

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (exercise.voteStatus === 1) {
            return;
          }
          setLoadingState('upvote-loading');
          await vote({
            variables: {
              exerciseId: exercise.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, exercise.id, cache),
          });
          setLoadingState('not-loading');
        }}
        colorScheme={exercise.voteStatus === 1 ? 'green' : undefined}
        isLoading={loadingState === 'upvote-loading'}
        aria-label="upvote exercise"
        icon={<ChevronUpIcon />}
      />
      {exercise.points}
      <IconButton
        onClick={async () => {
          if (exercise.voteStatus === -1) {
            return;
          }
          setLoadingState('downvote-loading');
          await vote({
            variables: {
              exerciseId: exercise.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, exercise.id, cache),
          });
          setLoadingState('not-loading');
        }}
        colorScheme={exercise.voteStatus === -1 ? 'red' : undefined}
        isLoading={loadingState === 'downvote-loading'}
        aria-label="downvote exercise"
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
