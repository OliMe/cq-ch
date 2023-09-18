import getTransport from './event-transport/get-transport';
import { TYPE_COMMAND } from './constants';
import { Context, Message, Send, Types } from './types';
import { checkChannelCreator, checkCommandChannel } from './helpers/argument-checkers';

/**
 * Declares a channel for sent commands in the service interface.
 * @param types Types of commands for sending.
 * @param context Application context e.g. Namespace of command.
 * @return Function for sending commands to channel.
 */
export default function command(
  types: Types,
  context: Context,
): Send<undefined, Message<undefined>> {
  checkChannelCreator(command.name, types, context);
  return async function commandChannel(command: Message<undefined>) {
    checkCommandChannel(commandChannel.name, command);
    if (!types.includes(command.type)) {
      throw new TypeError('Trying to send command with type not in interface.');
    }
    const extendedCommand = { ...command, context, timestamp: Date.now() };
    getTransport(TYPE_COMMAND).trigger(extendedCommand.type, extendedCommand);
  };
}
