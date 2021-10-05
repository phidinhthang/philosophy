import { AppProps } from 'next/app';
import { CSSReset, ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme';
import NProgressContainer from '../lib/nProgress';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ChakraProvider>
      <NProgressContainer />
    </>
  );
}

export default MyApp;
