import type { AppProps } from 'next/app';
import { CSSReset, ChakraProvider, theme } from '@chakra-ui/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />;
    </ChakraProvider>
  );
}
export default MyApp;
