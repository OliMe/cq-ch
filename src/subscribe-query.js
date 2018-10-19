// @flow
import getChannel from './event-transport/get-channel'
import { TYPE_QUERY } from './constants'
/**
 * @param {string} type
 * @param {Function} listener
 */
export default function subscribeQuery (type: string, listener: Function) {
    if (typeof listener !== 'function') {
        throw new TypeError(
            `Failed to execute 'subscribeQuery': 2 arguments required, but only ${arguments.length} present.`
        )
    }
    getChannel(TYPE_QUERY).on(type, listener)
}