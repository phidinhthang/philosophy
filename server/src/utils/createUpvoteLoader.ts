import { EntityManager } from '@mikro-orm/postgresql';
import {} from '@mikro-orm/core';
import { Upvote } from '../entities/Upvote';
import DataLoader from 'dataloader';

export const createUpvoteLoader = (em: EntityManager) =>
  new DataLoader<{ exercise: string; user: string }, Upvote | null>(
    async (keys) => {
      const upvotes = await em.find(Upvote, {
        $or: keys as { exercise: string; user: string }[],
      });
      const upvoteIdsToUpvote: Record<string, Upvote> = {};
      upvotes.forEach((upvote) => {
        console.log('upvote.userId ', upvote.user.id);
        upvoteIdsToUpvote[`${upvote.user.id}|${upvote.exercise.id}`] = upvote;
      });

      console.log(upvotes);

      return keys.map(
        (key) => upvoteIdsToUpvote[`${key.user}|${key.exercise}`],
      );
    },
  );
