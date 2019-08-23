import getTransport from '../event-transport/get-transport';
import EventTargetTransport from '../event-transport/event-target-transport';
import Channel from '../channel/channel';

/**
 *
 * @param {*} iterator
 * @param {*} notificator
 * @return {Function}
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
 *
 * @param {*} types
 * @param {*} context
 * @return {Function}
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
