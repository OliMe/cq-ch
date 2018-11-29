import { takeLatest, takeEvery } from 'redux-saga/effects'
import Api from '../services/api'
import { Types as SettlementTypes } from '../redux/settlement'
import { Types as AppTypes } from '../redux/app'
import { Types as UserTypes } from '../redux/user' 
import * as settlement from './settlement'
import * as user from './user'
import { appMountedSaga } from './app'

const api = Api.create()

/**
 * Sagas generator.
 */
export function * sagas () {
  yield [
    takeLatest(SettlementTypes.REQUEST, settlement.getSettlementList, api),
    takeLatest(UserTypes.SUCCESS, settlement.getSettlementList, api),
    takeLatest(UserTypes.REQUEST, user.getUserIp, api),
    takeEvery(SettlementTypes.SET_CURRENT, settlement.declareSettlement),
    takeEvery(AppTypes.MOUNTED, appMountedSaga),
  ]
}
