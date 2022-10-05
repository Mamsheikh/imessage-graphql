import userResolvers from './user';
import conversationResolver from './conversation';
import merge from 'lodash.merge';

const resolvers = merge({}, userResolvers, conversationResolver);

export default resolvers;
