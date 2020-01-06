import dotenv from 'dotenv'

import '@babel/polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Root from '#root/components/Root'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

import * as theme from './theme'

import { ApolloProvider } from 'react-apollo'
import graphqlClient from '#root/api/graphqlClient'
import store from './store'

dotenv.config()
// console.log(process.env.SERVICES_URI)
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

render(
  <Provider store={store}>
    <ApolloProvider client={graphqlClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Root />
      </ThemeProvider>
    </ApolloProvider>
  </Provider>,
  document.getElementById('app')
)
