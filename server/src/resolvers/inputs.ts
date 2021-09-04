import { Field, ID, InputType, Int } from 'type-graphql';
import { Answer } from '../entities/Answer';

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
