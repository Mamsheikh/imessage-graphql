import { CreateUsernameResponse, GraphQLContext } from './../../utils/types';
const resolvers = {
  Query: {
    searchUsers: () => {},
    hello: () => 'Hello, World!',
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
