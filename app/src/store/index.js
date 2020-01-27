import { combineReducers, createStore } from 'redux'

import * as allReducers from './reducers'

const reducers = combineReducers(allReducers)

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
