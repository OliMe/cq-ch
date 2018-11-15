import { createActions, createReducer } from 'reduxsauce'

export const { Types, Creators } = createActions({
  request: ['name', 'id'],
  success: ['list'],
  purge: null,
  setCurrent: ['current'],
}, { prefix: 'settlement/' })

export const INITIAL_STATE = {
  isFetching: false,
  list: undefined,
  current: undefined,
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
export const success = (state, { list }) => {
  return { ...state, list, ...{ isFetching: false } }
}

/**
 * Очистка списка городов.
 * @param {Object} state
 * @returns {Object}
 */
export const purge = state => {
  return { ...state, ...{ list: undefined } }
}

/**
 * Сохранение текущего города.
 * @param {Object} state Текущие данные.
 * @param {Object} current Данные города.
 * @returns {Object} Новые данные.
 */
export const setCurrent = (state, { current }) => {
  return { ...state, ...{ current: current } }
}

export const reducer = createReducer(INITIAL_STATE, {
  [Types.REQUEST]: request,
  [Types.SUCCESS]: success,
  [Types.PURGE]: purge,
  [Types.SET_CURRENT]: setCurrent,
})