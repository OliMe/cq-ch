import EventTarget from '../polyfill/event-target';
import CustomEvent from '../polyfill/custom-event';

export default class EventTargetTransport {
  target;
  listeners;
  eventQueue;

  /**
   * Create instance of EventTargetTransport.
   */
  constructor (events) {
    this.listeners = {};
    this.eventQueue = {};
    this.target = new EventTarget();
    if (events && typeof events === 'object') {
      for (const type in events) {
        if (typeof events[type] === 'function') {
          this.on(type, events[type]);
        }
      }
    }
  }

  /**
   *
   * @param {string} type
   * @param {Object} payload
   */
  trigger (type, payload = {}) {
    const event = new CustomEvent(type, {
      detail: payload,
    });
    if (this.listeners[type]) {
      this.target.dispatchEvent(event);
    }
    if (!this.eventQueue[type]) {
      this.eventQueue[type] = [];
    }
    this.eventQueue[type].push(event);
  }

  /**
   *
   * @param {string} type
   * @param {Function} callback
   */
  on (type, callback) {
    type = typeof type === 'string' ? [type] : type;
    if (Array.isArray(type)) {
      type.forEach(type => {
        this.listeners[type] = true;
        this.target.addEventListener(type, callback);
        if (this.eventQueue[type] && this.eventQueue[type].length) {
          this.eventQueue[type].forEach(event => {
            callback(event);
          });
        }
      });
    }
  }
}
