import { Button, Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import ConversationWrapper from './Conversations/ConversationWrapper';
import FeedWrapper from './Feed/FeedWrapper';

type ChatProps = {
  session: Session;
};

const Chat: React.FC<ChatProps> = ({ session }) => {
  return (
    <Flex h='100vh'>
      <ConversationWrapper session={session} />
      <FeedWrapper session={session} />
    </Flex>
  );
};
export default Chat;
