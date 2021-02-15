import { IS_BROWSER } from '../constants';

/**
 * CustomEvent constructor.
 * @param {string} event Event type.
 * @param {Object} params Parameters of created event.
 * @param {boolean} params.bubbles Does it bubbles?
 * @param {boolean} params.cancelable Does it cancelable?
 * @param {Object} params.detail Additional data.
 * @return {Event} Event.
 * @constructor
 */
export function CustomEvent (event, { bubbles, cancelable, detail } = {}) {
  const evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(
    event,
    Boolean(bubbles),
    Boolean(cancelable),
    detail
  );
  const origPrevent = evt.preventDefault;
  evt.preventDefault = function () {
    origPrevent.call(this);
    try {
      Object.defineProperty(this, 'defaultPrevented', {
        /**
         * Getter for 'defaultPrevented' property.
         * @return {boolean} Value of property.
         */
        get () {
          return true;
        },
      });
    } catch (e) {
      evt.defaultPrevented = true;
    }
  };
  return evt;
}

if (IS_BROWSER) {
  CustomEvent.prototype = window.Event.prototype;
}

/**
 * Choose constructor for CustomEvent.
 * @return {Function} CustomEvent constructor.
 */
export function getCustomEventConstructor () {
  let constructor;
  try {
    new window.CustomEvent('test');
    constructor = window.CustomEvent;
  } catch (e) {
    constructor = CustomEvent;
  }
  return constructor;
}

export default getCustomEventConstructor();
