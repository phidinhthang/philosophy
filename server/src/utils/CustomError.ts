import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class CustomError {
  @Field(() => String)
  field: string;

  @Field(() => String)
  message: string;
}
