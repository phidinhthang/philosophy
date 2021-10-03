import { Button, useColorModeValue } from '@chakra-ui/react';
import { CheckIcon, WarningIcon } from '@chakra-ui/icons';
import React from 'react';

interface ButtonProps {
  isChoose?: boolean;
  isCorrect?: boolean;
  isLoading: boolean;
  isSubmited: boolean;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
}

export const QuizOption: React.FC<ButtonProps> = ({
  children,
  isChoose = false,
  isCorrect = undefined,
  isLoading = false,
  isSubmited = false,
  onClick,
}) => {
  console.log(children, isCorrect);
  return (
    <Button
      isFullWidth
      size="lg"
      justifyContent="flex-start"
      mt={3}
      borderWidth={2}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      leftIcon={
        !isChoose ? undefined : isSubmited && isCorrect === true ? (
          <CheckIcon />
        ) : isSubmited && isCorrect === false ? (
          <WarningIcon />
        ) : undefined
      }
      isDisabled={isLoading || isSubmited}
      isActive={isChoose}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
