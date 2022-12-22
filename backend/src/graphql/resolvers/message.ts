import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { GraphQLContext, MessageSentSubscriptionPayload, SendMessageArgs } from "../../utils/types";

const resolvers = {
    Query: {},
    Mutation: {
        sendMessage: async (
            _: any,
            args: SendMessageArgs,
            context: GraphQLContext
        ): Promise<Boolean> => {
            const { prisma, pubsub, session } = context

            if (!session?.user) {
                throw new GraphQLError("Not authorized");
            }

            const { id: userId } = session.user
            const { id: messageId, body, conversationId, senderId } = args

            if (userId !== senderId) {
                throw new GraphQLError("Not authorized")
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
                        body
                    }
                })

                /**
                 * update conversation entity
                 */
                const conversation = await prisma.conversation.update({
                    where: {
                        id: conversationId
                    },
                    data: {
                        latestMessageId: newMessage.id,
                        participants: {
                            update: {
                                where: {
                                    id: senderId
                                },
                                data: {
                                    hasSeenLatestMessage: true
                                }
                            },
                            updateMany: {
                                where: {
                                    NOT: {
                                        userId: senderId
                                    },
                                },
                                data: {
                                    hasSeenLatestMessage: false
                                }
                            }
                        }
                    }
                })

                pubsub.publish("MESSAGE_SENT", { messageSent: newMessage })
                // pubsub.publish("CONVERSATION_UPDATED", {
                //     conversationUpdated: {
                //         conversation
                //     }
                // })
            } catch (error) {
                console.log('send message error', error);
                throw new GraphQLError("Error sending message")

            }
            return true
        }
    },
    Subscription: {
        messageSent: {
            subscribe: withFilter((_: any, __: any, context: GraphQLContext) => {
                return context.pubsub.asyncIterator(['MESSAGE_SENT'])
            }, (payload: MessageSentSubscriptionPayload, args: { conversationId: string }, context: GraphQLContext) => {
                return payload.messageSent.conversationId === args.conversationId
            })
        }
    }
}

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
    sender: {
        select: {
            id: true,
            username: true
        }
    }
})

export default resolvers;
