import { EntityManager } from '@mikro-orm/postgresql';
import { v4 } from 'uuid';
import { Answer } from '../entities/Answer';
import { Exercise } from '../entities/Exercise';
import { Question } from '../entities/Question';

export const seed = async (em: EntityManager) => {
  const answer2 = em.create(Answer, {
    id: v4(),
    text: 'This is the correct answer',
    isCorrect: true,
  });
  const answer1 = em.create(Answer, {
    id: v4(),
    text: 'This is the answer 1',
    isCorrect: false,
  });
  const answer3 = em.create(Answer, {
    id: v4(),
    text: 'This is the answer 3',
    isCorrect: false,
  });
  const answer4 = em.create(Answer, {
    id: v4(),
    text: 'This is the answer 4',
    isCorrect: false,
  });
  const question1 = em.create(Question, {
    id: v4(),
    title: 'This is the question 1',
  });

  const exercise = em.create(Exercise, {
    id: v4(),
    title: 'chapter 1',
    length: 4,
  });
  question1.answers.add(answer1, answer2, answer3, answer4);

  exercise.questions.add(question1);

  await em.persistAndFlush([exercise]);
};
