/**
 * EventTarget polyfill.
 */
export class EventTarget {
  listeners;

  /**
   * EventTarget polyfill constructor.
   */
  constructor () {
    this.listeners = {};
  }

  /**
   * Adds event listener.
   * @param {string} eventName Name of event.
   * @param {Function} listener Event listener.
   */
  addEventListener (eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Map();
    }
    this.listeners[eventName].set(listener, listener);
  }

  /**
   * Removes event listener.
   * @param {string} eventName Name of event.
   * @param {Function} listener Event listener.
   */
  removeEventListener (eventName, listener) {
    if (this.listeners[eventName] instanceof Map) {
      this.listeners[eventName].delete(listener);
    }
  }

  /**
   * Dispatches event.
   * @param {Event} event Event.
   */
  dispatchEvent (event) {
    if (event instanceof Event) {
      const eventName = event.type;
      if (this.listeners[eventName] instanceof Map) {
        this.listeners[eventName].forEach(listener => listener(event));
      }
    }
  }
}

/**
 * Choose constructor for EventTarget.
 * @return {Function} EventTarget constructor.
 */
export function getEventTargetConstructor () {
  let constructor;
  try {
    new window.EventTarget();
    constructor = window.EventTarget;
  } catch (e) {
    constructor = EventTarget;
  }
  return constructor;
}

export default getEventTargetConstructor();
