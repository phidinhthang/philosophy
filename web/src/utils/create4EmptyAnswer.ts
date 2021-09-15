export const create4EmptyAnswerField = () => {
  const emptyAnswerField: {
    text: string;
    isCorrect: boolean;
  } = {
    text: '',
    isCorrect: '' as unknown as boolean,
  };

  return [
    { ...emptyAnswerField },
    { ...emptyAnswerField },
    { ...emptyAnswerField },
    { ...emptyAnswerField },
  ];
};
