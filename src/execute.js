// @flow
import { channelCreator, takeChannelCreator } from './helpers/channel-creators'
import { TYPE_COMMAND } from './constants'
/**
 *
 * @param {Array} types
 * @param {string} context
 * @returns {Function}
 */
export default function execute(types: Array<string>, context: string): Function {
    const channel = channelCreator(types, context)
    return takeChannelCreator(TYPE_COMMAND, channel)
}
