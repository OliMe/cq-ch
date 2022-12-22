import { channelCreator, takeChannelCreator } from './helpers/channel-creators';
import { TYPE_COMMAND } from './constants';
import { checkChannelCreator } from './helpers/argument-checkers';
import { Context, OutputMessage, Types } from './types';

/**
 * Declares a channel for processed commands in the service interface.
 * @param types Types of processed commands.
 * @param context Application context e.g. Namespace of command.
 * @return Function for receiving commands from channel.
 */
export default function execute(types: Types, context: Context) {
  checkChannelCreator('execute', types, context);
  const channel = channelCreator<OutputMessage<undefined>>(types, context);
  return takeChannelCreator<OutputMessage<undefined>>(TYPE_COMMAND, channel)();
}
