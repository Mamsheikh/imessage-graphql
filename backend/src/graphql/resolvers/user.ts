const resolvers = {
  Query: {
    searchUsers: () => {},
    hello: () => 'Hello, World!',
  },

  Mutation: {
    createUsername: (_: any, args: { username: string }, context: any) => {
      const { username } = args;
      console.log(context);
    },
  },
};

export default resolvers;
