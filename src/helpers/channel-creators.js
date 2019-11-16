import getTransport from '../event-transport/get-transport';
import EventTargetTransport from '../event-transport/event-target-transport';
import Channel from '../channel/channel';

/**
 * Creates emitter for start channel.
 * @param {Iterable} iterator Event channel.
 * @param {EventTarget} notificator EventTarget for notify about new event in channel.
 * @param {Function|null} onchange A callback function to handle a new event in a channel.
 * @return {Function} Async function for channel initializing.
 */
function channelEmitterCreator (iterator, notificator, onchange = null) {
  let initialized = false;
  const emitter = async function (onchange = null) {
    initialized = !initialized ? iterator.next() : initialized;
    if (typeof onchange === 'function') {
      const callback = () => onchange(emitter) ? callback : callback;
      notificator.on('change', callback());
      return emitter;
    }
    return (await iterator.next(initialized)).value;
  };
  return typeof onchange === 'function' ? emitter(onchange) : emitter;
}

/**
 * Creates partially applied generator function for picking events from main stream through channel.
 * @param {Array|string} types List of filtered event types.
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
    type = type === '*' ? types : type;
    type = typeof type === 'string' ? [type] : type;
    Array.isArray(type)
    && type.every(type => types.includes(type))
    && transport.on(type, ({ detail: action }) => {
      if (action.context && action.context !== context) {
        queue.put(action);
      }
    });
    const initialized = yield true;
    while (initialized) {
      yield queue.take();
    }
  };
}

/**
 *
 * @param {*} key
 * @param {*} channel
 * @return {Function}
 */
export function takeChannelCreator (key, channel) {
  return (type = '*', onchange = null) => {
    const notificator = new EventTargetTransport();
    const iterator = channel(type, getTransport(key), notificator);
    return channelEmitterCreator(iterator, notificator, onchange);
  };
}
