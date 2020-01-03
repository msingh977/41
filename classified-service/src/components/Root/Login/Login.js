import React from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import TextInput from '#root/components/shared/TextInput'

const Label = styled.label`
  display: block;

  :not(:first-child) {
    margin-top: 0.75rem;
  }
`
const LabelText = styled.strong`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`

const LoginButton = styled.button`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: ${props => props.theme.DodgerBlue};
  text-align: center;
  box-shadow: rgb(255, 255, 255) -8px -8px 20px 0px,
    ${props => props.theme.gray} 1px 1px 14px -3px;
  background: ${props => props.theme.WhiteSmoke};
  // border: 1px solid rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.DimGrey};
  border-radius: 6px;

  :hover {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) inset, 0 3px 0 #fff;
  }
`

export default function Login () {
  const {
    formState: { isSubmitting },
    handleSubmit,
    register
  } = useForm()

  const onSubmit = handleSubmit(({ email, password }) => {
    console.log(email, password)
  })

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Label>
          <LabelText>Email</LabelText>
          <TextInput
            disabled={isSubmitting}
            name='email'
            type='email'
            ref={register}
          />
        </Label>
        <Label>
          <LabelText>Password</LabelText>
          <TextInput
            disabled={isSubmitting}
            name='password'
            type='password'
            ref={register}
          />
        </Label>
        <LoginButton type='submit'>Login</LoginButton>
      </form>
    </div>
  )
}
