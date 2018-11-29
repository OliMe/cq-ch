import { call, put } from 'redux-saga/effects'
import { watchOnCommands as watchOnSettlementCommands } from './settlement'
import { Types, Creators as UserAction } from '../redux/user'

export function* appMountedSaga() {
    yield put(UserAction.request())
    yield call(watchOnSettlementCommands)
}
