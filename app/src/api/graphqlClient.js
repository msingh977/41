import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'

export const cache = new InMemoryCache()

const errorLink = onError(
  ({ graphQLErrors, networkError, response, operation }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        console.error(
          `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`,
          operation,
          response
        )
      }
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`, operation, response)
    }
  }
)

const httpLink = new HttpLink({
  credentials: 'include',
  uri: process.env.REACT_APP_SERVICES_URI + '/graphql'
})

const graphqlClient = new ApolloClient({
  cache,
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache()
})

export default graphqlClient
