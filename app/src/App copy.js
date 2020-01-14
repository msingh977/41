import dotenv from 'dotenv'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import { Provider } from 'react-redux'

import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { ApolloProvider } from 'react-apollo'

import Root from 'components/Root'
import * as theme from './theme'
import graphqlClient from 'api/graphqlClient'
import store from './store'

dotenv.config({ path: './' })

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

  html, body, #app {
    display: flex;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    background: ${props => props.theme.WhiteSmoke};
  }

  body {
    font-family: Roboto, sans-serif;
  }

`

export default function App () {
  return (
    <Provider store={store}>
      <ApolloProvider client={graphqlClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Root />
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  )
}
