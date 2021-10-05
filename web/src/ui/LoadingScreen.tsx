import { Box, CircularProgress } from '@chakra-ui/react';

export const LoadingScreen = () => {
  return (
    <Box
      position="absolute"
      zIndex={1000}
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress isIndeterminate color="blue.300" />
    </Box>
  );
};
