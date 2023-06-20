import { Type, Types } from '../types';

import EventTarget from './polyfill/event-target';

/**
 * Event transport.
 */
export default class EventTargetTransport<T = Record<string, unknown>> {
  target: EventTarget;
  listeners: { [key: Type]: boolean } = {};
  eventQueue: { [key: Type]: Event[] };

  /**
   * Creates instance of EventTargetTransport.
   * @param events Event handlers map.
   */
  constructor(events?: { [key: Type]: EventListener }) {
    this.eventQueue = {};
    this.target = new EventTarget();
    if (events && typeof events === 'object') {
      for (const type in events) {
        this.on(type, events[type]);
      }
    }
  }

  /**
   * Triggers event of passed type.
   * @param type Type of event.
   * @param payload Data.
   */
  trigger(type: Type, payload: T | Record<string, unknown> = {}) {
    const event = new CustomEvent<T | Record<string, unknown>>(type, {
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
   * @param type Type of event.
   * @param callback Callback function.
   */
  on(type: Type | Types, callback: EventListener) {
    const types = typeof type === 'string' ? [type] : type;
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
