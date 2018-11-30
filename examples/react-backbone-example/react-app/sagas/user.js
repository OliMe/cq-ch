import get from 'lodash/get'
import { call, put, select, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { Types, Creators as Action } from '../redux/user'
import { sendQuery, subscribeQuery } from '../../../../es/cqrs-bus'

export const selectUserIp = state => get(state, 'user.ip', null)

export function* getUserIp({ resolver }) {
    let ip = yield select(selectUserIp)
    try {
        if (!ip) {
            ip = yield call(sendQuery, Action.getUserIp(), 10000)
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

function createUserQueryChannel() {
    return eventChannel(emit => {
        const queryHandler = query => {
            emit(query)
        }
        subscribeQuery(Types.GET_USER_IP, queryHandler)
        return () => { }
    })
}

export function* watchOnQueries() {
    const queryChannel = createUserQueryChannel()
    while (true) {
        const action = yield take(queryChannel)
        console.log(action)
        yield put(action)
    }
}
