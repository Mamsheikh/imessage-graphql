import { gql } from '@apollo/client';
import { MessageFields } from './message';

const ConversationsFields = `
  
          id
          participants {
            user {
              id
              username
              image
            }
            hasSeenLatestMessage
          }
          latestMessage {
           ${MessageFields}
          }
          updatedAt
  
`;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    conversations: gql`
      query Conversations {
        conversations {
          ${ConversationsFields}
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
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${ConversationsFields}
        }
      }
    `,
  },
};
