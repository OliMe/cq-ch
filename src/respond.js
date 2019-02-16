// @flow
import { channelCreator, takeChannelCreator } from './helpers/channel-creators'
import { TYPE_QUERY } from './constants'
import { checkArguments } from "./helpers/argument-checker";
import { channelCreatorCfg } from "./arguments.cfg";

/**
 * Declares a channel for processed queries in the service interface
 * @param {Array} types Types of queries for processing
 * @param {string} context Application context e.g. namespace of command
 * @returns {Function} Function for processing queries from channel
 */
export default function respond(types: Array<string>, context: string): Function {
    checkArguments([types, context],'respond', channelCreatorCfg)
    const channel = channelCreator(types, context)
    return takeChannelCreator(TYPE_QUERY, channel)
}
