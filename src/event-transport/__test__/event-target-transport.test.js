import EventTargetTransport from '../event-target-transport';
import EventTarget from '../../polyfill/event-target';

// We need to mock EventTarget, because it does not work in jsdom environment.
jest.mock('../../polyfill/event-target', () => {
  const actual = jest.requireActual('../../polyfill/event-target');
  return {
    __esModule: true,
    ...actual,
    default: actual.EventTarget,
  };
});

describe('EventTargetTransport', () => {
  it('should create listeners object, event queue object and event target instance at instance creation',
    () => {
      const transport = new EventTargetTransport();
      expect(transport.listeners).toEqual({});
      expect(transport.eventQueue).toEqual({});
      expect(transport.target).toBeInstanceOf(EventTarget);
    });
  it('should register passed events correctly at instance creation', () => {
    const events = { correct: jest.fn(), incorrect: 'test' };
    const transport = new EventTargetTransport(events);
    expect(transport.listeners.correct).toBe(true);
    expect(transport.listeners.incorrect).toBe(undefined);
    expect(transport.target.listeners.correct.get(events.correct)).toBe(events.correct);
  });
  it('should trigger events correctly', () => {
    const transport = new EventTargetTransport();
    const testPayload = { test: 'test' };
    const testType = 'correct';
    transport.trigger(testType, testPayload);
    expect(transport.eventQueue[testType][0].type).toBe(testType);
    expect(transport.eventQueue[testType][0].detail).toBe(testPayload);
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
  it('shouldn`t register callback when event type argument is not string or array', () => {
    const transport = new EventTargetTransport();
    const callback = jest.fn();
    transport.on({}, callback);
    expect(callback).not.toHaveBeenCalled();
    transport.trigger({});
    expect(callback).not.toHaveBeenCalled();
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
