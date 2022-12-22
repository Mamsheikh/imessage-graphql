import React from 'react';
import { Flex, Stack } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { MessagesData, MessagesVariables } from '../../../../utils/types';
import messagesOperations from '../../../../graphql/operations/message';

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ conversationId, userId }) => {
  const { data, error, loading, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(messagesOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError({ message }) {
      toast.error(message);
    },
  });
  return (
    <Flex direction='column' justify='flex-end' overflow='hidden'>
      {loading && (
        <Stack>
          {/* TODO: create skeleton loading */}
          <div>Loading messages</div>
        </Stack>
      )}
      {data?.messages && (
        <Flex direction='column-reverse' overflowY='scroll' height='100%'>
          {data.messages.map((message) => (
            // <MessageItem />
            <div key={message.id}>{message.body}</div>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
