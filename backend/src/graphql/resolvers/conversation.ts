const resolvers = {
  Mutation: {
    createConversation: async () => {
      console.log('INSIDE CREATE CONVERSATION RESOLVER');
    },
  },
};

export default resolvers;
