import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  width: 90vw;
  //   background: #919191;
`

const Content = styled.div`
  flex: 1;
  margin-right: 1rem;
  background: #919191;
`

const Sidebar = styled.div`
  flex: 0 auto;
  width: 10vw;
  background: #717171;
`

const Wrapper = styled.div`
  box-sizing: border-box;
  height: 100vh;
  padding: 1rem;
  width: 100vw;
  background: #c1c1c1;
`

function Root () {
  return (
    <Wrapper>
      <Container>
        <Content>Content</Content>
        <Sidebar>Sidebar</Sidebar>
      </Container>
    </Wrapper>
  )
}

export default Root
