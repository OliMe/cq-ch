import { channelCreator, takeChannelCreator } from './helpers/channel-creators';
import { TYPE_COMMAND, TYPE_QUERY } from './constants';
import { checkChannelCreator } from './helpers/argument-checkers';
import { Context, Message, Take, Types } from './types';

/**
 * Declares a channel for processed commands and queries in the service interface.
 * @param types Types of processed commands or queries.
 * @param context Application context e.g. Namespace of commands and queries.
 * @return Function for receiving commands and queries from channel.
 */
export default function take<TResponse = unknown>(
  types: Types,
  context: Context,
): Take<TResponse, Message<TResponse>> {
  checkChannelCreator('take', types, context);
  const channel = channelCreator<Message<TResponse>>(types, context);
  return takeChannelCreator<Message<TResponse>>([TYPE_COMMAND, TYPE_QUERY], channel)();
}
