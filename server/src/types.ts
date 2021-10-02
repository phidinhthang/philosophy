import { EntityManager } from '@mikro-orm/postgresql';
import { Redis } from 'ioredis';
import { Request, Response } from 'express';
import { Field, Int, ObjectType } from 'type-graphql';
import { Exercise } from './entities/Exercise';

export type MyContext = {
  req: Request;
  res: Response;
  em: EntityManager;
  redis: Redis;
};

@ObjectType()
class AnswerError {
  @Field(() => String, { nullable: true })
  text?: string | undefined;

  @Field(() => String, { nullable: true })
  isCorrect?: string | undefined;
}

@ObjectType()
class QuestionError {
  @Field(() => String, { nullable: true })
  title?: string | undefined;
  @Field(() => String, { nullable: true })
  isCorrect?: string | undefined;

  @Field(() => [AnswerError], { nullable: true })
  answers: AnswerError[];
}

@ObjectType()
export class ExerciseError {
  @Field(() => String, { nullable: true })
  title?: string | undefined;

  @Field(() => [QuestionError], { nullable: true })
  questions: QuestionError[];
}

@ObjectType()
export class CreateExerciseResponse {
  @Field(() => Boolean)
  hasError: boolean;

  @Field(() => ExerciseError, { nullable: true })
  errors?: ExerciseError;

  @Field(() => Exercise, { nullable: true })
  exercise?: Exercise;
}

@ObjectType()
export class CheckAnswerResponse {
  @Field(() => Boolean)
  isCorrect: boolean;

  @Field(() => Int)
  score: number;
}
