import { takeLatest, takeEvery } from 'redux-saga/effects'
import Api from '../services/api'
import { Types as SettlementTypes } from '../redux/settlement'
import * as settlement from './settlement'

const api = Api.create()

/**
 * Sagas generator.
 */
export function * sagas () {
  yield [
    takeLatest(SettlementTypes.REQUEST, settlement.getSettlementList, api),
    takeEvery(SettlementTypes.SET_CURRENT, settlement.declareSettlement)
  ]
}
