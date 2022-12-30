import {
  conversationPopulated,
  participatsPopulated,
} from './../graphql/resolvers/conversation';
import { Prisma, PrismaClient } from '@prisma/client';
import { ISODateString } from 'next-auth';
import { PubSub } from 'graphql-subscriptions';
import { Context } from 'graphql-ws/lib/server';
import { messagePopulated } from '../graphql/resolvers/message';

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface SubscritionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}

export interface Session {
  user?: User;
  expires: ISODateString;
}
export interface User {
  id: string;
  username: string;
  image: string;
  name: string;
  email: string;
}

/*
CONVERSATIONS
*/

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participatsPopulated;
}>;

export interface ConversationUpdatedSubscriptionPayload {
  conversationUpdated: {
    conversation: ConversationPopulated;
  };
}

/* MESSAGES */
export interface SendMessageArgs {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessageSentSubscriptionPayload {
  messageSent: MessagePopulated;
}

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;
