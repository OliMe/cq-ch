// @flow
import createEventTarget from '../helpers/event-target-creator'

export default class EventTargetTransport {
    target: EventTarget
    listeners: Object
    eventQueue: Object
    /**
     * Create instance of EventTargetTransport
     */
    constructor() {
        this.listeners = {}
        this.eventQueue = {}
        this.target = createEventTarget()
    }
    /**
     * 
     * @param {string} type 
     * @param {Object} payload 
     */
    trigger(type: string, payload: Object): void {
        const event = new CustomEvent(type, {
            detail: payload,
        });
        if (this.listeners[type]) {
            this.target.dispatchEvent(event)
        }
        if (!this.eventQueue[type]) {
            this.eventQueue[type] = []
        }
        this.eventQueue[type].push(event)
    }
    /**
     * 
     * @param {string} type 
     * @param {Function} callback 
     */
    on(type: string | Array<string>, callback: Function): void {
        type = (typeof type === 'string' ? [type] : type)
        if (Array.isArray(type)) {
            type.forEach(type => {
                this.listeners[type] = true
                this.target.addEventListener(type, callback)
                if (this.eventQueue[type] && this.eventQueue[type].length) {
                    this.eventQueue[type].forEach(event => {
                        callback(event)
                    })
                }
            })
        }
    }
}
