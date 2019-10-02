export class EventTarget {
  listeners;

  constructor () {
    this.listeners = {};
  }

  addEventListener (eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Map();
    }
    this.listeners[eventName].set(listener, listener);
  }

  removeEventListener (eventName, listener) {
    if (this.listeners[eventName] instanceof Map) {
      this.listeners[eventName].delete(listener);
    }
  }

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
 * @return {Function}
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
