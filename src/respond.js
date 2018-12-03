// @flow
import getChannel from './event-transport/get-channel'
import { TYPE_QUERY } from './constants'
/**
 * 
 * @param {Array} types 
 * @param {string} context
 * @returns {Function}
 */
export default function respond(types: Array<string>, context: string) {
    const channel = function* (type: string | Array<string>) {
        const queue: Array<any> = []
        type = (type === '*' ? types : type)
        type = typeof type === 'string' ? [type] : type
        Array.isArray(type)
        && type.every(type => types.includes(type))
        && getChannel(TYPE_QUERY).on(type, ({ detail: query }) => {
            console.error(query)
            if (query.context && query.context !== context) {
                queue.push(query)
            }
        })
        const startTime = Date.now()
        while ((Date.now() - startTime) < 5000) {
            let query = queue.shift()
            console.error(query)
            if (query) {
                yield query
                yield (result: any) => {
                    query.resolve(result)
                }
            }
        }
    }
    return (type: string | Array<string> = '*'): Function => {
        const queryIterator = channel(type)
        return (): Object => {
            return { query: queryIterator.next().value, resolver: queryIterator.next().value }
        }
    }
}