import userResolvers from './user';
import conversationResolver from './conversation';
import messageResolvers from './message';
import dateResolvers from './scalars';
import merge from 'lodash.merge';

const resolvers = merge(
  {},
  userResolvers,
  conversationResolver,
  messageResolvers,
  dateResolvers
);

export default resolvers;
