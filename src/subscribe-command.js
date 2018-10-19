// @flow
import getChannel from './event-transport/get-channel'
import { TYPE_COMMAND } from './constants'

/**
 * @param {string} type
 * @param {Function} listener
 */
export default function subscribeCommand (type: string, listener: Function) {
    getChannel(TYPE_COMMAND).on(type, listener)
}