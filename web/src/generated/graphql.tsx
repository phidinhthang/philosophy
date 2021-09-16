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
  questions: Array<Question>;
};

export type ExerciseError = {
  __typename?: 'ExerciseError';
  title?: Maybe<Scalars['String']>;
  questions?: Maybe<Array<QuestionError>>;
};

export type ExerciseInput = {
  title: Scalars['String'];
  questions?: Maybe<Array<QuestionInput>>;
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
  createExercise?: Maybe<CreateExerciseResponse>;
  saveComplete: Scalars['Boolean'];
  createQuestion: Scalars['Boolean'];
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


export type MutationCreateExerciseArgs = {
  input: ExerciseInput;
};


export type MutationSaveCompleteArgs = {
  input: CompleteInput;
};


export type MutationCreateQuestionArgs = {
  input: QuestionInput;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  me?: Maybe<User>;
  getScoreOfWeek: Array<ScorePerDay>;
  getAllExercises: Array<Exercise>;
  getQuestions: Array<Question>;
};


export type QueryGetQuestionsArgs = {
  id: Scalars['String'];
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

export type ScorePerDay = {
  __typename?: 'ScorePerDay';
  id: Scalars['String'];
  day: Scalars['String'];
  score: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
  score: Scalars['Int'];
  completes?: Maybe<Array<Complete>>;
  scorePerDay?: Maybe<Array<ScorePerDay>>;
};

export type UserAnswerInput = {
  questionId: Scalars['ID'];
  answerId: Scalars['ID'];
};

export type ErrorSnippetFragment = { __typename?: 'CustomError', field: string, message: string };

export type ExerciseSnippetFragment = { __typename?: 'Exercise', id: string, title: string, length: number };

export type UserSnippetFragment = { __typename?: 'User', id: string, name: string, firstName: string, lastName: string, avatarUrl?: Maybe<string>, score: number };

export type CheckAnswerMutationVariables = Exact<{
  questionId: Scalars['ID'];
  answerId: Scalars['ID'];
}>;


export type CheckAnswerMutation = { __typename?: 'Mutation', checkAnswer: { __typename?: 'CheckAnswerResponse', isCorrect: boolean, score: number } };

export type CreateExerciseMutationVariables = Exact<{
  input: ExerciseInput;
}>;


export type CreateExerciseMutation = { __typename?: 'Mutation', createExercise?: Maybe<{ __typename?: 'CreateExerciseResponse', hasError: boolean, errors?: Maybe<{ __typename?: 'ExerciseError', title?: Maybe<string>, questions?: Maybe<Array<{ __typename?: 'QuestionError', title?: Maybe<string>, isCorrect?: Maybe<string>, answers?: Maybe<Array<{ __typename?: 'AnswerError', text?: Maybe<string>, isCorrect?: Maybe<string> }>> }>> }>, exercise?: Maybe<{ __typename?: 'Exercise', id: string, title: string, length: number }> }> };

export type CreateQuestionMutationVariables = Exact<{
  input: QuestionInput;
}>;


export type CreateQuestionMutation = { __typename?: 'Mutation', createQuestion: boolean };

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = { __typename?: 'Query', getScoreOfWeek: Array<{ __typename?: 'ScorePerDay', id: string, day: string, score: number }> };

export type LoginMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: string, name: string, firstName: string, lastName: string, avatarUrl?: Maybe<string>, score: number, completes?: Maybe<Array<{ __typename?: 'Complete', corrects?: Maybe<number>, exercise: { __typename?: 'Exercise', id: string } }>> }>, errors?: Maybe<Array<{ __typename?: 'CustomError', field: string, message: string }>> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
  lastName: Scalars['String'];
  firstName: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'LoginResponse', accessToken?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: string, name: string, firstName: string, lastName: string, avatarUrl?: Maybe<string>, score: number, completes?: Maybe<Array<{ __typename?: 'Complete', corrects?: Maybe<number>, exercise: { __typename?: 'Exercise', id: string } }>> }>, errors?: Maybe<Array<{ __typename?: 'CustomError', field: string, message: string }>> } };

export type SaveCompleteMutationVariables = Exact<{
  input: CompleteInput;
}>;


export type SaveCompleteMutation = { __typename?: 'Mutation', saveComplete: boolean };

export type GetAllExercisesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllExercisesQuery = { __typename?: 'Query', getAllExercises: Array<{ __typename?: 'Exercise', id: string, title: string, length: number }> };

export type GetQuestionsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetQuestionsQuery = { __typename?: 'Query', getQuestions: Array<{ __typename?: 'Question', id: string, title: string, answers: Array<{ __typename?: 'Answer', id: string, text: string }> }> };

export type GetScoreOfWeekQueryVariables = Exact<{ [key: string]: never; }>;


export type GetScoreOfWeekQuery = { __typename?: 'Query', getScoreOfWeek: Array<{ __typename?: 'ScorePerDay', id: string, day: string, score: number }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: Maybe<{ __typename?: 'User', id: string, name: string, firstName: string, lastName: string, avatarUrl?: Maybe<string>, score: number, completes?: Maybe<Array<{ __typename?: 'Complete', corrects?: Maybe<number>, exercise: { __typename?: 'Exercise', id: string } }>> }> };

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
}
    `;
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
export const GetAllExercisesDocument = gql`
    query GetAllExercises {
  getAllExercises {
    ...exerciseSnippet
  }
}
    ${ExerciseSnippetFragmentDoc}`;

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
 *   },
 * });
 */
export function useGetAllExercisesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllExercisesQuery, GetAllExercisesQueryVariables>) {
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