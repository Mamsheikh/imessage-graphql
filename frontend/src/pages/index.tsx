import type { NextPage, NextPageContext } from 'next';
import { useSession, signOut, signIn, getSession } from 'next-auth/react';
import { Box, Button, useColorMode } from '@chakra-ui/react';
import Chat from '../components/Chat';
import Auth from '../components/Auth';

const Home: NextPage = () => {
  const { data: session } = useSession();
  // console.log(session);

  const reloadSession = () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  return (
    <Box>
      {session?.user.username ? (
        <Chat session={session} />
      ) : (
        <Auth session={session} reloadSession={reloadSession} />
      )}
    </Box>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Home;
