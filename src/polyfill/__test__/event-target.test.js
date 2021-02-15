import { EventTarget as PolyfillEventTarget, getEventTargetConstructor } from '../event-target';

describe('EventTarget', () => {
  it('should create instance of EventTarget.', () => {
    const eventTarget = new PolyfillEventTarget();
    expect(eventTarget).toBeInstanceOf(PolyfillEventTarget);
    expect(eventTarget.listeners).toBeInstanceOf(Object);
  });
  it('should add event listeners and call them on event dispatch.', () => {
    const eventTarget = new PolyfillEventTarget();
    const testListener = jest.fn();
    const testEvent = new CustomEvent('test');
    eventTarget.addEventListener('test', testListener);
    eventTarget.dispatchEvent(testEvent);
    expect(testListener).toHaveBeenCalledTimes(1);
    expect(testListener).toBeCalledWith(testEvent);
    const anotherTestListener = jest.fn();
    eventTarget.addEventListener('test', anotherTestListener);
    eventTarget.dispatchEvent(testEvent);
    expect(testListener).toHaveBeenCalledTimes(2);
    expect(anotherTestListener).toHaveBeenCalledTimes(1);
    expect(anotherTestListener).toBeCalledWith(testEvent);
  });
  it('should not dispatch event and call event listeners if event is not instance of EventTarget', () => {
    const eventTarget = new PolyfillEventTarget();
    const testListener = jest.fn();
    eventTarget.addEventListener('test', testListener);
    eventTarget.dispatchEvent('test');
    expect(testListener).not.toHaveBeenCalled();
  });
  it('should not call event listener registered for one type o event if dispatches event with another type.',
    () => {
      const eventTarget = new PolyfillEventTarget();
      const testListener = jest.fn();
      const testEvent = new CustomEvent('test-2');
      eventTarget.addEventListener('test', testListener);
      eventTarget.dispatchEvent(testEvent);
      expect(testListener).not.toHaveBeenCalled();
    });
  it('should remove event listeners.', () => {
    jest.spyOn(window.Map.prototype, 'delete');
    const eventTarget = new PolyfillEventTarget();
    const testListener = jest.fn();
    const testEvent = new CustomEvent('test');
    eventTarget.addEventListener('test', testListener);
    eventTarget.dispatchEvent(testEvent);
    expect(testListener).toHaveBeenCalledTimes(1);
    expect(testListener).toBeCalledWith(testEvent);
    eventTarget.removeEventListener('test', testListener);
    expect(window.Map.prototype.delete).toHaveBeenCalledTimes(1);
    expect(window.Map.prototype.delete).toHaveBeenCalledWith(testListener);
    eventTarget.dispatchEvent(testEvent);
    expect(testListener).toHaveBeenCalledTimes(1);
  });
  it('should not remove event listener if it is not added.', () => {
    jest.spyOn(window.Map.prototype, 'delete');
    const eventTarget = new PolyfillEventTarget();
    const testListener = jest.fn();
    eventTarget.removeEventListener('test', testListener);
    expect(window.Map.prototype.delete).not.toHaveBeenCalled();
  });
});

describe('getEventTargetConstructor', () => {
  it('should return native EventTarget if it defined.', () => {
    const EventTarget = getEventTargetConstructor();
    expect(new EventTarget()).toBeInstanceOf(window.EventTarget);
  });
  it('should return polyfill version of EventTarget if native is not defined.', () => {
    jest.spyOn(window, 'EventTarget');
    window.EventTarget.mockImplementation(function EventTarget () {
      throw new Error('test');
    });
    const EventTarget = getEventTargetConstructor();
    expect(new EventTarget('test')).toBeInstanceOf(PolyfillEventTarget);
  });
});
