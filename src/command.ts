import getTransport from './event-transport/get-transport';
import { TYPE_COMMAND } from './constants';
import { Context, Message, Types } from './types';
import { checkChannelCreator, checkCommandChannel } from './helpers/argument-checkers';

/**
 * Declares a channel for sent commands in the service interface.
 * @param {Array} types Types of commands for sending.
 * @param {string} context Application context e.g. Namespace of command.
 * @return {Function} Function for sending commands to channel.
 */
export default function command(types: Types, context: Context) {
  checkChannelCreator(command.name, types, context);
  return async function commandChannel(command: Message<undefined>) {
    checkCommandChannel(commandChannel.name, command);
    if (!types.includes(command.type)) {
      throw new TypeError('Trying to send command with type not in interface.');
    }
    const extendedCommand = { ...command, context };
    getTransport(TYPE_COMMAND).trigger(extendedCommand.type, extendedCommand);
  };
}
