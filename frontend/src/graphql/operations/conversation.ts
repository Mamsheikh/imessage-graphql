import { gql } from '@apollo/client';

export const conversationOperations = {
  Queries: {},
  Mutations: {
    createConversation: gql`
      mutation createConversation($participantsId: [String]!) {
        createConversation(participantsId: $participantsId) {
          conversationId
        }
      }
    `,
  },
  Subscriptions: {},
};
