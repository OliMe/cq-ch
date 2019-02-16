// @flow
import getTransport from './event-transport/get-transport'
import { TYPE_COMMAND } from './constants'
import { checkArguments } from "./helpers/argument-checker";
import { channelCreatorCfg, commandChannelCfg } from "./arguments.cfg";

type Command = {
    type: string,
}
/**
 * Declares a channel for sent commands in the service interface
 * @param {Array} types Types of commands for sending
 * @param {string} context Application context e.g. namespace of command
 * @returns {Function} Function for sending commands to channel
 */
export default function command(types: Array<string>, context: string): Function {
    checkArguments([types, context], 'command', channelCreatorCfg)
    return (command: Command) => {
        checkArguments([command], 'commandChannel', commandChannelCfg)
        if (!types.includes(command.type)) {
            throw new TypeError('Trying to send command with type not in interface.');
        }
        command = { ...command, context }
        getTransport(TYPE_COMMAND).trigger(command.type, command)
    }
}
