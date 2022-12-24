import React, { useEffect } from 'react';
import { Flex, Stack } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import {
  MessagesData,
  MessagesVariables,
  MessageSubscriptionData,
} from '../../../../utils/types';
import messagesOperations from '../../../../graphql/operations/message';
import SkeletonLoader from '../../../common/SkeletonLoader';

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
  useEffect(() => {
    subscribeToMoreMessages(conversationId);
  }, [conversationId]);
  if (error) {
    return null;
  }

  const subscribeToMoreMessages = (conversationId: string) => {
    subscribeToMore({
      document: messagesOperations.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData) return prev;

        console.log('HERE IS SUBSCRIPTION DATA', subscriptionData);

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages: [newMessage, ...prev.messages],
        });
      },
    });
  };

  return (
    <Flex direction='column' justify='flex-end' overflow='hidden'>
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height='60px' />
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
