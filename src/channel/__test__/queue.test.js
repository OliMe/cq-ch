import Queue from '../queue';
import EventTarget from '../../polyfill/event-target';
import CustomEvent from '../../polyfill/custom-event';

// We need to mock EventTarget, because it does not work in jsdom environment.
jest.mock('../../polyfill/event-target', () => {
  const actual = jest.requireActual('../../polyfill/event-target');
  return {
    __esModule: true,
    ...actual,
    default: actual.EventTarget,
  };
});

describe('Queue', () => {
  it('should create EventTarget instance at instance creation.', () => {
    const queue = new Queue();
    expect(queue.target).toBeInstanceOf(EventTarget);
  });
  it('should create empty buffer at instance creation.', () => {
    const queue = new Queue();
    expect(queue.buffer).toEqual([]);
  });
  it('should set buffer length as queue length', () => {
    const queue = new Queue();
    expect(queue.buffer).toHaveLength(queue.length);
  });
  it('should add event listener to event target for "put" event type', () => {
    const testListener = jest.fn();
    const queue = new Queue(testListener);
    expect(queue.target.listeners.put.size).toBe(1);
    expect(testListener).not.toHaveBeenCalled();
    queue.target.dispatchEvent(new CustomEvent('put'));
    expect(testListener).toHaveBeenCalledTimes(1);
  });
  it('should put value in buffer, change length and dispatch event', () => {
    const testListener = jest.fn();
    const testValue = 123456;
    const queue = new Queue(testListener);
    queue.put(testValue);
    expect(queue).toHaveLength(1);
    expect(queue.buffer[0]).toBe(testValue);
    expect(testListener).toHaveBeenCalledTimes(1);
    expect(testListener).toHaveBeenCalledWith(expect.any(CustomEvent));
  });
  it('should take value from queue, change length and return it if queue is not empty', () => {
    const testValue = 123456;
    const queue = new Queue();
    queue.put(testValue);
    expect(queue).toHaveLength(1);
    expect(queue.take()).toBe(testValue);
    expect(queue).toHaveLength(0);
  });
  it('should return undefined from take, if queue is empty', () => {
    const queue = new Queue();
    expect(queue).toHaveLength(0);
    expect(queue.take()).toBe(undefined);
    expect(queue).toHaveLength(0);
  });
});
