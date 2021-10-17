import { EntityManager } from '@mikro-orm/postgresql';
import {} from '@mikro-orm/core';
import Dataloader from 'dataloader';
import { User } from '../entities/User';

export const createUserLoader = (em: EntityManager) =>
  new Dataloader<string, User>(async (userIds) => {
    const users = await em.find(User, { id: { $in: userIds as string[] } });
    const userIdToUser: Record<string, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    const sortedUsers = userIds.map((userId) => userIdToUser[userId]);

    return sortedUsers;
  });
