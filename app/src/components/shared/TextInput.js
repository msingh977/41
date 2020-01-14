import styled from 'styled-components'

const TextInput = styled.input`
  border: 1px solid ${props => props.theme.VeryLightGray}
  box-sizing: border-box;
  display: block;
  font-size: 0.9rem;
  padding: 0.25rem;
  width: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) inset, 0 3px 0 #fff;
  background: ${props => props.theme.WhiteSmoke};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
`

export default TextInput
