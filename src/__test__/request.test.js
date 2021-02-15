import request from '../request';
import getTransport from '../event-transport/get-transport';
import { TYPE_QUERY } from '../constants';

jest.mock('../event-transport/get-transport', () => {
  const trigger = jest.fn();
  return jest.fn(() => ({
    trigger,
  }));
});

describe('request', () => {
  it('creates channel successfully.', () => {
    expect(request(['test_type'], 'test')).toBeInstanceOf(Function);
  });
  it('creates channel unsuccessfully.', () => {
    const createChannelWithoutArguments = () => request();
    const createChannelWithFirstIncorrectArgument = () => request('not array');
    const createChannelWithFirstArgumentEmptyArray = () => request([], 'test');
    const createChannelWithoutSecondArgument = () => request(['test_type']);
    const createChannelWithSecondIncorrectArgument = () => request(['test_type'], 200);
    expect(createChannelWithoutArguments).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstIncorrectArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstArgumentEmptyArray).toThrowErrorMatchingSnapshot();
    expect(createChannelWithoutSecondArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithSecondIncorrectArgument).toThrowErrorMatchingSnapshot();
  });
});

describe('created by request function', () => {
  const channel = request(['first_type', 'second_type'], 'test');
  it('throws error when incorrect arguments passed', async () => {
    await expect(channel()).rejects.toThrowErrorMatchingSnapshot();
    await expect(channel({})).rejects.toThrowErrorMatchingSnapshot();
    await expect(channel({ type: 'third_type' })).rejects.toThrowErrorMatchingSnapshot();
  });
  it('sends request', () => {
    channel({ type: 'first_type' });
    expect(getTransport).toHaveBeenCalledWith(TYPE_QUERY);
    const { trigger } = getTransport();
    expect(trigger).toHaveBeenCalledWith('first_type', {
      type: 'first_type',
      context: 'test',
      resolve: expect.any(Function),
    });
  });
  it('receives respond', () => {
    expect.assertions(1);
    const resovedBy = 'test value';
    channel({ type: 'first_type' }).then(value => {
      expect(value).toBe(resovedBy);
    });
    const { trigger } = getTransport();
    trigger.mock.calls[0][1].resolve(resovedBy);
  });
  it('throws error on wait timeout expires', () => {
    jest.useFakeTimers();
    expect(channel({ type: 'first_type' }, 100)).rejects.toThrowErrorMatchingSnapshot();
    jest.runAllTimers();
  });
});
