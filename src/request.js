// @flow
import getTransport from './event-transport/get-transport'
import { TYPE_QUERY } from './constants'
import { checkArguments, getCfgCreator } from './helpers/argument-checker'
import { requestChannelCfg } from './arguments.cfg'

type Query = {
    type: string,
    resolve?: Function
}
/**
 * 
 * @param {Array} types 
 * @param {string} context 
 * @returns {Function}
 */
export default function request(types: Array<string>, context: string) {
    return async (query: Query, time: number = 200): Promise<any> => {
        checkArguments([query, time], getCfgCreator('request', requestChannelCfg)([query, time]))
        if (!types.includes(query.type)) {
            throw new TypeError('Trying to request type not in inteface.');
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