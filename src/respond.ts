import { channelCreator, takeChannelCreator } from './helpers/channel-creators';
import { TYPE_QUERY } from './constants';
import { Context, OutputQuery, Types } from './types';
import { checkChannelCreator } from './helpers/argument-checkers';

/**
 * Declares a channel for processed queries in the service interface.
 * @param types Types of queries for processing.
 * @param context Application context e.g. Namespace of command.
 * @return Function for processing queries from channel.
 */
export default function respond<TResponse>(types: Types, context: Context) {
  checkChannelCreator('respond', types, context);
  const channel = channelCreator<OutputQuery<TResponse>>(types, context);
  return takeChannelCreator<OutputQuery<TResponse>>(TYPE_QUERY, channel)();
}
