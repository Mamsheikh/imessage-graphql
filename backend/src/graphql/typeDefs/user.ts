import { gql } from 'apollo-server-core';

const typeDefs = gql`
  type User {
    id: String
    username: String
  }

  type Query {
    searchUsers(username: String): [User]
    hello: String!
  }

  type Mutation {
    createUsername(username: String): CreateUsernameResponse
  }

  type CreateUsernameResponse {
    success: Boolean
    error: Boolean
  }
`;

export default typeDefs;
