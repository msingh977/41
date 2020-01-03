import React from 'react'
import { render } from 'react-dom'

import Root from '#root/components/Root'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

  html, body, #app {
    display: flex;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: Roboto, sans-serif;
  }
 `

render(
  <>
    <GlobalStyle />
    <Root />
  </>,
  document.getElementById('app')
)
