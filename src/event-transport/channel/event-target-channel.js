// @flow
import { EventTarget as EventTargetShim } from 'event-target-shim'

export default class EventTargetChannel {
    target: EventTarget | EventTargetShim
    /**
     * 
     */
    constructor () {
        this.target = this.createTarget()
    }
    /**
     * @returns {EventTarget|EventTargetShim}
     */
    createTarget (): EventTarget | EventTargetShim {
        let constructor = EventTargetShim
        if (typeof EventTarget === 'function') {
            constructor = EventTarget
        }
        return new constructor
    }
    /**
     * 
     * @param {string} type 
     * @param {Object} payload 
     */
    trigger (type: string, payload: Object): void {
        this.target.dispatchEvent(new CustomEvent (type, {
            detail: payload,
        }));
    }
    /**
     * 
     * @param {string} type 
     * @param {Function} callback 
     */
    on (type: string, callback: Function): void {
        this.target.addEventListener(type, callback);
    }
}
