import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const Email = styled.div`
  color: ${props => props.theme.DarkSlateGray};
  font-size: 1.1rem;
  top-margin: 0.25rem;
`

const Wrapper = styled.div`
  color: ${props => props.theme.Mortar};
  font-size: 0.9ren;
`

export default function Account () {
  const session = useSelector(state => state.session)

  return (
    <Wrapper>
      Logged in as <Email>{session.user.email}</Email>
    </Wrapper>
  )
}
