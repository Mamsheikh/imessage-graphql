import type { NextPage } from 'next';
import { useSession, signOut, signIn } from 'next-auth/react';
import { Button } from '@chakra-ui/react';

const Home: NextPage = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div>
      {session?.user ? (
        <Button onClick={() => signOut()}>Logout</Button>
      ) : (
        <Button onClick={() => signIn('google')}>Login</Button>
      )}
      {session?.user?.email}
    </div>
  );
};

export default Home;
