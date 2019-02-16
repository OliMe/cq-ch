// @flow
import getTransport from './event-transport/get-transport'
import { TYPE_QUERY } from './constants'
import { checkArguments } from './helpers/argument-checker'
import { channelCreatorCfg, requestChannelCfg } from './arguments.cfg'

type Query = {
    type: string,
    resolve?: Function
}
/**
 * Declares a channel for sent queries in the service interface
 * @param {Array} types Types of queries for sending
 * @param {string} context Application context e.g. namespace of command
 * @returns {Function} Function for sending queries to channel
 */
export default function request(types: Array<string>, context: string) {
    checkArguments([types, context], 'request', channelCreatorCfg)
    return async (query: Query, time: number = 200): Promise<any> => {
        checkArguments([query, time],'requestChannel', requestChannelCfg)
        if (!types.includes(query.type)) {
            throw new TypeError('Trying to send query with type not in interface.');
        }
        query = { ...query, context }
        return await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject('Time to answer exhausted.')
            }, time)
            getTransport(TYPE_QUERY).trigger(query.type, {
                ...query, resolve: (value: any) => {
                    clearTimeout(timeout)
                    return resolve(value)
                },
            })
        })
    }
}
