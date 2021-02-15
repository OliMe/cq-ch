import getTransport from '../event-transport/get-transport';
import EventTargetTransport from '../event-transport/event-target-transport';
import Channel from '../channel/channel';
import isTypeInTypes from './is-type-in-types';

/**
 * @typedef {{ next: function(*):* }} Iterator Iterator.
 */

/**
 * Creates emitter for start channel.
 * @param {Iterator} iterator Event channel.
 * @param {EventTarget} notificator EventTarget for notify about new event in channel.
 * @param {Function|null} onchange A callback function to handle a new event in a channel.
 * @return {Function} Async function for channel initializing.
 */
function channelEmitterCreator (iterator, notificator, onchange) {
  let initialized = false;

  /**
   * Function for receiving events from channel.
   * @param {Function} onchange Callback for notification on event in channel.
   * @return {Promise<Function|{type: string|symbol}>} Function for take event from channel or event.
   */
  const emitter = async function (onchange = null) {
    initialized = !initialized ? iterator.next() : initialized;
    if (typeof onchange === 'function') {
      /**
       * Change in channel event handler.
       */
      const callback = () => {
        onchange(emitter);
      };
      callback();
      notificator.on('change', callback);
      return emitter;
    }
    return (await iterator.next(initialized)).value;
  };
  return typeof onchange === 'function' ? emitter(onchange) : emitter;
}

/**
 * Creates partially applied function for handling event in channel.
 * @param {Channel} channel Channel with filtered events.
 * @param {symbol|string} context Identifier of place where event was emitted.
 * @return {function({detail:{type: string|symbol, context: string|symbol}}):undefined} Handler function.
 */
export const createChannelEventHandler = (channel, context) => ({ detail: action }) => {
  if (action.context && action.context !== context) {
    channel.put(action);
  }
};

/**
 * Cast event type to Array.
 * @param {string|Array<string|symbol>} inputType Input type of event.
 * @param {string|Array<string|symbol>} types List of filtered event types.
 * @return {Array<string|symbol>} Type in Array format.
 */
export const castType = (inputType, types) => {
  let resultType = [inputType];
  if (inputType === '*') {
    resultType = types;
    if (typeof resultType === 'string' || typeof resultType === 'symbol') {
      resultType = [types];
    }
  }
  return resultType;
};

/**
 * Creates partially applied generator function for picking events from main stream through channel.
 * @param {Array<symbol|string>|string} types List of filtered event types.
 * @param {symbol|string} context Identifier of place where event was emitted.
 * @return {Function} Generator function for picking filtered events.
 */
export function channelCreator (types, context) {
  return function* (
    type,
    transport,
    notificator
  ) {
    const queue = new Channel(notificator);
    const handledType = castType(type, types);
    if (isTypeInTypes(handledType, types)) {
      const channelEventHandler = createChannelEventHandler(queue, context);
      transport.on(handledType, channelEventHandler);
    }
    const initialized = yield true;
    while (initialized) {
      yield queue.take();
    }
  };
}

/**
 * Creates picking function for receiving events from channel.
 * @param {Array|string} key Event types.
 * @param {Generator} channel Events generator for picking events from queue.
 * @return {Function} Function for picking events from channel.
 */
export function takeChannelCreator (key, channel) {
  return (type = '*', onchange = null) => {
    const notificator = new EventTargetTransport();
    const iterator = channel(type, getTransport(key), notificator);
    return channelEmitterCreator(iterator, notificator, onchange);
  };
}
