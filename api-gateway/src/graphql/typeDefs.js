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

  type UserSession {
    id: ID!
    user: User!
    expiresAt: Date!
    createdAt: Date!
  }

  type Mutation {
    createUser(email: String!, password: String!): User!
    createUserSession(email: String!, password: String!): UserSession!
  }

  type Query {
    listings: [Listing!]!
  }
`
export default typeDefs
