import { gql } from 'apollo-server'

const typeDefs = gql`
  scalar Date

  type Listing {
    description: String!
    id: ID!
    title: String!
  }

  type User {
    id: ID!
    email: String!
  }

  type Error {
    path: String!
    message: String!
  }

  type UserSession {
    id: ID!
    userId: ID!
    user: User!
    expiresAt: Date!
    createdAt: Date!
  }

  type newUserResponse {
    ok: Boolean!
    errors: [Error!]
    user: User
  }

  type Mutation {
    createUser(email: String!, password: String!): User
    createUserSession(email: String!, password: String!): UserSession!
    deleteUserSession(sessionId: ID!): Boolean!
  }

  type Query {
    listings: [Listing!]!
    userSession(me: Boolean!): UserSession
    users: [User]
    allSessions: UserSession
  }
`
export default typeDefs
