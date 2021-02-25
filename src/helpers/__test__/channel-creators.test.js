import { castType, channelCreator, createChannelEventHandler, takeChannelCreator } from '../channel-creators';
import EventTargetTransport from '../../event-transport/event-target-transport';
import getTransport from '../../event-transport/get-transport';

// We need to mock EventTarget, because it does not work in jsdom environment.
jest.mock('../../polyfill/event-target', () => {
  const actual = jest.requireActual('../../polyfill/event-target');
  return {
    __esModule: true,
    ...actual,
    default: actual.EventTarget,
  };
});

describe('createChannelEventHandler', () => {
  it('should create channel event handler function.', () => {
    const mockChannel = {
      put: jest.fn(),
    };
    const testContext = 'test';
    const eventHandler = createChannelEventHandler(mockChannel, testContext);
    expect(eventHandler).toBeInstanceOf(Function);
    expect(eventHandler).toHaveLength(1);
    expect(mockChannel.put).not.toHaveBeenCalled();
    eventHandler({ detail: { context: testContext } });
    expect(mockChannel.put).not.toHaveBeenCalled();
    eventHandler({ detail: { context: 'notTest' } });
    expect(mockChannel.put).toHaveBeenCalledTimes(1);
  });
});

describe('castType', () => {
  it('should cast event type to array of types correctly', () => {
    const stringInputType = 'test';
    const arrayTypes = ['test'];
    const allInputType = '*';
    const stringTypes = 'secondTest';
    expect(castType(stringInputType)).toEqual(arrayTypes);
    expect(castType(allInputType, arrayTypes)).toEqual(arrayTypes);
    expect(castType(allInputType, stringTypes)).toEqual([stringTypes]);
  });
});

describe('channelCreator', () => {
  const testTypesArray = ['test', 'secondTest'];
  const notificator = new EventTargetTransport();
  it('should create channel correctly with array types.', async () => {
    const transport = new EventTargetTransport();
    const rightTestType = 'test';
    const channelIterator = channelCreator(testTypesArray, 'test');
    expect(channelIterator).toBeInstanceOf(Function);
    const gen = channelIterator(rightTestType, transport, notificator);
    expect(gen.next().value).toBe(true);
    transport.trigger(rightTestType, { context: 'notTest', type: rightTestType });
    await expect((await gen.next(true)).value).resolves.toEqual({ context: 'notTest', type: rightTestType });
  });
  it('should not register handler for type which does not exists in permitted types of channel.', () => {
    const transport = new EventTargetTransport();
    jest.spyOn(transport, 'on');
    const wrongTestType = 'thirdTest';
    const gen = channelCreator(testTypesArray, 'test')(wrongTestType, transport, notificator);
    gen.next();
    expect(transport.on).not.toHaveBeenCalled();
    transport.trigger(wrongTestType, { context: 'notTest', type: wrongTestType });
    expect(transport.on).not.toHaveBeenCalled();
  });
});

describe('takeChannelCreator', () => {
  const testTypesArray = ['test', 'secondTest'];
  const key = 'testEventChannel';
  const channel = channelCreator(testTypesArray, 'test');
  const takeChannel = takeChannelCreator(key, channel);
  it('should create take channel correctly.', () => {
    expect(takeChannel).toBeInstanceOf(Function);
  });
  it('should start channel and call onchange callback on changes in channel.', async done => {
    const payload = { type: 'test', context: 'notTest' };
    const onchange = jest.fn(async emitter => {
      await expect(emitter()).resolves.toBe(payload);
      done();
    });
    const emitter = await takeChannel('test', onchange);
    const transport = getTransport(key);
    transport.trigger('test', payload);
    expect(onchange).toHaveBeenCalledTimes(2);
    expect(onchange).toHaveBeenNthCalledWith(2, emitter);
  });
  it('should start channel without onchange callback and return messages from channel.', async () => {
    const payload = { type: 'secondTest', context: 'notTest' };
    const emitter = await takeChannel('secondTest');
    const transport = getTransport(key);
    transport.trigger('secondTest', payload);
    await expect(emitter()).resolves.toBe(payload);
  });
});
