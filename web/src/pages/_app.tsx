import App, { AppContext, AppProps } from 'next/app';
import { CSSReset, ChakraProvider, theme } from '@chakra-ui/react';
import NProgressContainer from '../lib/nProgress';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />;
      </ChakraProvider>
      <NProgressContainer />
    </>
  );
}

export default MyApp;
