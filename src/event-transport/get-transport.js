import EventTargetTransport from './event-target-transport';

/**
 *
 * @param {Function} type
 * @return {EventTargetTransport}
 */
export default function getTransport (type) {
  if (typeof window.CQChannels === 'undefined') {
    window.CQChannels = {};
  }
  if (typeof window.CQChannels[type] === 'undefined') {
    window.CQChannels[type] = new EventTargetTransport;
  }

  return window.CQChannels[type];
}
