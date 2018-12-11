// @flow
import { channelCreator, takeChannelCreator } from './helpers/channel-creators'
import { TYPE_QUERY } from './constants'
import EventTargetTransport from './event-transport/event-target-transport';
/**
 * 
 * @param {Array} types 
 * @param {string} context
 * @returns {Function}
 */
export default function respond(types: Array<string>, context: string): Function {
    const channel = channelCreator(types, context)
    return takeChannelCreator(TYPE_QUERY, channel)
}