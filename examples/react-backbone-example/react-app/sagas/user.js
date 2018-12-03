import get from 'lodash/get'
import { call, put, select, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { Types, Creators as Action } from '../redux/user'
import { respond, request } from '../../../../es/cqrs-bus'

const requestFn = request([Types.GET_USER_IP], 'react-app/user')
const respondFn = respond([Types.GET_USER_IP], 'react-app/user')

export const selectUserIp = state => get(state, 'user.ip', null)

export function* getUserIp({ resolver }) {
    let ip = yield select(selectUserIp)
    try {
        if (!ip) {
            ip = yield call(requestFn, Types.GET_USER_IP, Action.getUserIp(), 10000)
        }
    } catch (e) {
        console.log('react error', e)
        yield put(Action.request(resolver))
    }
    if (ip) {
        resolver 
        && typeof resolver === 'function' 
        && resolver(ip)
        yield put(Action.success(ip))
    }
}

export function* requestUserIp(api, { resolver }) {
    let ip = null
    const response = yield call(api.getIp)
    if (response.ok && response.data.ip) {
        ip = response.data.ip
    }
    if (ip) {
        resolver 
        && typeof resolver === 'function' 
        && resolver(ip)
        yield put(Action.success(ip))
    }
}

export function* watchOnQueries() {
    const getUserIpQuery = respondFn(Types.GET_USER_IP)
    console.log(getUserIpQuery())
    // while (true) {
        // const {query: action, resolver} = yield call(getUserIpQuery)
        // console.log(action)
        // yield put(action)
    // }
}
