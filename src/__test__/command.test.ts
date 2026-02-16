import { command } from '..';
import getTransport from '../event-transport/get-transport';
import { TYPE_COMMAND } from '../constants';

jest.mock('../event-transport/get-transport', () => {
  const trigger = jest.fn();
  return jest.fn(() => ({
    trigger,
  }));
});

describe('command', () => {
  it('creates channel successfully', () => {
    expect(command(['test_type'], 'test')).toBeInstanceOf(Function);
  });
  it('creates channel unsuccessfully', () => {
    // @ts-expect-error Ignore TS errors because for raw JS we need to test argument validation.
    const createChannelWithoutArguments = () => command();
    // @ts-expect-error Same as above.
    const createChannelWithFirstIncorrectArgument = () => command('not array');
    const createChannelWithFirstArgumentEmptyArray = () => command([], 'test');
    // @ts-expect-error Same as above.
    const createChannelWithoutSecondArgument = () => command(['test_type']);
    // @ts-expect-error Same as above.
    const createChannelWithSecondIncorrectArgument = () => command(['test_type'], 200);
    expect(createChannelWithoutArguments).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstIncorrectArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstArgumentEmptyArray).toThrowErrorMatchingSnapshot();
    expect(createChannelWithoutSecondArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithSecondIncorrectArgument).toThrowErrorMatchingSnapshot();
  });
});

describe('created by command function', () => {
  const channel = command(['first_type', 'second_type'], 'test');
  it('throws error when incorrect arguments passed', async () => {
    // @ts-expect-error Ignore TS errors because for raw JS we need to test argument validation.
    const callChannelWithoutArguments = async () => await channel();
    // @ts-expect-error Same as above.
    const callChannelWithCommandWithoutTypeProperty = async () => await channel({});
    const callChannelWithCommandWithUndefinedType = async () =>
      await channel({ type: 'third_type' });
    await expect(callChannelWithoutArguments).rejects.toThrowErrorMatchingSnapshot();
    await expect(callChannelWithCommandWithoutTypeProperty).rejects.toThrowErrorMatchingSnapshot();
    await expect(callChannelWithCommandWithUndefinedType).rejects.toThrowErrorMatchingSnapshot();
  });
  it('sends command', () => {
    channel({ type: 'first_type' });
    expect(getTransport).toHaveBeenCalledWith(TYPE_COMMAND);
    const { trigger } = getTransport('command');
    expect(trigger).toHaveBeenCalledWith('first_type', {
      type: 'first_type',
      context: 'test',
      timestamp: expect.any(Number),
    });
  });
});
