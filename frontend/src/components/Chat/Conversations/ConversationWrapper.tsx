import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import conversationOperations from '../../../graphql/operations/conversation';
import { ConversationsData } from '../../../utils/types';
import ConversationList from './ConversationList';

interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
  } = useQuery<ConversationsData, null>(
    conversationOperations.Queries.conversations
  );

  return (
    <Box
      width={{ base: '100%', md: '400px' }}
      // border='1px solid red'
      bg='whiteAlpha.50'
      py={6}
      px={3}
    >
      {/* Skeleton lOader */}
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
      />
    </Box>
  );
};
export default ConversationWrapper;
