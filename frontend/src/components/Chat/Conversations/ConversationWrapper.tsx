import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React from 'react';
import ConversationList from './ConversationList';

interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  return (
    <Box
      width={{ base: '100%', md: '400px' }}
      // border='1px solid red'
      bg='whiteAlpha.50'
      py={6}
      px={3}
    >
      {/* Skeleton lOader */}
      <ConversationList session={session} />
    </Box>
  );
};
export default ConversationWrapper;
