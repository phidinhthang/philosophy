import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Answer = {
  __typename?: 'Answer';
  id: Scalars['ID'];
  text: Scalars['String'];
  question: Question;
};

export type AnswerError = {
  __typename?: 'AnswerError';
  text?: Maybe<Scalars['String']>;
  isCorrect?: Maybe<Scalars['String']>;
};

export type AnswerInput = {
  questionId?: Maybe<Scalars['ID']>;
  text: Scalars['String'];
  isCorrect?: Maybe<Scalars['Boolean']>;
};

export type CheckAnswerResponse = {
  __typename?: 'CheckAnswerResponse';
  isCorrect: Scalars['Boolean'];
  score: Scalars['Int'];
};

export type Complete = {
  __typename?: 'Complete';
  user: User;
  exercise: Exercise;
  corrects?: Maybe<Scalars['Int']>;
};

export type CompleteInput = {
  exerciseId: Scalars['ID'];
  corrects: Scalars['Int'];
};

export type CreateExerciseResponse = {
  __typename?: 'CreateExerciseResponse';
  hasError: Scalars['Boolean'];
  errors?: Maybe<ExerciseError>;
  exercise?: Maybe<Exercise>;
};

export type CustomError = {
  __typename?: 'CustomError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Exercise = {
  __typename?: 'Exercise';
  id: Scalars['ID'];
  title: Scalars['String'];
  length: Scalars['Int'];
  createdAt: Scalars['String'];
  points: Scalars['Float'];
  creator: User;
  voteStatus?: Maybe<Scalars['Int']>;
  questions: Array<Question>;
};

export type ExerciseError = {
  __typename?: 'ExerciseError';
  title?: Maybe<Scalars['String']>;
  questions?: Maybe<Array<QuestionError>>;
};

export type ExerciseField = {
  __typename?: 'ExerciseField';
  id: Scalars['ID'];
  title: Scalars['String'];
  length: Scalars['Int'];
  saved?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  creator: User;
  points?: Maybe<Scalars['Int']>;
  voteStatus?: Maybe<Scalars['Int']>;
};

export type ExerciseInput = {
  title: Scalars['String'];
  questions?: Maybe<Array<QuestionInput>>;
};

export type ExerciseResponse = {
  __typename?: 'ExerciseResponse';
  exercises?: Maybe<Array<ExerciseField>>;
  hasMore?: Maybe<Scalars['Boolean']>;
};

export type InfoInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type LoginInput = {
  name: Scalars['String'];
  password: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  user?: Maybe<User>;
  accessToken?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<CustomError>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  logout: Scalars['Boolean'];
  login: LoginResponse;
  register: LoginResponse;
  checkAnswer: CheckAnswerResponse;
  vote: Scalars['Boolean'];
  deleteExercise: Scalars['Boolean'];
  updateExercise: Scalars['Boolean'];
  createExercise?: Maybe<CreateExerciseResponse>;
  saveComplete: Scalars['Boolean'];
  saveExercise: Scalars['Boolean'];
  deleteQuestion: Scalars['Boolean'];
  createQuestion: Scalars['Boolean'];
  uploadAvatar: Scalars['Boolean'];
  updateInfo: Scalars['Boolean'];
  changePassword: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  resetPassword: LoginResponse;
  addEmail: Scalars['Boolean'];
  confirmEmail: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationCheckAnswerArgs = {
  input: UserAnswerInput;
};


export type MutationVoteArgs = {
  value: Scalars['Int'];
  exerciseId: Scalars['String'];
};


export type MutationDeleteExerciseArgs = {
  id: Scalars['String'];
};


export type MutationUpdateExerciseArgs = {
  title: Scalars['String'];
  id: Scalars['String'];
};


export type MutationCreateExerciseArgs = {
  input: ExerciseInput;
};


export type MutationSaveCompleteArgs = {
  input: CompleteInput;
};


export type MutationSaveExerciseArgs = {
  exerciseId: Scalars['String'];
};


export type MutationDeleteQuestionArgs = {
  id: Scalars['String'];
};


export type MutationCreateQuestionArgs = {
  input: QuestionInput;
};


export type MutationUploadAvatarArgs = {
  avatarUrl: Scalars['String'];
};


export type MutationUpdateInfoArgs = {
  input: InfoInput;
};


export type MutationChangePasswordArgs = {
  password: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationAddEmailArgs = {
  email: Scalars['String'];
};


export type MutationConfirmEmailArgs = {
  token: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  getScoreOfWeek: Array<ScorePerDay>;
  hello: Scalars['String'];
  getAllExercises: ExerciseResponse;
  getAllSavedExercise?: Maybe<Array<Exercise>>;
  getRandomExercise: Scalars['ID'];
  exercise?: Maybe<Exercise>;
  getQuestions: Array<Question>;
  getTopUsers: Array<TopUser>;
  getUserInfo: UserInfoResponse;
};


export type QueryGetAllExercisesArgs = {
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['String']>;
};


export type QueryGetRandomExerciseArgs = {
  currentId: Scalars['String'];
};


export type QueryExerciseArgs = {
  id: Scalars['String'];
};


export type QueryGetQuestionsArgs = {
  id: Scalars['String'];
};


export type QueryGetUserInfoArgs = {
  id: Scalars['ID'];
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['ID'];
  title: Scalars['String'];
  exercise: Exercise;
  answers: Array<Answer>;
};

export type QuestionError = {
  __typename?: 'QuestionError';
  title?: Maybe<Scalars['String']>;
  isCorrect?: Maybe<Scalars['String']>;
  answers?: Maybe<Array<AnswerError>>;
};

export type QuestionInput = {
  exerciseId?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  answers?: Maybe<Array<AnswerInput>>;
};

export type RegisterInput = {
  name: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type SavedExercise = {
  __typename?: 'SavedExercise';
  user: User;
  exercise: Exercise;
};

export type ScorePerDay = {
  __typename?: 'ScorePerDay';
  id: Scalars['String'];
  day: Scalars['String'];
  score: Scalars['Int'];
};

export type TopUser = {
  __typename?: 'TopUser';
  id: Scalars['ID'];
  name: Scalars['String'];
  score: Scalars['Int'];
  avatarUrl?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
  score: Scalars['Int'];
  completes?: Maybe<Array<Complete>>;
  savedExercises?: Maybe<Array<SavedExercise>>;
  scorePerDay?: Maybe<Array<ScorePerDay>>;
};

export type UserAnswerInput = {
  questionId: Scalars['ID'];
  answerId: Scalars['ID'];
};

export type UserInfoResponse = {
  __typename?: 'UserInfoResponse';
  id: Scalars['ID'];
  name: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
  scorePerDay?: Maybe<Array<ScorePerDay>>;
};

export type ErrorSnippetFragment = { __typename?: 'CustomError', field: string, message: string };

export type ExerciseSnippetFragment = { __typename?: 'Exercise', id: string, title: string, length: number, createdAt: string, voteStatus?: Maybe<number>, creator: { __typename?: 'User', id: string, name: string } };

export type ExerciseFieldSnippetFragment = { __typename?: 'ExerciseField', id: string, title: string, length: number, saved?: Maybe<boolean>, createdAt: string, points?: Maybe<number>, voteStatus?: Maybe<number>, creator: { __typename?: 'User', id: string, name: string } };

export type UserSnippetFragment = { __typename?: 'User', id: string, name: string, firstName: string, lastName: string, avatarUrl?: Maybe<string>, score: number, email?: Maybe<string> };

export type AddEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type AddEmailMutation = { __typename?: 'Mutation', addEmail: boolean };

export type ChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type CheckAnswerMutationVariables = Exact<{
  questionId: Scalars['ID'];
  answerId: Scalars['ID'];
}>;


export type CheckAnswerMutation = { __typename?: 'Mutation', checkAnswer: { __typename?: 'CheckAnswerResponse', isCorrect: boolean, score: number } };

export type ConfirmEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ConfirmEmailMutation = { __typename?: 'Mutation', confirmEmail: boolean };

export type CreateExerciseMutationVariables = Exact<{
  input: ExerciseInput;
}>;


export type CreateExerciseMutation = { __typename?: 'Mutation', createExercise?: Maybe<{ __typename?: 'CreateExerciseResponse', hasError: boolean, errors?: Maybe<{ __typename?: 'ExerciseError', title?: Maybe<string>, questions?: Maybe<Array<{ __typename?: 'QuestionError', title?: Maybe<string>, isCorrect?: Maybe<string>, answers?: Maybe<Array<{ __typename?: 'AnswerError', text?: Maybe<string>, isCorrect?: Maybe<string> }>> }>> }>, exercise?: Maybe<{ __typename?: 'Exercise', id: string, title: string, length: number, createdAt: string, voteStatus?: Maybe<number>, creator: { __typename?: 'User', id: string, name: string } }> }> };

export type CreateQuestionMutationVariables = Exact<{
  input: QuestionInput;
}>;


export type CreateQuestionMutation = { __typename?: 'Mutation', createQuestion: boolean };

export type DeleteExerciseMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteExerciseMutation = { __typename?: 'Mutation', deleteExercise: boolean };

export type DeleteQuestionMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteQuestionMutation = { __typename?: 'Mutation', deleteQuestion: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = { __typename?: 'Query', getScoreOfWeek: Array<{ __typename?: 'ScorePerDay', id: string, day: string, score: number }> };

export type LoginMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: string, name: string, firstName: string, lastName: string, avatarUrl?: Maybe<string>, score: number, email?: Maybe<string>, completes?: Maybe<Array<{ __typename?: 'Complete', corrects?: Maybe<number>, exercise: { __typename?: 'Exercise', id: string } }>> }>, errors?: Maybe<Array<{ __typename?: 'CustomError', field: string, message: string }>> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
  lastName: Scalars['String'];
  firstName: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'LoginResponse', accessToken?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: string, name: string, firstName: string, lastName: string, avatarUrl?: Maybe<string>, score: number, email?: Maybe<string>, completes?: Maybe<Array<{ __typename?: 'Complete', corrects?: Maybe<number>, exercise: { __typename?: 'Exercise', id: string } }>> }>, errors?: Maybe<Array<{ __typename?: 'CustomError', field: string, message: string }>> } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'LoginResponse', accessToken?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: string, name: string, firstName: string, lastName: string, avatarUrl?: Maybe<string>, score: number, email?: Maybe<string>, completes?: Maybe<Array<{ __typename?: 'Complete', corrects?: Maybe<number>, exercise: { __typename?: 'Exercise', id: string } }>> }>, errors?: Maybe<Array<{ __typename?: 'CustomError', field: string, message: string }>> } };

export type SaveCompleteMutationVariables = Exact<{
  input: CompleteInput;
}>;


export type SaveCompleteMutation = { __typename?: 'Mutation', saveComplete: boolean };

export type SaveExerciseMutationVariables = Exact<{
  exerciseId: Scalars['String'];
}>;


export type SaveExerciseMutation = { __typename?: 'Mutation', saveExercise: boolean };

export type UpdateExerciseMutationVariables = Exact<{
  id: Scalars['String'];
  title: Scalars['String'];
}>;


export type UpdateExerciseMutation = { __typename?: 'Mutation', updateExercise: boolean };

export type UpdateInfoMutationVariables = Exact<{
  input: InfoInput;
}>;


export type UpdateInfoMutation = { __typename?: 'Mutation', updateInfo: boolean };

export type UploadAvatarMutationVariables = Exact<{
  avatarUrl: Scalars['String'];
}>;


export type UploadAvatarMutation = { __typename?: 'Mutation', uploadAvatar: boolean };

export type VoteMutationVariables = Exact<{
  exerciseId: Scalars['String'];
  value: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type ExerciseQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ExerciseQuery = { __typename?: 'Query', exercise?: Maybe<{ __typename?: 'Exercise', id: string, title: string, length: number, points: number, voteStatus?: Maybe<number>, creator: { __typename?: 'User', id: string, name: string }, questions: Array<{ __typename?: 'Question', id: string, title: string, answers: Array<{ __typename?: 'Answer', id: string, text: string }> }> }> };

export type GetAllExercisesQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type GetAllExercisesQuery = { __typename?: 'Query', getAllExercises: { __typename?: 'ExerciseResponse', hasMore?: Maybe<boolean>, exercises?: Maybe<Array<{ __typename?: 'ExerciseField', id: string, title: string, length: number, saved?: Maybe<boolean>, createdAt: string, points?: Maybe<number>, voteStatus?: Maybe<number>, creator: { __typename?: 'User', id: string, name: string } }>> } };

export type GetQuestionsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetQuestionsQuery = { __typename?: 'Query', getQuestions: Array<{ __typename?: 'Question', id: string, title: string, answers: Array<{ __typename?: 'Answer', id: string, text: string }> }> };

export type GetAllSavedExerciseQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSavedExerciseQuery = { __typename?: 'Query', getAllSavedExercise?: Maybe<Array<{ __typename?: 'Exercise', id: string, title: string, length: number }>> };

export type GetRandomExerciseQueryVariables = Exact<{
  currentId: Scalars['String'];
}>;


export type GetRandomExerciseQuery = { __typename?: 'Query', getRandomExercise: string };

export type GetScoreOfWeekQueryVariables = Exact<{ [key: string]: never; }>;


export type GetScoreOfWeekQuery = { __typename?: 'Query', getScoreOfWeek: Array<{ __typename?: 'ScorePerDay', id: string, day: string, score: number }> };

export type GetTopUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTopUsersQuery = { __typename?: 'Query', getTopUsers: Array<{ __typename?: 'TopUser', id: string, name: string, score: number, avatarUrl?: Maybe<string> }> };

export type GetUserInfoQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetUserInfoQuery = { __typename?: 'Query', getUserInfo: { __typename?: 'UserInfoResponse', id: string, name: string, avatarUrl?: Maybe<string>, scorePerDay?: Maybe<Array<{ __typename?: 'ScorePerDay', id: string, day: string, score: number }>> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: Maybe<{ __typename?: 'User', id: string, name: string, firstName: string, lastName: string, avatarUrl?: Maybe<string>, score: number, email?: Maybe<string>, completes?: Maybe<Array<{ __typename?: 'Complete', corrects?: Maybe<number>, exercise: { __typename?: 'Exercise', id: string } }>> }> };

export const ErrorSnippetFragmentDoc = gql`
    fragment errorSnippet on CustomError {
  field
  message
}
    `;
export const ExerciseSnippetFragmentDoc = gql`
    fragment exerciseSnippet on Exercise {
  id
  title
  length
  createdAt
  creator {
    id
    name
  }
  voteStatus
}
    `;
export const ExerciseFieldSnippetFragmentDoc = gql`
    fragment exerciseFieldSnippet on ExerciseField {
  id
  title
  length
  saved
  createdAt
  points
  creator {
    id
    name
  }
  voteStatus
}
    `;
export const UserSnippetFragmentDoc = gql`
    fragment userSnippet on User {
  id
  name
  firstName
  lastName
  avatarUrl
  score
  email
}
    `;
export const AddEmailDocument = gql`
    mutation AddEmail($email: String!) {
  addEmail(email: $email)
}
    `;
export type AddEmailMutationFn = Apollo.MutationFunction<AddEmailMutation, AddEmailMutationVariables>;

/**
 * __useAddEmailMutation__
 *
 * To run a mutation, you first call `useAddEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEmailMutation, { data, loading, error }] = useAddEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAddEmailMutation(baseOptions?: Apollo.MutationHookOptions<AddEmailMutation, AddEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEmailMutation, AddEmailMutationVariables>(AddEmailDocument, options);
      }
export type AddEmailMutationHookResult = ReturnType<typeof useAddEmailMutation>;
export type AddEmailMutationResult = Apollo.MutationResult<AddEmailMutation>;
export type AddEmailMutationOptions = Apollo.BaseMutationOptions<AddEmailMutation, AddEmailMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($newPassword: String!, $password: String!) {
  changePassword(newPassword: $newPassword, password: $password)
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      newPassword: // value for 'newPassword'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CheckAnswerDocument = gql`
    mutation CheckAnswer($questionId: ID!, $answerId: ID!) {
  checkAnswer(input: {questionId: $questionId, answerId: $answerId}) {
    isCorrect
    score
  }
}
    `;
export type CheckAnswerMutationFn = Apollo.MutationFunction<CheckAnswerMutation, CheckAnswerMutationVariables>;

/**
 * __useCheckAnswerMutation__
 *
 * To run a mutation, you first call `useCheckAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkAnswerMutation, { data, loading, error }] = useCheckAnswerMutation({
 *   variables: {
 *      questionId: // value for 'questionId'
 *      answerId: // value for 'answerId'
 *   },
 * });
 */
export function useCheckAnswerMutation(baseOptions?: Apollo.MutationHookOptions<CheckAnswerMutation, CheckAnswerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckAnswerMutation, CheckAnswerMutationVariables>(CheckAnswerDocument, options);
      }
export type CheckAnswerMutationHookResult = ReturnType<typeof useCheckAnswerMutation>;
export type CheckAnswerMutationResult = Apollo.MutationResult<CheckAnswerMutation>;
export type CheckAnswerMutationOptions = Apollo.BaseMutationOptions<CheckAnswerMutation, CheckAnswerMutationVariables>;
export const ConfirmEmailDocument = gql`
    mutation ConfirmEmail($token: String!) {
  confirmEmail(token: $token)
}
    `;
export type ConfirmEmailMutationFn = Apollo.MutationFunction<ConfirmEmailMutation, ConfirmEmailMutationVariables>;

/**
 * __useConfirmEmailMutation__
 *
 * To run a mutation, you first call `useConfirmEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmEmailMutation, { data, loading, error }] = useConfirmEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useConfirmEmailMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmEmailMutation, ConfirmEmailMutationVariables>(ConfirmEmailDocument, options);
      }
export type ConfirmEmailMutationHookResult = ReturnType<typeof useConfirmEmailMutation>;
export type ConfirmEmailMutationResult = Apollo.MutationResult<ConfirmEmailMutation>;
export type ConfirmEmailMutationOptions = Apollo.BaseMutationOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>;
export const CreateExerciseDocument = gql`
    mutation CreateExercise($input: ExerciseInput!) {
  createExercise(input: $input) {
    hasError
    errors {
      title
      questions {
        title
        isCorrect
        answers {
          text
          isCorrect
        }
      }
    }
    exercise {
      ...exerciseSnippet
    }
  }
}
    ${ExerciseSnippetFragmentDoc}`;
export type CreateExerciseMutationFn = Apollo.MutationFunction<CreateExerciseMutation, CreateExerciseMutationVariables>;

/**
 * __useCreateExerciseMutation__
 *
 * To run a mutation, you first call `useCreateExerciseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExerciseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExerciseMutation, { data, loading, error }] = useCreateExerciseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateExerciseMutation(baseOptions?: Apollo.MutationHookOptions<CreateExerciseMutation, CreateExerciseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateExerciseMutation, CreateExerciseMutationVariables>(CreateExerciseDocument, options);
      }
export type CreateExerciseMutationHookResult = ReturnType<typeof useCreateExerciseMutation>;
export type CreateExerciseMutationResult = Apollo.MutationResult<CreateExerciseMutation>;
export type CreateExerciseMutationOptions = Apollo.BaseMutationOptions<CreateExerciseMutation, CreateExerciseMutationVariables>;
export const CreateQuestionDocument = gql`
    mutation CreateQuestion($input: QuestionInput!) {
  createQuestion(input: $input)
}
    `;
export type CreateQuestionMutationFn = Apollo.MutationFunction<CreateQuestionMutation, CreateQuestionMutationVariables>;

/**
 * __useCreateQuestionMutation__
 *
 * To run a mutation, you first call `useCreateQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuestionMutation, { data, loading, error }] = useCreateQuestionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateQuestionMutation(baseOptions?: Apollo.MutationHookOptions<CreateQuestionMutation, CreateQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateQuestionMutation, CreateQuestionMutationVariables>(CreateQuestionDocument, options);
      }
export type CreateQuestionMutationHookResult = ReturnType<typeof useCreateQuestionMutation>;
export type CreateQuestionMutationResult = Apollo.MutationResult<CreateQuestionMutation>;
export type CreateQuestionMutationOptions = Apollo.BaseMutationOptions<CreateQuestionMutation, CreateQuestionMutationVariables>;
export const DeleteExerciseDocument = gql`
    mutation DeleteExercise($id: String!) {
  deleteExercise(id: $id)
}
    `;
export type DeleteExerciseMutationFn = Apollo.MutationFunction<DeleteExerciseMutation, DeleteExerciseMutationVariables>;

/**
 * __useDeleteExerciseMutation__
 *
 * To run a mutation, you first call `useDeleteExerciseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExerciseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExerciseMutation, { data, loading, error }] = useDeleteExerciseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteExerciseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExerciseMutation, DeleteExerciseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteExerciseMutation, DeleteExerciseMutationVariables>(DeleteExerciseDocument, options);
      }
export type DeleteExerciseMutationHookResult = ReturnType<typeof useDeleteExerciseMutation>;
export type DeleteExerciseMutationResult = Apollo.MutationResult<DeleteExerciseMutation>;
export type DeleteExerciseMutationOptions = Apollo.BaseMutationOptions<DeleteExerciseMutation, DeleteExerciseMutationVariables>;
export const DeleteQuestionDocument = gql`
    mutation DeleteQuestion($id: String!) {
  deleteQuestion(id: $id)
}
    `;
export type DeleteQuestionMutationFn = Apollo.MutationFunction<DeleteQuestionMutation, DeleteQuestionMutationVariables>;

/**
 * __useDeleteQuestionMutation__
 *
 * To run a mutation, you first call `useDeleteQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteQuestionMutation, { data, loading, error }] = useDeleteQuestionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteQuestionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteQuestionMutation, DeleteQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteQuestionMutation, DeleteQuestionMutationVariables>(DeleteQuestionDocument, options);
      }
export type DeleteQuestionMutationHookResult = ReturnType<typeof useDeleteQuestionMutation>;
export type DeleteQuestionMutationResult = Apollo.MutationResult<DeleteQuestionMutation>;
export type DeleteQuestionMutationOptions = Apollo.BaseMutationOptions<DeleteQuestionMutation, DeleteQuestionMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const Document = gql`
    {
  getScoreOfWeek {
    id
    day
    score
  }
}
    `;

/**
 * __useQuery__
 *
 * To run a query within a React component, call `useQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuery({
 *   variables: {
 *   },
 * });
 */
export function useQuery(baseOptions?: Apollo.QueryHookOptions<Query, QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Query, QueryVariables>(Document, options);
      }
export function useLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Query, QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Query, QueryVariables>(Document, options);
        }
export type QueryHookResult = ReturnType<typeof useQuery>;
export type LazyQueryHookResult = ReturnType<typeof useLazyQuery>;
export type QueryResult = Apollo.QueryResult<Query, QueryVariables>;
export const LoginDocument = gql`
    mutation Login($name: String!, $password: String!) {
  login(input: {name: $name, password: $password}) {
    user {
      ...userSnippet
      completes {
        exercise {
          id
        }
        corrects
      }
    }
    errors {
      field
      message
    }
    accessToken
  }
}
    ${UserSnippetFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      name: // value for 'name'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($name: String!, $password: String!, $lastName: String!, $firstName: String!) {
  register(
    input: {name: $name, password: $password, lastName: $lastName, firstName: $firstName}
  ) {
    user {
      ...userSnippet
      completes {
        exercise {
          id
        }
        corrects
      }
    }
    errors {
      ...errorSnippet
    }
    accessToken
  }
}
    ${UserSnippetFragmentDoc}
${ErrorSnippetFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      name: // value for 'name'
 *      password: // value for 'password'
 *      lastName: // value for 'lastName'
 *      firstName: // value for 'firstName'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword) {
    user {
      ...userSnippet
      completes {
        exercise {
          id
        }
        corrects
      }
    }
    accessToken
    errors {
      field
      message
    }
  }
}
    ${UserSnippetFragmentDoc}`;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SaveCompleteDocument = gql`
    mutation SaveComplete($input: CompleteInput!) {
  saveComplete(input: $input)
}
    `;
export type SaveCompleteMutationFn = Apollo.MutationFunction<SaveCompleteMutation, SaveCompleteMutationVariables>;

/**
 * __useSaveCompleteMutation__
 *
 * To run a mutation, you first call `useSaveCompleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveCompleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveCompleteMutation, { data, loading, error }] = useSaveCompleteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveCompleteMutation(baseOptions?: Apollo.MutationHookOptions<SaveCompleteMutation, SaveCompleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveCompleteMutation, SaveCompleteMutationVariables>(SaveCompleteDocument, options);
      }
export type SaveCompleteMutationHookResult = ReturnType<typeof useSaveCompleteMutation>;
export type SaveCompleteMutationResult = Apollo.MutationResult<SaveCompleteMutation>;
export type SaveCompleteMutationOptions = Apollo.BaseMutationOptions<SaveCompleteMutation, SaveCompleteMutationVariables>;
export const SaveExerciseDocument = gql`
    mutation SaveExercise($exerciseId: String!) {
  saveExercise(exerciseId: $exerciseId)
}
    `;
export type SaveExerciseMutationFn = Apollo.MutationFunction<SaveExerciseMutation, SaveExerciseMutationVariables>;

/**
 * __useSaveExerciseMutation__
 *
 * To run a mutation, you first call `useSaveExerciseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveExerciseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveExerciseMutation, { data, loading, error }] = useSaveExerciseMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *   },
 * });
 */
export function useSaveExerciseMutation(baseOptions?: Apollo.MutationHookOptions<SaveExerciseMutation, SaveExerciseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveExerciseMutation, SaveExerciseMutationVariables>(SaveExerciseDocument, options);
      }
export type SaveExerciseMutationHookResult = ReturnType<typeof useSaveExerciseMutation>;
export type SaveExerciseMutationResult = Apollo.MutationResult<SaveExerciseMutation>;
export type SaveExerciseMutationOptions = Apollo.BaseMutationOptions<SaveExerciseMutation, SaveExerciseMutationVariables>;
export const UpdateExerciseDocument = gql`
    mutation UpdateExercise($id: String!, $title: String!) {
  updateExercise(id: $id, title: $title)
}
    `;
export type UpdateExerciseMutationFn = Apollo.MutationFunction<UpdateExerciseMutation, UpdateExerciseMutationVariables>;

/**
 * __useUpdateExerciseMutation__
 *
 * To run a mutation, you first call `useUpdateExerciseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExerciseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExerciseMutation, { data, loading, error }] = useUpdateExerciseMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useUpdateExerciseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExerciseMutation, UpdateExerciseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExerciseMutation, UpdateExerciseMutationVariables>(UpdateExerciseDocument, options);
      }
export type UpdateExerciseMutationHookResult = ReturnType<typeof useUpdateExerciseMutation>;
export type UpdateExerciseMutationResult = Apollo.MutationResult<UpdateExerciseMutation>;
export type UpdateExerciseMutationOptions = Apollo.BaseMutationOptions<UpdateExerciseMutation, UpdateExerciseMutationVariables>;
export const UpdateInfoDocument = gql`
    mutation UpdateInfo($input: InfoInput!) {
  updateInfo(input: $input)
}
    `;
export type UpdateInfoMutationFn = Apollo.MutationFunction<UpdateInfoMutation, UpdateInfoMutationVariables>;

/**
 * __useUpdateInfoMutation__
 *
 * To run a mutation, you first call `useUpdateInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInfoMutation, { data, loading, error }] = useUpdateInfoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInfoMutation, UpdateInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInfoMutation, UpdateInfoMutationVariables>(UpdateInfoDocument, options);
      }
export type UpdateInfoMutationHookResult = ReturnType<typeof useUpdateInfoMutation>;
export type UpdateInfoMutationResult = Apollo.MutationResult<UpdateInfoMutation>;
export type UpdateInfoMutationOptions = Apollo.BaseMutationOptions<UpdateInfoMutation, UpdateInfoMutationVariables>;
export const UploadAvatarDocument = gql`
    mutation UploadAvatar($avatarUrl: String!) {
  uploadAvatar(avatarUrl: $avatarUrl)
}
    `;
export type UploadAvatarMutationFn = Apollo.MutationFunction<UploadAvatarMutation, UploadAvatarMutationVariables>;

/**
 * __useUploadAvatarMutation__
 *
 * To run a mutation, you first call `useUploadAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadAvatarMutation, { data, loading, error }] = useUploadAvatarMutation({
 *   variables: {
 *      avatarUrl: // value for 'avatarUrl'
 *   },
 * });
 */
export function useUploadAvatarMutation(baseOptions?: Apollo.MutationHookOptions<UploadAvatarMutation, UploadAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadAvatarMutation, UploadAvatarMutationVariables>(UploadAvatarDocument, options);
      }
export type UploadAvatarMutationHookResult = ReturnType<typeof useUploadAvatarMutation>;
export type UploadAvatarMutationResult = Apollo.MutationResult<UploadAvatarMutation>;
export type UploadAvatarMutationOptions = Apollo.BaseMutationOptions<UploadAvatarMutation, UploadAvatarMutationVariables>;
export const VoteDocument = gql`
    mutation Vote($exerciseId: String!, $value: Int!) {
  vote(exerciseId: $exerciseId, value: $value)
}
    `;
export type VoteMutationFn = Apollo.MutationFunction<VoteMutation, VoteMutationVariables>;

/**
 * __useVoteMutation__
 *
 * To run a mutation, you first call `useVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteMutation, { data, loading, error }] = useVoteMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useVoteMutation(baseOptions?: Apollo.MutationHookOptions<VoteMutation, VoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument, options);
      }
export type VoteMutationHookResult = ReturnType<typeof useVoteMutation>;
export type VoteMutationResult = Apollo.MutationResult<VoteMutation>;
export type VoteMutationOptions = Apollo.BaseMutationOptions<VoteMutation, VoteMutationVariables>;
export const ExerciseDocument = gql`
    query Exercise($id: String!) {
  exercise(id: $id) {
    id
    title
    length
    points
    creator {
      id
      name
    }
    voteStatus
    questions {
      id
      title
      answers {
        id
        text
      }
    }
  }
}
    `;

/**
 * __useExerciseQuery__
 *
 * To run a query within a React component, call `useExerciseQuery` and pass it any options that fit your needs.
 * When your component renders, `useExerciseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExerciseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useExerciseQuery(baseOptions: Apollo.QueryHookOptions<ExerciseQuery, ExerciseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExerciseQuery, ExerciseQueryVariables>(ExerciseDocument, options);
      }
export function useExerciseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExerciseQuery, ExerciseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExerciseQuery, ExerciseQueryVariables>(ExerciseDocument, options);
        }
export type ExerciseQueryHookResult = ReturnType<typeof useExerciseQuery>;
export type ExerciseLazyQueryHookResult = ReturnType<typeof useExerciseLazyQuery>;
export type ExerciseQueryResult = Apollo.QueryResult<ExerciseQuery, ExerciseQueryVariables>;
export const GetAllExercisesDocument = gql`
    query GetAllExercises($limit: Int!, $cursor: String) {
  getAllExercises(limit: $limit, cursor: $cursor) {
    exercises {
      ...exerciseFieldSnippet
    }
    hasMore
  }
}
    ${ExerciseFieldSnippetFragmentDoc}`;

/**
 * __useGetAllExercisesQuery__
 *
 * To run a query within a React component, call `useGetAllExercisesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllExercisesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllExercisesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetAllExercisesQuery(baseOptions: Apollo.QueryHookOptions<GetAllExercisesQuery, GetAllExercisesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllExercisesQuery, GetAllExercisesQueryVariables>(GetAllExercisesDocument, options);
      }
export function useGetAllExercisesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllExercisesQuery, GetAllExercisesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllExercisesQuery, GetAllExercisesQueryVariables>(GetAllExercisesDocument, options);
        }
export type GetAllExercisesQueryHookResult = ReturnType<typeof useGetAllExercisesQuery>;
export type GetAllExercisesLazyQueryHookResult = ReturnType<typeof useGetAllExercisesLazyQuery>;
export type GetAllExercisesQueryResult = Apollo.QueryResult<GetAllExercisesQuery, GetAllExercisesQueryVariables>;
export const GetQuestionsDocument = gql`
    query GetQuestions($id: String!) {
  getQuestions(id: $id) {
    id
    title
    answers {
      id
      text
    }
  }
}
    `;

/**
 * __useGetQuestionsQuery__
 *
 * To run a query within a React component, call `useGetQuestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuestionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetQuestionsQuery(baseOptions: Apollo.QueryHookOptions<GetQuestionsQuery, GetQuestionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuestionsQuery, GetQuestionsQueryVariables>(GetQuestionsDocument, options);
      }
export function useGetQuestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuestionsQuery, GetQuestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuestionsQuery, GetQuestionsQueryVariables>(GetQuestionsDocument, options);
        }
export type GetQuestionsQueryHookResult = ReturnType<typeof useGetQuestionsQuery>;
export type GetQuestionsLazyQueryHookResult = ReturnType<typeof useGetQuestionsLazyQuery>;
export type GetQuestionsQueryResult = Apollo.QueryResult<GetQuestionsQuery, GetQuestionsQueryVariables>;
export const GetAllSavedExerciseDocument = gql`
    query GetAllSavedExercise {
  getAllSavedExercise {
    id
    title
    length
  }
}
    `;

/**
 * __useGetAllSavedExerciseQuery__
 *
 * To run a query within a React component, call `useGetAllSavedExerciseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllSavedExerciseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllSavedExerciseQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllSavedExerciseQuery(baseOptions?: Apollo.QueryHookOptions<GetAllSavedExerciseQuery, GetAllSavedExerciseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllSavedExerciseQuery, GetAllSavedExerciseQueryVariables>(GetAllSavedExerciseDocument, options);
      }
export function useGetAllSavedExerciseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllSavedExerciseQuery, GetAllSavedExerciseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllSavedExerciseQuery, GetAllSavedExerciseQueryVariables>(GetAllSavedExerciseDocument, options);
        }
export type GetAllSavedExerciseQueryHookResult = ReturnType<typeof useGetAllSavedExerciseQuery>;
export type GetAllSavedExerciseLazyQueryHookResult = ReturnType<typeof useGetAllSavedExerciseLazyQuery>;
export type GetAllSavedExerciseQueryResult = Apollo.QueryResult<GetAllSavedExerciseQuery, GetAllSavedExerciseQueryVariables>;
export const GetRandomExerciseDocument = gql`
    query GetRandomExercise($currentId: String!) {
  getRandomExercise(currentId: $currentId)
}
    `;

/**
 * __useGetRandomExerciseQuery__
 *
 * To run a query within a React component, call `useGetRandomExerciseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRandomExerciseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRandomExerciseQuery({
 *   variables: {
 *      currentId: // value for 'currentId'
 *   },
 * });
 */
export function useGetRandomExerciseQuery(baseOptions: Apollo.QueryHookOptions<GetRandomExerciseQuery, GetRandomExerciseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRandomExerciseQuery, GetRandomExerciseQueryVariables>(GetRandomExerciseDocument, options);
      }
export function useGetRandomExerciseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRandomExerciseQuery, GetRandomExerciseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRandomExerciseQuery, GetRandomExerciseQueryVariables>(GetRandomExerciseDocument, options);
        }
export type GetRandomExerciseQueryHookResult = ReturnType<typeof useGetRandomExerciseQuery>;
export type GetRandomExerciseLazyQueryHookResult = ReturnType<typeof useGetRandomExerciseLazyQuery>;
export type GetRandomExerciseQueryResult = Apollo.QueryResult<GetRandomExerciseQuery, GetRandomExerciseQueryVariables>;
export const GetScoreOfWeekDocument = gql`
    query GetScoreOfWeek {
  getScoreOfWeek {
    id
    day
    score
  }
}
    `;

/**
 * __useGetScoreOfWeekQuery__
 *
 * To run a query within a React component, call `useGetScoreOfWeekQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScoreOfWeekQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScoreOfWeekQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetScoreOfWeekQuery(baseOptions?: Apollo.QueryHookOptions<GetScoreOfWeekQuery, GetScoreOfWeekQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetScoreOfWeekQuery, GetScoreOfWeekQueryVariables>(GetScoreOfWeekDocument, options);
      }
export function useGetScoreOfWeekLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetScoreOfWeekQuery, GetScoreOfWeekQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetScoreOfWeekQuery, GetScoreOfWeekQueryVariables>(GetScoreOfWeekDocument, options);
        }
export type GetScoreOfWeekQueryHookResult = ReturnType<typeof useGetScoreOfWeekQuery>;
export type GetScoreOfWeekLazyQueryHookResult = ReturnType<typeof useGetScoreOfWeekLazyQuery>;
export type GetScoreOfWeekQueryResult = Apollo.QueryResult<GetScoreOfWeekQuery, GetScoreOfWeekQueryVariables>;
export const GetTopUsersDocument = gql`
    query GetTopUsers {
  getTopUsers {
    id
    name
    score
    avatarUrl
  }
}
    `;

/**
 * __useGetTopUsersQuery__
 *
 * To run a query within a React component, call `useGetTopUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTopUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTopUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTopUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetTopUsersQuery, GetTopUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTopUsersQuery, GetTopUsersQueryVariables>(GetTopUsersDocument, options);
      }
export function useGetTopUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTopUsersQuery, GetTopUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTopUsersQuery, GetTopUsersQueryVariables>(GetTopUsersDocument, options);
        }
export type GetTopUsersQueryHookResult = ReturnType<typeof useGetTopUsersQuery>;
export type GetTopUsersLazyQueryHookResult = ReturnType<typeof useGetTopUsersLazyQuery>;
export type GetTopUsersQueryResult = Apollo.QueryResult<GetTopUsersQuery, GetTopUsersQueryVariables>;
export const GetUserInfoDocument = gql`
    query GetUserInfo($id: ID!) {
  getUserInfo(id: $id) {
    id
    name
    avatarUrl
    scorePerDay {
      id
      day
      score
    }
  }
}
    `;

/**
 * __useGetUserInfoQuery__
 *
 * To run a query within a React component, call `useGetUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserInfoQuery(baseOptions: Apollo.QueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, options);
      }
export function useGetUserInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, options);
        }
export type GetUserInfoQueryHookResult = ReturnType<typeof useGetUserInfoQuery>;
export type GetUserInfoLazyQueryHookResult = ReturnType<typeof useGetUserInfoLazyQuery>;
export type GetUserInfoQueryResult = Apollo.QueryResult<GetUserInfoQuery, GetUserInfoQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...userSnippet
    completes {
      exercise {
        id
      }
      corrects
    }
  }
}
    ${UserSnippetFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;