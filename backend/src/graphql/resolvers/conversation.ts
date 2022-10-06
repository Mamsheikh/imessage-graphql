import { GraphQLContext } from './../../utils/types';
const resolvers = {
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantsIds: string[] },
      context: GraphQLContext
    ) => {
      console.log('INSIDE CREATE CONVERSATION RESOLVER', args);
    },
  },
};

export default resolvers;
