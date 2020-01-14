import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import graphqlClient from 'api/graphqlClient'

import { Grommet, Box, Form, FormField, Button, grommet } from 'grommet'

const query = gql`
  query {
    listings {
      id
      title
      description
    }
  }
`

function Login () {
  const { loading, error, data } = useQuery(query)
  const [loginError, setLoginError] = React.useState(false)

  const onSubmit = async form => {
    if (loading) return <div>Loading....</div>
    const result = await data.listings
    if (result.length === 0) setLoginError(true)
    console.log(form.value)
  }
  return (
    <Grommet theme={grommet}>
      <Box>
        <Form onSubmit={onSubmit}>
          <FormField name='email' type='email' label='email' />
          <FormField name='password' type='password' label='password' />
          <Button type='submit' label='Login' />
        </Form>
        {loginError && <Box>Cannot Login, please try again</Box>}
      </Box>
    </Grommet>
  )
}

export default Login
