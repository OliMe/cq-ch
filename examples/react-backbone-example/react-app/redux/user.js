import { createActions, createReducer } from 'reduxsauce'

export const { Types, Creators } = createActions({
    request: null,
    success: ['ip'],
}, { prefix: 'user/' })

export const INITIAL_STATE = {
    isFetching: false,
    ip: undefined,
}

/**
 * Обработчик инициализации отправки.
 * @param {Object} state
 * @returns {Object}
 */
export const request = state => {
    return { ...state, ...{ isFetching: true } }
}

/**
 * Обработчик успешного ответа.
 * @param {Object} state
 * @param {Object} data
 * @returns {Object}
 */
export const success = (state, { ip }) => {
    return { ...state, ip, ...{ isFetching: false } }
}

export const reducer = createReducer(INITIAL_STATE, {
    [Types.REQUEST]: request,
    [Types.SUCCESS]: success,
})