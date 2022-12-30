import { gql } from 'graphql-tag';

const typeDefs = gql`
  scalar Date
  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
    markConversationAsRead(conversationId: String!, userId: String!): Boolean
    deleteConversation(conversationId: String!): Boolean
  }

  type CreateConversationResponse {
    conversationId: String
  }

  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
  }

  type ConversationDeletedSubscriptionPayload {
    id: String
  }
  type Query {
    conversations: [Conversation]
  }

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }

  type Subscription {
    conversationCreated: Conversation
    conversationUpdated: ConversationUpdatedSubscriptionPayload
    conversationDeleted: ConversationDeletedSubscriptionPayload
  }
`;

export default typeDefs;
