// @flow
import { channelCreator, takeChannelCreator } from './helpers/channel-creators'
import { TYPE_COMMAND } from './constants'
import { checkArguments } from "./helpers/argument-checker";
import { channelCreatorCfg } from "./arguments.cfg";
/**
 * Declares a channel for processed commands in the service interface
 * @param {Array} types Types of processed commands
 * @param {string} context Application context e.g. namespace of command
 * @returns {Function} Function for receiving commands from channel
 */
export default function execute(types: Array<string>, context: string): Function {
    checkArguments([types, context],'execute', channelCreatorCfg)
    const channel = channelCreator(types, context)
    return takeChannelCreator(TYPE_COMMAND, channel)
}
