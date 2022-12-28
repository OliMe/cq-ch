import { request } from '..';
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
    // TODO Ignore TS errors because for raw JS we need to test argument validation.
    // @ts-ignore
    const createChannelWithoutArguments = () => request();
    // @ts-ignore
    const createChannelWithFirstIncorrectArgument = () => request('not array');
    const createChannelWithFirstArgumentEmptyArray = () => request([], 'test');
    // @ts-ignore
    const createChannelWithoutSecondArgument = () => request(['test_type']);
    // @ts-ignore
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
    // TODO Ignore TS errors because for raw JS we need to test argument validation.
    // @ts-ignore
    await expect(channel()).rejects.toThrowErrorMatchingSnapshot();
    // @ts-ignore
    await expect(channel({})).rejects.toThrowErrorMatchingSnapshot();
    await expect(channel({ type: 'third_type' })).rejects.toThrowErrorMatchingSnapshot();
  });
  it('sends request', () => {
    channel({ type: 'first_type' });
    expect(getTransport).toHaveBeenCalledWith(TYPE_QUERY);
    const { trigger } = getTransport(TYPE_QUERY);
    expect(trigger).toHaveBeenCalledWith('first_type', {
      type: 'first_type',
      context: 'test',
      resolve: expect.any(Function),
    });
  });
  it('receives respond', done => {
    expect.assertions(1);
    const resovedBy = 'test value';
    channel({ type: 'first_type' }).then(value => {
      expect(value).toBe(resovedBy);
      done();
    });
    const { trigger } = getTransport(TYPE_QUERY);
    (trigger as jest.Mock).mock.calls[1][1].resolve(resovedBy);
  });
  it('throws error on wait timeout expires', () => {
    jest.useFakeTimers();
    expect(channel({ type: 'first_type' }, 100)).rejects.toThrowErrorMatchingSnapshot();
    jest.runAllTimers();
  });
});
