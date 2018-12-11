import EventTargetTransport from "../event-transport/event-target-transport";
import Channel from '../channel/channel'

// @flow
/**
 * 
 * @param {*} types 
 * @param {*} context
 * @returns {Function} 
 */
export function actionChannelCreator(types: Array<string>, context: string) {
    return async function* (type: string | Array<string>, transport: EventTargetTransport, notificator: EventTargetTransport) {
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
 * @param {*} iterator 
 * @param {*} notificator
 * @returns {Function}
 */
export function channelEmitterCreator(iterator: Function, notificator: EventTargetTransport) {
    let initialized = false;
    const emitter = async function (onchange: Function | null = null): Object {
        initialized = !initialized ? iterator.next() : initialized
        if (typeof onchange === 'function') {
            notificator.on('change', onchange.bind(onchange, emitter))
            return;
        }
        return (await iterator.next(initialized)).value
    }
    return emitter
}