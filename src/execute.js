// @flow
import getTransport from './event-transport/get-transport'
import { actionChannelCreator, channelEmitterCreator } from './helpers/action-channel-creator'
import { TYPE_COMMAND } from './constants'
import EventTargetTransport from './event-transport/event-target-transport';
/**
 * 
 * @param {Array} types 
 * @param {string} context 
 * @returns {Function}
 */
export default function execute(types: Array<string>, context: string): Function {
    const channel = actionChannelCreator(types, context)
    return (type: string | Array<string> = '*', onchange: Function | null = null): Function => {
        const events = typeof onchange === 'function' ? { change: onchange } : null
        const notificator = new EventTargetTransport(events);
        const iterator = channel(type, getTransport(TYPE_COMMAND), notificator)
        return channelEmitterCreator(iterator, notificator)
    }
}