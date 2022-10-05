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
  searchUsers: Array<{ id: string; username: string }>;
}

export interface SearchUsersVariables {
  username: string;
}
