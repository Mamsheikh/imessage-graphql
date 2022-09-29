import type { NextPage } from 'next';
import { useSession, signOut, signIn } from 'next-auth/react';

const Home: NextPage = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div>
      {session?.user ? (
        <button onClick={() => signOut()}>Logout</button>
      ) : (
        <button onClick={() => signIn('google')}>Login</button>
      )}
      {session?.user?.email}
    </div>
  );
};

export default Home;
