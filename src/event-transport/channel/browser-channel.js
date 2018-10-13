// @flow
import TargetWrapper from './target-wrapper'
import { EventTarget as EventTargetShim } from 'event-target-shim'
import { Channel } from '../../types';

export default class BrowserChannel extends TargetWrapper implements Channel {
    target: EventTarget
    /**
     * @returns {EventTarget|EventTargetShim}
     */
    createTarget (): EventTarget {
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
