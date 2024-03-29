import getTransport from './event-transport/get-transport';
import { TYPE_QUERY } from './constants';
import { Context, Message, Types } from './types';
import { checkChannelCreator, checkRequestChannel } from './helpers/argument-checkers';

/**
 * Declares a channel for sent queries in the service interface.
 * @param types Types of queries for sending.
 * @param context Application context e.g. Namespace of command.
 * @return Function for sending queries to channel.
 */
export default function request(types: Types, context: Context) {
  checkChannelCreator('request', types, context);
  return async function requestChannel<TResponse = Exclude<any, undefined>>(
    query: Message<TResponse>,
    time = 200,
  ) {
    checkRequestChannel('requestChannel', query, time);
    if (!types.includes(query.type)) {
      throw new TypeError('Trying to send query with type not in interface.');
    }
    return await new Promise((resolve: (value: TResponse) => void, reject) => {
      const timeout = setTimeout(() => {
        reject(
          `Time to answer exhausted. Message type: ${query.type}, request context: ${context}.`,
        );
      }, time);
      const extendedQuery: Message<TResponse> = {
        ...query,
        context,
        timestamp: Date.now(),
        resolve: (value: TResponse) => {
          clearTimeout(timeout);
          resolve(value);
        },
      };
      getTransport(TYPE_QUERY).trigger(extendedQuery.type, extendedQuery);
    });
  };
}
