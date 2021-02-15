import Channel from '../channel';
import EventTargetTransport from '../../event-transport/event-target-transport';
import Queue from '../queue';

// We need to mock EventTarget, because it does not work in jsdom environment.
jest.mock('../../polyfill/event-target', () => {
  const actual = jest.requireActual('../../polyfill/event-target');
  return {
    __esModule: true,
    ...actual,
    default: actual.EventTarget,
  };
});

describe('Channel', () => {
  it('should create queues and take notificator of correct type on instance creation.', () => {
    const notificator = new EventTargetTransport();
    const channel = new Channel(notificator);
    expect(channel.puts).toBeInstanceOf(Queue);
    expect(channel.takes).toBeInstanceOf(Queue);
    expect(channel.notificator).toBe(notificator);
  });
  it('should not take notificator of incorrect type.', () => {
    const notificator = {};
    const channel = new Channel(notificator);
    expect(channel.notificator).not.toBe(notificator);
  });
  it('should return value from take on put.', async () => {
    expect.assertions(1);
    const channel = new Channel();
    const value = { test: 5 };
    setTimeout(() => {
      channel.put(value);
    }, 1);
    const received = await channel.take();
    expect(received).toBe(value);
  });
  it('should return value from take if some value already in channel.', async () => {
    expect.assertions(1);
    const channel = new Channel();
    const value = { test: 6 };
    channel.put(value);
    const received = await channel.take();
    expect(received).toBe(value);
  });
  it('should trigger change on notificator, when state of queues changed.', async () => {
    const changeListener = jest.fn();
    const notificator = new EventTargetTransport();
    notificator.on('change', changeListener);
    const channel = new Channel(notificator);
    channel.put(5);
    await channel.take();
    expect(changeListener).toBeCalledTimes(1);
  });
  it('shouldn`t do anything, when was put undefined value.', () => {
    const channel = new Channel();
    jest.spyOn(channel.puts, 'put');
    expect(channel.puts.put).not.toHaveBeenCalled();
    channel.put();
    expect(channel.puts.put).not.toHaveBeenCalled();
  });
});
