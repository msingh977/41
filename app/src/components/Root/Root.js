import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { useDispatch } from 'react-redux'
import gql from 'graphql-tag'
import graphqlClient from 'api/graphqlClient'
import { setSession } from 'store/reducers/session'

// import Login from './Login'
import AccountDetails from './AccountDetails'

const Wrapper = styled.div`
  box-sizing: border-box;
  height: 100vh;
  padding: 1rem;
  width: 100vw;
`
const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 0 auto;
  width: 90vw;
`

const Content = styled.div`
  flex: 1;
  margin-right: 1rem;
`

const Sidebar = styled.div`
  flex: 0 auto;
  width: 10vw;
`

const query = gql`
  {
    userSession(me: true) {
      id
      user {
        email
        id
      }
    }
  }
`

export default function Root () {
  const [initialized, setInitialized] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    graphqlClient.query({ query }).then(({ data }) => {
      if (data.userSession) {
        dispatch(setSession(data.userSession))
      }
      setInitialized(true)
    })
  }, [])

  if (!initialized) return 'Loading...'

  return (
    <Wrapper>
      <Container>
        <Content>Content</Content>
        <Sidebar>
          <AccountDetails />
        </Sidebar>
      </Container>
    </Wrapper>
  )
}
