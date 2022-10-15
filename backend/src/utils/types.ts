import {
  conversationPopulated,
  participatsPopulated,
} from './../graphql/resolvers/conversation';
import { Prisma, PrismaClient } from '@prisma/client';
import { ISODateString } from 'next-auth';

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
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
