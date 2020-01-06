import React from 'react'
import { useSelector } from 'react-redux'

import Login from '#root/components/Root/Login'
import Account from './Account'

export default function AccountDetails () {
  const session = useSelector(state => state.session)

  return <>{session ? <Account /> : <Login />}</>
}
