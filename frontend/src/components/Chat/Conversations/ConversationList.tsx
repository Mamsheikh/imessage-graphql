import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useState } from 'react';
import { ConversationPopulated } from '../../../../../backend/src/utils/types';
import ConversationModal from '../Modal/index';

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);

  const onClose = () => setIsOpen(false);
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
    </Box>
  );
};
export default ConversationList;
