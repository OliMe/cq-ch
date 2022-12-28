import { channelCreator, takeChannelCreator } from './helpers/channel-creators';
import { TYPE_COMMAND } from './constants';
import { checkChannelCreator } from './helpers/argument-checkers';
import { Context, Message, Take, Types } from './types';

/**
 * Declares a channel for processed commands in the service interface.
 * @param types Types of processed commands.
 * @param context Application context e.g. Namespace of command.
 * @return Function for receiving commands from channel.
 */
export default function execute(
  types: Types,
  context: Context,
): Take<undefined, Message<undefined>> {
  checkChannelCreator('execute', types, context);
  const channel = channelCreator<Message<undefined>>(types, context);
  return takeChannelCreator<Message<undefined>>([TYPE_COMMAND], channel)();
}
