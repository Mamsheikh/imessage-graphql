import { gql } from '@apollo/client';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    conversations: gql`
      query Conversations {
        conversations {
          id
          participants {
            user {
              id
              username
            }
            hasSeenLatestMessage
          }
          latestMessage {
            id
            sender {
              id
              username
            }
            body
            createdAt
          }
          updatedAt
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation createConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
  },
  Subscriptions: {},
};
