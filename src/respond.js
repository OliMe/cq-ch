// @flow
import getChannel from './event-transport/get-channel'
import { TYPE_QUERY } from './constants'

const channel = function (types: Array<any>, context: string) {
    let taker: Function
}
/**
 * 
 * @param {Array} types 
 * @param {string} context
 * @returns {Function}
 */
export default function respond (types: Array<string>, context: string) {
    return (type: string): Function  => {
        if (!types.includes(type)) {
            throw new TypeError('Trying to request type not in inteface.');
        }
    }
}