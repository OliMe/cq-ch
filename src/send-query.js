// @flow
import getChannel from './event-transport/get-channel'
import { EventTarget } from 'event-target-shim'
/**
 * @param {Object} query
 * @param {number} time
 * @returns {Promise}
 */
export default async function sendQuery (query: {type: string}, time: number): Promise<any> {
    return new Promise((resolve, reject) => {
        getChannel(EventTarget).dispatchEvent(new CustomEvent(`query:${query.type}`, {
            detail: {
                type: query.type,
                resolver: resolve,
            },
        }));
        setTimeout(() => {
            reject('Time to answer exhausted.')
        }, time)
    })
}