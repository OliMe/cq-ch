import { combineReducers } from 'redux'

export const reducers = combineReducers({
  settlement: require('./settlement').reducer,
})