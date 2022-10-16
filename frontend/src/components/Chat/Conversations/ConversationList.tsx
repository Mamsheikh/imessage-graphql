import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ConversationPopulated } from '../../../../../backend/src/utils/types';
import ConversationModal from '../Modal/index';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const { id: userId } = session.user;

  return (
    <Box width='100%'>
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
      {conversations.map((conversation) => (
        <ConversationItem
          conversation={conversation}
          key={conversation.id}
          userId={userId}
          onClick={() => onViewConversation(conversation.id)}
          isSelected={conversation.id === router.query.conversationId}
        />
      ))}
    </Box>
  );
};
export default ConversationList;
