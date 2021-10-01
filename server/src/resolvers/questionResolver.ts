import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { v4 } from 'uuid';
import { Answer } from '../entities/Answer';
import { Exercise } from '../entities/Exercise';
import { Question } from '../entities/Question';
import { MyContext } from '../types';
import { QuestionInput } from './inputs';

@Resolver()
export class QuestionResolver {
  @Query(() => [Question])
  async getQuestions(
    @Ctx() { em }: MyContext,
    @Arg('id') id: string,
  ): Promise<Question[]> {
    em = em.fork();
    console.log(id);
    const exercise = em.getReference(Exercise, id);
    console.log(exercise);
    // const questions = await em.find(Question, { exercise });
    // console.log(questions);
    // return questions;
    const questions = await em
      .createQueryBuilder(Question)
      .select('*')
      .where({ exercise })
      .getResult();
    await em.populate(questions, ['answers']);
    return questions;
  }

  @Mutation(() => Boolean)
  async createQuestion(
    @Ctx() { em }: MyContext,
    @Arg('input') input: QuestionInput,
  ): Promise<boolean> {
    em = em.fork();
    const hasAnswers = input && input.answers && input.answers.length > 0;
    const exercise = await em.findOneOrFail(Exercise, { id: input.exerciseId });
    const question = em.create(Question, {
      id: v4(),
      title: input.title,
      exercise,
    });
    if (hasAnswers) {
      input.answers?.forEach((a) => {
        question.answers.add(em.create(Answer, a));
      });
    }

    try {
      await em.nativeUpdate(
        Exercise,
        { id: input.exerciseId },
        { length: exercise.length + 1 },
      );
      await em.persistAndFlush(question);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
