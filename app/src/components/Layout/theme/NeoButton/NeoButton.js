import { Button } from 'grommet'
import styled from 'styled-components'

const NeoButton = styled(Button)`
  font-weight: bold;
  font-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgb(239, 238, 238);
  box-shadow: rgb(255, 255, 255) -8px -8px 20px 0px,
    rgb(146, 146, 146) 1px 1px 14px -3px;
  :hover {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) inset, 0 3px 0 #fff;
  }
  ,
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

export default NeoButton
