//@flow

const listeners = new WeakMap();

export class EventTargetShim {
    addEventListener(eventName: String, listener: Function | Object, options: Object) {

    }
    removeEventListener(eventName: String, listener: Function | Object, options: Object) {

    }
    dispatchEvent(event: Event) {

    }
}

/**
 * Choose constructor for EventTarget
 * @returns {Function}
 */
export function getEventTargetConstructor(): Function {
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
