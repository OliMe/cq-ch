// @flow
import getTransport from './event-transport/get-transport'
import { actionChannelCreator } from './helpers/action-channel-creator'
import { TYPE_QUERY } from './constants'
/**
 * 
 * @param {Array} types 
 * @param {string} context
 * @returns {Function}
 */
export default function respond(types: Array<string>, context: string) {
    const channel = actionChannelCreator(types, context)
    return (type: string | Array<string> = '*'): Function => {
        const iterator = channel(type, getTransport(TYPE_QUERY))
        return async (): Object => {
            return (await iterator.next()).value
        }
    }
}