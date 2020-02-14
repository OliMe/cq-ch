import EventTargetTransport from './event-target-transport';
import { IS_BROWSER } from '../constants';

/**
 * Creates or returns existing event transport instance.
 * @param {string} type Type of event transport.
 * @return {EventTargetTransport} Event transport instance.
 */
export default function getTransport (type) {
  const globalThis = IS_BROWSER ? window : global;
  if (typeof globalThis.CQChannels === 'undefined') {
    globalThis.CQChannels = {};
  }
  if (typeof globalThis.CQChannels[type] === 'undefined') {
    globalThis.CQChannels[type] = new EventTargetTransport;
  }

  return globalThis.CQChannels[type];
}
