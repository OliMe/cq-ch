import get from 'lodash/get'
import { call, put, select, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { Types, Creators as Action } from '../redux/user'
import { respond, request } from '../../../../es/cqrs-bus'

const requestFn = request([Types.QUERY_USER_IP], 'react-app/user')
const respondFn = respond([Types.QUERY_USER_IP], 'react-app/user')

export const selectUserIp = state => get(state, 'user.ip', null)

export function* respondOnQueryUserIp({ resolve }) {
    let ip = yield select(selectUserIp)
    if (!ip) {
        yield put(Action.request())
        ip = (yield take(Types.SUCCESS)).ip
    }
    ip && typeof resolve === 'function' && resolve(ip)
}

export function* getUserIp({ resolve }) {
    let ip = yield select(selectUserIp)
    try {
        if (!ip) {
            ip = yield call(requestFn, Action.queryUserIp(), 200)
            if (ip) {
                yield put(Action.success(ip))
            }
        }
    } catch (e) {
        yield put(Action.request(resolve))
    }
}

export function* requestUserIp(api) {
    let ip = null
    const response = yield call(api.getIp)
    if (response.ok && response.data.ip) {
        ip = response.data.ip
    }
    if (ip) {
        yield put(Action.success(ip))
    }
}

export function* watchOnQueries() {
    const getUserIpQuery = respondFn(Types.QUERY_USER_IP)
    while (true) {
        yield put(yield call(getUserIpQuery))
    }
}
