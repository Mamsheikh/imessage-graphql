import { Box, Button, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ConversationPopulated } from '../../../../../backend/src/utils/types';
import ConversationModal from '../Modal/index';
import conversationOpearations from '../../../graphql/operations/conversation';
import ConversationItem from './ConversationItem';
import { useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { signOut } from 'next-auth/react';

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const [deleteConversation] = useMutation<
    { deleteConversation: boolean },
    { conversationId: string }
  >(conversationOpearations.Mutations.deleteConversation);

  const onDeleteConversation = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLI_BASE_URL === 'string'
                ? process.env.NEXT_PUBLI_BASE_URL
                : ''
            );
          },
        }),
        {
          success: 'Conversation deleted',
          error: 'Failed to delete conversation',
          loading: 'Deleting conversation',
        }
      );
    } catch (error) {
      console.log('onDeleteConversation error', error);
    }
  };

  const router = useRouter();
  const { id: userId } = session.user;

  const sortedConversation = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

  return (
    <Box
      width={{ base: '100%', md: '400px' }}
      position='relative'
      height='100%'
      overflow='hidden'
    >
      <Box
        py={2}
        px={4}
        mb={4}
        bg='blackAlpha.300'
        borderRadius={4}
        cursor='pointer'
        onClick={onOpen}
      >
        <Text textAlign='center' fontWeight={500} color='whiteAlpha.800'>
          Find or start a new conversation
        </Text>
      </Box>
      <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
      {sortedConversation.map((conversation) => {
        const participant = conversation.participants.find(
          (p) => p.user.id === userId
        );
        return (
          <ConversationItem
            conversation={conversation}
            key={conversation.id}
            userId={userId}
            onClick={() =>
              onViewConversation(
                conversation.id,
                participant?.hasSeenLatestMessage
              )
            }
            onDeleteConversation={onDeleteConversation}
            isSelected={conversation.id === router.query.conversationId}
            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
          />
        );
      })}
      <Box position='absolute' bottom={0} left={0} width='100%' px={8}>
        <Button width='100%' onClick={() => signOut()}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};
export default ConversationList;
