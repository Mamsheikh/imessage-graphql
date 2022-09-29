import { useMutation } from '@apollo/client';
import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import React, { useState } from 'react';
import userOperations from '../../graphql/operations/user';
import { CreateUsernameData, CreateUsernameVariables } from '../../utils/types';
// import { CreateUsernameData, CreateUserVariables } from '../../utils/types';
type IAuthProps = {
  session: Session | null;
  reloadSession: () => void;
};

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [createUsername] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(userOperations.Mutations.createUsername);
  const [username, setUsername] = useState('');

  const onSubmit = async () => {
    if (!username) return;
    try {
      await createUsername({ variables: { username } });
    } catch (error) {
      console.log('create username onSubmit error', error);
    }
  };
  return (
    <Center h='100vh'>
      <Stack align='center' spacing={8}>
        {session ? (
          <>
            <Text fontSize='3xl'>Create a Username</Text>
            <Input
              placeholder='Enter a Username'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Button width='100%' onClick={onSubmit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize='3xl'>IMessengerQl</Text>
            <Button
              onClick={() => signIn('google')}
              leftIcon={
                <Image
                  src='/images/googleLogo.png'
                  height='20px'
                  alt='google logo'
                />
              }
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};
export default Auth;
