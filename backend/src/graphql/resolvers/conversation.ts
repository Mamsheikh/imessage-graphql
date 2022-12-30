import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { userIsConversationParticipant } from '../../utils/functions';
import {
  ConversationDeletedSubscriptionPayload,
  ConversationPopulated,
  ConversationUpdatedSubscriptionPayload,
  GraphQLContext,
} from './../../utils/types';
const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError('not authorized');
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
        throw new GraphQLError(error?.message);
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
        throw new GraphQLError('not authorized');
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
        throw new GraphQLError('error creating conversation ');
      }
    },
    markConversationAsRead: async (
      _: any,
      args: { userId: string; conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { conversationId, userId } = args;
      const { prisma, session } = context;

      if (!session?.user) {
        throw new GraphQLError('Not authorized');
      }

      try {
        const convparticipant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId,
          },
        });

        if (!convparticipant) {
          throw new GraphQLError('Conversation participant not found');
        }

        await prisma.conversationParticipant.update({
          where: {
            id: convparticipant.id,
          },
          data: {
            hasSeenLatestMessage: true,
          },
        });
        return true;
      } catch (error: any) {
        console.log('markConversationAsRead error', error);
        throw new GraphQLError(error?.message);
      }
    },
    deleteConversation: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { session, prisma, pubsub } = context;
      const { conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError('Not authorized');
      }

      try {
        const [deletedConversation] = await prisma.$transaction([
          prisma.conversation.delete({
            where: {
              id: conversationId,
            },
            include: conversationPopulated,
          }),
          prisma.conversationParticipant.deleteMany({
            where: {
              conversationId,
            },
          }),
          prisma.message.deleteMany({
            where: {
              conversationId,
            },
          }),
        ]);

        pubsub.publish('CONVERSATION_DELETED', {
          conversationDeleted: deletedConversation,
        });
      } catch (error: any) {
        console.log('deleteConversation error', error);
        throw new GraphQLError(error.message);
      }

      return true;
    },
  },
  Subscription: {
    conversationCreated: {
      // subscribe: (_: any, __: any, context: GraphQLContext) => {
      //   const { pubsub } = context;

      //   return pubsub.asyncIterator(['CONVERSATION_CREATED']);
      // },
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(['CONVERSATION_CREATED']);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _,
          context: GraphQLContext
        ) => {
          const { session } = context;
          if (!session?.user) {
            throw new GraphQLError('Not authorized');
          }
          const {
            conversationCreated: { participants },
          } = payload;

          // const userIsParticipant = !!participants.find(
          //   (p) => p.userId === session?.user?.id
          // );
          const userIsParticipant = userIsConversationParticipant(
            participants,
            session.user.id
          );

          return userIsParticipant;
        }
      ),
    },
    conversationUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(['CONVERSATION_UPDATED']);
        },
        (
          payload: ConversationUpdatedSubscriptionPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;

          if (!session?.user) {
            throw new GraphQLError('Not authorized');
          }
          const { id: userId } = session.user;
          const {
            conversationUpdated: {
              conversation: { participants },
            },
          } = payload;

          const userIsParticipant = userIsConversationParticipant(
            participants,
            userId
          );
          return userIsParticipant;
        }
      ),
    },
    conversationDeleted: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(['CONVERSATION_DELETED']);
        },
        (
          payload: ConversationDeletedSubscriptionPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;
          if (!session?.user) {
            throw new GraphQLError('Not authorized');
          }

          const { id: userId } = session.user;

          const {
            conversationDeleted: { participants },
          } = payload;
          return userIsConversationParticipant(participants, userId);
        }
      ),
    },
  },
};

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

export const participatsPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: { select: { id: true, username: true, image: true } },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participatsPopulated,
    },
    latestMessage: {
      include: {
        sender: { select: { id: true, username: true, image: true } },
      },
    },
  });
export default resolvers;
