// @flow
import { EventTarget as EventTargetShim } from 'event-target-shim'
/**
 * Creates EventTarget instance
 *
 * @returns { EventTarget | EventTargetShim }
 */
export default function createEventTarget(): EventTarget | EventTargetShim {
    let instance
    try {
        instance = new EventTarget()
    } catch (e) {
        instance = new EventTargetShim()
    }
    return instance
}
