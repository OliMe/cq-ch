import { call, put } from 'redux-saga/effects'
import { Types, Creators as Action } from '../redux/user'
import { sendQuery } from '../../../../es/cqrs-bus'

/**
 * Получение информации о городах из API.
 * @generator
 * @param {Object} api Объект API-методов.
 * @param {Object} query Параметры запроса.
 */
export function* getUserIp(api) {
    let ip = null
    try {
        ip = yield call(sendQuery, {
            type: 'user/GET_USER_IP'
        }, 200)
    } catch (e) {

    }
    if (ip) {
        yield put(Action.success(ip))
    } else {
        const response = yield call(api.getIp)
        if (response.ok && response.data.ip) {
            yield put(Action.success(response.data.ip))
        }
    }
}
