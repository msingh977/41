import { gql } from 'apollo-server'

const typeDefs = gql`
  type Listing {
    description: String!
    id: ID!
    title: String!
  }

  type User {
    id: ID!
    email: String!
  }

  type Mutation {
    createUser(email: String!, password: String!): User!
  }

  type Query {
    listings: [Listing!]!
  }
`
export default typeDefs
