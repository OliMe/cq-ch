import { reducers } from './redux/'
import { sagas } from './sagas/'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()

const Store = ((reducers, sagas) => {
    const reduxStore = createStore(
        reducers,
        sagas && applyMiddleware(sagaMiddleware)
    )
    if (sagas) {
        sagaMiddleware.run(sagas)
    }

    return reduxStore
})(reducers, sagas)

export default Store