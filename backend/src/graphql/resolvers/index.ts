import userResolvers from './user';
import conversationResolver from './conversation';
import messageResolvers from './message'
import merge from 'lodash.merge';

const resolvers = merge({}, userResolvers, conversationResolver, messageResolvers);

export default resolvers;
