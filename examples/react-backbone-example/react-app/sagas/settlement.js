import get from 'lodash/get'
import { call, put, select } from 'redux-saga/effects'
import { Creators as Action } from '../redux/settlement'
import { sendCommand } from '../../../../es/cqrs-bus'

export const selectSettlementId = state => get(state, 'settlement.current.id', null)

/**
 * Получение информации о городах из API.
 * @generator
 * @param {Object} api Объект API-методов.
 * @param {Object} query Параметры запроса.
 */
export function * getSettlementList (api, query) {
  let headers = null
  if (!(query.id || query.name)) {
    query = {
      ...query,
      detect_by_ip: 1
    }
    const response = yield call(api.getIp)
    if (response.ok && response.data.ip) {
      headers = {
        headers: {
          'x-client-ip': response.data.ip
        }
      }
    }
  }
  query = {
    ...query,
    type: undefined,
    perPage: 10,
  }
  const response = yield call(api.getSettlementList, query, headers)
  if (response.ok) {
    yield put(Action.success(response.data.items))
    if (query.id) {
      const currentSettlementId = yield select(selectSettlementId)
      if (query.id === currentSettlementId) {
        yield put(Action.purge())
      }
    }
  }
}

/**
 * Обновляет необходимые поля в store в соответствии с выбранным населенным пунктом.
 * @generator
 * @param {Object} action 
 */
export function * declareSettlement ({ current }) {
  yield call(sendCommand, {
    type: 'SET_SETTLEMENT',
    payload: current
  })
}
