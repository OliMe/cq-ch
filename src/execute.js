// @flow
import getTransport from './event-transport/get-transport'
import { actionChannelCreator } from './helpers/action-channel-creator'
import { TYPE_COMMAND } from './constants'
/**
 * 
 * @param {Array} types 
 * @param {string} context 
 * @returns {Function}
 */
export default function execute(types: Array<string>, context: string): Function {
    const channel = actionChannelCreator(types, context)
    return (type: string | Array<string> = '*'): Function => {
        const iterator = channel(type, getTransport(TYPE_COMMAND))
        return async (): Object => {
            return (await iterator.next()).value
        }
    }
}