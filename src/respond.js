import { channelCreator, takeChannelCreator } from './helpers/channel-creators';
import { TYPE_QUERY } from './constants';
import { checkArguments } from './helpers/argument-checker';
import { channelCreatorCfg } from './arguments.cfg';

/**
 * Declares a channel for processed queries in the service interface.
 * @param {Array} types Types of queries for processing.
 * @param {string} context Application context e.g. Namespace of command.
 * @return {Function} Function for processing queries from channel.
 */
export default function respond (types, context) {
  checkArguments([types, context], 'respond', channelCreatorCfg);
  const channel = channelCreator(types, context);
  return takeChannelCreator(TYPE_QUERY, channel);
}
