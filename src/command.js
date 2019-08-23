import getTransport from './event-transport/get-transport';
import { TYPE_COMMAND } from './constants';
import { checkArguments } from './helpers/argument-checker';
import { channelCreatorCfg, commandChannelCfg } from './arguments.cfg';

/**
 * Declares a channel for sent commands in the service interface.
 * @param {Array} types Types of commands for sending.
 * @param {string} context Application context e.g. Namespace of command.
 * @return {Function} Function for sending commands to channel.
 */
export default function command (types, context): Function {
  checkArguments([types, context], 'command', channelCreatorCfg);
  return command => {
    checkArguments([command], 'commandChannel', commandChannelCfg);
    if (!types.includes(command.type)) {
      throw new TypeError('Trying to send command with type not in interface.');
    }
    command = { ...command, context };
    getTransport(TYPE_COMMAND).trigger(command.type, command);
  };
}
