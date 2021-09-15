import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { Answer } from '../entities/Answer';
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

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => String, { nullable: true })
  accessToken?: string;
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];
}
