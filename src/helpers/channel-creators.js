// @flow
import getTransport from '../event-transport/get-transport'
import EventTargetTransport from "../event-transport/event-target-transport";
import Channel from '../channel/channel'

/**
 *
 * @param {*} iterator
 * @param {*} notificator
 * @returns {Function}
 */
function channelEmitterCreator(iterator: Function, notificator: EventTargetTransport) {
    let initialized = false;
    const emitter = async function (onchange: Function | null = null): Object {
        initialized = !initialized ? iterator.next() : initialized
        if (typeof onchange === 'function') {
            onchange = onchange.bind(onchange, emitter)
            notificator.on('change', onchange)
            onchange()
            return;
        }
        return (await iterator.next(initialized)).value
    }
    return emitter
}

/**
 *
 * @param {*} types
 * @param {*} context
 * @returns {Function}
 */
export function channelCreator(types: Array<string>, context: string) {
    return async function* (
        type: string | Array<string>,
        transport: EventTargetTransport,
        notificator: EventTargetTransport
    ) {
        const queue: Channel = new Channel(notificator)
        type = (type === '*' ? types : type)
        type = typeof type === 'string' ? [type] : type
        Array.isArray(type)
        && type.every(type => types.includes(type))
        && transport.on(type, ({ detail: action }) => {
            if (action.context && action.context !== context) {
                queue.put(action)
            }
        })
        const initialized = yield true
        while (initialized) {
            yield await queue.take()
        }
    }
}

/**
 *
 * @param {*} key
 * @param {*} channel
 * @returns {Function}
 */
export function takeChannelCreator(key: string, channel: Function) {
    return (type: string | Array<string> = '*', onchange: Function | null = null): Function => {
        const events = typeof onchange === 'function' ? { change: onchange } : null
        const notificator = new EventTargetTransport(events);
        const iterator = channel(type, getTransport(key), notificator)
        return channelEmitterCreator(iterator, notificator)
    }
}
