import { call, put } from 'redux-saga/effects'
import { watchOnCommands as watchOnSettlementCommands } from './settlement'
import { watchOnQueries as watchOnUserQueries } from './user'
import { Types, Creators as UserAction } from '../redux/user'

export function* appMountedSaga() {
    yield call(watchOnUserQueries)
    yield call(watchOnSettlementCommands)
    yield put(UserAction.getUserIp())
}
