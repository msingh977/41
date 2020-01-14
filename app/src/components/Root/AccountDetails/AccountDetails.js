import React from 'react'
import { useSelector } from 'react-redux'

import Login from 'components/Root/AccountDetails/Login'
import Account from './Account'

export default function AccountDetails () {
  const session = useSelector(state => state.session)

  return <>{session ? <Account /> : <Login />}</>
}
