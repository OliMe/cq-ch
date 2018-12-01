// @flow
import getChannel from './event-transport/get-channel'
import { TYPE_QUERY } from './constants'
/**
 * 
 * @param {Array} types 
 * @param {string} context 
 * @returns {Function}
 */
export default function request (types: Array<string>, context: string) {
    return async (type: string, data: Object = {}, time: number = 200): Promise<any>  => {
        if (!types.includes(type)) {
            throw new TypeError('Trying to request type not in inteface.');
        }
        const query = { type, context, ...data }
        return await new Promise((resolve, reject) => {
            getChannel(TYPE_QUERY).trigger(query.type, { ...query, resolve })
            if (time) {
                setTimeout(() => {
                    reject('Time to answer exhausted.')
                }, time)
            }
        })
    }
}