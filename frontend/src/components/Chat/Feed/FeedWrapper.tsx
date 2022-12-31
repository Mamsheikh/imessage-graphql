import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React from 'react';
import MessagesHeader from './Messages/Header';
import MessageInput from './Messages/Input';
import Messages from './Messages/Messages';
import NoConversationSelected from './NoConversationSelected';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();

  const { conversationId } = router.query;

  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      // border='1px solid red'
      width='100%'
      direction='column'
    >
      {conversationId && typeof conversationId === 'string' ? (
        <>
          <Flex
            direction='column'
            justify='space-between'
            overflow='hidden'
            flexGrow={1}
          >
            <MessagesHeader
              conversationId={conversationId}
              userId={session.user.id}
            />
            <Messages
              conversationId={conversationId}
              userId={session.user.id}
            />
          </Flex>
          <MessageInput conversationId={conversationId} session={session} />
        </>
      ) : (
        <NoConversationSelected />
      )}
    </Flex>
  );
};
export default FeedWrapper;
