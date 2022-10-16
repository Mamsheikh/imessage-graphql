import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useEffect } from 'react';
import { ConversationPopulated } from '../../../../../backend/src/utils/types';
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
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    conversationOperations.Queries.conversations
  );

  console.log('query data', conversationsData);

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: conversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        console.log('subscription data', subscriptionData);

        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [...prev.conversations, newConversation],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
    // eslint-disable-next-line
  }, []);

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
