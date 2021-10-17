import React from 'react';
import { Box, IconButton, Link } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useDeleteExerciseMutation, useMeQuery } from '../generated/graphql';

interface EditDeleteExerciseButtonsProps {
  id: string;
  creatorId: string;
}

export const EditDeleteExerciseButtons: React.FC<EditDeleteExerciseButtonsProps> =
  ({ id, creatorId }) => {
    const { data: meData } = useMeQuery();
    const [deleteExercise] = useDeleteExerciseMutation();

    if (meData?.me?.id !== creatorId) {
      return null;
    }

    return (
      <Box>
        <NextLink href={`/e/edit/${id}`}>
          <IconButton
            as={Link}
            icon={<EditIcon />}
            aria-label="Edit exercise"
          />
        </NextLink>
        <IconButton
          icon={<DeleteIcon />}
          aria-label="delete exercise"
          onClick={() => {
            deleteExercise({
              variables: { id },
              update: (cache) => {
                cache.evict({ id: 'Post:' + id });
              },
            });
          }}
        />
      </Box>
    );
  };
