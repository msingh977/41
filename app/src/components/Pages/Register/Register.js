import React from 'react'
import { Grommet, Box } from 'grommet'
import { Form, validators } from 'grommet-controls'
import _ from 'lodash'

import theme, {
  NeoButton,
  NeoEmailField,
  NeoPasswordField
} from 'components/Layout/theme'

import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useHistory } from 'react-router-dom'
import { onError } from 'apollo-link-error'

const mutation = gql`
  mutation($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      id
      user {
        email
        id
      }
    }
  }
`

function Register (props) {
  const [createUser] = useMutation(mutation, { errorPolicy: 'all' })
  // const {loading, error, data } = useMutation(mutation, { errorPolicy: 'all' })
  const history = useHistory()

  const onSubmit = async ({ email, password }) => {
    try {
      const data = await createUser(
        { variables: { email, password } },
        { errorPolicy: 'all' }
      )

      // const link = onError(({ graphQLErrors, networkError }) => {
      //   if (graphQLErrors)
      //     graphQLErrors.map(({ message, locations, path }) =>
      //       console.log(
      //         `[GraphQL Error]: message: ${message}, Location: ${locations}, Path: ${path}`
      //       )
      //     )
      //   if (networkError) console.log(`[Netwrok Error]: ${networkError}`)
      // })
      // history.replace({ pathname: '/login' })
    } catch (e) {
      const err = _.get(e, 'originalError.response.body')
      console.log(`[53]: ${err}`)
      console.log(`[54]: ${e.errors}`)

      return null
    }
  }

  return (
    <Grommet theme={theme}>
      <Box align='center' pad={{ vertical: 'xlarge' }}>
        <Box
          style={{
            boxShadow:
              '-8px -8px 20px 0 rgba(255,255,255,1),  1px 1px 14px -3px rgba(146,146,146,1)',
            background: '#efeeee',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '6px'
          }}
          pad='medium'
          width={{ min: '350px', max: '350px' }}
        >
          <Form
            basis='medium'
            focusFurstChild={false}
            onSubmit={f => onSubmit(f)}
            {...props}
          >
            <NeoEmailField
              placeholder='email'
              name='email'
              validation={[validators.required(), validators.email()]}
            />
            <NeoPasswordField
              placeholder='password'
              description='Password'
              name='password'
              validation={[
                validators.required(),
                validators.minLength(4),
                validators.alphaNumeric()
              ]}
            />
            <NeoPasswordField
              placeholder='confirm password'
              description='Confirm Password'
              name='confirm_password'
              validation={[
                validators.equalsField('password', 'the above password')
              ]}
            />
            <Box pad='medium' gap='medium'>
              <NeoButton type='submit' label='Register' />
            </Box>
          </Form>
        </Box>
      </Box>
    </Grommet>
  )
}

export default Register
