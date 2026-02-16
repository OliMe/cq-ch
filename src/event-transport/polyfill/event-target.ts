/**
 * EventTarget polyfill.
 */
export class EventTargetPolyfill implements EventTarget {
  protected _listeners: Record<
    string,
    Map<EventListenerOrEventListenerObject, EventListenerOrEventListenerObject>
  >;
  /**
   * EventTarget polyfill constructor.
   */
  constructor() {
    this._listeners = {};
  }

  /**
   * @inheritdoc
   */
  addEventListener(type: string, callback: EventListenerOrEventListenerObject): void {
    if (!this._listeners[type]) {
      this._listeners[type] = new Map();
    }
    this._listeners[type].set(callback, callback);
  }

  /**
   * @inheritdoc
   */
  dispatchEvent(event: Event): boolean {
    const eventName = event.type;
    this._listeners[eventName]?.forEach(listener => {
      'handleEvent' in listener ? listener.handleEvent(event) : listener(event);
    });

    return true;
  }

  /**
   * @inheritdoc
   */
  removeEventListener(type: string, callback: EventListenerOrEventListenerObject): void {
    if (this._listeners[type]) {
      this._listeners[type].delete(callback);
    }
  }
}

/**
 * Choose constructor for EventTarget.
 * @return {Function} EventTarget constructor.
 */
export function getEventTargetConstructor() {
  let constructor;
  try {
    new window.EventTarget();
    constructor = window.EventTarget;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    constructor = EventTargetPolyfill;
  }
  return constructor;
}

export default getEventTargetConstructor();
