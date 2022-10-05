import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../chakra/theme';
import { client } from '../graphql/apollo-client';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={pageProps.session}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
          <Toaster />
        </ChakraProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}

export default MyApp;
