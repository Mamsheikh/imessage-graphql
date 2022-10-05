import { User } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';
import { CreateUsernameResponse, GraphQLContext } from './../../utils/types';
const resolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<User[]> => {
      const { username: searchedUsername } = args;
      const { prisma, session } = context;

      if (!session?.user) {
        throw new ApolloError('Not Authorized');
      }

      const {
        user: { username: myUsername },
      } = session;

      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: 'insensitive',
            },
          },
        });

        return users;
      } catch (error: any) {
        console.log('SearchUsers error', error);
        throw new ApolloError(error?.message);
      }
    },
  },

  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = context;
      if (!session?.user) {
        return {
          error: 'Not Authorized',
        };
      }

      const { id } = session.user;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { username },
        });

        if (existingUser) {
          return {
            error: 'Username is already take. Try another!',
          };
        }

        await prisma.user.update({
          where: { id },
          data: {
            username,
          },
        });
        return {
          success: true,
        };
      } catch (error) {
        console.log('Createusername resolver error', error);
        return {
          error: error as string,
        };
      }
    },
  },
};

export default resolvers;
