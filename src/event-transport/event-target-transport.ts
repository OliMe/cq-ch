import { Type, Types } from '../types';

/**
 * Event transport.
 */
export default class EventTargetTransport<T = {}> {
  target: EventTarget;
  listeners: { [key: Type]: boolean } = {};
  eventQueue: { [key: Type]: Event[] };

  /**
   * Creates instance of EventTargetTransport.
   * @param {Object} events Event handlers map.
   */
  constructor(events?: { [key: Type]: EventListener }) {
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
   * Triggers event of passed type.
   * @param {string} type Type of event.
   * @param {Object} payload Data.
   */
  trigger(type: Type, payload: T | {} = {}) {
    const event = new CustomEvent<T | {}>(type, {
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
   * Adds handler for event of passed type.
   * @param {string} type Type of event.
   * @param {Function} callback Callback function.
   */
  on(type: Type | Types, callback: EventListener) {
    const types = typeof type === 'string' ? [type] : type;
    if (Array.isArray(types)) {
      types.forEach(type => {
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
