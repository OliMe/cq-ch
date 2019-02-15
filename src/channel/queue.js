// @flow
import createEventTarget from '../helpers/event-target-creator'

export default class Queue {
    target: EventTarget
    buffer: Array<any>
    length: number = 0

    /**
     * Instantiate Queue
     *
     * @param {Function | undefined} putCallback
     */
    constructor(putCallback: Function | null = null) {
        this.target = createEventTarget()
        this.buffer = []
        this.length = this.buffer.length
        if (putCallback && typeof putCallback == 'function') {
            this.target.addEventListener('put', putCallback);
        }
    }

    /**
     * Add value to queue
     *
     * @param {any} value
     * @returns {number}
     */
    put(value: any): number {
        const result = this.buffer.push(value)
        this.length = this.buffer.length
        this.target.dispatchEvent(new CustomEvent('put', {
            detail: value,
        }))
        return result
    }

    /**
     * Get value from queue
     *
     * @returns {any}
     */
    take() {
        const result = this.buffer.shift()
        this.length = this.buffer.length
        return result
    }
}
