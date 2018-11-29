import get from 'lodash/get'
import { call, put, select, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { Types, Creators as Action } from '../redux/settlement'
import { sendCommand, subscribeCommand } from '../../../../es/cqrs-bus'

export const selectSettlementId = state => get(state, 'settlement.current.id', null)
export const selectUserIp = state => get(state, 'user.ip', null)

/**
 * Получение информации о городах из API.
 * @generator
 * @param {Object} api Объект API-методов.
 * @param {Object} query Параметры запроса.
 */
export function* getSettlementList(api, query) {
  let headers = null
  if (!(query.id || query.name)) {
    query = {
      detect_by_ip: 1
    }
    headers = {
      headers: {
        'x-client-ip': yield select(selectUserIp)
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

function createSettlementCommandChannel() {
  return eventChannel(emit => {
    const commandHandler = command => {
      emit(command)
    }
    subscribeCommand(Types.SET_CURRENT, commandHandler)
    return () => { }
  })
}

export function* watchOnCommands() {
  const commandChannel = createSettlementCommandChannel()
  while (true) {
    yield put(yield take(commandChannel))
  }
}

/**
 * Обновляет необходимые поля в store в соответствии с выбранным населенным пунктом.
 * @generator
 * @param {Object} action 
 */
export function* declareSettlement(action) {
  yield call(sendCommand, action)
}
