import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { Answer } from '../entities/Answer';
import { Exercise } from '../entities/Exercise';
import { ScorePerDay } from '../entities/ScorePerDay';
import { User } from '../entities/User';
import { CustomError } from '../utils/CustomError';

@InputType()
export class AnswerInput implements Partial<Answer> {
  @Field(() => ID, { nullable: true })
  questionId?: string;

  @Field(() => String)
  text: string;

  @Field(() => Boolean, { defaultValue: false })
  isCorrect: boolean = false;
}

@InputType()
export class QuestionInput {
  @Field(() => ID, { nullable: true })
  exerciseId?: string;

  @Field(() => String)
  title: string;

  @Field(() => [AnswerInput], { nullable: true })
  answers?: AnswerInput[];
}

@InputType()
export class ExerciseInput {
  @Field(() => String)
  title: string;

  @Field(() => [QuestionInput], { nullable: true })
  questions?: QuestionInput[];
}

@InputType()
export class UserAnswerInput {
  @Field(() => ID)
  questionId: string;

  @Field(() => ID)
  answerId: string;
}

@InputType()
export class CompleteInput {
  @Field(() => ID)
  exerciseId: string;

  @Field(() => Int)
  corrects: number;
}

@InputType()
export class LoginInput implements Partial<User> {
  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;
}

/**
 * Register input
 */

@InputType()
export class RegisterInput implements Partial<User> {
  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}

/**
 * Login Response
 */

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => String, { nullable: true })
  accessToken?: string;
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];
}

/**
 * Exercise Response
 */
@ObjectType()
export class ExerciseField implements Partial<Exercise> {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => Int)
  length: number;

  @Field(() => Boolean, { defaultValue: false })
  saved: boolean = false;

  @Field(() => String)
  createdAt: string;

  @Field(() => User)
  creator: User;

  @Field(() => Int, { defaultValue: 0 })
  points: number;

  @Field(() => Int, { nullable: true })
  voteStatus: number;
}

@ObjectType()
export class ExerciseResponse {
  @Field(() => [ExerciseField], { nullable: true })
  exercises: ExerciseField[];

  @Field(() => Boolean, { defaultValue: true })
  hasMore: boolean;
}

@ObjectType()
export class UserInfoResponse implements Partial<User> {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => [ScorePerDay], { nullable: true })
  // @ts-ignore
  scorePerDay: ScorePerDay[];
}
