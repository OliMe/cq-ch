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
    return async function* (type: string | Array<string>, transport: EventTargetTransport, notificator) {
        const queue: Channel = new Channel()
        type = (type === '*' ? types : type)
        type = typeof type === 'string' ? [type] : type
        Array.isArray(type)
            && type.every(type => types.includes(type))
            && transport.on(type, ({ detail: action }) => {
                if (action.context && action.context !== context) {
                    queue.put(action)
                    notificator.trigger('change')
                }
            })
        while (true) {
            yield await queue.take()
        }
    }
}

export function channelEmitterCreator(iterator: Function, notificator) {
    const result = async function (): Object {
        return (await iterator.next()).value
    }
    return Object.assign(result, {
        change: (callback: Function) => {
            notificator.on('change', callback)
        }
    });
}