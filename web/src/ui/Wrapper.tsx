import React from 'react';
import { Box } from '@chakra-ui/react';

export type WrapperVariant = 'small' | 'regular';

interface WrapperProps extends React.ComponentPropsWithoutRef<'div'> {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular',
  ...props
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === 'regular' ? '800px' : '400px'}
      w="100%"
      px="5"
      {...props}
    >
      {children}
    </Box>
  );
};
