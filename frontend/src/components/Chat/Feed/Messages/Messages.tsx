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
import MessageItem from './MessageItem';

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
          messages:
            newMessage?.sender?.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
  };

  return (
    <Flex direction='column' height='100%' justify='flex-end' overflow='hidden'>
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height='60px' width='100%' />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction='column-reverse' overflowY='scroll' height='100%'>
          {data.messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              sentByMe={message?.sender?.id === userId}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
