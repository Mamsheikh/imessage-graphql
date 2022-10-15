import { Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';
import { ConversationPopulated, GraphQLContext } from './../../utils/types';
const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new ApolloError('not authorized');
      }

      const { id: userId } = session.user;

      try {
        const conversations = prisma.conversation.findMany({
          include: conversationPopulated,
        });

        return (await conversations).filter(
          (conversation) =>
            !!conversation.participants.find((p) => p.userId === userId)
        );
      } catch (error: any) {
        console.log('conversations error', error);
        throw new ApolloError(error?.message);
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: string[] },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { prisma, session, pubsub } = context;
      const { participantIds } = args;

      if (!session?.user) {
        throw new ApolloError('not authorized');
      }

      const { id: userId } = session.user;

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });

        pubsub.publish('CONVERSATION_CREATED', {
          conversationCreated: conversation,
        });

        return {
          conversationId: conversation.id,
        };
      } catch (error) {
        console.log('createConversation error', error);
        throw new ApolloError('error creating conversation ');
      }
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        const { pubsub } = context;

        pubsub.asyncIterator(['CONVERSATION_CREATED']);
      },
    },
  },
};

export const participatsPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: { select: { id: true, username: true } },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participatsPopulated,
    },
    latestMessage: {
      include: { sender: { select: { id: true, username: true } } },
    },
  });
export default resolvers;
