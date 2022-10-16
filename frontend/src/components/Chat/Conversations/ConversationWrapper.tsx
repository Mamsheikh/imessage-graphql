import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  const { conversationId } = router.query;
  const onViewConversation = async (conversationId: string) => {
    //push the conversatinId to the router query param

    router.push({ query: { conversationId } });

    //2. marked the conversation as read
  };

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
      display={{ base: conversationId ? 'none' : 'flex', md: 'flex' }}
      width={{ base: '100%', md: '400px' }}
      bg='whiteAlpha.50'
      py={6}
      px={3}
    >
      {/* Skeleton lOader */}
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        onViewConversation={onViewConversation}
      />
    </Box>
  );
};
export default ConversationWrapper;
