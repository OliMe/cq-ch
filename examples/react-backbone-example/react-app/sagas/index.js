import { takeLatest } from 'redux-saga/effects'
import Api from '../services/api'
import { Types as SettlementTypes } from '../redux/settlement'
import * as settlement from './settlement'

const api = Api.create()

/**
 * Генератор с сагами.
 */
export function * sagas () {
  yield [
    takeLatest(SettlementTypes.REQUEST, settlement.getSettlementList, api),
  ]
}
