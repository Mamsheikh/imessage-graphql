import { Button } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';

type IChatProps = {};

const Chat: React.FC<IChatProps> = () => {
  return (
    <div>
      CHAT
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
};
export default Chat;
