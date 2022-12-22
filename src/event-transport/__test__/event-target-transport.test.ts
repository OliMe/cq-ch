import EventTargetTransport from '../event-target-transport';

describe('EventTargetTransport', () => {
  it('should create listeners object, event queue object and event target instance at instance creation', () => {
    const transport = new EventTargetTransport();
    expect(transport.listeners).toEqual({});
    expect(transport.eventQueue).toEqual({});
    expect(transport.target).toBeInstanceOf(EventTarget);
  });
  it('should register passed events correctly at instance creation', () => {
    const listener = (event: Event) => jest.fn(() => event);
    const events = { correct: listener };
    EventTargetTransport.prototype.on = jest.fn(EventTargetTransport.prototype.on);
    const transport = new EventTargetTransport(events);
    expect(transport.listeners.correct).toBe(true);
    expect(transport.on).toHaveBeenCalledTimes(1);
    expect(transport.on).toHaveBeenCalledWith('correct', events.correct);
  });
  it('should trigger events correctly', () => {
    const transport = new EventTargetTransport();
    const testPayload = { test: 'test' };
    const testType = 'correct';
    transport.trigger(testType, testPayload);
    const event = transport.eventQueue[testType][0] as CustomEvent;
    expect(event.type).toBe(testType);
    expect(event.detail).toBe(testPayload);
  });
  it('should register event callback correctly for single event and call it on this event.', () => {
    const transport = new EventTargetTransport();
    const callback = jest.fn();
    const payload = { test: 'test' };
    transport.on('test', callback);
    expect(callback).not.toHaveBeenCalled();
    transport.trigger('test', payload);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].detail).toBe(payload);
  });
  it('should register event callback correctly for multiple event and call it on this events.', () => {
    const transport = new EventTargetTransport();
    const callback = jest.fn();
    const firstPayload = { test: 'test' };
    const secondPayload = { test: 'test1' };
    transport.on(['test1', 'test2'], callback);
    expect(callback).not.toHaveBeenCalled();
    transport.trigger('test1', firstPayload);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].detail).toBe(firstPayload);
    transport.trigger('test2', secondPayload);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback.mock.calls[1][0].detail).toBe(secondPayload);
  });
  it('should call callback at registration when events have been triggered already.', () => {
    const transport = new EventTargetTransport();
    const callback = jest.fn();
    const firstEventType = 'test';
    const secondEventType = 'second_test';
    const firstPayload = { test: 'test' };
    const secondPayload = { test: 'test1' };
    transport.trigger(firstEventType, firstPayload);
    transport.trigger(secondEventType, secondPayload);
    expect(callback).not.toHaveBeenCalled();
    transport.on([firstEventType, secondEventType], callback);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback.mock.calls[0][0].detail).toBe(firstPayload);
    expect(callback.mock.calls[1][0].detail).toBe(secondPayload);
  });
});
