// actions
const CLEAR = 'session/CLEAR'
const SET = 'session/SET'

const DEFAULT_STATE = null

//reducer
const sessionReducer = (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {
    case SET:
      return { ...state, sessionid: action.payload.id, isLoggedin: true }
    case CLEAR:
      return null
    default:
      return state
  }
}

export default sessionReducer

// action creators
export const setSession = session => {
  return { payload: session, type: SET }
}

export const clearSession = () => {
  return { type: CLEAR }
}
