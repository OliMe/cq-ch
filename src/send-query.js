// @flow
import getTransport from './event-transport/get-transport'
import { TYPE_QUERY } from './constants'

type Query = {
    type: string,
    payload?: Object,
    resolver?: Function
}

/**
 * @param {Object} query
 * @param {number} time
 * @returns {Promise}
 */
export default async function sendQuery(query: Query, time: number = 200): Promise<any> {
    const { type, payload } = query
    return await new Promise((resolve, reject) => {
        let clonedQuery: Query = { type: type, resolver: resolve }
        if (typeof payload === 'object' && payload.constructor === Object) {
            clonedQuery.payload = payload
        }
        getTransport(TYPE_QUERY).trigger(query.type, clonedQuery)
        if (time) {
            setTimeout(() => {
                reject('Time to answer exhausted.')
            }, time)
        }
    })
}