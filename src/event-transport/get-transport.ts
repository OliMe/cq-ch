import EventTargetTransport from './event-target-transport';
import { IS_BROWSER } from '../constants';
import { Message } from '../types';

declare global {
  // eslint-disable-next-line no-var
  var CQChannels:
    | {
        [key: string]: EventTargetTransport<Message<unknown>>;
      }
    | undefined;
}

/**
 * Creates or returns existing event transport instance.
 * @param type Type of event transport.
 * @return Event transport instance.
 */
export default function getTransport(type: string) {
  const globalThis = IS_BROWSER ? window : global;
  if (typeof globalThis.CQChannels === 'undefined') {
    globalThis.CQChannels = {};
  }
  if (typeof globalThis.CQChannels[type] === 'undefined') {
    globalThis.CQChannels[type] = new EventTargetTransport<Message<unknown>>();
  }

  return globalThis.CQChannels[type];
}
