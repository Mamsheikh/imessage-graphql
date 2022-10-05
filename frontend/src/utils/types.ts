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
