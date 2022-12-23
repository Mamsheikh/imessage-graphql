import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { userIsParticipant } from '../../utils/functions';
import {
  GraphQLContext,
  MessagePopulated,
  MessageSentSubscriptionPayload,
  SendMessageArgs,
} from '../../utils/types';
import { conversationPopulated } from './conversation';

const resolvers = {
  Query: {
    messages: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<Array<MessagePopulated>> => {
      const { session, prisma } = context;
      const { conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError('Not authorized');
      }

      const { id: userId } = session.user;

      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: conversationPopulated,
      });

      if (!conversation) {
        throw new GraphQLError('conversation not found');
      }

      const allowedToView = userIsParticipant(
        conversation.participants,
        userId
      );

      if (!allowedToView) {
        throw new GraphQLError('not authorized');
      }

      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId,
          },
          include: messagePopulated,
          orderBy: {
            createdAt: 'desc',
          },
        });

        return messages;
      } catch (error: any) {
        console.log('query messages error', error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    sendMessage: async (
      _: any,
      args: SendMessageArgs,
      context: GraphQLContext
    ): Promise<Boolean> => {
      const { prisma, pubsub, session } = context;

      if (!session?.user) {
        throw new GraphQLError('Not authorized');
      }

      const { id: userId } = session.user;
      const { id: messageId, body, conversationId, senderId } = args;

      if (userId !== senderId) {
        throw new GraphQLError('Not authorized');
      }

      try {
        /**
         * create new message
         */
        const newMessage = await prisma.message.create({
          data: {
            id: messageId,
            senderId,
            conversationId,
            body,
          },
        });

        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId: userId,
            conversationId,
          },
        });

        if (!participant) {
          throw new GraphQLError('participant does not exist');
        }
        /**
         * update conversation entity
         */
        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: participant.id,
                },
                data: {
                  hasSeenLatestMessage: true,
                },
              },
              updateMany: {
                where: {
                  NOT: {
                    userId,
                  },
                },
                data: {
                  hasSeenLatestMessage: false,
                },
              },
            },
          },
          include: conversationPopulated,
        });

        pubsub.publish('MESSAGE_SENT', { messageSent: newMessage });
        // pubsub.publish("CONVERSATION_UPDATED", {
        //     conversationUpdated: {
        //         conversation
        //     }
        // })
      } catch (error) {
        console.log('send message error', error);
        throw new GraphQLError('Error sending message');
      }
      return true;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          return context.pubsub.asyncIterator(['MESSAGE_SENT']);
        },
        (
          payload: MessageSentSubscriptionPayload,
          args: { conversationId: string },
          context: GraphQLContext
        ) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      ),
    },
  },
};

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});

export default resolvers;
