import get from 'lodash/get'
import { call, put, select} from 'redux-saga/effects'
import { Types, Creators as Action } from '../redux/settlement'
import { command, execute } from '../../../../es/cqrs-bus'
import watchGeneratorCreator from '../helpers/watch-generator-creator'

const executeChannelFactory = execute([Types.SET_CURRENT], 'react-app/settlement')
const putCommand = command([Types.SET_CURRENT], 'react-app/settlement')
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

export const watchOnCommands = watchGeneratorCreator(executeChannelFactory)

// Отправка команды на изменение города в других приложениях
export function* declareSettlement(action) {
  yield call(putCommand, action)
}
