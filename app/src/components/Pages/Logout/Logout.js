import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearSession } from 'store/reducers/session'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const mutation = gql`
  mutation($session: String!) {
    deleteUserSession(sessionId: $session)
  }
`

function Logout () {
  const dispatch = useDispatch()
  const history = useHistory()
  const [deleteUserSession] = useMutation(mutation)
  const session = useSelector(state => state.session)

  async function deleteSession () {
    const data = await deleteUserSession({ variables: { session } })
    dispatch(clearSession())
    history.replace({ pathname: '/notifications' })
    return data
  }

  return (
    <div>
      {deleteSession()}
      <h1>Logout</h1>
    </div>
  )
}

export default Logout
