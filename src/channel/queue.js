import EventTarget from '../polyfill/event-target';
import CustomEvent from '../polyfill/custom-event';

export default class Queue {
    target;
    buffer;
    length = 0;

    /**
     * Instantiate Queue.
     * @param {Function | undefined} putCallback
     */
    constructor (putCallback = null) {
      this.target = new EventTarget();
      this.buffer = [];
      this.length = this.buffer.length;
      if (putCallback && typeof putCallback === 'function') {
        this.target.addEventListener('put', putCallback);
      }
    }

    /**
     * Add value to queue.
     * @param {*} value
     * @return {number}
     */
    put (value) {
      const result = this.buffer.push(value);
      this.length = this.buffer.length;
      this.target.dispatchEvent(new CustomEvent('put', {
        detail: value,
      }));
      return result;
    }

    /**
     * Get value from queue.
     * @return {*}
     */
    take () {
      const result = this.buffer.shift();
      this.length = this.buffer.length;
      return result;
    }
}
