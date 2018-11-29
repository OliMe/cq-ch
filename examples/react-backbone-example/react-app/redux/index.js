import { combineReducers } from 'redux'

export const reducers = combineReducers({
  settlement: require('./settlement').reducer,
  user: require('./user').reducer,
  app: require('./app').reducer,
})