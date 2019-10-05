import { IS_BROWSER } from '../constants';

/**
 *
 * @param event
 * @param bubbles
 * @param cancelable
 * @param detail
 * @return {CustomEvent}
 */
export const createBrowserEvent = (event, bubbles, cancelable, detail) => {
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
        get () {
          return true;
        },
      });
    } catch (e) {
      this.defaultPrevented = true;
    }
  };
  return evt;
};
/**
 *
 * @param event
 * @param bubbles
 * @param cancelable
 * @param detail
 * @return {{cancelable: *, bubbles: *, detail: *, type: *}}
 */
export const createNodeEvent = (event, bubbles, cancelable, detail) => ({
  type: event,
  bubbles: Boolean(bubbles),
  cancelable: Boolean(bubbles),
  detail,
});

/**
 *
 * @param event
 * @param bubbles
 * @param cancelable
 * @param detail
 * @return {*}
 * @constructor
 */
export function CustomEvent (event, { bubbles, cancelable, detail } = {}) {
  return (IS_BROWSER ? createBrowserEvent : createNodeEvent)(event, bubbles, cancelable, detail);
}

if (IS_BROWSER) {
  CustomEvent.prototype = window.Event.prototype;
}

/**
 *
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
