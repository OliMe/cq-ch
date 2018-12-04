import { call, put, all } from 'redux-saga/effects'
import { watchOnCommands as watchOnSettlementCommands } from './settlement'
import { watchOnQueries as watchOnUserQueries } from './user'
import { Types, Creators as UserAction } from '../redux/user'

export function* appMountedSaga() {
    yield all([
        call(watchOnSettlementCommands),
        call(watchOnUserQueries)
    ])
    yield put(UserAction.getUserIp())
}
