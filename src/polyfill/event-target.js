export class EventTargetShim {
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
        this.listeners[eventName].values();
      }
    }
  }
}

/**
 * Choose constructor for EventTarget.
 * @return {Function}
 */
export function getEventTargetConstructor (): Function {
  let constructor;
  try {
    new EventTarget();
    constructor = EventTarget;
  } catch (e) {
    constructor = EventTargetShim;
  }
  return constructor;
}

export default getEventTargetConstructor();
