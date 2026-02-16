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
    // @ts-expect-error Ignore TS errors because for raw JS we need to test argument validation.
    const createChannelWithoutArguments = () => request();
    // @ts-expect-error Same as above.
    const createChannelWithFirstIncorrectArgument = () => request('not array');
    const createChannelWithFirstArgumentEmptyArray = () => request([], 'test');
    // @ts-expect-error Same as above.
    const createChannelWithoutSecondArgument = () => request(['test_type']);
    // @ts-expect-error Same as above.
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
    // @ts-expect-error Ignore TS errors because for raw JS we need to test argument validation.
    await expect(channel()).rejects.toThrowErrorMatchingSnapshot();
    // @ts-expect-error Same as above.
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
      timestamp: expect.any(Number),
    });
  });
  it('receives respond', async () => {
    const resovedBy = 'test value';
    setTimeout(() => {
      const { trigger } = getTransport(TYPE_QUERY);
      (trigger as jest.Mock).mock.calls[1][1].resolve(resovedBy);
    }, 0);
    const result = await channel({ type: 'first_type' });
    expect(result).toBe(resovedBy);
  });
  it('throws error on wait timeout expires', async () => {
    await expect(channel({ type: 'first_type' }, 5)).rejects.toMatchSnapshot();
  });
});
