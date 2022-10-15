import { ConversationPopulated } from './../../../backend/src/utils/types';
/**
 * User
 */
export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchUsersVariables {
  username: string;
}

export interface SearchedUser {
  id: string;
  username: string;
  image: string;
}

/**
 * Conversations
 */

export interface CreateConversationVariables {
  participantIds: string[];
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface ConversationsData {
  conversations: Array<ConversationPopulated>;
}
