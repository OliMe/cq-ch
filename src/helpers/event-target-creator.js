// @flow
import { EventTarget as EventTargetShim } from 'event-target-shim'
/**
 * Creates EventTarget instance
 * 
 * @returns { EventTarget | EventTargetShim }
 */
export default function createEventTarget(): EventTarget | EventTargetShim {
    let constructor = EventTargetShim
    if (typeof EventTarget === 'function') {
        constructor = EventTarget
    }
    return new constructor
}