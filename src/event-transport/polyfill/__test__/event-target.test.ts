import { EventTargetPolyfill, getEventTargetConstructor } from '../event-target';

describe('EventTarget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create instance of EventTarget.', () => {
    const eventTarget = new EventTargetPolyfill();
    expect(eventTarget).toBeInstanceOf(EventTargetPolyfill);
  });
  it('should add event listeners and call them on event dispatch.', () => {
    const eventTarget = new EventTargetPolyfill();
    const testListener = jest.fn();
    const testEvent = new CustomEvent('test');
    eventTarget.addEventListener('test', testListener);
    eventTarget.dispatchEvent(testEvent);
    expect(testListener).toHaveBeenCalledTimes(1);
    expect(testListener).toHaveBeenCalledWith(testEvent);
    const anotherTestListener = jest.fn();
    eventTarget.addEventListener('test', { handleEvent: anotherTestListener });
    eventTarget.dispatchEvent(testEvent);
    expect(testListener).toHaveBeenCalledTimes(2);
    expect(anotherTestListener).toHaveBeenCalledTimes(1);
    expect(anotherTestListener).toHaveBeenCalledWith(testEvent);
  });
  it('should not call event listener registered for one type o event if dispatches event with another type.', () => {
    const eventTarget = new EventTargetPolyfill();
    const testListener = jest.fn();
    const testEvent = new CustomEvent('test-2');
    eventTarget.addEventListener('test', testListener);
    eventTarget.dispatchEvent(testEvent);
    expect(testListener).not.toHaveBeenCalled();
  });
  it('should remove event listeners.', () => {
    jest.spyOn(window.Map.prototype, 'delete');
    const eventTarget = new EventTargetPolyfill();
    const testListener = jest.fn();
    const testEvent = new CustomEvent('test');
    eventTarget.addEventListener('test', testListener);
    eventTarget.dispatchEvent(testEvent);
    expect(testListener).toHaveBeenCalledTimes(1);
    expect(testListener).toHaveBeenCalledWith(testEvent);
    eventTarget.removeEventListener('test', testListener);
    expect(window.Map.prototype.delete).toHaveBeenCalledTimes(1);
    expect(window.Map.prototype.delete).toHaveBeenCalledWith(testListener);
    eventTarget.dispatchEvent(testEvent);
    expect(testListener).toHaveBeenCalledTimes(1);
  });
  it('should not remove event listener if it is not added.', () => {
    jest.spyOn(window.Map.prototype, 'delete');
    const eventTarget = new EventTargetPolyfill();
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
    (window.EventTarget as jest.Mock).mockImplementation(function EventTarget() {
      throw new Error('test');
    });
    const EventTarget = getEventTargetConstructor();
    expect(new EventTarget()).toBeInstanceOf(EventTargetPolyfill);
  });
});
