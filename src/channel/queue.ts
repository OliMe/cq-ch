/**
 * Queue.
 */
export default class Queue<T> {
  target: EventTarget;
  buffer: T[];
  length = 0;

  /**
   * Instantiate Queue.
   * @param putCallback Callback for adding in queue event.
   */
  constructor(putCallback: EventListener | null = null) {
    this.target = new EventTarget();
    this.buffer = [];
    this.length = this.buffer.length;
    if (putCallback && typeof putCallback === 'function') {
      this.target.addEventListener('put', putCallback);
    }
  }

  /**
   * Add value to queue.
   * @param value Element for add.
   * @return Index of added element.
   */
  put(value: T) {
    const result = this.buffer.push(value);
    this.length = this.buffer.length;
    this.target.dispatchEvent(
      new CustomEvent('put', {
        detail: value,
      }),
    );
    return result;
  }

  /**
   * Get value from queue.
   * @return Element.
   */
  take(): T | undefined {
    const result = this.buffer.shift();
    this.length = this.buffer.length;
    return result;
  }
}
