import EventTargetTransport from './event-target-transport';
import { IS_BROWSER } from '../constants';

/**
 *
 * @param {Function} type
 * @return {EventTargetTransport}
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
