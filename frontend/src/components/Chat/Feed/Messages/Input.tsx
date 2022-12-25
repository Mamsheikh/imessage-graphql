import { useMutation } from '@apollo/client';
import { Box, Input } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { ObjectID } from 'bson';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { SendMessageArgs } from '../../../../../../backend/src/utils/types';
import messageOperations from '../../../../graphql/operations/message';
import { MessagesData } from '../../../../utils/types';

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  session,
}) => {
  const [messageBody, setMessageBody] = useState('');
  const [sendMessage] = useMutation<{ sendMessage: boolean }, SendMessageArgs>(
    messageOperations.Mutation.sendMessage
  );
  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      //TODO: call sendMessage mutation
      const { id: senderId } = session?.user;
      const messageId = new ObjectID().toString();
      const newMessage: SendMessageArgs = {
        id: messageId,
        senderId,
        conversationId,
        body: messageBody,
      };
      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        /**
         * Optimistically update UI
         */
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          setMessageBody('');
          const existing = cache.readQuery<MessagesData>({
            query: messageOperations.Query.messages,
            variables: { conversationId },
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: messageOperations.Query.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: messageId,
                  body: messageBody,
                  senderId: session.user.id,
                  conversationId,
                  sender: {
                    id: session.user.id,
                    username: session.user.username,
                    // image: session.user.image,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error('failed to send message');
      }
    } catch (error: any) {
      console.log('onSendMessage error', error);
      toast.error(error?.message);
    }
  };
  return (
    <Box px={4} py={6} width='100%'>
      <form onSubmit={onSendMessage}>
        <Input
          value={messageBody}
          onChange={(event) => setMessageBody(event.target.value)}
          size='md'
          resize='none'
          placeholder='New message'
          _focus={{
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'whiteAlpha.300',
          }}
          _hover={{
            borderColor: 'whiteAlpha.300',
          }}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
