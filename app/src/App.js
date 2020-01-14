import dotenv from 'dotenv'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import { Provider } from 'react-redux'

import { ApolloProvider } from 'react-apollo'
import graphqlClient from 'api/graphqlClient'
import store from './store'

// import Login from 'components/Root/AccountDetails/Login'
import Layout from 'components/Layout'

dotenv.config({ path: './' })

function App () {
  return (
    <Provider store={store}>
      <ApolloProvider client={graphqlClient}>
        <Layout />
      </ApolloProvider>
    </Provider>
  )
}

export default App
