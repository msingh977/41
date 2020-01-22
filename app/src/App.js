import dotenv from 'dotenv'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import { ApolloProvider } from 'react-apollo'
import graphqlClient from 'api/graphqlClient'
import store from './store'

// import Login from 'components/Root/AccountDetails/Login'
import Layout from 'components/Layout'

dotenv.config({ path: './' })

function App () {
  return (
    <Router>
      <Provider store={store}>
        <ApolloProvider client={graphqlClient}>
          <Layout />
        </ApolloProvider>
      </Provider>
    </Router>
  )
}

export default App
