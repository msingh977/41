import { EmailInputField } from 'grommet-controls'
import styled from 'styled-components'

const NeoEmailField = styled(EmailInputField)`
  font-weight: normal;
  font-align: left;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgb(239, 238, 238);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) inset, 0 3px 0 #fff;
  :active {
    border: 1px solid rgb(239, 238, 238);
  }
  ,
  :focus {
    border-color: rgb(239, 238, 238);
    box-shadow: rgb(239, 238, 238);
    border: 1px solid rgb(239, 238, 238);
    outline: none;
  }
`

export default NeoEmailField
